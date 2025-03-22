import { applyDecorators, UseGuards } from '@nestjs/common';
import { validRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: validRoles[]) {
  
    return applyDecorators( // MOVIMOS el roleprotected y userGuard, Authguard , userRoleGuard en esta funcion. simplifica el controllers

    RoleProtected(...roles), // aplicamos la interface validRoles

    UseGuards(AuthGuard(), UserRoleGuard),
   
  );
}