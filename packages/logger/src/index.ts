export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
  level?: LogLevel;
}

export interface LogMetadata {
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
  error(message: string, metadata?: LogMetadata): void;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const minimumLevel: LogLevel = options.level ?? "info";

  function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[minimumLevel];
  }

  function formatMessage(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): string {
    const timestamp = new Date().toISOString();

    const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (!metadata || Object.keys(metadata).length === 0) {
      return base;
    }

    return `${base} ${JSON.stringify(metadata)}`;
  }

  function debug(message: string, metadata?: LogMetadata): void {
    if (!shouldLog("debug")) {
      return;
    }

    console.debug(formatMessage("debug", message, metadata));
  }

  function info(message: string, metadata?: LogMetadata): void {
    if (!shouldLog("info")) {
      return;
    }

    console.log(formatMessage("info", message, metadata));
  }

  function warn(message: string, metadata?: LogMetadata): void {
    if (!shouldLog("warn")) {
      return;
    }

    console.warn(formatMessage("warn", message, metadata));
  }

  function error(message: string, metadata?: LogMetadata): void {
    if (!shouldLog("error")) {
      return;
    }

    console.error(formatMessage("error", message, metadata));
  }

  return {
    debug,
    info,
    warn,
    error,
  };
}