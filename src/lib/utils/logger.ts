export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function logToConsole(level: LogLevel, message: string, payload?: unknown) {
	const args = payload !== undefined ? [message, payload] : [message];
	switch (level) {
		case 'debug':
			console.debug(...args);
			break;
		case 'info':
			console.info(...args);
			break;
		case 'warn':
			console.warn(...args);
			break;
		case 'error':
			console.error(...args);
			break;
	}
}

// Stub for future remote logging. Replace with real endpoint/service when ready.
async function logToRemote(_level: LogLevel, _message: string, _payload?: unknown) {
	// No-op by default. Implement fetch to your logging backend here.
	return Promise.resolve();
}

const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

export const logger = {
	debug(message: string, payload?: unknown) {
		logToConsole('debug', message, payload);
		if (isProd) void logToRemote('debug', message, payload);
	},
	info(message: string, payload?: unknown) {
		logToConsole('info', message, payload);
		if (isProd) void logToRemote('info', message, payload);
	},
	warn(message: string, payload?: unknown) {
		logToConsole('warn', message, payload);
		if (isProd) void logToRemote('warn', message, payload);
	},
	error(message: string, payload?: unknown) {
		logToConsole('error', message, payload);
		if (isProd) void logToRemote('error', message, payload);
	},
};
