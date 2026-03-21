type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  feature?: string;
  action?: string;
  [key: string]: unknown;
}

const isDev = import.meta.env.DEV;
const SENSITIVE_KEYS = ["email", "phone", "password", "token", "address", "fullName", "full_name"];

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.length <= 2) return "**";
    return `${value.slice(0, 2)}***`;
  }
  return "***";
}

function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;
  const cleaned: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      cleaned[key] = redactValue(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const safeContext = sanitizeContext(context);
  const ctx = safeContext ? ` ${JSON.stringify(safeContext)}` : "";
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
