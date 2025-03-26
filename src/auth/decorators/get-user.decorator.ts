import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator( //

    (data: string, ctx: ExecutionContext)=> {

        

        //console.log(data);
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(!user)
            throw new InternalServerErrorException('User not foun (request)');

        
        return (!data) ? user : user[data]; 
            
        

       
    }

) 