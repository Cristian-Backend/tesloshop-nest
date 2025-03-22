


export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    //console.log({file});
    
    if(!file) return callback(new Error (` file is empty`), false); // si no hay archivo retorna un error

    const fileExptension = file.mimetype.split('/')[1]; // obtiene la extension del archivo
    const validExtension = ['jpg', 'jpeg', 'png', 'gif']; // extensiones validas

    if (validExtension.includes(fileExptension)) return callback(null, true); // si la extension es valida retorna true

    callback(null, false);

}