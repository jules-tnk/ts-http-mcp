import { HttpRequest, HttpResponse } from '../types';

export interface HttpClient {
	executeRequest(request: HttpRequest): Promise<HttpResponse>;
}
