import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator( //

    (data: string, ctx: ExecutionContext)=> {

        

        //console.log(data);
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(!user)
            throw new InternalServerErrorException('User not foun (request)');

        //si no se pasa un argumento, se devuelve el objeto completo del usuario, de lo contrario, se devuelve la propiedad específica del usuario que se pasa como argumento *
        return (!data) ? user : user[data]; 
            
        

       
    }

) 