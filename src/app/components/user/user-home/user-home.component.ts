import { Component, OnInit } from '@angular/core';
import { User } from '../../../types/user';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [TitleCasePipe, RouterLink, RouterOutlet],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  

  user: User ={} as User;

  constructor(private readonly activatedRoute: ActivatedRoute ,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['userId'];
    
  }
}
