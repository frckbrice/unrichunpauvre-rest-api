import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { localEvents } from './events/event-list';
// import { MailService } from 'src/mail/mail.service'
import { PrismaService } from '../adapter/prisma-service';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from 'src/global/logger/logger.service';
import { MailServiceEvent } from '../mail/mail.service';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class ListenerService {
  counter: number = 1;
  private logger = new LoggerService(ListenerService.name);
  constructor(
    private readonly mailerService: MailerService,
    private prismaService: PrismaService,
    private sendMailService: MailServiceEvent,
  ) { }

  /**
   * Handle the event when a participant is created.
   * by sending the confirmation registration received
   * @param {Participant} payload - The participant data
   */
  @OnEvent(localEvents.paymentSuccess)
  async handleSuccessPaymentLogic(payload: any) {
    // TODO: send email to Customer compte
    this.logger.log('handleSuccessPaymentLogic', JSON.stringify(payload));
  }

  @OnEvent(localEvents.paymentCanceled)
  async handleCancelPaymentLogic(payload: any) {
    // TODO: send email to Customer account
    this.logger.log('handleCancelPaymentLogic', JSON.stringify(payload));
  }

  @OnEvent(localEvents.paymentSuccess)
  async handleUnsubscribePaymentLogic(payload: any) {
    // TODO: send email to Customer company
    const res = await this.sendMailService.senMail({
      toEmail: payload.email,
      subject: `${payload.name} CONFIRMATION DE PAYMENT SUR LA PLATEFORME UNRICHUNPAUVRE ✔ `,
      text: 'Merci pour votre generosite. Votre donation sera envoyee au destinataire.',
    });
    if (res) {
      // TODO: send email to Customer account
      this.logger.log(
        'Account created \n\n ' + JSON.stringify(payload),
        ListenerService.name,
      );
    } else {
      // TODO: will find a better way the handle this later
      while (this.counter < 4) {
        this.handleAccountCreated(payload);
        this.counter++;
      }
    }
    this.counter = 1;
  }

  @OnEvent(localEvents.paymentCanceled)
  async handleUpgradePaymentLogic(payload: any) {
    // TODO: send email to Customer company
    this.logger.log('handleupgradePaymentLogic', JSON.stringify(payload));
  }

  // company created
  @OnEvent(localEvents.userCreated)
  async handleAccountCreated(payload: any) {
    const res = await this.sendMailService.senMail({
      toEmail: payload.email,
      subject: `${payload.name} CONFIRMATION DE CREATION DE COMPTE SUR LA PLATEFORME UNRICHUNPAUVRE ✔ `,
      text: 'Merci pour votre inscription. Nous somme heureux de vous avoir dans la famille de ceux qui redonnent le sourire a ceux qui en ont le plus besoin.',
    });
    if (res) {
      // TODO: send email to Customer account
      this.logger.log(
        'Account created \n\n ' + JSON.stringify(payload),
        ListenerService.name,
      );
    } else {
      // TODO: will find a better way the handle this later
      while (this.counter < 4) {
        this.handleAccountCreated(payload);
        this.counter++;
      }
    }
    this.counter = 1;
  }

  // To update the current user and add him to current user state. 
  @OnEvent(localEvents.userCreated)
  async updateRequestCurrentUserPayload(
    payload: Partial<User>,
    req: Request & {
      user: Partial<User>;
    },
  ) {
    const user: Partial<User> = {
      id: payload.id,
      nomUser: payload.nomUser,
      username: payload.username,
      mdpUser: payload.mdpUser,
      etatUser: payload.etatUser,
      photoUser: payload.photoUser,
      updatedAt: payload.updatedAt,
    };

    return (req['user'] = user);
  }
}
