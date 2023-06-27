import { createLogger, transports } from "winston";
import { createFileTransports, globalFormat } from ".";

const discordLogger = createLogger({
  format: globalFormat,
  transports: [
    ...createFileTransports("discord", ["info", "warn", "debug"]),
    new transports.Console({ level: "info" }),
  ],
});

export default discordLogger;
