import { createLogger } from "winston";
import { createFileTransports, globalFormat } from ".";

const databaseLogger = createLogger({
  format: globalFormat,
  transports: [...createFileTransports("database", ["debug"])],
});

export default databaseLogger;
