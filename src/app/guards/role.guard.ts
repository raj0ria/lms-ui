import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot) {
  //     const roles = route.data['roles'] as string[]
  //     if(!roles.some(r => this.authService.hasRole(r))){
  //       this.router.navigate(['/login'])
  //       return false;
  //     }
  //   return true;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { 
    const roles = route.data['roles'] as string[] | undefined; // If no roles defined, allow access 
    if (!roles || roles.length === 0) { return true; } // If user has at least one required role 
    if (roles.some(r => this.authService.hasRole(r))) 
      { return true; } // Otherwise redirect 
    this.router.navigate(['/login']); return false; 
  }
  
}
