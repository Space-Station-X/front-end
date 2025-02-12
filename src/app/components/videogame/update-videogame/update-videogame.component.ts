import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideogameService } from '../../../service/videogame.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Videogame } from '../../../types/videogame';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-update-videogame',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-videogame.component.html',
  styleUrl: './update-videogame.component.css'
})
export class UpdateVideogameComponent implements OnInit {



  constructor(private readonly videogameService: VideogameService,
    private readonly route : Router,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params["id"];
    this.videogameService.getVideogameById(id).subscribe(
      (data: Videogame) => {
        this.videogameForm.patchValue(data),
        this.videogameForm.get("id")?.setValue(Number(id));
        //this.videogameForm.get("feReg")?.setValue(data.feReg ? new Date(data.feReg) : null);
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
    feReg: new FormControl<string | Date | null>(new Date().toISOString().slice(0, 10)) 
  })

  updateVideogame() {
    this.videogameService.updateVideogame(this.videogameForm.value as Videogame).subscribe(
      () => {
        const modal = new bootstrap.Modal(document.getElementById('modalCreate')!);
        modal.show();
      }
    )
  }

  hideModal(){
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCreate')!);
    modal?.hide();
    this.route.navigate(["/userHome/1"]);
  }

}
