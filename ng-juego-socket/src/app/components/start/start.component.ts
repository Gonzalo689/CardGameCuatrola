import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent{

  nameInput: string = '';

  constructor(private router: Router, private dataService: DataService) { }

  
  startGame(roomID: string) {
    
    this.dataService.setData(this.nameInput);
    this.router.navigate(['/game', roomID])
    
  }
}
