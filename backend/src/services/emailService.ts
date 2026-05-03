import nodemailer from 'nodemailer';

class EmailService {
  private transporter;
  private MAILTRAP_USERNAME = process.env.MAIL_USER;
  private MAILTRAP_PASSWORD = process.env.MAIL_PASSWORD;
  private MAILTRAP_HOST = process.env.MAIL_HOST;
  private MAILTRAP_PORT = process.env.MAILTRAP_PORT;
  private MAILTRAP_FROM = process.env.MAIL_FROM;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.MAILTRAP_HOST,
      port: Number(this.MAILTRAP_PORT),
      auth: {
        user: this.MAILTRAP_USERNAME,
        pass: this.MAILTRAP_PASSWORD,
      },
    });
  }

  async sendContactEmail({
    sellerEmail,
    buyerEmail,
    buyerUsername,
    advertName,
    message,
  }: {
    sellerEmail: string;
    buyerEmail: string;
    buyerUsername: string;
    advertName: string;
    message: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"${buyerUsername} a través de Wallaclone-GitGirls" <${this.MAILTRAP_FROM}>`,
      to: sellerEmail,
      subject: `Nuevo mensaje sobre ${advertName}`,
      text: `Has recibido un nuevo mensaje del usuario ${buyerUsername} por tu anuncio ${advertName}.
      mensaje: ${message} 
      Puedes responder directamente a este email para contactar con el comprador.`,
      replyTo: buyerEmail,
    });
  }
}

export const emailService = new EmailService();
