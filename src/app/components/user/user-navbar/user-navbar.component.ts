import { Component, OnInit } from '@angular/core';
import { User } from '../../../types/user';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet,TitleCasePipe],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent implements OnInit {
user: User ={} as User;

  constructor(private readonly activatedRoute: ActivatedRoute ,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['userId'];
    
  }
}
