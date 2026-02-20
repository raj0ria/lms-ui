import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from './course.service';
import { User, UserService } from './user.service';

export interface Enrollment {
  student: User;
  course: Course;
  progress: number;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private enrollments: Enrollment[] = [
    { student: { id:1, name:'Alice', email:'alice@example.com', role:'STUDENT' }, course: {
      id: 1, title: 'Angular Basics', instructor: 'Bob', capacity: 20, published: true,
      description: ''
    }, progress: 50 }
  ];

  private enrollments$ = new BehaviorSubject<Enrollment[]>(this.enrollments);

  getEnrollments(): Observable<Enrollment[]> {
    return this.enrollments$.asObservable();
  }
}
