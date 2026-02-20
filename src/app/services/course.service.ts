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


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  capacity: number;
  published: boolean;
  progress?: number; // for student dashboard
}

export interface Module {
  id: number;
  courseId: number;
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
    {
      id: 1, title: 'Angular Basics', description: 'Learn Angular', instructor: 'John Doe', capacity: 20, published: true, progress: 50
    },
    {
      id: 2, title: 'Spring Boot Intro', description: 'Backend with Spring', instructor: 'Jane Doe', capacity: 15, published: false, progress: 0
    },
  ];

  private courses$ = new BehaviorSubject<Course[]>(this.courses);

  private modules: Module[] = [];
  private modules$ = new BehaviorSubject<Module[]>([]);

  private enrollments: Enrollment[] = [];
  private enrollments$ = new BehaviorSubject<Enrollment[]>([]);

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

  deleteModule(id: number) {
    this.modules = this.modules.filter(m => m.id !== id);
    this.modules$.next(this.modules);
  }

  getCourseById(id: number): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  getCourses(): Observable<Course[]> {
    return this.courses$.asObservable();
  }

  addCourse(course: Course) {
    course.id = this.courses.length + 1;
    this.courses.push(course);
    this.courses$.next(this.courses);
  }

  updateCourse(updated: Course) {
    this.courses = this.courses.map(c => c.id === updated.id ? updated : c);
    this.courses$.next(this.courses);
  }

  deleteCourse(id: number) {
    this.courses = this.courses.filter(c => c.id !== id);
    this.courses$.next(this.courses);
  }

  togglePublish(courseId: number) {
    this.courses = this.courses.map(c => c.id === courseId ? { ...c, published: !c.published } : c);
    this.courses$.next(this.courses);
  }

  getEnrollments(): Observable<Enrollment[]> {
      return this.enrollments$.asObservable();
    }
}
