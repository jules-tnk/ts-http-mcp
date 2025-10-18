# HTTP MCP Server

A Model Context Protocol (MCP) server that enables AI agents to send HTTP requests to any endpoint with full control over methods, headers, query parameters, and request bodies.

**Note**: This MCP server only supports stdio transport.

# MCP Badge from LobeHub

[![MCP Badge](https://lobehub.com/badge/mcp-full/jules-tnk-ts-http-mcp?theme=light)](https://lobehub.com/mcp/jules-tnk-ts-http-mcp)

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Local Development](#local-development)
  - [Install](#install)
  - [Build](#build)
  - [Run](#run)

# Features

- Support for all major HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Custom headers configuration
- Query parameter handling with proper URL encoding
- Request body support for POST/PUT/PATCH
- Comprehensive error handling
- TypeScript with strict type safety
- Clean, modular architecture
- STDIO transport support for seamless integration with MCP clients

# Installation

Install the package globally using npm:

```bash
npm install -g @jules-tnk/ts-http-mcp
```

Or use npx to run it directly:

```bash
npx @jules-tnk/ts-http-mcp
```

# Configuration

## Claude Desktop

Add the following configuration to your Claude Desktop config file (`claude_desktop_config.json`):

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
	"mcpServers": {
		"http-mcp": {
			"command": "npx",
			"args": ["@jules-tnk/ts-http-mcp"]
		}
	}
}
```

After updating the configuration, restart Claude Desktop to load the MCP server.

## Other MCP Clients

For other MCP clients that support stdio transport, configure them to run:

```bash
npx @jules-tnk/ts-http-mcp
```

# Local Development

## Install

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Run

```bash
pnpm start
```

## Testing

To test the MCP server locally, you can run it directly and interact with it through stdio:

```bash
pnpm start
```

The server will start and listen for MCP protocol messages on stdin/stdout.

# Usage

Once configured with your MCP client, the HTTP MCP server provides the following capabilities:

- **GET requests**: Retrieve data from any HTTP endpoint
- **POST requests**: Send data to endpoints that accept POST requests
- **PUT/PATCH requests**: Update resources on remote servers
- **DELETE requests**: Remove resources from remote servers
- **Custom headers**: Add authentication, content-type, and other headers
- **Query parameters**: Include URL parameters with proper encoding
- **Request bodies**: Send JSON, form data, or raw content

The server handles all the HTTP communication details, error handling, and response processing, making it easy for AI agents to interact with web APIs and services.

# License

MIT License - see the [LICENSE.md](LICENSE.md) file for details.
