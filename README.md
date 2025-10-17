# HTTP MCP Server

A Model Context Protocol (MCP) server that enables AI agents to send HTTP requests to any endpoint with full control over methods, headers, query parameters, and request bodies.

# Table of Contents

- [Features](#features)
- [Local Setup](#local-setup)
  - [Install](#install)
  - [Build](#build)
  - [Environment Variables](#environment-variables)
  - [Run](#run)
- [Use with Docker](#use-with-docker)
  - [HTTP-STREAM Transport](#http-stream-transport)
  - [STDIO transport](#stdio-transport)

# Features

- Support for all major HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Custom headers configuration
- Query parameter handling with proper URL encoding
- Request body support for POST/PUT/PATCH
- Comprehensive error handling
- TypeScript with strict type safety
- Clean, modular architecture

# Local Setup

## Install

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Environment Variables

The server can be configured using the following environment variables:

- **MCP_TRANSPORT**: Transport mode (`stdio` or `httpStream`) - Default: `stdio`
- **MCP_PORT**: Port for httpStream transport - Default: `3000`

You can copy `.env.example` to `.env` and customize the values:

```bash
cp .env.example .env
```

## Run

```bash
pnpm start
```

# Use with Docker

## Build the docker image

```
bash docker build -t http-mcp .
```

## HTTP-STREAM Transport

The [`docker-compose.yml`](docker-compose.yml) file provide an example for running the server with the `httpStream` transport.

When the server is running, you can the server to your MCP client's configuration. For example for `Claude Desktop`:

```json

```

## STDIO transport

The server can be used with the `stdio` transport by directly adding the required configuration to your MCP client's configuration. For example for `Claude Desktop`:

```json

```
