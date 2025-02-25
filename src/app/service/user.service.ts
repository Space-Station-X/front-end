import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)
  //"http://localhost:3000"
  private url = environment.apiUrl ;


  getUser(){
    return this.http.get<User[]>(`${this.url}user`);
  }

  geUserById( id : number){
    return this.http.get<User>(`${this.url}user/${id}`);
  }

  createUser(user : User){
    return this.http.post<User>(`${this.url}user`, user);
  }

  updateUser(user : User){
    return this.http.put<User>(`${this.url}user/${user.id}`, user);
  }

  deleteUser(id : number){
    return this.http.delete(`${this.url}user/${id}`);
  }
}
