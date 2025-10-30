import prisma from '../../config/prisma.config'
import loggerConfig from '../../config/logger.config'

export class LoggerService {
  static async saveLog(userId: string, target: string, request: string): Promise<void> {
    const ctx = 'Save Log'
    const scp = 'Logger'
    await prisma.log.create({
      data: {
        userId,
        target,
        request,
      },
    })
    loggerConfig.info(ctx, '✅ Saved internal log', scp)
  }

  static async saveExternalLog(ip: string, target: string, request: string): Promise<void> {
    const ctx = 'Save External Log'
    const scp = 'Logger'
    await prisma.logExternal.create({
      data: {
        ip,
        target,
        request,
      },
    })
    loggerConfig.info(ctx, '✅ Saved external log', scp)
  }
}
