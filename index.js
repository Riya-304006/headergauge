
function analyzeHeaders(headers, options = {}) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    throw new TypeError("Headers must be an object or Headers instance");
  }

  const {
    maxTotalBytes = 16 * 1024,
    maxHeaderBytes = 8 * 1024,
    sensitiveHeaderWarningBytes = 2 * 1024
  } = options;

  for (const limit of [
    maxTotalBytes,
    maxHeaderBytes,
    sensitiveHeaderWarningBytes
  ]) {
    if (!Number.isFinite(limit) || limit < 0) {
      throw new TypeError("Header size limits must be non-negative numbers");
    }
  }

  const entries = [];

  if (typeof headers.forEach === "function" &&
      typeof headers.entries === "function") {
    headers.forEach((value, name) => {
      entries.push([name, value]);
    });
  } else {
    entries.push(...Object.entries(headers));
  }

  const headerSizes = entries.map(([name, value]) => {
    const headerName = String(name);
    const headerValue = Array.isArray(value)
      ? value.join(", ")
      : String(value);

    if (!headerName) {
      throw new TypeError("Header names cannot be empty");
    }

    const valueBytes = Buffer.byteLength(headerValue, "utf8");
    const lineBytes = Buffer.byteLength(
      `${headerName}: ${headerValue}\r\n`,
      "utf8"
    );

    return {
      name: headerName,
      valueBytes,
      lineBytes
    };
  });

  const totalBytes =
    headerSizes.reduce((total, header) => total + header.lineBytes, 0) + 2;

  const oversizedHeaders = headerSizes.filter(
    header => header.lineBytes > maxHeaderBytes
  );

  const warnings = [];

  if (totalBytes > maxTotalBytes) {
    warnings.push("Total header size exceeds the configured budget.");
  }

  for (const header of headerSizes) {
    const name = header.name.toLowerCase();

    if (
      (name === "cookie" || name === "authorization") &&
      header.lineBytes > sensitiveHeaderWarningBytes
    ) {
      warnings.push(
        `${header.name} header is unusually large.`
      );
    }
  }

  return {
    totalBytes,
    headerCount: headerSizes.length,
    headerSizes: headerSizes.sort(
      (a, b) => b.lineBytes - a.lineBytes
    ),
    oversizedHeaders,
    withinBudget: totalBytes <= maxTotalBytes &&
      oversizedHeaders.length === 0,
    warnings
  };
}

module.exports = { analyzeHeaders };


