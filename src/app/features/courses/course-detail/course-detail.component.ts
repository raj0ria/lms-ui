import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService, Enrollment, Module } from 'src/app/services/course.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';
import { CourseDetail } from 'src/app/models/course-detail-instructor.model';
import { EnrollmentStatus, StudentModule } from 'src/app/shared/directives/enrollment-status.enum';
import { InstructorCourseStudentResponse, UserService } from 'src/app/services/user.service';
import { PagedResponse } from '../../student/browse/browse.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  course!: CourseDetail;
  modules: Module[] = [];
  courseId!: number;
  enrollments: Enrollment[] = [];

  students: InstructorCourseStudentResponse[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loadingStudents = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadStudents();
    this.courseService.getCourseDetail(this.courseId).subscribe({
      next: (response) => {
        this.course = response;
        this.modules = response.modules;
        this.enrollments = response.enrollments;
        console.log(this.enrollments);
      },
      error: (err) => {
        console.error('Failed to load course detail:', err);
      }
    });
  }

  // ngOnInit(): void {
  //   this.courseId = Number(this.route.snapshot.paramMap.get('id'));

  //   this.courseService.getCourses().subscribe(courses => {
  //     this.course = courses.find(c => c.id === this.courseId)!;
  //   });

  //   this.courseService.getModulesByCourse(this.courseId)
  //     .subscribe(modules => {
  //       this.modules = modules.filter(m => m.courseId === this.courseId);
  //     });

  //   this.courseService.getEnrollmentsByCourse(this.courseId)
  //     .subscribe(enrollments => {
  //       this.enrollments = enrollments
  //         .filter(e => e.courseId === this.courseId);
  //     });
  // }

  loadStudents() {
    this.loadingStudents = true;
    this.userService
      .getCourseStudents(this.courseId, this.page, this.size)
      .subscribe({
        next: (response: PagedResponse<InstructorCourseStudentResponse>) => {
          this.students = response.content;
          this.totalPages = response.totalPages;
          this.loadingStudents = false;

          console.log('Students:', response);
        },
        error: (err) => {
          console.error('Failed to load students', err);
          this.loadingStudents = false;
        }
      });
  }

  openModule(module: { materialUrl: string }): void {
    if (module.materialUrl) {
      window.open(module.materialUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No material URL available for this module.');
    }
  }

  getMaterialType(url: string): 'video' | 'document' {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const lowerUrl = url.toLowerCase();

    if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) {
      return 'video';
    }

    return 'document';
  }

  deleteModule(id: number) {
    this.courseService.deleteModule(id);
  }
}

