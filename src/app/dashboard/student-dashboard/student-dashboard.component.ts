import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { map, Observable } from 'rxjs';
import { CourseService, Enrollment } from 'src/app/services/course.service';
import { RouterLink } from '@angular/router';
import { CourseTitlePipe } from "../pipe/course-title.pipe";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink, CourseTitlePipe],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {

  studentName = 'Alice'; // TODO: get from AuthService
  enrollments$!: Observable<Enrollment[]>;

  // enrolledCourses = [ 
  //   { title: 'Angular Basics', progress: '50%' }, 
  //   { title: 'Spring Boot', progress: '20%' } 
  // ];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.enrollments$ = this.courseService.getEnrollmentsByCourse(0) // all enrollments
      .pipe(
        map(enrolls => enrolls.filter(e => e.studentName === this.studentName))
      );
  }
}
