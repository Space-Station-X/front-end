import { Component, inject } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { User } from '../../../types/user';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , RouterLink],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  userService = inject(UserService)
  route = inject(Router)


  userForm = new FormGroup({
    id: new FormControl<number | null>(null),
    username: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
      Validators.pattern("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \"'.,:-]+$")
    ]),
    fullName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \"'.,:-]+$")
    ]),
    phone: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern("^[0-9]{9}$")
    ]),
    registrationDate: new FormControl<string | Date | null>(new Date().toISOString(), [
      Validators.required
    ]),
    isActive: new FormControl<string | null>("S", [
      Validators.required,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email
    ])
  })

  onSubmit() {
    this.userService.createUser(this.userForm.value as User).subscribe(
      () => {
        const modal = new bootstrap.Modal(document.getElementById("modalRegistro")!)
        modal.show()
      }
    )
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalRegistro")!)
    modal?.hide()
    this.route.navigate(['/']);
  }

}
