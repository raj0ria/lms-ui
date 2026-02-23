import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService, Course, Module, Enrollment } from 'src/app/services/course.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';
import { EnrollmentStatus, StudentModule } from 'src/app/shared/directives/enrollment-status.enum';
import { UserService } from 'src/app/services/user.service';
import { CourseDetail } from 'src/app/models/course-detail-instructor.model';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-module-management',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink, FormsModule],
  templateUrl: './module-management.component.html',
  styleUrls: ['./module-management.component.css']
})
export class ModuleManagementComponent implements OnInit {

  courseId!: number;
  course!: Observable<CourseDetail>;
  role!: string;

  modules$: Observable<Module[]> = new Observable();
  enrollments$: Observable<Enrollment[]> = new Observable();

  studentModules: StudentModule[] = [];  
  EnrollmentStatus = EnrollmentStatus; // expose enum to template
  updatingModuleIds: number[] = [];
  loading = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadModules();
  }

  loadModules(): void {
    this.loading = true;

    this.enrollmentService.getModulesWithProgress(this.courseId)
      .subscribe({
        next: (modules) => {
          this.studentModules = modules;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // loadModules(): void {
  //   this.loading = true;
  //   this.courseService.getCourseModules(this.courseId)
  //   .subscribe({
  //     next: (modules: any[]) => {
  //       // Map backend 'id' to frontend 'moduleId'
  //       this.studentModules = modules.map(m => ({
  //         moduleId: m.id,  // <-- backend id
  //         name: m.name,
  //         materialUrl: m.materialUrl,
  //         status: EnrollmentStatus.NOT_STARTED // default
  //       }));
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load modules', err);
  //       this.loading = false;
  //     }
  //   });
  // }

  updateProgress(moduleId: number, newStatus: EnrollmentStatus) {

    this.updatingModuleIds.push(moduleId);

    this.userService.updateModuleProgress(moduleId, newStatus)
      .subscribe({
        next: () => {

          // Update UI immediately (optimistic update)
          const module = this.studentModules.find(m => m.moduleId === moduleId);
          if (module) {
            module.status = newStatus;
          }

          this.updatingModuleIds =
            this.updatingModuleIds.filter(id => id !== moduleId);
        },
        error: (err) => {

          this.updatingModuleIds =
            this.updatingModuleIds.filter(id => id !== moduleId);

          alert('Invalid status transition.');
          console.error(err);
        }
      });
  }

  openMaterial(url: string) {
    window.open(url, '_blank');
  }

  deleteModule(moduleId: number) {
    if (this.role !== 'INSTRUCTOR') return; // only instructor can delete
    if (confirm('Are you sure?')) {
      this.courseService.deleteModule(moduleId);
    }
  }

  goBack() {
      this.router.navigate(['/user']);
  }
}
