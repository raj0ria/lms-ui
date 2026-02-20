import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseService } from 'src/app/services/course.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarComponent } from 'src/app/dashboard/nav-bar/nav-bar.component';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent, RouterLink],
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {

  courseId!: number;
  course!: Course;
  successMessage = '';

  courseForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [''],
    capacity: [0, [Validators.required, Validators.min(1)]],
    published: [false]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    this.courseService.getCourses().subscribe(courses => {
      const found = courses.find(c => c.id === this.courseId);
      if (found) {
        this.course = found;
        this.courseForm.patchValue(found);
      }
    });
  }

  updateCourse() {
    if (this.courseForm.valid) {
      const updated: Course = {
        ...this.course,
        ...this.courseForm.value
      } as Course;

      this.courseService.updateCourse(updated);

      this.successMessage = 'Course updated successfully!';

      setTimeout(() => {
        this.router.navigate(['/instructor']);
      }, 1500);
    }
  }
}
