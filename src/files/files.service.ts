import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

getStaticProductImage(imageName: string){

    const path = join(__dirname, '../../static/products', imageName); // se une el directorio actual con la carpeta static/products y el nombre de la imagen

    if(!existsSync(path)) // si no existe el path
        throw new BadRequestException(`No product found with image ${imageName}`);

        return path;
       
    

}

}
