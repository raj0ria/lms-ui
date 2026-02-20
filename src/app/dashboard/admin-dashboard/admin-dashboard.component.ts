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

  stats = { 
    users: 0, 
    courses: 0, 
    enrollments: 0, 
    instructors: 0 
  }; 

  users$!: Observable<any>;
  selectedOrder$!: Observable<any>;
  constructor( 
    private userService: UserService,
    private router: Router,
  ) {}
  
  ngOnInit() {
    // this.loadOrders();
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.userService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.users = data.totalStudents;
        this.stats.instructors = data.totalInstructors;
        this.stats.courses = data.totalCourses;
        this.stats.enrollments = data.totalEnrollments;
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
      }
    });
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
