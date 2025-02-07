import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { localEvents } from './events/event-list';
// import { MailService } from 'src/mail/mail.service'
import { PrismaService } from '../adapter/prisma-service';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from 'src/global/logger/logger.service';
import { MailServiceEvent } from '../mail/mail.service';
import { Request } from 'express';
import { Prisma, User } from '@prisma/client';


const PORT = process.env.PORT ?? 5000;
const dev_server_url = `${process.env.LOCAL_API_URL} `;
const production_server_url = `${process.env.PROD_API_URL} `;

const environment = process.env.NODE_ENV || 'development';

const API_URL = environment === 'development' ? dev_server_url : production_server_url;

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

    try {
      const res = await this.sendMailService.senMail({
        toEmail: payload.email,
        subject: `${payload.name} CONFIRMATION DE PAYMENT SUR LA PLATEFORME 1RICHE1PAUVRE ✔ `,
        text: 'Merci pour votre generosite. Votre donation sera envoyee au destinataire.',
      });
    } catch (error) {
      while (this.counter < 4) {
        this.handleAccountCreated(payload);
        this.counter++;
      }
      this.logger.error(
        `mail service event :error sending mail \n\n ${error}`,
        MailServiceEvent.name,
      );
    }

    this.counter = 1;
  }

  // reinitialize the password
  @OnEvent(localEvents.userPasswordReset)
  async handleUpdatePassword(payload: Prisma.UserCreateInput) {

    // step 1: generate a token, expiration time and store them in the database and send it to the user
    const token = require("crypto").randomBytes(64).toString("hex");
    const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now

    const resetToken = await this.prismaService.resetPassword.create({
      data: {
        token,
        email: payload.username,
        expiration: tokenExpiration
      },
    });


    if (resetToken) {
      const resetLink = `${API_URL.trim()}/api/reset-password?token=${token}&email=${payload.username}`;


      // send email to the user
      try {
        await this.sendMailService.senMail({
          toEmail: payload.username,
          subject: 'REINITIALISATION DE VOTRE MOT DE PASSE SUR LA PLATEFORME 1Riche1Pauvre',
          // text: `Pour réinitialiser votre mot de passe, `,
          html: `<p>Click sur le <a href="${resetLink}">lien</a> pour reinitialiser votre mot de passe</p>`,

        });
      } catch (error) {
        this.logger.error(
          `mail service event :error resetting password \n\n ${error}`,
          MailServiceEvent.name,
        );
      }
    }

    // step 2: send an email to the user to update the password

    // step 3: send an email to the user to validate the password update


    this.logger.log('handleupgradePaymentLogic', JSON.stringify(payload));
  }

  // company created
  @OnEvent(localEvents.userCreated)
  async handleAccountCreated(payload: Prisma.UserCreateInput) {
    try {
      const res = await this.sendMailService.senMail({
        toEmail: payload.username,
        subject: `${payload.nomUser} CONFIRMATION DE CREATION DE COMPTE SUR LA PLATEFORME 1RICHE1PAUVRE ✔ `,
        text: `Merci pour votre inscription. Nous somme heureux de vous avoir 
        dans la famille de ceux qui redonnent le sourire a ceux qui en ont le plus besoin.`,
      });
      if (res) {
        return;
      }
    } catch (error) {
      this.logger.error(
        `mail service event :error sending mail \n\n ${error}. resending`,
        MailServiceEvent.name,
      );
      for (let i = 0; i < 4; i++) {
        this.handleAccountCreated(payload);
      }
    }
  }

  // To update the current user and add him to current user state. 
  @OnEvent(localEvents.userUpdated)
  async updateRequestCurrentUserPayload(
    payload: Partial<User>,
  ) {

    try {
      const res = await this.sendMailService.senMail({
        toEmail: payload.username,
        subject: `${payload.nomUser} CONFIRMATION DE MODIFICATION DE PROFILE SUR LA PLATEFORME 1RICHE1PAUVRE ✔ `,
        text: 'Votre profile a ete mis a jour.',
      });
    } catch (error) {
      this.logger.error(
        `Cannot set current user to request object \n\n ${error}`,
        MailServiceEvent.name,
      );
    }
  }
}
