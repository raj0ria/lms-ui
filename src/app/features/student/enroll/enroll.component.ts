import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService, Enrollment } from 'src/app/services/course.service';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css']
})
export class EnrollComponent {

  studentName = 'Alice'; // TODO: Replace with actual logged-in student
  enrolledCourses$!: Observable<Course[]>;

  constructor(public courseService: CourseService) {}

  ngOnInit() {
    // Combine courses and enrollments to filter only courses student is enrolled in
    this.enrolledCourses$ = combineLatest([
      this.courseService.getCourses(),
      this.courseService.getEnrollments() // Observable<Enrollment[]>
    ]).pipe(
      map(([courses, enrollments]) =>
        courses.filter(course =>
          enrollments.some(e => e.courseId === course.id && e.studentName === this.studentName)
        )
      )
    );
  }

  // Optional helper to get progress for a course
  getProgress(courseId: number, enrollments: Enrollment[]): number {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.studentName === this.studentName);
    return enrollment ? enrollment.progress : 0;
  }
}
