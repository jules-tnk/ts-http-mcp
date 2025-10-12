import { HttpRequest, ValidationError, HttpMethod } from '../types';

const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function validateHttpRequest(request: HttpRequest): void {
	if (!request.url || typeof request.url !== 'string') {
		throw new ValidationError('URL is required and must be a string');
	}

	if (!request.method || typeof request.method !== 'string') {
		throw new ValidationError('Method is required and must be a string');
	}

	if (!validMethods.includes(request.method)) {
		throw new ValidationError(
			`Invalid HTTP method. Must be one of: ${validMethods.join(', ')}`
		);
	}

	try {
		new URL(request.url);
	} catch {
		throw new ValidationError('Invalid URL format');
	}
}
