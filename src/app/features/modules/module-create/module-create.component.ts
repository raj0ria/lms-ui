import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course, CourseService, Module } from 'src/app/services/course.service';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-module-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './module-create.component.html',
  styleUrls: ['./module-create.component.css']
})
export class ModuleCreateComponent {

  successMessage = '';
  errorMessage = '';

  courseId!: number;
  courses: Course[] = [];
  course!: Course;

  moduleForm = this.fb.group({
    courseId: this.fb.control<number | null>(null),
    title: ['', Validators.required],
    contentType: ['video', Validators.required],
    contentUrl: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private courseService: CourseService,
    private router: Router, private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Get courseId from route
    const idParam = this.route.snapshot.paramMap.get('courseId');

    if (idParam) {
      this.courseId = Number(idParam);
    }

    // Load courses for dropdown (no hardcoded instructor)
    this.courseService.getCoursesByInstructor().subscribe({
      next: (courses) => {
        this.courses = courses;

        // Preselect current course
        if (this.courseId) {
          this.moduleForm.patchValue({
            courseId: this.courseId
          });
        }
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  // ngOnInit(): void {
  //   this.courseService.getCourses().subscribe(courses => {
  //     // Optional: only show published courses
  //     // this.courses = courses.filter(c => c.published);
  //     const currentInstructor = 'Jane Doe'; // TODO: get from authService
  //     this.courses = courses.filter(c => c.instructorName === currentInstructor);
  //   });
  //   this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
  //   this.moduleForm.patchValue({courseId: this.courseId.toString()});
  // }

  submit() {
    if (this.moduleForm.valid) {
      const newModule = {
        name: this.moduleForm.value.title!,
        // contentType: this.moduleForm.value.contentType as 'video' | 'document',
        materialUrl: this.moduleForm.value.contentUrl!
      };

      this.courseService.addModule2(this.courseId, newModule).subscribe({
        next: (createdModule) => {
          this.successMessage = 'Module added successfully!';
          
          // Optionally update local modules list if needed
          // this.modules.push(createdModule);
          // this.modules$.next([...this.modules]);

          // Navigate back to course detail page
          setTimeout(() => {
            this.router.navigate(['/courses', this.courseId]);
          }, 800);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to add module';
        }
      });
    }
  }

  // submit() {
  //   if (this.moduleForm.valid) {

  //     const newModule = {
  //       id: 0, // will be set inside service
  //       courseId: Number(this.moduleForm.value.courseId),
  //       title: this.moduleForm.value.title!,
  //       contentType: this.moduleForm.value.contentType as 'video' | 'document',
  //       contentUrl: this.moduleForm.value.contentUrl!
  //     };

  //     this.courseService.addModule(newModule);
  //     this.successMessage = 'Module added successfully!';

  //     // Navigate back to course detail page
  //     setTimeout(() => {
  //       this.router.navigate(['/courses', this.courseId]);
  //     }, 800);
  //   }
  // }


  // submit() {
  //   if (this.moduleForm.valid) {
  //     console.log(this.moduleForm.value);

  //     this.successMessage = 'Module added successfully!';
  //     this.moduleForm.reset();

  //     setTimeout(() => {
  //       this.successMessage = '';
  //     }, 3000);
  //   }
  // }

  goBack() {
    this.router.navigate(['/courses', this.courseId]);
  }
}

