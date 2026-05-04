import nodemailer, { type Transporter } from 'nodemailer';

type SendContactEmailParams = {
  sellerEmail: string;
  buyerEmail: string;
  buyerUsername: string;
  advertName: string;
  message: string;
  advertLink: string;
};

class EmailService {
  private transporter: Transporter;
  private mailFrom = process.env.MAIL_FROM ?? 'no-reply@wallaclone.local';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT ?? 587),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendContactEmail({
    sellerEmail,
    buyerEmail,
    buyerUsername,
    advertName,
    message,
    advertLink,
  }: SendContactEmailParams): Promise<void> {
    await this.transporter.sendMail({
      from: `"${buyerUsername} a través de Wallaclone-GitGirls" <${this.mailFrom}>`,
      to: sellerEmail,
      subject: `Alguien se ha interesado en tu anuncio: ${advertName}`,
      text: `
      Has recibido un nuevo mensaje en Wallaclone.

      Usuario: ${buyerUsername}
      Anuncio: ${advertName}

      Mensaje:
      ${message}

      Ver anuncio:
      ${advertLink}

      Para contactar con el comprador responde directamente a este correo.
      `,
      replyTo: buyerEmail,
    });
  }
}

export const emailService = new EmailService();
