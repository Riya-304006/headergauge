# HeaderGauge

**HeaderGauge** is a lightweight Node.js utility that analyzes HTTP headers, measures their sizes, identifies oversized headers, and provides configurable size-budget warnings.

## Features

- Calculate total HTTP header size in bytes.
- Measure individual header sizes.
- Identify oversized headers.
- Configure maximum total and individual header sizes.
- Detect unusually large Cookie and Authorization headers.
- Supports plain JavaScript objects and Node.js Headers objects.
- Zero external dependencies.

## Installation

```bash
npm install headergauge
```

## Usage

```javascript
const { analyzeHeaders } = require("headergauge");

const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer example-token",
  "Accept": "application/json"
};

const result = analyzeHeaders(headers);

console.log(result);
```

## Custom Configuration

You can customize the size limits:

```javascript
const result = analyzeHeaders(headers, {
  maxTotalBytes: 8192,
  maxHeaderBytes: 4096,
  sensitiveHeaderWarningBytes: 1024
});
```

## Example Output

```javascript
{
  totalBytes: 125,
  headerCount: 3,
  headerSizes: [
    {
      name: "Authorization",
      valueBytes: 19,
      lineBytes: 35
    }
  ],
  oversizedHeaders: [],
  withinBudget: true,
  warnings: []
}
```

*The output above is illustrative.*

## API Reference

### `analyzeHeaders(headers, options)`

Analyzes HTTP headers and returns a size report.

**Parameters**

| Parameter | Description |
|---|---|
| `headers` | HTTP headers as an object or Node.js Headers instance |
| `options` | Optional configuration object |

**Configuration options**

| Option | Default |
|---|---:|
| `maxTotalBytes` | 16384 |
| `maxHeaderBytes` | 8192 |
| `sensitiveHeaderWarningBytes` | 2048 |

**Return values**

| Property | Description |
|---|---|
| `totalBytes` | Total header size in bytes |
| `headerCount` | Number of headers |
| `headerSizes` | Individual header size details |
| `oversizedHeaders` | Headers exceeding the configured individual limit |
| `withinBudget` | Whether all configured size limits are satisfied |
| `warnings` | List of warnings |

## Running Tests

```bash
npm test
```

## Requirements

- Node.js 18 or later.

## License

MIT