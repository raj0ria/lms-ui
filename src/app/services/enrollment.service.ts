import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from './course.service';
import { User, UserService } from './user.service';
import { StudentModule } from '../shared/directives/enrollment-status.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Enrollment {
  student: User;
  course: Course;
  progress: number;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private enrollments: Enrollment[] = [
    // { student: { id:1, name:'Alice', email:'alice@example.com', role:'STUDENT' }, course: {
    //   id: 1, title: 'Angular Basics', instructor: 'Bob', capacity: 20, published: true,
    //   description: ''
    // }, progress: 50 }
  ];

  private enrollments$ = new BehaviorSubject<Enrollment[]>(this.enrollments);

  constructor(private http: HttpClient) { }

  getEnrollments(): Observable<Enrollment[]> {
    return this.enrollments$.asObservable();
  }

  getModulesWithProgress(courseId: number) {
    return this.http.get<StudentModule[]>(
      `${environment.apiBaseUrl}/api/v1/modules/${courseId}/modules/progress`
    );
  }
}
