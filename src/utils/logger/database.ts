import { createFileTransports, globalFormat } from ".";
import { createLogger } from "winston";

export const databaseLogger = createLogger({
  format: globalFormat,
  transports: [...createFileTransports("database", ["debug"])],
});
