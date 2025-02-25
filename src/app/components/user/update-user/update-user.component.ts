import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../types/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , RouterLink],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {

  user: User = {} as User
  userService = inject(UserService)
  homeRoute = inject(ActivatedRoute)
  route = inject(Router)
  userId = this.homeRoute.parent?.snapshot.params['userId']

  ngOnInit(): void {
    this.userService.geUserById(this.userId).subscribe(
      (data) => {
        this.userForm.patchValue(data)
        this.userForm.get("id")?.setValue(Number(this.userId))
      }
    )
  }

  userForm = new FormGroup({
    id: new FormControl<number | null>(null),
    username: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
      Validators.pattern("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \"'.,:-]+$")
    ]),
    fullname: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-Z\\s]+$")
    ]),
    phone: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern("^[0-9]{9}$")
    ]),
    registrationDate: new FormControl<Date | null>(null, [
      Validators.required
    ]),
    isActive: new FormControl<string | null>("S", [
      Validators.required,
    ]),
    password: new FormControl<string | null>(null),
    email : new FormControl<string | null>(null)
  })

  onSubmit() {
    this.userService.updateUser(this.userForm.value as User).subscribe(
      () => {
        const modal = new bootstrap.Modal(document.getElementById('modalUpdate')!)
        modal.show()
      }
    )
  }

  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalUpdate')!)
    modal?.hide()
    this.route.navigate(["/userHome/"+this.userId])
  }

}
