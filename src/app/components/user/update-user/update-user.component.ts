import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../types/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  private userService = inject(UserService);
  private homeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  userId = this.homeRoute.parent?.snapshot.params['userId'];
  isLoading = true;

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
    registrationDate: new FormControl<Date | null>(null, [Validators.required]),
    isActive: new FormControl<string | null>("S", [Validators.required]),
    password: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.geUserById(this.userId).subscribe({
      next: (data) => {
        this.userForm.patchValue(data);
        this.userForm.get("id")?.setValue(Number(this.userId));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value as User).subscribe({
        next: () => {
          this.showModal();
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      });
    }
  }

  private showModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('modalUpdate')!);
    modal.show();
  }

  hideModal(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalUpdate')!);
    modal?.hide();
    this.router.navigate(["/userHome/", this.userId]);
  }
}
