import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector // Reflector es una clase que nos permite obtener los metadatos de una clase o método.
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      
    const validRoles = this.reflector.get<string[]>(META_ROLES, context.getHandler()); // Obtiene los "roles" válidos de la ruta en el controller private2
    
    if(!validRoles) return true; // Si no hay roles válidos, se permite el acceso a la ruta
    if(validRoles.length === 0) return true; // Si no hay roles válidos, se permite el acceso a la ruta



    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!user) 
      throw new BadRequestException('User not found ');

    
    for (const role of user.roles ){ // Recorre los roles del usuario
      if(validRoles.includes(role)){ // Si el rol del usuario está en los roles válidos, se permite el acceso a la ruta
        return true;
      }
    }

    throw new ForbiddenException( // Si el usuario no tiene un rol válido, se lanza una excepción
    `User ${user.fullName} need a valid role: [${validRoles}] `
    )
    
  }
}
