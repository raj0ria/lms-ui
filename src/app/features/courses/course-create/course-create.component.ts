import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent, RouterLink, MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent {
  courseForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    capacity: [0, Validators.required]
  });

  successMessage = '';

  constructor(private fb: FormBuilder, private courseService: CourseService, private router: Router) {}

  // submit() { 
  //   if (this.courseForm.valid) { 
  //     this.courseService.addCourse({ 
  //       id: 0, title: this.courseForm.value.title!, 
  //       description: this.courseForm.value.description!, 
  //       capacity: this.courseForm.value.capacity!, 
  //       published: false, instructor: 'Current Instructor' 
  //     }); 
  //     this.successMessage = 'Course created successfully!'; 
  //     console.log('Course created!'); 
  //     this.courseForm.reset(); 
  //     setTimeout(() => {
  //       this.router.navigate(['/instructor']);
  //     }, 1500);
  //   } 
  // }

  submit() {
    if (this.courseForm.valid) {

      const newCourse = {
        id: 0, // backend usually generates this
        title: this.courseForm.value.title!,
        description: this.courseForm.value.description!,
        capacity: this.courseForm.value.capacity!,
        published: false,
        instructorName: 'Current Instructor'
      };

      this.courseService.addCourse(newCourse).subscribe({
        next: (response) => {
          this.successMessage = 'Course created successfully!';
          console.log('Course created!', response);

          this.courseForm.reset();

          setTimeout(() => {
            this.router.navigate(['/instructor']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating course:', error);
        }
      });
    }
  }

}

