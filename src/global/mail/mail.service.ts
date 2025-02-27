import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../adapter/prisma-service';
import { LoggerService } from 'src/global/logger/logger.service';

// https://documentation.mailgun.com/docs/mailgun/sdk/nodejs_sdk/
// import FormData from 'form-data';
// import Mailgun from 'mailgun.js';
// const mailgun = new Mailgun(FormData);
// const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });
// import { readFile } from 'node:fs/promises';
// const path = require('node:path');

interface MailOptions {
  toEmail: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class MailServiceEvent {
  private readonly logger = new LoggerService(MailServiceEvent.name);
  constructor(private readonly mailerService: MailerService) { }

  async senMail({
    toEmail,
    subject,
    text,
    html
  }: Partial<MailOptions>): Promise<any> {
    return this.mailerService
      .sendMail({
        to: toEmail, // list of receivers
        from: 'noreply@unricheunpauvre.com', // sender address
        subject, // Subject line
        text, // plaintext body
        html, // HTML body content
      })
      .then((resp) => {
        this.logger.log(` mail sent to ${toEmail}`, MailServiceEvent.name);
        return resp.response;
      })
      .catch((err) => {
        this.logger.error(
          `mail service event :error sending mail \n\n ${err}`,
          MailServiceEvent.name,
        );

      });
  }
}
