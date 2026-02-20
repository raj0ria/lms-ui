import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from 'src/app/models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('USER', [Validators.required])
  })
  errorMessage: string =''
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // handleSubmit(){
  //   this.errorMessage =''
  //   if(this.registerForm.valid){
  //     const registerRequest: RegisterRequest = {
  //       username: this.registerForm.value.username!,
  //       password: this.registerForm.value.password!,
  //       role: this.registerForm.value.role!
  //     }
  //     this.authService.register(registerRequest).subscribe({
  //       next: res => {
  //       if(res.message){
  //         this.router.navigate(['/login'])
  //       }
  //     },
  //     error: () => {
  //       this.errorMessage ='Registration failed, please try again'
  //     }
  //   })
  //   }else{
  //     this.errorMessage ='Invalid username / password'
  //   }
  // }

  handleSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.valid) {
      const registerRequest: RegisterRequest = {
        username: this.registerForm.value.username!,
        password: this.registerForm.value.password!,
        role: this.registerForm.value.role!
      };

      this.authService.register(registerRequest).subscribe({
        next: (res) => {
          if (res.message) {
            // Show success message
            this.successMessage = `User "${registerRequest.username}" registered successfully!`;
            this.errorMessage = '';

            // Reset form
            this.registerForm.reset({ role: 'USER' });

            // Optionally redirect to login after 3-5 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 4000);
          }
        },
        error: () => {
          this.errorMessage = 'Registration failed, please try again';
        }
      });
    } else {
      this.errorMessage = 'Invalid username / password';
    }
  }

}
