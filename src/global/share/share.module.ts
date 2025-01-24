import { Module } from '@nestjs/common';
import { ListenerService } from './share.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [],
  providers: [ListenerService],
})
export class ShareModule { }
