import z from 'zod';

export interface McpConfig {
	transport: 'stdio' | 'httpStream';
	port: number;
}

export const httpRequestZodSchema = z.object({
	url: z
		.string()
		.describe(
			'The full URL to send the request to (including path parameters)'
		),
	method: z
		.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
		.describe('HTTP method to use'),
	queryParams: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
			})
		)
		.optional()
		.describe('Query parameters to append to the URL'),
	headers: z
		.record(z.string(), z.string())
		.optional()
		.describe('HTTP headers to include in the request'),
	body: z
		.unknown()
		.optional()
		.describe('Request body (for POST, PUT, PATCH methods)'),
});

export interface McpResponse {
	success: boolean;
	data: unknown;
	status: number;
	statusText: string;
	headers: Record<string, string>;
}
