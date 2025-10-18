import { FastMcpServer } from '../../implementations/fastmcp-server';
import { HttpClient, Logger } from '../../interfaces';
import { HttpResponse, HttpRequestError } from '../../types';

// Mock FastMCP
jest.mock('fastmcp', () => {
	const mockAddTool = jest.fn();
	const mockStart = jest.fn().mockResolvedValue(undefined);
	const mockFastMCP = jest.fn().mockImplementation(() => ({
		addTool: mockAddTool,
		start: mockStart,
	}));

	return {
		FastMCP: mockFastMCP,
	};
});

// Mock validateHttpRequest utility
jest.mock('../../utils', () => ({
	validateHttpRequest: jest.fn(),
}));

describe('FastMcpServer', () => {
	let mockLogger: jest.Mocked<Logger>;
	let mockHttpClient: jest.Mocked<HttpClient>;
	let fastMcpServer: FastMcpServer;
	let mockAddTool: jest.Mock;
	let mockStart: jest.Mock;
	let mockFastMCP: jest.Mock;
	let mockValidateHttpRequest: jest.Mock;

	beforeEach(() => {
		// Get the mocked functions from the modules
		const { FastMCP } = require('fastmcp');
		const { validateHttpRequest } = require('../../utils');

		mockFastMCP = FastMCP;
		mockValidateHttpRequest = validateHttpRequest;

		// Create mock instances
		mockLogger = {
			debug: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
		};

		mockHttpClient = {
			executeRequest: jest.fn(),
		};

		// Clear all mocks
		jest.clearAllMocks();

		// Create FastMcpServer instance
		fastMcpServer = new FastMcpServer({
			logger: mockLogger,
			httpClient: mockHttpClient,
		});

		// Get the mocks from the instance
		const instance = mockFastMCP.mock.results[0].value;
		mockAddTool = instance.addTool;
		mockStart = instance.start;
	});

	describe('constructor', () => {
		it('should initialize with correct name and version', () => {
			expect(mockFastMCP).toHaveBeenCalledWith({
				name: '@jules-tnk/http-mcp',
				version: '0.0.1',
			});
		});

		it('should setup tools on construction', () => {
			expect(mockAddTool).toHaveBeenCalledTimes(1);

			const addToolCall = mockAddTool.mock.calls[0][0];
			expect(addToolCall.name).toBe('send_http_request');
			expect(addToolCall.description).toBe(
				'Send an HTTP request to any endpoint with custom headers, query parameters, and body'
			);
			expect(typeof addToolCall.execute).toBe('function');
		});
	});

	describe('startServer', () => {
		it('should start server with stdio transport', async () => {
			await fastMcpServer.startServer();

			expect(mockStart).toHaveBeenCalledWith({ transportType: 'stdio' });
			expect(mockLogger.info).toHaveBeenCalledWith(
				'Server started successfully with stdio transport'
			);
		});

		it('should handle start errors', async () => {
			const error = new Error('Start failed');
			mockStart.mockRejectedValue(error);

			await expect(fastMcpServer.startServer()).rejects.toThrow('Start failed');
		});
	});

	describe('send_http_request tool execution', () => {
		let executeFunction: Function;

		beforeEach(() => {
			// Get the execute function from the addTool call
			executeFunction = mockAddTool.mock.calls[0][0].execute;
		});

		it('should execute successful HTTP request', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			};

			const mockHttpResponse: HttpResponse = {
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: { 'content-type': 'application/json' },
			};

			mockHttpClient.executeRequest.mockResolvedValue(mockHttpResponse);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			expect(mockValidateHttpRequest).toHaveBeenCalledWith(requestArgs);
			expect(mockHttpClient.executeRequest).toHaveBeenCalledWith(requestArgs);
			expect(mockLogger.info).toHaveBeenCalledWith(
				'Sending GET request to https://api.example.com/users'
			);
			expect(mockLogger.info).toHaveBeenCalledWith(
				'Request completed with status 200'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toEqual({
				success: true,
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: { 'content-type': 'application/json' },
			});
		});

		it('should execute POST request with body', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: { name: 'John Doe' },
			};

			const mockHttpResponse: HttpResponse = {
				data: { id: 1, name: 'John Doe' },
				status: 201,
				statusText: 'Created',
				headers: { 'content-type': 'application/json' },
			};

			mockHttpClient.executeRequest.mockResolvedValue(mockHttpResponse);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			expect(mockHttpClient.executeRequest).toHaveBeenCalledWith(requestArgs);
			expect(mockLogger.info).toHaveBeenCalledWith(
				'Sending POST request to https://api.example.com/users'
			);
			expect(mockLogger.info).toHaveBeenCalledWith(
				'Request completed with status 201'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult.success).toBe(true);
			expect(parsedResult.status).toBe(201);
		});

		it('should handle HTTP request errors', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const httpError = new HttpRequestError('Not Found', 404, {
				error: 'Resource not found',
			});
			mockHttpClient.executeRequest.mockRejectedValue(httpError);

			const result = await executeFunction(requestArgs);

			expect(mockLogger.error).toHaveBeenCalledWith(
				'Request failed: Not Found'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toEqual({
				success: false,
				error: 'Not Found',
				details: 'HttpRequestError',
			});
		});

		it('should handle validation errors', async () => {
			const requestArgs = {
				url: 'invalid-url',
				method: 'GET',
			};

			const validationError = new Error('Invalid URL format');
			mockValidateHttpRequest.mockImplementation(() => {
				throw validationError;
			});

			const result = await executeFunction(requestArgs);

			expect(mockLogger.error).toHaveBeenCalledWith(
				'Request failed: Invalid URL format'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toEqual({
				success: false,
				error: 'Invalid URL format',
				details: 'Error',
			});
		});

		it('should handle unknown errors', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const unknownError = 'String error';
			mockHttpClient.executeRequest.mockRejectedValue(unknownError);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			expect(mockLogger.error).toHaveBeenCalledWith(
				'Request failed: Unknown error'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toEqual({
				success: false,
				error: 'Unknown error',
				details: 'Error',
			});
		});

		it('should handle errors without message', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const errorWithoutMessage = {};
			mockHttpClient.executeRequest.mockRejectedValue(errorWithoutMessage);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			expect(mockLogger.error).toHaveBeenCalledWith(
				'Request failed: Unknown error'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toEqual({
				success: false,
				error: 'Unknown error',
				details: 'Error',
			});
		});

		it('should handle network timeout errors', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const timeoutError = new Error('timeout of 5000ms exceeded');
			mockHttpClient.executeRequest.mockRejectedValue(timeoutError);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			expect(mockLogger.error).toHaveBeenCalledWith(
				'Request failed: timeout of 5000ms exceeded'
			);

			const parsedResult = JSON.parse(result);
			expect(parsedResult.success).toBe(false);
			expect(parsedResult.error).toBe('timeout of 5000ms exceeded');
		});

		it('should handle different HTTP methods', async () => {
			const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

			for (const method of methods) {
				const requestArgs = {
					url: 'https://api.example.com/users',
					method: method as any,
				};

				const mockHttpResponse: HttpResponse = {
					data: { result: 'success' },
					status: 200,
					statusText: 'OK',
					headers: {},
				};

				mockHttpClient.executeRequest.mockResolvedValue(mockHttpResponse);
				mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

				const result = await executeFunction(requestArgs);

				expect(mockLogger.info).toHaveBeenCalledWith(
					`Sending ${method} request to https://api.example.com/users`
				);

				const parsedResult = JSON.parse(result);
				expect(parsedResult.success).toBe(true);
				expect(parsedResult.status).toBe(200);

				// Clear mocks for next iteration
				jest.clearAllMocks();
				mockHttpClient.executeRequest.mockResolvedValue(mockHttpResponse);
				mockValidateHttpRequest.mockImplementation(() => {});
			}
		});

		it('should return properly formatted JSON response', async () => {
			const requestArgs = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const mockHttpResponse: HttpResponse = {
				data: { users: [{ id: 1, name: 'John' }] },
				status: 200,
				statusText: 'OK',
				headers: { 'content-type': 'application/json' },
			};

			mockHttpClient.executeRequest.mockResolvedValue(mockHttpResponse);
			mockValidateHttpRequest.mockImplementation(() => {}); // Don't throw

			const result = await executeFunction(requestArgs);

			// Should be valid JSON string
			expect(() => JSON.parse(result)).not.toThrow();

			const parsedResult = JSON.parse(result);
			expect(parsedResult).toHaveProperty('success');
			expect(parsedResult).toHaveProperty('data');
			expect(parsedResult).toHaveProperty('status');
			expect(parsedResult).toHaveProperty('statusText');
			expect(parsedResult).toHaveProperty('headers');
		});
	});
});
