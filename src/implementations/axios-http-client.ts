import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpRequest, HttpResponse, HttpRequestError } from '../types';
import { HttpClient } from '../interfaces';

export class AxiosHttpClient implements HttpClient {
	async executeRequest(request: HttpRequest): Promise<HttpResponse> {
		try {
			const url = this.buildUrl(request.url, request.queryParams);

			const config: AxiosRequestConfig = {
				url,
				method: request.method,
				headers: request.headers || {},
			};

			if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
				config.data = request.body;
			}

			const response = await axios(config);

			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers as Record<string, string>,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError;
				throw new HttpRequestError(
					axiosError.message || 'HTTP request failed',
					axiosError.response?.status,
					axiosError.response?.data
				);
			}
			throw new HttpRequestError(
				error instanceof Error ? error.message : 'Unknown error occurred'
			);
		}
	}

	private buildUrl(
		baseUrl: string,
		queryParams?: Array<{ name: string; value: string }>
	): string {
		if (!queryParams || queryParams.length === 0) {
			return baseUrl;
		}

		const url = new URL(baseUrl);
		queryParams.forEach((param) => {
			url.searchParams.append(param.name, param.value);
		});

		return url.toString();
	}
}
