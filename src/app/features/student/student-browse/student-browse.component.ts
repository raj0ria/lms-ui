import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService, Enrollment } from 'src/app/services/course.service';
import { combineLatest, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';

@Component({
  selector: 'app-student-browse',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent],
  templateUrl: './student-browse.component.html',
  styleUrls: ['./student-browse.component.css']
})
export class StudentBrowseComponent {

  studentName = 'Alice';
  // courses$: Observable<Course[]>;
  coursesWithEnrollment$!: Observable<(Course & { enrolled: boolean })[]>;

  constructor(private courseService: CourseService) {
    // Only show published courses
    // this.courses$ = this.courseService.getCourses();

    // this.courses$ = this.courseService.getCourses().pipe(
    //   map(courses => courses.filter(c => c.published))
    // );
  }

  ngOnInit() {
    // Combine courses and enrollments to mark if student is enrolled
    this.coursesWithEnrollment$ = combineLatest([
      this.courseService.getCourses(),
      this.courseService.getEnrollments()
    ]).pipe(
      map(([courses, enrollments]) =>
        courses
          .filter(c => c.published) // only published courses for student
          .map(c => ({
            ...c,
            enrolled: enrollments.some(e => e.courseId === c.id && e.studentName === this.studentName)
          }))
      )
    );
  }

  enroll(course: Course) {
    const enrollment: Enrollment = {
      id: Date.now(),
      courseId: course.id,
      studentName: 'Alice', // TODO: replace with logged-in student
      progress: 0
    };

    this.courseService.addEnrollment(enrollment);
    alert(`Enrolled in ${course.title} successfully!`);
  }

}
