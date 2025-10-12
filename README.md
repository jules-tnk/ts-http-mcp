# HTTP MCP Server

A Model Context Protocol (MCP) server that enables AI agents to send HTTP requests to any endpoint with full control over methods, headers, query parameters, and request bodies.

## Features

- Support for all major HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Custom headers configuration
- Query parameter handling with proper URL encoding
- Request body support for POST/PUT/PATCH
- Comprehensive error handling
- TypeScript with strict type safety
- Clean, modular architecture

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Usage

### Environment Variables

The server can be configured using the following environment variables:

- **MCP_TRANSPORT**: Transport mode (`stdio` or `httpStream`) - Default: `stdio`
- **MCP_PORT**: Port for httpStream transport - Default: `3000`

You can copy `.env.example` to `.env` and customize the values:

```bash
cp .env.example .env
```

### Local Development

#### Start with stdio transport (for MCP clients):

```bash
MCP_TRANSPORT=stdio pnpm start
```

Or simply:

```bash
pnpm start
```

#### Start with httpStream transport:

```bash
MCP_TRANSPORT=httpStream MCP_PORT=3000 pnpm start
```

### Docker Deployment

#### Build Docker Image

```bash
docker build -t http-mcp .
```

#### Run with Docker Compose

For httpStream mode (default in docker-compose.yml):

```bash
docker-compose up -d
```

For stdio mode, uncomment the `http-mcp-stdio` service in `docker-compose.yml` and run:

```bash
docker-compose up http-mcp-stdio
```

#### Run Docker Container Manually

**stdio mode:**

```bash
docker run -e MCP_TRANSPORT=stdio -it http-mcp
```

**httpStream mode:**

```bash
docker run -e MCP_TRANSPORT=httpStream -e MCP_PORT=3000 -p 3000:3000 http-mcp
```

### Configure in Claude Desktop

Add to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**For local Node.js installation:**

```json
{
	"mcpServers": {
		"http-mcp": {
			"command": "node",
			"args": ["C:/Users/jules/juju/build/ts-http-mcp/dist/index.js"],
			"env": {
				"MCP_TRANSPORT": "stdio"
			}
		}
	}
}
```

**For Docker:**

```json
{
	"mcpServers": {
		"http-mcp": {
			"command": "docker",
			"args": ["run", "-i", "--rm", "-e", "MCP_TRANSPORT=stdio", "http-mcp"],
			"env": {
				"MCP_TRANSPORT": "stdio"
			}
		}
	}
}
```

## Request Schema

The MCP server accepts requests in the following format:

```json
{
	"url": "https://api.example.com/users/123",
	"method": "GET",
	"queryParams": [
		{ "name": "include", "value": "profile" },
		{ "name": "limit", "value": "10" }
	],
	"headers": {
		"Authorization": "Bearer token",
		"Content-Type": "application/json"
	},
	"body": {
		"key": "value"
	}
}
```

### Fields

- **url** (required): The full URL including path parameters
- **method** (required): HTTP method - one of: GET, POST, PUT, PATCH, DELETE
- **queryParams** (optional): Array of query parameters to append to the URL
- **headers** (optional): Object containing custom HTTP headers
- **body** (optional): Request body for POST/PUT/PATCH methods

## Example Usage

### GET Request with Query Parameters

```json
{
	"url": "https://api.github.com/repos/facebook/react/issues",
	"method": "GET",
	"queryParams": [
		{ "name": "state", "value": "open" },
		{ "name": "per_page", "value": "5" }
	],
	"headers": {
		"Accept": "application/vnd.github.v3+json"
	}
}
```

This executes: `GET https://api.github.com/repos/facebook/react/issues?state=open&per_page=5`

### POST Request with Body

```json
{
	"url": "https://api.example.com/users",
	"method": "POST",
	"headers": {
		"Content-Type": "application/json",
		"Authorization": "Bearer your-token"
	},
	"body": {
		"name": "John Doe",
		"email": "john@example.com"
	}
}
```

## Response Format

Successful responses return:

```json
{
	"success": true,
	"data": {},
	"status": 200,
	"statusText": "OK",
	"headers": {}
}
```

Error responses return:

```json
{
	"success": false,
	"error": "Error message",
	"details": "ErrorType"
}
```

## Architecture

The server follows a clean, layered architecture with Strategy pattern:

- **Interfaces Layer**: Abstract interfaces (Logger, HttpClient)
- **Implementations Layer**: Concrete implementations (ConsoleLogger, AxiosHttpClient)
- **Types Layer**: TypeScript interfaces and type definitions
- **Service Layer**: Request validation and URL construction
- **Handler Layer**: MCP tool registration and request orchestration
- **Entry Point**: Server initialization and lifecycle management

### Design Patterns

- **Strategy Pattern**: Logger and HttpClient are abstracted as interfaces, allowing easy swapping of implementations
- **Dependency Injection**: Dependencies are injected into handlers for better testability
- **Clean Architecture**: Clear separation of concerns with layered approach

## Error Handling

The server handles various error scenarios:

- Invalid URL format
- Invalid HTTP method
- Network errors
- HTTP error responses (4xx, 5xx)
- Validation errors

All errors are caught and returned in a structured format to the MCP client.

## Development

The codebase uses:

- TypeScript with strict mode
- ES Modules
- Clean code principles
- SOLID architecture
- Comprehensive type safety

## License

MIT
