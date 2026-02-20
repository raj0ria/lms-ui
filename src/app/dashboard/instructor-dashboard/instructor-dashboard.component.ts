import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  myCourses!: Course[] ;
  currentInstructor = 'Bob';

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => {
      this.myCourses = courses;
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      // Show only courses created by this instructor
      this.myCourses = courses.filter(
        c => c.instructor === this.currentInstructor
      );
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

  togglePublish(course: Course): void {
    if (!course.published) {
      if (course.capacity <= 0) {
        alert('Cannot publish course with zero capacity.');
        return;
      }
    }
    this.courseService.togglePublish(course.id);
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id);
    }
  }
  
  // deleteCourse(id: number): void {
  //   if (confirm('Are you sure you want to delete this course?')) {
  //     this.myCourses = this.myCourses.filter(c => c.id !== id);
  //     console.log('Deleted course with id:', id);
  //     // Call API here
  //   }
  // }
}
