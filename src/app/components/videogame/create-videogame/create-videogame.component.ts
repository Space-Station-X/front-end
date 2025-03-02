import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImgbbServiceService } from '../../../service/imgbb.service.service';
import { Videogame } from '../../../types/videogame';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-videogame',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-videogame.component.html',
  styleUrl: './create-videogame.component.css'
})
export class CreateVideogameComponent {
  selectedFile = signal<File | null>(null);
  imagenError = signal<string | null>(null);
  imagenPreview = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  showModal = signal<boolean>(false);

  private videogameService = inject(VideogameService);
  private route = inject(Router);
  private imgBBService = inject(ImgbbServiceService);
  private homeRoute = inject(ActivatedRoute);

  userId = this.homeRoute.parent?.snapshot.params['userId'];

  videogameForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \"'.,:-]+$")
    ]),
    plataforma: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
      Validators.pattern("^[a-zA-Z\\s]+$")
    ]),
    descripcion: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500)
    ]),
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000000),
      Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")
    ]),
    nuCopias: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern("^[0-9]+$")
    ]),
    feReg: new FormControl<string | Date | null>(new Date().toISOString().slice(0, 10)),
    imagen: new FormControl<string | null>(null),
    activo: new FormControl<string | null>("S")
  });


  isInvalid(fieldName: string): boolean {
    const field = this.videogameForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }


  isValid(fieldName: string): boolean {
    const field = this.videogameForm.get(fieldName);
    return field ? field.valid : false;
  }


  getErrorMessage(fieldName: string): string | null {
    const field = this.videogameForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return null;

    const errors = field.errors;

    const errorMessages: Record<string, Record<string, string>> = {
      nombre: {
        required: 'El nombre es obligatorio',
        minlength: 'El nombre debe tener al menos 3 caracteres',
        maxlength: 'El nombre no debe exceder los 30 caracteres',
        pattern: 'El nombre contiene caracteres no permitidos'
      },
      plataforma: {
        required: 'La plataforma es obligatoria',
        minlength: 'La plataforma debe tener al menos 2 caracteres',
        maxlength: 'La plataforma no debe exceder los 250 caracteres',
        pattern: 'Solo se permiten letras y espacios'
      },
      descripcion: {
        required: 'La descripción es obligatoria',
        minlength: 'La descripción debe tener al menos 10 caracteres',
        maxlength: 'La descripción no debe exceder los 500 caracteres'
      },
      precio: {
        required: 'El precio es obligatorio',
        min: 'El precio debe ser mayor a 0',
        max: 'El precio no puede exceder 1,000,000',
        pattern: 'Formato inválido (use hasta 2 decimales)'
      },
      nuCopias: {
        required: 'El número de copias es obligatorio',
        min: 'El número mínimo de copias es 0',
        max: 'El número máximo de copias es 1,000,000',
        pattern: 'Solo se permiten números enteros'
      }
    };

    const errorType = Object.keys(errors)[0];
    return errorMessages[fieldName]?.[errorType] || 'Campo inválido';
  }


  hasError(fieldName: string): boolean {
    const field = this.videogameForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  createVideogame(): void {
    this.isLoading.set(true);

    if (this.selectedFile()) {
      this.imgBBService.subirImagen(this.selectedFile()!).subscribe({
        next: (response: any) => {
          this.videogameForm.get("imagen")?.setValue(response.data.url);
          this.enviarFormulario();
        },
        error: () => {
          this.imagenError.set('Error al subir la imagen');
          this.isLoading.set(false);
        }
      });
    } else {
      this.enviarFormulario();
    }
  }

  private enviarFormulario(): void {
    this.videogameService.createVideogame(this.videogameForm.value as Videogame).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showModal.set(true);
      },
      error: (err) => {
        console.error('Error al crear el videojuego:', err);
        this.isLoading.set(false);
      }
    });
  }


  hideModal(): void {
    this.showModal.set(false);
    setTimeout(() => {
      this.route.navigate(["/userHome", this.userId]);
    }, 300);
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile.set(file);
    this.imagenError.set(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}
