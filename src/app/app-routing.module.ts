import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { AuthGuard } from "./guards/auth.guard";
import { RoleGuard } from "./guards/role.guard";
import { StudentDashboardComponent } from "./dashboard/student-dashboard/student-dashboard.component";
import { AdminDashboardComponent } from "./dashboard/admin-dashboard/admin-dashboard.component";
import { InstructorDashboardComponent } from "./dashboard/instructor-dashboard/instructor-dashboard.component";
import { UserListComponent } from "./features/admin/user-list/user-list.component";
import { CourseListAdminComponent } from "./features/admin/course-list-admin/course-list-admin.component";
import { CourseCreateComponent } from "./features/courses/course-create/course-create.component";
import { ModuleCreateComponent } from "./features/modules/module-create/module-create.component";
import { CourseEditComponent } from "./features/courses/course-edit/course-edit.component";
import { CourseDetailComponent } from "./features/courses/course-detail/course-detail.component";
import { ModuleManagementComponent } from "./features/courses/module-management/module-management.component";
import { StudentBrowseComponent } from "./features/student/student-browse/student-browse.component";
import { EnrollComponent } from "./features/student/enroll/enroll.component";

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', 
    canActivate:[AuthGuard, RoleGuard], 
    data: {roles: ['USER', 'ADMIN'] },  
    component: StudentDashboardComponent},
  { path: 'courses', component: StudentBrowseComponent, 
    canActivate: [RoleGuard], data: { role: 'USER' } },
  { path: 'enrollments/create', component: EnrollComponent, 
    canActivate: [RoleGuard], data: { role: 'USER' } },
  {
    path: 'instructor', 
    canActivate:[AuthGuard, RoleGuard], 
    data: {roles: ['ADMIN', 'USER'] },//'INSTRUCTOR'] },  
    component: InstructorDashboardComponent
  },
  {path: 'courses/create', component: CourseCreateComponent, 
    canActivate: [RoleGuard], data: { role: 'USER' }},//'INSTRUCTOR' }},
  {path: 'courses/edit/:id', component: CourseEditComponent, 
    canActivate: [RoleGuard], data: { role: 'USER' }},
  {path: 'courses/:courseId/modules/create', component: ModuleCreateComponent, 
    canActivate: [RoleGuard], data: { role: 'USER' }},//'INSTRUCTOR' }},
  {
    path: 'courses/:courseId', component: ModuleManagementComponent //CourseDetailComponent
  },
  {
    path: 'admin', canActivate: [AuthGuard, RoleGuard], 
    data: {roles: ['ADMIN'] }, 
    component: AdminDashboardComponent
  },
  {path: 'admin/users', component: UserListComponent,
    canActivate: [RoleGuard], data: { role: 'ADMIN' }
  },
  {path: 'admin/courses', component: CourseListAdminComponent, 
    canActivate: [RoleGuard], data: { role: 'ADMIN' }},
];

