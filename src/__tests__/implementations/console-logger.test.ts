import { ConsoleLogger } from '../../implementations/console-logger';

describe('ConsoleLogger', () => {
	let logger: ConsoleLogger;
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		logger = new ConsoleLogger();
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	describe('debug', () => {
		it('should log debug message with timestamp and level', () => {
			const message = 'Debug message';

			logger.debug(message);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Debug message$/
			);
		});

		it('should log debug message with data', () => {
			const message = 'Debug message';
			const data = { key: 'value', number: 42 };

			logger.debug(message, data);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Debug message {"key":"value","number":42}$/
			);
		});

		it('should handle undefined data', () => {
			const message = 'Debug message';

			logger.debug(message, undefined);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\] Debug message$/
			);
		});
	});

	describe('info', () => {
		it('should log info message with timestamp and level', () => {
			const message = 'Info message';

			logger.info(message);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Info message$/
			);
		});

		it('should log info message with data', () => {
			const message = 'Info message';
			const data = { status: 'success' };

			logger.info(message, data);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Info message {"status":"success"}$/
			);
		});
	});

	describe('warn', () => {
		it('should log warn message with timestamp and level', () => {
			const message = 'Warning message';

			logger.warn(message);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Warning message$/
			);
		});

		it('should log warn message with data', () => {
			const message = 'Warning message';
			const data = { warning: 'deprecated' };

			logger.warn(message, data);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Warning message {"warning":"deprecated"}$/
			);
		});
	});

	describe('error', () => {
		it('should log error message with timestamp and level', () => {
			const message = 'Error message';

			logger.error(message);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Error message$/
			);
		});

		it('should log error message with data', () => {
			const message = 'Error message';
			const data = { error: 'network timeout' };

			logger.error(message, data);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Error message {"error":"network timeout"}$/
			);
		});
	});

	describe('formatMessage', () => {
		it('should format message correctly without data', () => {
			const message = 'Test message';

			logger.info(message);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message$/
			);
		});

		it('should format message correctly with complex data', () => {
			const message = 'Complex data test';
			const data = {
				nested: { value: 123 },
				array: [1, 2, 3],
				string: 'test',
			};

			logger.info(message, data);

			expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
			const loggedMessage = consoleErrorSpy.mock.calls[0][0];
			expect(loggedMessage).toMatch(
				/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Complex data test {"nested":{"value":123},"array":\[1,2,3\],"string":"test"}$/
			);
		});
	});

	describe('all methods use console.error', () => {
		it('should use console.error for all log levels', () => {
			logger.debug('debug message');
			logger.info('info message');
			logger.warn('warn message');
			logger.error('error message');

			expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
		});
	});
});
