import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const browserLogger = pino({ level: isDev ? "debug" : "info", browser: { asObject: true } });

export { browserLogger };
