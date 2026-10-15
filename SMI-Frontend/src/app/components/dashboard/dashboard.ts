import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  
  usuarioLogueado: string = 'Cargando...';

  mostrarModalPass = false;
  passActual = '';
  passNuevo = '';
  msgPass = '';
  msgColor = '';
  cargandoPass = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario) {
      this.usuarioLogueado = usuario;
    } else {
      this.router.navigate(['/']); 
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }

  abrirModalPass(event: Event) {
    event.preventDefault(); 
    this.mostrarModalPass = true;
    this.msgPass = '';
    this.passActual = '';
    this.passNuevo = '';
  }

  cerrarModalPass() {
    this.mostrarModalPass = false;
  }

  guardarPassword() {
    if (!this.passActual || !this.passNuevo) {
      this.msgPass = "Por favor, completa todos los campos.";
      this.msgColor = "red";
      return;
    }

    this.cargandoPass = true;
   
    setTimeout(() => {
      this.msgPass = "¡Contraseña actualizada correctamente!";
      this.msgColor = "green";
      this.cargandoPass = false;
      
      setTimeout(() => this.cerrarModalPass(), 2000);
    }, 1500);
  }
}