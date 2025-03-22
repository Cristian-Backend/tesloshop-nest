
import {v4 as uuid} from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    //console.log({file});
    
    if(!file) return callback(new Error (` file is empty`), false); // si no hay archivo retorna un error

    const fileExptension = file.mimetype.split('/')[1]; // obtiene la extension del archivo

    const fileName = `${uuid()}.${fileExptension}`

  

    callback(null, fileName);

}