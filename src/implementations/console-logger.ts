import { Logger } from '../interfaces';

export class ConsoleLogger implements Logger {
	private formatMessage(
		level: string,
		message: string,
		data?: unknown
	): string {
		const timestamp = new Date().toISOString();
		const baseMessage = `[${timestamp}] [${level}] ${message}`;

		if (data !== undefined) {
			return `${baseMessage} ${JSON.stringify(data)}`;
		}

		return baseMessage;
	}

	debug(message: string, data?: unknown): void {
		console.error(this.formatMessage('DEBUG', message, data));
	}

	info(message: string, data?: unknown): void {
		console.error(this.formatMessage('INFO', message, data));
	}

	warn(message: string, data?: unknown): void {
		console.error(this.formatMessage('WARN', message, data));
	}

	error(message: string, data?: unknown): void {
		console.error(this.formatMessage('ERROR', message, data));
	}
}
