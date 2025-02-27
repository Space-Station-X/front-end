import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../types/user';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingComponent } from "../../modal/loading/loading.component";

@Component({
  selector: 'app-get-user',
  standalone: true,
  imports: [DatePipe, LoadingComponent, CommonModule],
  templateUrl: './get-user.component.html',
  styleUrl: './get-user.component.css'
})
export class GetUserComponent implements OnInit {

  getUser : User = {} as User;
  userService = inject(UserService)
  homeRoute = inject(ActivatedRoute)
  isLoading:boolean = true;

  userId = this.homeRoute.parent?.snapshot.params['userId']

  ngOnInit(): void {
      //const id = this.activatedRoute.snapshot.params['id'];
      this.userService.geUserById(this.userId).subscribe(
        (data)=>{
          this.getUser = data
          this.isLoading = false
        }
        );
  }


}
