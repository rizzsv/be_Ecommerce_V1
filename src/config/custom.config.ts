import { Request } from 'express'
import { JwtPayload } from '../utils/type.utils'

export interface CustomRequest extends Request {
  user?: JwtPayload
}

export class ErrorHandler extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message)
  }
}
