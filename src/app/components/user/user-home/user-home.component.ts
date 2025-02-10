import { Component, OnInit } from '@angular/core';
import { User } from '../../../types/user';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  usuarios: User[] = [
    { id: 1, name: "alejandro", email: "mi correo" },
    { id: 2, name: "maria", email: "mi correo maria" },
  ];

  user: User ={} as User;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['userId'];
    for (let u of this.usuarios) {
      if (u.id === parseInt(userId)) {
        this.user = u;
        break; 
      }
    }
  }
}
