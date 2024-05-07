import { BadRequestException } from '@nestjs/common';

// validation de archivo de imagen
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file)
    return callback(new BadRequestException('No hay ningun archivo.'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(null, false);
};
