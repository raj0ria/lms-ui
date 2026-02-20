import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService, Enrollment, Module } from 'src/app/services/course.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  course!: Course;
  modules: Module[] = [];
  courseId!: number;
  enrollments: Enrollment[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    this.courseService.getCourses().subscribe(courses => {
      this.course = courses.find(c => c.id === this.courseId)!;
    });

    this.courseService.getModulesByCourse(this.courseId)
      .subscribe(modules => {
        this.modules = modules.filter(m => m.courseId === this.courseId);
      });

    this.courseService.getEnrollmentsByCourse(this.courseId)
      .subscribe(enrollments => {
        this.enrollments = enrollments
          .filter(e => e.courseId === this.courseId);
      });
  }

  deleteModule(id: number) {
    this.courseService.deleteModule(id);
  }
}

