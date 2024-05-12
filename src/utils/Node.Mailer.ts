import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CorreoService {
  async enviarCorreo(destinatario: string, asunto: string, contenido: string) {
    // Configurar el transporte
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tucorreo@gmail.com',
        pass: 'tucontraseña',
      },
    });

    // Configurar el contenido del correo electrónico
    const mailOptions = {
      from: 'tucorreo@gmail.com',
      to: destinatario,
      subject: asunto,
      text: contenido,
    };

    // Enviar el correo electrónico

    return transporter.sendMail(mailOptions);
  }
}
