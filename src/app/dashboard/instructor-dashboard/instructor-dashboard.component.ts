import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Course, CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent {
  myCourses: Course[] = [];

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    // this.courseService.getCourses().subscribe(courses => {
    //   this.myCourses = courses;
    // });
    this.loadCourses();
  }

  loadCourses(): void {
    // Call backend which already knows the logged-in instructor
    this.courseService.getCoursesByInstructor().subscribe({
      next: (courses) => {
        this.myCourses = courses;
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
      }
    });
  }

  get totalCourses(): number {
    return this.myCourses.length;
  }

  get publishedCourses(): number {
    return this.myCourses.filter(c => c.published).length;
  }

  get draftCourses(): number {
    return this.myCourses.filter(c => !c.published).length;
  }

  // togglePublish(course: Course): void {
  //   if (!course.published) {
  //     if (course.capacity <= 0) {
  //       alert('Cannot publish course with zero capacity.');
  //       return;
  //     }
  //   }
  //   this.courseService.togglePublish(course.id);
  // }

  togglePublish(course: Course): void {
    // Optional validation before publishing
    if (course.published) {
      alert('Course is already published!');
      return;
    }
    if (!course.published && course.capacity <= 0) {
      alert('Cannot publish course with zero capacity.');
      return;
    }
    this.courseService.publishCourse(course.id).subscribe({
      next: (updatedCourse) => {
        // Update the course in the UI
        course.published = updatedCourse.published;
        console.log(`Course "${course.title}" publish status updated`);
      },
      error: (err) => {
        console.error('Failed to publish course:', err);
        alert('Failed to update course status. Please try again.');
      }
    });
  }

  deleteCourse(courseId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this course?'
    );

    if (!confirmDelete) return;

    this.courseService.deleteCourseByInstructor(courseId).subscribe({
      next: () => {
        this.myCourses = this.myCourses.filter(c => c.id !== courseId);
        // alert('Course deleted successfully');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete course');
      }
    });
  }

}
