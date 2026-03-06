type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  feature?: string;
  action?: string;
  [key: string]: unknown;
}

const isDev = import.meta.env.DEV;

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    const formatted = formatMessage("info", message, context);
    console.info(formatted);
  },

  warn(message: string, context?: LogContext): void {
    const formatted = formatMessage("warn", message, context);
    console.warn(formatted);
  },

  error(message: string, error?: unknown, context?: LogContext): void {
    const formatted = formatMessage("error", message, context);
    console.error(formatted, error !== undefined ? error : "");
  },

  debug(message: string, context?: LogContext): void {
    if (isDev) {
      const formatted = formatMessage("debug", message, context);
      console.debug(formatted);
    }
  },
};
