import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../types/user';

@Component({
  selector: 'app-get-user',
  standalone: true,
  imports: [],
  templateUrl: './get-user.component.html',
  styleUrl: './get-user.component.css'
})
export class GetUserComponent implements OnInit {

  getUser : User = {} as User;
  constructor(private readonly userService : UserService,
    private readonly activatedRoute : ActivatedRoute
  ){}

  ngOnInit(): void {
      //const id = this.activatedRoute.snapshot.params['id'];
      this.userService.geUserById(1).subscribe(
        (data)=>{ this.getUser = data}
        );
  }


}
