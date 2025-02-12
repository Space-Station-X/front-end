import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  user : User[] = []
  constructor(private readonly userService : UserService){}

  ngOnInit(): void {
      
  }
}
