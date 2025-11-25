# REST API Tester

A lightweight Chrome extension that allows you to test REST API endpoints directly from your browser.

## Features

- **HTTP Methods**: Support for GET, POST, PUT, PATCH, and DELETE requests
- **Request Body**: Toggle between JSON and Form Data formats
- **Custom Headers**: Add and manage custom request headers
- **Response Viewer**: View formatted responses with syntax highlighting
- **Status Codes**: See HTTP status codes with color-coded badges
- **Response Timing**: Track response times in milliseconds
- **Save Endpoints**: Store frequently-used endpoints for quick access

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The REST API Tester icon will appear in your browser toolbar

## Usage

1. Click the REST API Tester icon in your browser toolbar
2. Enter the URL of the API endpoint you want to test
3. Select the HTTP method (GET, POST, PUT, PATCH, DELETE)
4. Optionally add headers and request body
5. Click "Send" to make the request
6. View the response with status code and timing

### Saving Endpoints

1. After configuring your request, click "Save Current"
2. Enter a name for the endpoint
3. The endpoint will appear in the saved endpoints list
4. Click on a saved endpoint to load it

## Tech Stack

- **Manifest V3**: Chrome extension configuration
- **Vanilla JavaScript**: No frameworks required
- **Chrome Storage API**: For storing saved endpoints
- **Fetch API**: For making HTTP requests

## Architecture

```
├── manifest.json    # Extension configuration
├── background.js    # Service worker for window management
├── popup.html       # Main UI structure
├── popup.css        # UI styling
├── popup.js         # Request builder and response viewer logic
└── icons/           # Extension icons
```

## License

MIT License
