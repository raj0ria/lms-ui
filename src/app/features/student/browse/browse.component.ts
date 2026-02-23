import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from 'src/app/services/course.service';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from "src/app/dashboard/nav-bar/nav-bar.component";
import { StudentCourse, StudentDashBoardCourse } from 'src/app/models/student-course.model';
import { UserService } from 'src/app/services/user.service';

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number; 
  last: boolean;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, NavBarComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  courses: StudentCourse[] = [];
  keyword: string = '';
  enrolledCourseIds: number[] = [];
  enrollingCourseIds: number[] = [];
  myCourses: StudentDashBoardCourse[] = [];

  page = 0;
  size = 8;
  totalPages = 0;
  totalElements = 0;

  loading = false;

  constructor(private courseService: CourseService, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    this.loading = true;

    this.userService.getStudentDashBoardCourses(this.page, this.size)
      .subscribe({
        next: (response: PagedResponse<StudentDashBoardCourse>) => {
          this.myCourses = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
          this.enrolledCourseIds = response.content.map(
          course => course.courseId
        );
        },
        error: (err) => {
          console.error('Failed to load courses', err);
          this.loading = false;
        }
      });
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.searchCourses(this.keyword, this.page, this.size)
      .subscribe({
        next: (response: PagedResponse<StudentCourse>) => {
          this.courses = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading courses', err);
          this.loading = false;
        }
      });
  }

  search(): void {
    this.page = 0;
    this.loadCourses();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadCourses();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadCourses();
    }
  }

  enroll(courseId: number): void {

    if (this.enrolledCourseIds.includes(courseId)) {
      return;
    }

    this.enrollingCourseIds.push(courseId);

    this.courseService.enrollInCourse(courseId)
      .subscribe({
        next: (response) => {

          this.enrolledCourseIds.push(response.courseId);

          // remove from loading state
          this.enrollingCourseIds =
            this.enrollingCourseIds.filter(id => id !== courseId);

          alert(`Successfully enrolled in ${response.courseTitle}`);
        },
        error: (err) => {

          this.enrollingCourseIds =
            this.enrollingCourseIds.filter(id => id !== courseId);

          if (err.status === 409) {
            alert('You are already enrolled in this course.');
          }
          if (err.message === "You are already enrolled in this course") {
            alert('You are already enrolled in this course.');
          } 
          else {
            alert('Enrollment failed.');
          }

          console.error(err);
        }
      });
  }


  unenroll(courseId: number): void {

    this.enrollingCourseIds.push(courseId);

    this.courseService.unenrollFromCourse(courseId)
      .subscribe({
        next: () => {

          // remove from enrolled list
          this.enrolledCourseIds =
            this.enrolledCourseIds.filter(id => id !== courseId);

          // remove loading state
          this.enrollingCourseIds =
            this.enrollingCourseIds.filter(id => id !== courseId);

          alert('Successfully unenrolled from course.');
        },
        error: (err) => {

          this.enrollingCourseIds =
            this.enrollingCourseIds.filter(id => id !== courseId);

          alert('Unenrollment failed.');
          console.error(err);
        }
      });
  }

}
