import axios from 'axios';
import { AxiosHttpClient } from '../../implementations/axios-http-client';
import { HttpRequest, HttpRequestError } from '../../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// Mock axios.isAxiosError
const mockIsAxiosError = jest.fn();
(axios as any).isAxiosError = mockIsAxiosError;

describe('AxiosHttpClient', () => {
	let httpClient: AxiosHttpClient;

	beforeEach(() => {
		httpClient = new AxiosHttpClient();
		jest.clearAllMocks();
	});

	describe('executeRequest', () => {
		it('should execute GET request successfully', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			};

			const mockResponse = {
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: { 'content-type': 'application/json' },
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			expect(result).toEqual({
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: { 'content-type': 'application/json' },
			});
		});

		it('should execute POST request with body', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: { name: 'John Doe', email: 'john@example.com' },
			};

			const mockResponse = {
				data: { id: 1, name: 'John Doe' },
				status: 201,
				statusText: 'Created',
				headers: { 'content-type': 'application/json' },
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: { name: 'John Doe', email: 'john@example.com' },
			});

			expect(result).toEqual({
				data: { id: 1, name: 'John Doe' },
				status: 201,
				statusText: 'Created',
				headers: { 'content-type': 'application/json' },
			});
		});

		it('should execute PUT request with body', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users/1',
				method: 'PUT',
				body: { name: 'Jane Doe' },
			};

			const mockResponse = {
				data: { id: 1, name: 'Jane Doe' },
				status: 200,
				statusText: 'OK',
				headers: {},
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users/1',
				method: 'PUT',
				headers: {},
				data: { name: 'Jane Doe' },
			});

			expect(result.status).toBe(200);
		});

		it('should execute PATCH request with body', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users/1',
				method: 'PATCH',
				body: { email: 'jane@example.com' },
			};

			const mockResponse = {
				data: { id: 1, email: 'jane@example.com' },
				status: 200,
				statusText: 'OK',
				headers: {},
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users/1',
				method: 'PATCH',
				headers: {},
				data: { email: 'jane@example.com' },
			});

			expect(result.status).toBe(200);
		});

		it('should execute DELETE request without body', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users/1',
				method: 'DELETE',
			};

			const mockResponse = {
				data: null,
				status: 204,
				statusText: 'No Content',
				headers: {},
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users/1',
				method: 'DELETE',
				headers: {},
			});

			expect(result.status).toBe(204);
		});

		it('should handle request with query parameters', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
				queryParams: [
					{ name: 'page', value: '1' },
					{ name: 'limit', value: '10' },
					{ name: 'search', value: 'john' },
				],
			};

			const mockResponse = {
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: {},
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users?page=1&limit=10&search=john',
				method: 'GET',
				headers: {},
			});

			expect(result.status).toBe(200);
		});

		it('should handle request without headers', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const mockResponse = {
				data: { users: [] },
				status: 200,
				statusText: 'OK',
				headers: {},
			};

			mockedAxios.mockResolvedValue(mockResponse);

			const result = await httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: {},
			});

			expect(result.status).toBe(200);
		});

		it('should handle axios error with response', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const axiosError = {
				isAxiosError: true,
				message: 'Request failed with status code 404',
				response: {
					status: 404,
					data: { error: 'Not Found' },
				},
			};

			mockedAxios.mockRejectedValue(axiosError);
			mockIsAxiosError.mockReturnValue(true);

			await expect(httpClient.executeRequest(request)).rejects.toThrow(
				HttpRequestError
			);

			try {
				await httpClient.executeRequest(request);
			} catch (error) {
				expect(error).toBeInstanceOf(HttpRequestError);
				expect((error as HttpRequestError).message).toBe(
					'Request failed with status code 404'
				);
				expect((error as HttpRequestError).statusCode).toBe(404);
				expect((error as HttpRequestError).response).toEqual({
					error: 'Not Found',
				});
			}
		});

		it('should handle axios error without response', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const axiosError = {
				isAxiosError: true,
				message: 'Network Error',
			};

			mockedAxios.mockRejectedValue(axiosError);
			mockIsAxiosError.mockReturnValue(true);

			await expect(httpClient.executeRequest(request)).rejects.toThrow(
				HttpRequestError
			);

			try {
				await httpClient.executeRequest(request);
			} catch (error) {
				expect(error).toBeInstanceOf(HttpRequestError);
				expect((error as HttpRequestError).message).toBe('Network Error');
				expect((error as HttpRequestError).statusCode).toBeUndefined();
				expect((error as HttpRequestError).response).toBeUndefined();
			}
		});

		it('should handle non-axios error', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const genericError = new Error('Generic error');
			mockedAxios.mockRejectedValue(genericError);
			mockIsAxiosError.mockReturnValue(false);

			await expect(httpClient.executeRequest(request)).rejects.toThrow(
				HttpRequestError
			);

			try {
				await httpClient.executeRequest(request);
			} catch (error) {
				expect(error).toBeInstanceOf(HttpRequestError);
				expect((error as HttpRequestError).message).toBe('Generic error');
			}
		});

		it('should handle unknown error type', async () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			const unknownError = 'String error';
			mockedAxios.mockRejectedValue(unknownError);
			mockIsAxiosError.mockReturnValue(false);

			await expect(httpClient.executeRequest(request)).rejects.toThrow(
				HttpRequestError
			);

			try {
				await httpClient.executeRequest(request);
			} catch (error) {
				expect(error).toBeInstanceOf(HttpRequestError);
				expect((error as HttpRequestError).message).toBe(
					'Unknown error occurred'
				);
			}
		});
	});

	describe('buildUrl', () => {
		it('should return original URL when no query params', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: {},
			});
		});

		it('should return original URL when query params array is empty', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
				queryParams: [],
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users',
				method: 'GET',
				headers: {},
			});
		});

		it('should build URL with single query parameter', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
				queryParams: [{ name: 'page', value: '1' }],
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users?page=1',
				method: 'GET',
				headers: {},
			});
		});

		it('should build URL with multiple query parameters', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users',
				method: 'GET',
				queryParams: [
					{ name: 'page', value: '1' },
					{ name: 'limit', value: '10' },
					{ name: 'sort', value: 'name' },
				],
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users?page=1&limit=10&sort=name',
				method: 'GET',
				headers: {},
			});
		});

		it('should handle URL with existing query parameters', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/users?existing=param',
				method: 'GET',
				queryParams: [{ name: 'new', value: 'value' }],
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/users?existing=param&new=value',
				method: 'GET',
				headers: {},
			});
		});

		it('should URL encode query parameter values', () => {
			const request: HttpRequest = {
				url: 'https://api.example.com/search',
				method: 'GET',
				queryParams: [
					{ name: 'q', value: 'hello world' },
					{ name: 'filter', value: 'type=user&active=true' },
				],
			};

			mockedAxios.mockResolvedValue({
				data: {},
				status: 200,
				statusText: 'OK',
				headers: {},
			});

			httpClient.executeRequest(request);

			expect(mockedAxios).toHaveBeenCalledWith({
				url: 'https://api.example.com/search?q=hello+world&filter=type%3Duser%26active%3Dtrue',
				method: 'GET',
				headers: {},
			});
		});
	});
});
