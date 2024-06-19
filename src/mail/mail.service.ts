import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor( private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_SERVER'),
      port: this.configService.get<number>('SMTP_PORT', 465),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  private renderTemplate(templatePath: string, context: any): string {
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateString);
    return template(context);
  }

  private async sendEmail(
    to: string,
    subject: string,
    templatePath: string,
    context: Record<string, any>
  ) {
    const htmlContent = this.renderTemplate(templatePath, context);

    const mailOptions = {
      from: this.configService.get<string>('DEFAULT_EMAIL_FROM', 'alessandro@pinaculodigital.com.br'),
      to: to,
      subject: subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Falha ao enviar e-mail:', error);
      return false; // Falha ao enviar e-mail
    }
  }

  async sendUserRegistrationEmail(name: string, email: string) {
    try {
      await this.sendEmail(
        email,
        'Bem-vindo ao nosso serviço!',
        join(__dirname, './templates/registration-confirmation.hbs'),
        { name }
      );
    } catch (error) {
      console.error('Falha ao enviar e-mail:', error);
      return false; // Falha ao enviar e-mail
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    try {
      await this.sendEmail(
        email,
        'Redefinição de senha',
        join(__dirname, './templates/reset-password.hbs'),
        { resetUrl }, // Certifique-se de que o template handlebars use essa variável
      );
      return true; // E-mail enviado com sucesso
    } catch (error) {
      console.error('Falha ao enviar e-mail:', error);
      return false; // Falha ao enviar e-mail
    }
  }
}