// src/helpers/logRequest.helper.ts
import { LoggerService } from '../bin/logger/loggerService'
import { CustomRequest } from '../config/custom.config'

export const logRequest = async (
  req: CustomRequest,
  target: string
): Promise<void> => {
  const requestData = JSON.stringify({
    body: req.body,
    params: req.params,
    query: req.query,
  })

  if (req.user) {
    await LoggerService.saveLog(req.user.id, target, requestData)
  } else {
    const ip = req.ip || 'unknown'
    await LoggerService.saveExternalLog(ip, target, requestData)
  }
}
