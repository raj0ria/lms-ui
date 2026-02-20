import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from "src/app/dashboard/nav-bar/nav-bar.component";

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  imports: [CommonModule, NavBarComponent, FormsModule],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'STUDENT' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'INSTRUCTOR' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'ADMIN' }
  ];

  searchTerm: string = '';
  selectedRole: string = '';

  changeRole(user: any, newRole: string) {
    user.role = newRole;
    console.log(`Changed role of ${user.name} to ${newRole}`);
  }

  // onRoleChange(event: Event, user: any) { 
  //   const selectElement = event.target as HTMLSelectElement; 
  //   const newRole = selectElement.value; user.role = newRole; 
  //   console.log(`Changed role of ${user.name} to ${newRole}`); 
  // }

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

  // onRoleChange(newRole: string, user: any): void {
  //   if (newRole === user.role) return;

  //   if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
  //     user.role = newRole;
  //     console.log('Role updated:', user);
  //     // Call backend API here
  //   }
  // }

  onRoleChange(event: Event, user: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;

    if (!newRole) return;

    if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      user.role = newRole;
      console.log('Updated user:', user);
      // Call backend API here
    }
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
      console.log('Deleted user:', id);
      // Call backend API here
    }
  }


}
