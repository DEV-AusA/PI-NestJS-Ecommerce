import { Controller, Post, Param, ParseUUIDPipe, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/helpers/file.filter.helper';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadimage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file')) //uso interceptor de nestjs
  async uploadProfilePic(
    @Param('id', ParseUUIDPipe) productId : string,
    @UploadedFile(
      // validations
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100*1024, // max 100KB
            message: `El tamaño del archivo debe ser 100KB maximo`,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/
          })
        ]
      })
    )
    file: Express.Multer.File
  )
  {   
    
    return this.filesService.uploadImage( productId, file);
  }

  @Post('uploadimage/id/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    //validations
    fileFilter: fileFilter,
    limits: { fileSize: 100*1024 } // tamaño maximo 100 KB
  }))
  async uploadProfilePicture(
    @Param('id', ParseUUIDPipe) productId : string,
    @UploadedFile() file: Express.Multer.File
  ){
    
    if(!file) throw new BadRequestException('Verifica que el archivo sea del formato imagen: jpg, jpeg, png, gif');

    return this.filesService.uploadImage( productId, file);
  }
}
