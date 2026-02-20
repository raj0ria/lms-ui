import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Course } from 'src/app/services/course.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent { 
  stats = { users: 120, courses: 15, enrollments: 300, instructors: 230 }; 

  users$!: Observable<any>;
  selectedOrder$!: Observable<any>;
  constructor( 
    private userService: UserService,
    private router: Router,
  ) {}
  
  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.users$ = this.userService.listUsers();
  }

  loadUserById(id: number) {
    this.selectedOrder$ = this.userService.getUserById(id);
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

}
