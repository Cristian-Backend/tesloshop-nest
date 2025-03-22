import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

//Este decorador se encarga de obtener los headers de la petición
export const RawHeaders = createParamDecorator( //

    (data: string, ctx: ExecutionContext)=> {

        

        //console.log(data);
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;

         

       
    }

) 