import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// // Para usar de forma local en algun modulo, 
// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log(`Estas en la ruta ${req.url}`);
//     next()
//   }
// }

// Para usar en forma global
export const loggerGlobal = ( req: Request, res: Response, next: NextFunction, ) => {
  const currentDate = new Date();
  console.log(
    `Ejecutando metodo ${req.method} en la ruta ${req.url} con fecha y hora local: ${currentDate.toLocaleString()}`,
  );
  next();
};
