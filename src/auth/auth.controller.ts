import { Controller, Get, Post, Body,  UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces';





@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
 loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private') // Ruta privada para probar el token
  @UseGuards(AuthGuard()) //Aplica un guard de autenticación a la ruta, protegiéndola para que solo los usuarios autenticados puedan acceder.
  testigPrivateRoutes(
    @Req() request: Express.Request, //Obtiene la solicitud de la petición
    @GetUser() user: User,//En este metodo me retorna todo el usuario
    @GetUser('email') userEmail: string, // voy a obtener el email solo del usuario. *
    @RawHeaders() rawHeaders:string[], //Obtiene los headers de la petición,
    @Headers() headers: IncomingHttpHeaders, // otra forma o quizas mas comun // retorna lo mismo o parecido de raw headers
  ){
    return {
      message: 'hola mundo private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
    
  }

  
  @Get('private2')
  @RoleProtected(validRoles.superUser, validRoles.admin, validRoles.user) // aplicamos la interface validRoles
 // @SetMetadata('roles', ['admin', 'super-user']) Esto se usa, pero vamos a usar un decorador personalizado
 
  @UseGuards(AuthGuard(), UserRoleGuard) // guard personalizado. UserRoleGuard
  privateRouter2(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }


  // UTILIZAMOS el private 3 para implementar mas conocimiento, simplificamos el private 2 en private 3
  @Get('private3')
  @Auth(validRoles.admin)
  privateRouter3(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }

}
