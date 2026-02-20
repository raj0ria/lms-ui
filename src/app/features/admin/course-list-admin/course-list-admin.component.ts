import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from "src/app/dashboard/nav-bar/nav-bar.component";

@Component({
  selector: 'app-course-list-admin',
  standalone: true,
  templateUrl: './course-list-admin.component.html',
  imports: [CommonModule, NavBarComponent, FormsModule],
  styleUrls: ['./course-list-admin.component.css']
})
export class CourseListAdminComponent {
  courses = [
    { id: 1, title: 'Angular Basics', instructor: 'Bob', published: true },
    { id: 2, title: 'Spring Boot', instructor: 'Alice', published: false }
  ];

  searchTerm: string = '';
  publishedFilter: string = '';

  togglePublish(course: any) {
    course.published = !course.published;
    console.log(`Course ${course.title} publish status: ${course.published}`);
  }

  // deleteCourse(courseId: number) {
  //   this.courses = this.courses.filter(c => c.id !== courseId);
  //   console.log(`Deleted course with ID ${courseId}`);
  // }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courses = this.courses.filter(c => c.id !== id);
      console.log('Deleted course:', id);
      // Call backend API here
    }
  }


  filteredCourses() {
    return this.courses.filter(c => {

      const matchesSearch =
        c.title.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesPublished =
        this.publishedFilter === '' ||
        c.published.toString() === this.publishedFilter;

      return matchesSearch && matchesPublished;
    });
  }

}
