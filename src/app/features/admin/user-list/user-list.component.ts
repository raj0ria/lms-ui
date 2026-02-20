import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { NavBarComponent } from "src/app/dashboard/nav-bar/nav-bar.component";
import { environment } from 'src/environments/environment.development';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PaginatedUsers {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: User[];
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  imports: [CommonModule, NavBarComponent, FormsModule],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  searchTerm: string = '';
  selectedRole: string = '';
  users: User[] = [];
  private apiUrl = environment.apiBaseUrl + '/api/v1'

  constructor(private http: HttpClient) {
    this.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to fetch users', err)
    });
  }

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.apiUrl}/users`);
  // }

  getUsers(): Observable<User[]> {
    return this.http.get<PaginatedUsers>(`${this.apiUrl}/users`).pipe(
      map(response => response.content || []), // extract the array from paginated response
      tap(data => console.log('Fetched users:', data))
    );
  }

  changeRole(user: any, newRole: string) {
    user.role = newRole;
    console.log(`Changed role of ${user.name} to ${newRole}`);
  }

  filteredUsers() {
    return this.users.filter(u => {

      const matchesSearch =
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole =
        this.selectedRole === '' || u.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  // onRoleChange(event: Event, user: any): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const newRole = selectElement.value;

  //   if (!newRole) return;

  //   if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
  //     user.role = newRole;
  //     console.log('Updated user:', user);
  //     // Call backend API here
  //   }
  // }

  onRoleChange(event: Event, user: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;

    if (!newRole || newRole === user.role) return; // No need to change if the role is same

    if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      const updatedUser = { ...user, role: newRole };

      this.http.put(`${this.apiUrl}/users/${user.id}`, { role: newRole }).subscribe({
        next: () => {
          // Update the local users array with the new role
          user.role = newRole;
          console.log('Role updated:', user);
          alert(`Role of ${user.name} changed to ${newRole} successfully!`);
        },
        error: (err) => {
          console.error('Failed to update role', err);
          alert('Failed to update role. Please try again.');
        }
      });
    }
  }


  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.http.delete(`${this.apiUrl}/users/${id}`).subscribe({
      next: () => {
        // Remove the user from the local array after successful deletion
        this.users = this.users.filter(u => u.id !== id);
        console.log('Deleted user:', id);
        alert('User deleted successfully!');
      },
      error: (err) => {
        console.error('Failed to delete user', err);
        alert('Failed to delete user. Please try again.');
      }
    });
  }


}
