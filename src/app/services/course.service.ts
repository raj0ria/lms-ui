// import { Injectable } from '@angular/core';

// export interface Course {
//   id: number;
//   title: string;
//   description: string;
//   capacity: number;
//   published: boolean;
//   instructor: string;
// }
// 
// @Injectable({ providedIn: 'root' })
// export class CourseService {
//   private courses: Course[] = [
//     { id: 1, title: 'Angular Basics', description: 'Intro course', capacity: 30, published: true, instructor: 'Bob' },
//     { id: 2, title: 'Spring Boot', description: 'Backend course', capacity: 20, published: false, instructor: 'Alice' }
//   ];

//   getCourses(): Course[] {
//     return this.courses;
//   }

//   addCourse(course: Course) {
//     course.id = this.courses.length + 1;
//     this.courses.push(course);
//   }
// }


import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PaginatedCourses } from '../features/admin/course-list-admin/course-list-admin.component';
import { CourseDetail } from '../models/course-detail-instructor.model';
import { PageResponse } from '../models/user-course.model';
import { PagedResponse } from '../features/student/browse/browse.component';
import { EnrollmentResponse } from '../models/enrollment-response.model';
import { StudentCourse } from '../models/student-course.model';
import { StudentModule } from '../shared/directives/enrollment-status.enum';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  capacity: number;
  published: boolean;
  progress?: number; // for student dashboard
}

export interface Module {
  id: number;
  courseId: number;
  name: string,
  materialUrl: string,
  title: string;
  contentType: 'video' | 'document';
  contentUrl: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentName: string;
  progress: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses: Course[] = [
    // {
    //   id: 1, title: 'Angular Basics', description: 'Learn Angular', instructor: 'John Doe', capacity: 20, published: true, progress: 50
    // },
    // {
    //   id: 2, title: 'Spring Boot Intro', description: 'Backend with Spring', instructor: 'Jane Doe', capacity: 15, published: false, progress: 0
    // },
  ];

  private courses$ = new BehaviorSubject<Course[]>(this.courses);
  private modules: Module[] = [];
  private modules$ = new BehaviorSubject<Module[]>([]);
  private enrollments: Enrollment[] = [];
  private enrollments$ = new BehaviorSubject<Enrollment[]>([]);

  private apiUrlAdmin = `${environment.apiBaseUrl}/api/v1/admin`;
  private apiUrlInstructor = `${environment.apiBaseUrl}/api/v1/instructor`;

  constructor(private http: HttpClient) { }

  getEnrollmentsByCourse(courseId: number) {
    return this.enrollments$.asObservable();
  }

  addEnrollment(enrollment: Enrollment) {
    enrollment.id = Date.now();
    this.enrollments.push(enrollment);
    this.enrollments$.next(this.enrollments);
  }


  getModulesByCourse(courseId: number) {
    return this.modules$.asObservable();
  }

  addModule(module: Module) {
    module.id = Date.now();
    this.modules.push(module);
    this.modules$.next(this.modules);
  }

  addModule2(courseId: number, module: { name: string; materialUrl: string }): Observable<Module> {
    return this.http.post<Module>(`${this.apiUrlInstructor}/courses/${courseId}/modules`, module);
  }

  deleteModule(id: number) {
    this.modules = this.modules.filter(m => m.id !== id);
    this.modules$.next(this.modules);
  }

  getCourseById(id: number): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  getCourseById2(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${environment.apiBaseUrl}/api/v1/courses/${courseId}/full-detail`);
  }

  getCourseModules(courseId: number) {
    return this.http.get<StudentModule[]>(
      `${environment.apiBaseUrl}/api/v1/courses/${courseId}/modules`
    );
  }

  getCourseDetail(courseId: number): Observable<CourseDetail> {
    return this.http.get<CourseDetail>(`${environment.apiBaseUrl}/api/v1/courses/${courseId}/full-detail`);
  }

  getCourses(): Observable<Course[]> {
    return this.courses$.asObservable();
  }

  getCoursesByInstructor(): Observable<Course[]> {
    return this.http.get<PaginatedCourses>(`${this.apiUrlInstructor}/courses`).pipe(
      map(response => response.content) // content is already an array of Course-like objects
    );
  }
  // getCourses(): Observable<PaginatedCourses> {
  //   return this.http.get<PaginatedCourses>(this.apiUrl);
  // }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrlInstructor}/courses`, course);
  }

  // addCourse(course: Course) {
  //   course.id = this.courses.length + 1;
  //   this.courses.push(course);
  //   this.courses$.next(this.courses);
  // }

  updateCourse(courseId: number, course: Partial<Course>): Observable<Course> {
    // Only send the fields backend expects (title, description, capacity, etc.)
    const updateRequest = {
      title: course.title,
      description: course.description,
      capacity: course.capacity
    };

    return this.http.put<Course>(
      `${this.apiUrlInstructor}/courses/${courseId}`,
      updateRequest
    );
  }


  searchCourses(
    keyword: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<PagedResponse<StudentCourse>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<PagedResponse<StudentCourse>>(`${environment.apiBaseUrl}/api/v1/courses`, { params });
  }

  enrollInCourse(courseId: number) {
    return this.http.post<EnrollmentResponse>(
      `${environment.apiBaseUrl}/api/v1/courses/${courseId}/enroll`,
      {}
    );
  }

  unenrollFromCourse(courseId: number) {
    return this.http.delete(
      `${environment.apiBaseUrl}/api/v1/courses/${courseId}/unenroll`
    );
  }

  // deleteCourse(id: number) {
  //   this.courses = this.courses.filter(c => c.id !== id);
  //   this.courses$.next(this.courses);
  // }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrlAdmin}/courses/${courseId}`);
  }

  deleteCourseByInstructor(courseId: number) {
    return this.http.delete(`${this.apiUrlInstructor}/courses/${courseId}`);
  }

  togglePublish(courseId: number) {
    this.courses = this.courses.map(c => c.id === courseId ? { ...c, published: !c.published } : c);
    this.courses$.next(this.courses);
  }

  updatePublishStatus(courseId: number, published: boolean): Observable<Course> {
    return this.http.put<Course>(
      `http://localhost:8080/api/courses/${courseId}/publish`,
      { published }
    );
  }

  publishCourse(courseId: number): Observable<Course> {
    return this.http.patch<Course>(
      `${this.apiUrlInstructor}/courses/${courseId}/publish`,
      {} // empty body, backend just toggles status
    );
  }

  getEnrollments(): Observable<Enrollment[]> {
      return this.enrollments$.asObservable();
  }
}
