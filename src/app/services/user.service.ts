import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

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

  getCourseById(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/course/${id}`);
  }

  //Admin endpoints
  listUsers() {
    return this.http.get(`${environment.apiBaseUrl}/admin/users`);
  }

  getUserById(id: number) {
    return this.http.get(`${environment.apiBaseUrl}/admin/user/${id}`);
  }
}
