import nodemailer from "nodemailer";
import { promo } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { User } from "@prisma/client";

export const sendPromoEmail = async (promo: promo) => {
  // transporter Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAILER,
      pass: process.env.PASSWORD_MAILER,
    },
  });

  const users = await prisma.user.findMany({
    select: { email: true, username: true },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${promo.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <!-- Container Utama -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header dengan Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    🎉 PROMO SPESIAL 🎉
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                    Jangan Lewatkan Penawaran Terbaik Kami!
                  </p>
                </td>
              </tr>

              <!-- Badge Diskon Besar -->
              <tr>
                <td style="padding: 0; position: relative; text-align: center;">
                  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: inline-block; padding: 20px 60px; margin-top: -25px; border-radius: 50px; box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);">
                    <span style="color: #ffffff; font-size: 48px; font-weight: 900; line-height: 1;">
                      ${promo.discount}% OFF
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Konten Utama -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 26px; font-weight: 700; text-align: center;">
                    ${promo.title}
                  </h2>
                  
                  <p style="margin: 0 0 25px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: center;">
                    ${promo.description}
                  </p>

                  <!-- Info Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="color: #333333; font-size: 15px; font-weight: 600;">
                              📅 Periode Promo:
                            </td>
                            <td style="color: #666666; font-size: 15px; text-align: right;">
                              ${promo.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #333333; font-size: 15px; font-weight: 600;">
                              ⏰ Berakhir:
                            </td>
                            <td style="color: #f5576c; font-size: 15px; text-align: right; font-weight: 700;">
                              ${promo.endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 50px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                          Belanja Sekarang 🛍️
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Urgency Message -->
                  <div style="background: linear-gradient(90deg, #fff3cd 0%, #ffeaa7 100%); border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin-top: 25px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; text-align: center; font-weight: 600;">
                      ⚡ Buruan! Promo terbatas dan berlaku selama persediaan masih ada
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #2d3436; padding: 30px; text-align: center;">
                  <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                    FASCO
                  </h3>
                  <p style="margin: 0 0 10px 0; color: #b2bec3; font-size: 14px;">
                    Fashion & Style Collection
                  </p>
                  <p style="margin: 0; color: #636e72; font-size: 12px; line-height: 1.5;">
                    Email ini dikirim ke Anda karena Anda terdaftar sebagai pelanggan Fasco.<br/>
                    Jika tidak ingin menerima email promo, Anda dapat berhenti berlangganan.
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="#" style="color: #74b9ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Instagram</a>
                    <a href="#" style="color: #74b9ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Facebook</a>
                    <a href="#" style="color: #74b9ff; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  for (const user of users) {
    await transporter.sendMail({
      from: `"Fasco Promo" <${process.env.USER_MAILER}>`,
      to: `${user.username} <${user.email}>`, // Diperbaiki dari hardcoded email
      subject: `🎉 ${promo.title} - Diskon ${promo.discount}%!`,
      html: htmlTemplate,
    });
  }
};