import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = "http://localhost:8080/api/v1";
  constructor(private readonly http: HttpClient) { }

  getUser(){
    return this.http.get<User[]>(`${this.url}/users`);
  }

  geUserById( id : number){
    return this.http.get<User>(`${this.url}/users/${id}`);
  }

  createUser(user : User){
    return this.http.post<User>(`${this.url}/users`, user);
  }

  updateUser(user : User){
    return this.http.put<User>(`${this.url}/users/${user.id}`, user);
  }

  deleteUser(id : number){
    return this.http.delete(`${this.url}/users/${id}`);
  }
}
