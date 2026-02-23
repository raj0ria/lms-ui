import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { NavBarComponent } from "src/app/dashboard/nav-bar/nav-bar.component";
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import { environment } from 'src/environments/environment.development';

export interface PaginatedCourses {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: Course[];
}

@Component({
  selector: 'app-course-list-admin',
  standalone: true,
  templateUrl: './course-list-admin.component.html',
  imports: [CommonModule, NavBarComponent, FormsModule],
  styleUrls: ['./course-list-admin.component.css']
})
export class CourseListAdminComponent {
  // courses = [
  //   { id: 1, title: 'Angular Basics', instructor: 'Bob', published: true },
  //   { id: 2, title: 'Spring Boot', instructor: 'Alice', published: false }
  // ];

  courses: Course[] = [];
  searchTerm: string = '';
  publishedFilter: string = '';
  private apiUrl = environment.apiBaseUrl + '/api/v1/admin'

  constructor(private http: HttpClient, private courseService: CourseService){
    this.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Failed to fetch courses', err)
    });
  }

  // togglePublish(course: Course): void {
  //   const newStatus = !course.published;
  //   this.courseService.updatePublishStatus(course.id, newStatus).subscribe({
  //     next: () => {
  //       course.published = newStatus; // update UI only after success
  //       console.log(`Course ${course.title} publish status updated`);
  //     },
  //     error: (err) => {
  //       console.error('Error updating publish status', err);
  //     }
  //   });

  // }

  getCourses(): Observable<Course[]> {
      return this.http.get<PaginatedCourses>(`${this.apiUrl}/courses`).pipe(
        map(response => response.content || []), // extract the array from paginated response
        tap(data => console.log('Fetched users:', data))
      );
  }

  // deleteCourse(courseId: number) {
  //   this.courses = this.courses.filter(c => c.id !== courseId);
  //   console.log(`Deleted course with ID ${courseId}`);
  // }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c.id !== id);
          console.log('Deleted course:', id);
        },
        error: (err) => {
          console.error('Error deleting course:', err);
        }
      });
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
