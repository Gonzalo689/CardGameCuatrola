import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private name: string = ''; 

  constructor() {}

  // Método para establecer datos
  setData(name: string) {
    this.name = name;
  }

  // Método para obtener datos
  getData(): string  { 
    return this.name;
  }

  // Método para limpiar datos (opcional)
  clearData() {
    this.name = ''; 
  }
}
