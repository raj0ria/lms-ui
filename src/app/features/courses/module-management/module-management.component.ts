import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService, Course, Module, Enrollment } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';

@Component({
  selector: 'app-module-management',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './module-management.component.html',
  styleUrls: ['./module-management.component.css']
})
export class ModuleManagementComponent implements OnInit {

  courseId!: number;
  course!: Course;
  role!: string;

  modules$: Observable<Module[]> = new Observable();
  enrollments$: Observable<Enrollment[]> = new Observable();

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.role = this.route.snapshot.data['role']; // get role from route

    console.log("Role is "+this.role)

    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const foundCourse = this.courseService.getCourseById(this.courseId);

    if (!foundCourse) {
      alert('Course not found!');
      this.router.navigate(['/instructor']);
      return;
    }

    this.course = foundCourse;

    // Subscribe to modules for this course
    this.modules$ = this.courseService.getModulesByCourse(this.courseId).pipe(
      map(modules => modules.filter(m => m.courseId === this.courseId))
    );

    // Subscribe to enrollments for this course
    if (this.role === 'USER') {
      this.enrollments$ = this.courseService.getEnrollmentsByCourse(this.courseId).pipe(
        map(enrolls => enrolls.filter(e => e.courseId === this.courseId))
      );
    }
  }

  deleteModule(moduleId: number) {
    if (this.role !== 'USER') return; // only instructor can delete
    if (confirm('Are you sure?')) {
      this.courseService.deleteModule(moduleId);
    }
  }

  goBack() {
    if (this.role === 'USER') {
      this.router.navigate(['/courses']);
    } 
    else {
      this.router.navigate(['/instructor']);
    }
  }
}
