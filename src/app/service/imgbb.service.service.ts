import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImgbbServiceService {

  private API_KEY = '8e8d5537cb093a100ba16b08745caeb3'
  constructor(private http: HttpClient) { }

  subirImagen(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`https://api.imgbb.com/1/upload?key=${this.API_KEY}`, formData);
  }
}
