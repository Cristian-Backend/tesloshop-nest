import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}


  @Get('product/:imageName') // localhost:3000/files/product/imageName 
  findProductImage(
    @Res() res: Response, // se recibe la respuesta 
    @Param('imageName') imageName: string){ // se recibe el nombre de la imagen

    const path = this.filesService.getStaticProductImage(imageName) // se llama al metodo getStaticProductImage del servicio y se le pasa el nombre

    
    res.sendFile(path)

  }

  // localhost:3000/files/product
  @Post('product')
  @UseInterceptors(FileInterceptor("file",{ //intercepta la peticion 
    fileFilter: fileFilter, // se le pasa el fileFilter de helpers

    storage: diskStorage({ 
        destination: "./static/products", // se guarda en la carpeta static/uploads
        filename: fileNamer, // se le pasa el fileNamer de helpers
    })

  })) // 
  uploadProductImage(@UploadedFile() file: Express.Multer.File){


    if(!file) {
      throw new BadRequestException("make sure that the file is an image ")
    }

   // const secureUrl = `${file.filename}`
   const secureUrl =  `${this.configService.get("HOST_API")}/files/product/${file.filename}`



     return {
      secureUrl
     }
  }
 
}
