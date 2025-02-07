import { Controller, Get, Post, Body, Render, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Public } from './global/auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Route to render the password reset form (GET request)
  @Public()
  @Get('reset-password')
  @Render('reset-password')
  getResetPasswordForm(@Query('token') token: string, @Query('email') email: string) {
    return { token, email }; // Pass token and email to the template
  }

  // Route to handle form submission (POST request)
  @Public()
  @Post('reset-password')
  async handleResetPassword(
    @Body('token') token: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
    @Res() res: Response,
  ) {
    if (password !== confirmPassword) {
      return res.status(400).send('Pas de correspondance entre les deux mots de passe.');
    }

    const success = await this.appService.resetPassword(email, token, password);

    if (success) {
      return res.send({
        message: 'Mot de passe réinitialisé avec succès. Veuillez vous connecter.',
        status: 200,
        data: null
      });
    } else {
      return res.status(400).send({
        message: 'Token non valide ou expiré.',
        status: 400,
        data: null
      });
    }
  }
}
