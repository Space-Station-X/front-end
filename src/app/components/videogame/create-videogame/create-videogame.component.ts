import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideogameService } from '../../../service/videogame.service';
import { Router, RouterLink } from '@angular/router';
import { ImgbbServiceService } from '../../../service/imgbb.service.service';
import { Videogame } from '../../../types/videogame';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-videogame',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './create-videogame.component.html',
  styleUrl: './create-videogame.component.css'
})
export class CreateVideogameComponent {
  selectedFile: File | null = null;
  imagenError: string | null = null;
  imagenPreview: string | null = null;

  constructor(private readonly videogameService: VideogameService,
    private readonly route: Router,
    private readonly imgBBService : ImgbbServiceService
  ) { }

  videogameForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
      Validators.pattern("^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ \"'.,:-]+$")
    ]),
    plataforma: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-Z\\s]+$")
    ]),
    genero: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-Z\\s]+$")
    ]),
    descripcion: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(700)
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
    imagen: new FormControl<string | null>(null)
  })

  createVideogame() {
    if (this.selectedFile) {
      this.imgBBService.subirImagen(this.selectedFile).subscribe({
        next: (response: any) => {
          this.videogameForm.get("imagen")?.setValue(response.data.url);
          this.enviarFormulario();
        },
        error: () => {
          this.imagenError = 'Error al subir la imagen';
        }
      });
    } else {
      this.enviarFormulario();
    }
  }

  private enviarFormulario() {
    this.videogameService.createVideogame(this.videogameForm.value as Videogame).subscribe(() => {
      const modal = new bootstrap.Modal(document.getElementById('modalCreate')!);
      modal.show();
    });
  }
  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCreate')!);
    modal?.hide();
    this.route.navigate(["/userHome/1"]);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.imagenError = null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
}
