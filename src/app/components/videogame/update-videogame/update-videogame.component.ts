import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Videogame } from '../../../types/videogame';
import * as bootstrap from 'bootstrap';
import { ImgbbServiceService } from '../../../service/imgbb.service.service';


@Component({
  selector: 'app-update-videogame',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-videogame.component.html',
  styleUrl: './update-videogame.component.css'
})
export class UpdateVideogameComponent implements OnInit {
  selectedFile: File | null = null;
  imagenError: string | null = null;
  imagenPreview: string | null = null;

  homeRoute = inject(ActivatedRoute);
  videogameService = inject(VideogameService);
  route = inject(Router)

  userId = this.homeRoute.parent?.snapshot.params['userId'];
  videogameId = this.homeRoute.snapshot.params['id'];

  constructor(
    private readonly imgBBService: ImgbbServiceService
  ) { }

  ngOnInit(): void {
    this.videogameService.getVideogameById(this.videogameId).subscribe(
      (data: Videogame) => {
        this.videogameForm.patchValue(data)
        this.videogameForm.get("id")?.setValue(Number(this.videogameId))
        this.videogameForm.get("activo")?.setValue("S")
      }
    )
  }

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
    imagen: new FormControl<string | null>(null),
    activo: new FormControl<string | null>("S")
  })

  updateVideogame() {
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
    this.videogameService.updateVideogame(this.videogameForm.value as Videogame).subscribe(() => {
      const modal = new bootstrap.Modal(document.getElementById('modalCreate')!);
      modal.show();
    });
  }
  hideModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCreate')!);
    modal?.hide();
    this.route.navigate(["/userHome/" + this.userId]);
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
