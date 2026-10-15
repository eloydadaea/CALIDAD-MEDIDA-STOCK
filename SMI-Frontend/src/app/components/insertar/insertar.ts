import { Component, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, MaterialItem } from '../../services/stock';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insertar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insertar.html'
})
export class InsertarComponent {

  mostrarModalPdf = false;
  mostrarModalManual = false;
  cargando = false;

  mOrden = '';
  mProveedor = '';
  mFecha = '';
  mSap = '';
  mMaterial = '';
  mCantidad: number | null = null;
  mPrecio: number | null = null;

  archivoSeleccionado: File | null = null; 

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) {}

  abrirModalPdf() { this.mostrarModalPdf = true; }
  
  cerrarModalPdf() { 
    this.mostrarModalPdf = false; 
    this.archivoSeleccionado = null; 
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  cargarPdf() {
    if (!this.archivoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo no seleccionado',
        text: 'Por favor, selecciona un PDF primero.',
        confirmButtonColor: '#273481'
      });
      return;
    }

    this.cargando = true;
    
    this.stockService.subirPdf(this.archivoSeleccionado).subscribe({
      next: (datosExtraidos) => {
        this.cargando = false;

        this.mOrden = datosExtraidos.orden;
        this.mProveedor = datosExtraidos.proveedor;
        this.mFecha = datosExtraidos.fecha;
        this.mSap = datosExtraidos.codigo_sap;
        this.mMaterial = datosExtraidos.nombre_material;
        this.mCantidad = datosExtraidos.cantidad;
        this.mPrecio = datosExtraidos.precio_unitario;

        this.cerrarModalPdf();
        this.abrirModalManual();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al subir PDF:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al procesar el PDF. Revisa la consola.',
          confirmButtonColor: '#c62828'
        });
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalManual() { this.mostrarModalManual = true; }
  cerrarModalManual() { this.mostrarModalManual = false; }

 guardarManual() {
    if (!this.mOrden || !this.mProveedor || !this.mFecha || !this.mSap || !this.mMaterial || !this.mCantidad || !this.mPrecio) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos del formulario.',
        confirmButtonColor: '#273481'
      });
      return;
    }

    this.cargando = true;
    const total = Number(this.mCantidad) * Number(this.mPrecio);

    const nuevoIngreso: MaterialItem = {
      orden: this.mOrden,
      proveedor: this.mProveedor,
      fecha: this.mFecha,
      moneda: 'PEN',
      codigo_sap: this.mSap,
      nombre_material: this.mMaterial,
      cantidad: Number(this.mCantidad),
      unidad: 'UN',
      precio_unitario: Number(this.mPrecio),
      cantidad_total: total
    };

    this.stockService.agregarRegistro(nuevoIngreso).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'El ingreso se registró exitosamente en el servidor.',
          timer: 2000,
          showConfirmButton: false
        });

        this.cargando = false;
        this.mOrden = ''; this.mProveedor = ''; this.mFecha = ''; this.mSap = '';
        this.mMaterial = ''; this.mCantidad = null; this.mPrecio = null;
        this.cerrarModalManual();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al enviar POST al backend:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al guardar en el servidor.',
          confirmButtonColor: '#c62828'
        });
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}