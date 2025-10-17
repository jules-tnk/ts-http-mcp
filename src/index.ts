#!/usr/bin/env node

import { ConsoleLogger, AxiosHttpClient } from './implementations';
import { FastMcpServer } from './implementations/fastmcp-server';

const logger = new ConsoleLogger();

async function main() {
	const httpClient = new AxiosHttpClient();

	logger.info('Starting HTTP MCP Server...');

	const httpMcpServer = new FastMcpServer({
		logger,
		httpClient,
	});
	await httpMcpServer.startServer();

	logger.info('Ready to accept HTTP requests');
}

process.on('SIGINT', () => {
	logger.info('Shutting down gracefully...');
	process.exit(0);
});

process.on('SIGTERM', () => {
	logger.info('Shutting down gracefully...');
	process.exit(0);
});

main().catch((error) => {
	logger.error('Fatal error:', error);
	process.exit(1);
});
