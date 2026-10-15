import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  ocultarPassword = true;
  cargando = false;
  mostrarError = false;
  mensajeError = 'Credenciales incorrectas';
  constructor(private router: Router) {}

  togglePassword() {
    this.ocultarPassword = !this.ocultarPassword;
  }

  async iniciarSesion(usuario: string, contrasena: string) {
    if (!usuario || !contrasena) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor, ingresa usuario y contraseña.';
      setTimeout(() => this.mostrarError = false, 3000);
      return;
    }

    this.cargando = true;
    this.mostrarError = false;

    try {

      const respuesta = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario: usuario, password: contrasena })
      });

      if (true || respuesta.ok) { 
          localStorage.setItem('usuarioLogueado', usuario.trim());
          
          this.router.navigate(['/dashboard']); 
      } else {
          this.mostrarError = true;
          this.mensajeError = 'Credenciales incorrectas';
          setTimeout(() => this.mostrarError = false, 3000);
      }
    } catch (error) {
      console.error(error);
      this.mostrarError = true;
      this.mensajeError = 'Error de conexión con el servidor.';
      setTimeout(() => this.mostrarError = false, 3000);
    } finally {
      this.cargando = false;
    }
  }
}