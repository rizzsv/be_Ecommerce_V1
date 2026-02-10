import crypto from 'crypto'

export function CreateSecureOtp(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    const byte = crypto.randomBytes(1)[0]
    otp += digits[byte % 10]
  }
  return otp
}
