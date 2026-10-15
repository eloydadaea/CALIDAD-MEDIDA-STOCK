import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, MaterialItem } from '../../services/stock';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.html'
})
export class ReservaComponent {
  
  mostrarModalPdf = false;
  mostrarModalManual = false;
  cargando = false;

  mOrden = '';
  mFecha = '';
  mSap = '';
  mMaterial = '';
  mCantidad: number | null = null;

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) {}

  abrirModalPdf() { this.mostrarModalPdf = true; }
  cerrarModalPdf() { this.mostrarModalPdf = false; }
  
  cargarPdf() {
    this.cargando = true;
    setTimeout(() => {
      Swal.fire({
        icon: 'info',
        title: 'Simulación de lectura de PDF',
        text: '¡Simulación de lectura de PDF en progreso!',
        confirmButtonColor: '#273481'
      });
      this.cargando = false;
      this.cerrarModalPdf();
      this.cdr.detectChanges();
    }, 2000);
  }

  abrirModalManual() { this.mostrarModalManual = true; }
  cerrarModalManual() { this.mostrarModalManual = false; }

  guardarManual() {
    if (!this.mOrden || !this.mFecha || !this.mSap || !this.mMaterial || !this.mCantidad) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos de la reserva.',
        confirmButtonColor: '#273481'
      });
      return;
    }

    this.cargando = true;

    const cantidadSalida = -Math.abs(Number(this.mCantidad));
    const nuevaReserva: MaterialItem = {
      orden: this.mOrden,
      proveedor: 'RESERVA INTERNA', 
      fecha: this.mFecha,
      moneda: 'PEN',
      codigo_sap: this.mSap,
      nombre_material: this.mMaterial,
      cantidad: cantidadSalida, 
      unidad: 'UN',
      precio_unitario: 0,
      cantidad_total: 0
    };

    this.stockService.agregarRegistro(nuevaReserva).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Reserva registrada con éxito!',
          text: 'El stock ha sido descontado.',
          confirmButtonColor: '#273481'
        });
        this.cargando = false;
        this.mOrden = ''; this.mFecha = ''; this.mSap = '';
        this.mMaterial = ''; this.mCantidad = null;
        this.cerrarModalManual();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al enviar POST al backend:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al guardar en el servidor. Revisa la consola (F12).',
          confirmButtonColor: '#c62828'
        });
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}