import dotenv from 'dotenv'
dotenv.config()

export const globalEnv = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    PREFIX: process.env.PREFIX,
    CRYPTO_KEY: process.env.CRYPTO_SECRET,
}