import nodemailer from 'nodemailer'
import mustache from 'mustache'
import fs from 'fs'
import { globalEnv } from '../../utils/globalEnv.utils'
import loggerConfig from '../../config/logger.config'
import { text } from 'stream/consumers'
import { ErrorHandler } from '../../config/custom.config'
import path from 'path'

export class Nodemailer {
    static async sendUserForgotPassword(email: string, otp:string): Promise<void> {
        const templatePath = path.join(__dirname, 'otp.html')
        const template = fs.readFileSync(templatePath, 'utf-8')

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            pool: true,
            maxMessages: Infinity,
            auth: {
                user: globalEnv.USER_MAILER,
                pass: globalEnv.PASSWORD_MAILER,
            },
        })
        const msg = {
            to: email,
            from: globalEnv.USER_MAILER,
            replyTo: globalEnv.USER_MAILER,
            subject: 'Fasco Fashion Indonesia - Lupa Password',
            text: '',
            html: mustache.render(template, {otp})
        }

        transporter.sendMail(msg, (err: Error | null, data: nodemailer.SentMessageInfo) => {
            if(err) {
                console.error('Nodemailer error:', err) 
                loggerConfig.error('send email - Forgot Password ', 'failed send email to user', 'Node Mailer')
                throw new ErrorHandler(500, 'Failed to send email please try again')
            }
            loggerConfig.info('Send Email - Forgot Password', `Success send email to user | ${data}`, 'Node Mailer')
        })
        return 
    }
}