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

@Get('check-status')
@Auth()
checkAuthStatus(
@GetUser() user: User 
) {

  return this.authService.checkAuthStatus(user);

}


  @Get('private') 
  @UseGuards(AuthGuard()) 
  testigPrivateRoutes(
    @Req() request: Express.Request, 
    @GetUser() user: User,
    @GetUser('email') userEmail: string, 
    @RawHeaders() rawHeaders:string[], 
    @Headers() headers: IncomingHttpHeaders, 
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
  @RoleProtected(validRoles.superUser, validRoles.admin, validRoles.user) 
 // @SetMetadata('roles', ['admin', 'super-user']) Esto se usa, pero vamos a usar un decorador personalizado
 
  @UseGuards(AuthGuard(), UserRoleGuard) 
  privateRouter2(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }


  
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
