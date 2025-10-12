export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface QueryParam {
	name: string;
	value: string;
}

export interface HttpRequest {
	url: string;
	method: HttpMethod;
	queryParams?: QueryParam[];
	headers?: Record<string, string>;
	body?: unknown;
}

export interface HttpResponse {
	data: unknown;
	status: number;
	statusText: string;
	headers: Record<string, string>;
}

export class HttpRequestError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly response?: unknown
	) {
		super(message);
		this.name = 'HttpRequestError';
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}
