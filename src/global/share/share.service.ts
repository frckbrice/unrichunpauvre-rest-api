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
        subject: `Paiement - 1	RICHE	1	PAUVRE ✔ `,
        text: `
        Bonjour,	${payload.nomUser}

Votre	paiement	a	bien	été	enregistré.	Vous	venez	de	réaliser	un	rêve	et	nous	vous en	
remercions.	

Nous reviendrons	vers	vous,	avec	une	vidéo	prouvant	cette	réalisation.	

Si	vous	avez	des	questions,	ou	si	vous	avez	besoin	d’aide,	n’hésitez	pas	à	nous	contacter	à	
unricheunpauvre@gmail.com ou	à	consulter	notre	section	d’aide	dans	l’application.

Merci	de	votre	fidélité	et	à	bientôt sur	1RICHE	1PAUVRE.	

Cordialement	
L’équipe	de	1RICHE	1	PAUVRE
        `,
      });
    } catch (error) {
      for (let i = 0; i < 4; i++)
        this.handleUnsubscribePaymentLogic(payload);
      this.logger.error(
        `mail service event :error sending mail \n\n ${error}`,
        MailServiceEvent.name,
      );
    }
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
          subject: '	Mise	à	jour	du	compte - 1	RICHE	1	PAUVRE ✔',
          // text: `Pour réinitialiser votre mot de passe, `,
          html: `<p> Bonjour,	${payload.nomUser} 
          Cliquez sur le lien <a href="${resetLink}">reinitialiser</a> pour reinitialiser votre mot de passe
          </p>`,

        });
      } catch (error) {
        for (let i = 0; i < 4; i++)
          this.handleUpdatePassword(payload);
        this.logger.error(
          `mail service event :error resetting password \n\n ${error}`,
          MailServiceEvent.name,
        );
      }
    }

  }

  // company created
  @OnEvent(localEvents.userCreated)
  async handleAccountCreated(payload: Prisma.UserCreateInput) {
    try {
      const res = await this.sendMailService.senMail({
        toEmail: payload.username,
        subject: `Bienvenue	sur	1	RICHE	1	PAUVRE	 ✔ `,
        text: `Bonjour,	${payload.nomUser}
Merci	d’avoir	crée	un	compte	sur	1	RICHE	1	PAUVRE ! Nous	sommes	ravis	de	vous	accueillir	
sur	l’application.
Votre	compte	a	été	crée	avec	succès.	Vous	pouvez	maintenant décrire	et	poster	votre	rêve.	
Pour	vous	connecter,	utilisez	les	informations	suivantes :
- Adresse	email : ${payload?.username}
- Mot	de	Passe : votre mot de passe a conserver au secret
Si	vous	avez	des	questions,	ou	si	vous	avez	besoin	d’aide,	n’hésitez	pas	à	nous	contacter	à	
unricheunpauvre@gmail.com ou	à	consulter	notre	section	d’aide	dans	l’application.

Merci	encore	et	profitez	de	votre	expérience	sur	1RICHE	1	PAUVRE.	

Cordialement	

L’équipe	de	1RICHE	1	PAUVRE`,
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
        subject: `Mise	à	jour	du	compte	1	RICHE	1	PAUVRE ✔ `,
        text: `
      Bonjour,	${payload?.nomUser}

Nous	vous	informons	que	votre	compte	sur	1	RICHE	1	PAUVRE,	a	été	mis	à	jour	avec	succès !

Si	vous	avez	des	questions,	ou	si	vous	avez	besoin	d’aide,	n’hésitez	pas	à	nous	contacter	à	
unricheunpauvre@gmail.com ou	à	consulter	notre	section	d’aide	dans	l’application.	

Merci	de	votre	fidélité	et	à	bientôt sur	1RICHE	1PAUVRE.	

Cordialement	
L’équipe	de	1RICHE	1	PAUVRE
      `,
      });
    } catch (error) {
      this.logger.error(
        `Cannot set current user to request object \n\n ${error}`,
        MailServiceEvent.name,
      );
    }
  }
}
