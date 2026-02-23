import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { map, Observable } from 'rxjs';
import { CourseService, Enrollment } from 'src/app/services/course.service';
import { RouterLink } from '@angular/router';
import { CourseTitlePipe } from "../pipe/course-title.pipe";
import { StudentDashBoardCourse } from 'src/app/models/student-course.model';
import { PagedResponse } from 'src/app/features/student/browse/browse.component';
import { UserService } from 'src/app/services/user.service';

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

  myCourses: StudentDashBoardCourse[] = [];

  page = 0;
  size = 6;
  totalPages = 0;
  totalElements = 0;

  loading = false;

  // enrolledCourses = [ 
  //   { title: 'Angular Basics', progress: '50%' }, 
  //   { title: 'Spring Boot', progress: '20%' } 
  // ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.loading = true;

    this.userService.getStudentDashBoardCourses(this.page, this.size)
      .subscribe({
        next: (response: PagedResponse<StudentDashBoardCourse>) => {
          this.myCourses = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load courses', err);
          this.loading = false;
        }
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadMyCourses();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadMyCourses();
    }
  }
}
