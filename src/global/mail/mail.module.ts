import { Module } from '@nestjs/common';
import { MailServiceEvent } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SENWISETOOL_HOST,
        service: process.env.SENWISETOOL_SERVICE_PROVIDER,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENWISETOOL_TRANSPORT_USER,
          pass: process.env.SENWISETOOL_TRANSPORT_PASSWORD,
        },
      },
      defaults: {
        from: `"no reply" <${process.env.INOVENT_EMAIL}>`,
      },
      template: {
        dir: path.join(__dirname, 'templates'), // where email templates are found, using hbs.
        // adapter: ; // TODO +=> install and add hbs adapter,
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailServiceEvent],
  exports: [MailServiceEvent],
})
export class MailModule { }
