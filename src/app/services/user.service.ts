import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Course, PageResponse } from '../models/user-course.model';
import { StudentDashBoardCourse } from '../models/student-course.model';
import { PagedResponse } from '../features/student/browse/browse.component';
import { EnrollmentStatus } from '../shared/directives/enrollment-status.enum';

export interface InstructorCourseStudentResponse {
  studentId: number;
  studentName: string;
  studentEmail: string;
  // role: string;
  enrolledAt: string;
  progressPercentage: number; // make sure backend sends this
  completedModules: number
  totalModules: number
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'STUDENT' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'INSTRUCTOR' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'ADMIN' },
  ];

  private base = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  // enrollCourse(payload: CreateCourseRequest): Observable<{ orderId: number }> {
  //   return this.http.post<{ orderId: number }>(this.base, payload);
  // }

  getStudentDashBoardCourses(page: number = 0, size: number = 10) {
    return this.http.get<PagedResponse<StudentDashBoardCourse>>(
      `${environment.apiBaseUrl}/api/v1/students/me/courses`,
      {
        params: {
          page,
          size
        }
      }
    );
  }

  updateModuleProgress(moduleId: number, status: EnrollmentStatus) {
    return this.http.patch(
      `${environment.apiBaseUrl}/api/v1/modules/${moduleId}/progress`,
      { status }
    );
  }

  getCourseById(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/course/${id}`);
  }

  getPublishedCourses2(page: number = 0, size: number = 10) {
      return this.http.get<PageResponse<Course>>(
        `${environment.apiBaseUrl}/api/v1/courses?page=${page}&size=${size}`
      );
  }

  getPublishedCourses(page: number = 0, size: number = 10): Observable<Course[]> {
    return this.http
      .get<PageResponse<Course>>(`${environment.apiBaseUrl}/api/v1/courses?page=${page}&size=${size}`)
      .pipe(
        map(res => res.content) // 🔥 extract content array
      );
  }

  //Admin endpoints
  listUsers() {
    return this.http.get(`${environment.apiBaseUrl}/admin/users`);
  }

  getUserById(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/admin/user/${id}`);
  }

  getDashboardStats() {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/v1/admin/dashboard/summary`);
  }

  getCourseStudents(courseId: number, page: number, size: number) {
  return this.http.get<PagedResponse<InstructorCourseStudentResponse>>(
    `${environment.apiBaseUrl}/api/v1/instructors/courses/${courseId}/students?page=${page}&size=${size}`
  );
}
}
