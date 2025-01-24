
// import {
//     Injectable,
//     NestMiddleware,
//     UnauthorizedException,
// } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { JwtService } from '@nestjs/jwt';
// import { User } from '@prisma/client';
// import { LoggerService } from 'src/global/logger/logger.service';


// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//     private allowGetRoutes = ['/v1', '/v1/health'];

//     private allowPostRoutes = [
//         '/v1/subscriptions/successPayPalPayment/?subscription_id',
//     ];

//     constructor(
//         private jwtService: JwtService,
//     ) { }
//     private readonly logger = new LoggerService(AuthMiddleware.name);

//     async use(
//         req: Request & {
//             user: Partial<User>;
//         },
//         res: Response,
//         next: NextFunction,
//     ): Promise<void> {

//         console.log("income url: ", req.originalUrl)

//         // allow health check 
//         if (req.method == 'GET' && this.allowGetRoutes.includes(req.originalUrl)) {
//             this.logger.log('Allowing public  access to route ', AuthMiddleware.name);
//             return next();
//         }

//         // to handle the paypal payment success return payload
//         if (
//             req.method == 'POST' &&
//             this.allowPostRoutes.includes(req.originalUrl)
//         ) {
//             // allow some routes to be public
//             this.logger.log('Allowing public  access to route ', AuthMiddleware.name);
//             return next();
//         }
//         try {
//             //get the token frm the req.
//             const token = this.extractTokenFromHeader(req);

//             // the token should be there even if it is the companies endPoint.
//             if (!token) {
//                 throw new UnauthorizedException('user not authenticated');
//             }
//             // decode the token to get the request payload
//             const payload = await this.jwtService.decode(token);


//             req['user'] = {
//                 id: payload.id,
//                 email: payload.email,
//                 nomUser: payload.nomUser,
//                 username: payload.username,
//             } as Partial<User>;

//             next();

//         } catch (error) {
//             this.logger.error(
//                 `Authenticification failed \n\n${error}`,
//                 AuthMiddleware.name,
//             );
//             throw new UnauthorizedException('user not authenticated');
//         }
//     }

//     /**
//      * Extracts the token fro the request header.
//      *
//      * @param {Request} request - the request object
//      * @return {string | undefined} the xtracted token  or undefined
//      */
//     private extractTokenFromHeader(request: Request): string | undefined {
//         // console.log(" the request   headers  auth: ", request.headers.authorization);
//         // console.log("the request body: ", request.body);
//         const [type, token] = request.headers.authorization?.split(' ') ?? [];

//         return type === 'Bearer' ? token : undefined;
//     }
// }
