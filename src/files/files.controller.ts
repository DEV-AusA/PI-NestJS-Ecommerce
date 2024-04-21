import { Controller, Post, Param, ParseUUIDPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../helpers/file.filter.helper';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @Post('uploadimage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file')) //uso interceptor de nestjs
  @ApiResponse({ status: 201, description: 'Imagen creada y cargada correctamente' })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({ status: 413, description: 'El tamaño del archivo debe ser 100KB maximo' })
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

  @ApiBearerAuth()
  @Post('uploadimage/id/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    //validations
    fileFilter: fileFilter,
    limits: { fileSize: 100*1024 }, // max 100 KB
  }))
  @ApiResponse({ status: 201, description: 'Imagen creada y cargada correctamente' })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({ status: 413, description: 'El tamaño del archivo debe ser 100KB maximo' })
  async uploadProfilePicture(
    @Param('id', ParseUUIDPipe) productId : string,
    @UploadedFile() file: Express.Multer.File
  ){
    
    if(!file) throw new BadRequestException('Verifica que el archivo sea del formato imagen: jpg, jpeg, png, gif');

    return this.filesService.uploadImage( productId, file);
  }
}
