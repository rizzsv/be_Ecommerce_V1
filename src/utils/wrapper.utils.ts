import { Response } from 'express'
import { MetaData } from './type.utils'

export class Wrapper {
  static success<T>(res: Response, success: boolean, data: T, message: string, code: number): void {
    res.status(code).json({
      success,
      data,
      message,
    })
  }

  static pagination<T>(
    res: Response,
    success: boolean,
    metaData: MetaData,
    message: string,
    data: T,
    code: number,
  ): void {
    res.status(code).json({
      success,
      data: !data && data === null ? {} : data,
      metaData,
      message,
    })
  }
}
