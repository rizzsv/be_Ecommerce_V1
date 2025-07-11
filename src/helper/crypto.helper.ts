import CryptoJS from 'crypto-js'
import { globalEnv } from '../utils/globalEnv.utils'

export class Crypto {
  static encode(data: string): string {
    return CryptoJS.AES.encrypt(data, globalEnv.CRYPTO_KEY!).toString()
  }

  static decode(data: string): string {
    return CryptoJS.AES.decrypt(data, globalEnv.CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
  }

  static compare(data: string, encryptedData: string): boolean {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, globalEnv.CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
    return data === decryptedData
  }
}
