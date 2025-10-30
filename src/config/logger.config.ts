import winston from 'winston'

const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'green',
}

winston.addColors(customColors)

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, context, scope }) => {
      let log = `[${timestamp}] ${level}: ${message}`
      if (context) log += ` | context: ${context}`
      if (scope) log += ` | scope: ${scope}`
      return log
    })
  ),
  transports: [new winston.transports.Console()],
})

const logWithStructure = (level: string, context: string, message: string, scope?: string) => {
  logger.log({ level, message, context, scope })
}

const LoggerService = {
  info: (context: string, message: string, scope?: string) => logWithStructure('info', context, message, scope),
  error: (context: string, message: string, scope?: string) => logWithStructure('error', context, message, scope),
  warn: (context: string, message: string, scope?: string) => logWithStructure('warn', context, message, scope),
  debug: (context: string, message: string, scope?: string) => logWithStructure('debug', context, message, scope),
}

export default LoggerService
