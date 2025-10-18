import { FastMCP } from 'fastmcp';
import { HttpClient, Logger } from '../interfaces';
import { httpRequestZodSchema, McpResponse } from '../types';
import { validateHttpRequest } from '../utils';

export class FastMcpServer {
	private mcp = new FastMCP({
		name: '@jules-tnk/http-mcp',
		version: '0.2.1',
	});
	private logger: Logger;
	private httpClient: HttpClient;

	constructor({
		logger,
		httpClient,
	}: {
		logger: Logger;
		httpClient: HttpClient;
	}) {
		this.logger = logger;
		this.httpClient = httpClient;
		this.setupTools();
	}

	async startServer() {
		await this.mcp.start({ transportType: 'stdio' });
		this.logger.info('Server started successfully with stdio transport');
	}

	private setupTools() {
		this.mcp.addTool({
			name: 'send_http_request',
			description:
				'Send an HTTP request to any endpoint with custom headers, query parameters, and body',
			parameters: httpRequestZodSchema,
			execute: async (args) => {
				try {
					this.logger.info(`Sending ${args.method} request to ${args.url}`);

					validateHttpRequest(args);
					const httpResponse = await this.httpClient.executeRequest(args);

					this.logger.info(
						`Request completed with status ${httpResponse.status}`
					);

					const mcpResponse: McpResponse = {
						success: true,
						data: httpResponse.data,
						status: httpResponse.status,
						statusText: httpResponse.statusText,
						headers: httpResponse.headers,
					};

					return JSON.stringify(mcpResponse, null, 2);
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : 'Unknown error';
					this.logger.error(`Request failed: ${errorMessage}`);

					return JSON.stringify(
						{
							success: false,
							error: errorMessage,
							details: error instanceof Error ? error.name : 'Error',
						},
						null,
						2
					);
				}
			},
		});
	}
}
