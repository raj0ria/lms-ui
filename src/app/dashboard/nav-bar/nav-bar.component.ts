import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course, CourseService, Module } from 'src/app/services/course.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(public authService: AuthService, private router: Router,
    private route: ActivatedRoute, private courseService: CourseService
  ){
    console.log('Role is '+authService.hasRole('INSTRUCTOR'))
   }

  handleLogout(){
    this.authService.logout().subscribe(()=>{
      this.router.navigate(['/login'])
    })
  }
}
