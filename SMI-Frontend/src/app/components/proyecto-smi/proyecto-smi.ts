import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyecto-smi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyecto-smi.html'
})
export class ProyectoSmiComponent {

  presupuestoTotal: number | null = null;
  asignacionRM: number | null = null;
  mesesProyecto: number | null = null;
  
  get asignacionIC(): number {
    const total = this.presupuestoTotal || 0;
    const rm = this.asignacionRM || 0;
    return total - rm; 
  }

  distribucionRMMateriales: number = 38;
  distribucionICMateriales: number = 50;
  cantTotalMedidores: number = 0;
  cantMonofasicos: number = 0;
  tipoCambio: number | null = null;

  get cantTrifasicos(): number {
    const total = this.cantTotalMedidores || 0;
    const mono = this.cantMonofasicos || 0;
    return total > mono ? total - mono : 0;
  }

  materialesSMI = [
    { nombre: 'MEDIDOR ELECTRONICO MONOFASICO 5(60A) 220V 3H CL.1 60HZ', sap: '3000479', unidad: 'UNIDADES', uso10: 10, precioBase: 31.15, moneda: 'SOLES', tipo: 'MONOFASICO' },
    { nombre: 'TAPA DE FIBRA DE VIDRIO P.CAJA TP. L DE 154 X 421 X 3MM', sap: '3004178', unidad: 'UNIDADES', uso10: 2, precioBase: 27.37, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TAPA DE FIBRA DE VIDRIO P.CAJA TP. L DE 154 X 474 X 3MM', sap: '3004180', unidad: 'UNIDADES', uso10: 2, precioBase: 30.94, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TORNILLO AUTOROSCANTE DE ACERO GALV. 11/32" / NUM 10 X 1/2"', sap: '8000358', unidad: 'UNIDADES', uso10: 10, precioBase: 0.05, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TORNILLO AUTOROSCANTE DE ACERO TROPICALIZADO 11/32"', sap: '8000846', unidad: 'UNIDADES', uso10: 10, precioBase: 0.33, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'FUSIBLE TP. C 220V. 30A. P.CONEX.DOMICIL. Y A.P.', sap: '8001951', unidad: 'UNIDADES', uso10: 2, precioBase: 1.30, moneda: 'SOLES', tipo: 'MONOFASICO' },
    { nombre: 'VISOR TRANSPARENTE P.CAJAS TIPO L - LT 110 X 115 X 3MM', sap: '3000781', unidad: 'UNIDADES', uso10: 10, precioBase: 2.27, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'PRECINTO DE SEGURIDAD TP.TRIPLE ANCLA P.BORNERAS ROJO', sap: '3004155', unidad: 'UNIDADES', uso10: 10, precioBase: 0.12, moneda: 'DOLARES', tipo: 'AMBOS' }, // <-- EN DÓLARES
    { nombre: 'CONDUCTOR SOLIDO TW 750V.UNIP.NEGRO 1X 4 MM2', sap: '3001659', unidad: 'CM', uso10: 0.5, precioBase: 2.29, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'CONDUCTOR SOLIDO TW 750V.UNIP.NEGRO 1X 6 MM2', sap: '3001665', unidad: 'CM', uso10: 0.5, precioBase: 2.60, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'BASE PORTAFUSIBLE LOZA BIP. 220V. P.FUSIBLE TP.C', sap: '8001843', unidad: 'UNIDADES', uso10: 2, precioBase: 24.69, moneda: 'SOLES', tipo: 'MONOFASICO' },
    { nombre: 'INTERRUPTOR TERMOMAGNETICO BIPOLAR CURVA C 220V 32A', sap: '3005039', unidad: 'UNIDADES', uso10: 3, precioBase: 6.79, moneda: 'SOLES', tipo: 'MONOFASICO' },
    { nombre: 'CERRADURA TRIANGULAR PARA CAJA TP. L - LT', sap: '3004152', unidad: 'UNIDADES', uso10: 1, precioBase: 7.81, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'PERFILES SIMETRICOS (RIEL DIN) P. INTERRUP. BIP. Y TRIP.', sap: '3003920', unidad: 'UNIDADES', uso10: 1, precioBase: 2.38, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'MEDIDOR ELECTRONICO TRIFASICO 15(90A) 220V 3H 2S CL.1 60HZ', sap: '3000232', unidad: 'UNIDADES', uso10: 10, precioBase: 75.10, moneda: 'SOLES', tipo: 'TRIFASICO' },
    { nombre: 'FUSIBLE TP. C 220V. 60A. P.CONEX.DOMICIL. Y A.P.', sap: '8001952', unidad: 'UNIDADES', uso10: 2, precioBase: 2.08, moneda: 'SOLES', tipo: 'TRIFASICO' },
    { nombre: 'BASE PORTAFUSIBLE LOZA TRIP. 220V. P.FUSIBLE TP.C', sap: '8001844', unidad: 'UNIDADES', uso10: 2, precioBase: 30.59, moneda: 'SOLES', tipo: 'TRIFASICO' },
    { nombre: 'INTERRUPTOR TERMOMAGNETICO TRIPOLAR CURVA C 220V 32A', sap: '3005056', unidad: 'UNIDADES', uso10: 3, precioBase: 9.69, moneda: 'SOLES', tipo: 'TRIFASICO' },
    { nombre: 'TAPA DE FIBRA DE VIDRIO P.CAJA TP. LT DE 216 X 496 X 3MM', sap: '3004184', unidad: 'UNIDADES', uso10: 0.5, precioBase: 33.34, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TAPA DE FIBRA DE VIDRIO P.CAJA TP. LR DE 154 X 351 X 3MM', sap: '3004186', unidad: 'UNIDADES', uso10: 0.5, precioBase: 33.93, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TAPA DE FIBRA DE VIDRIO P.CAJA TP. LTR DE 216 X 421 X 3MM', sap: '3004189', unidad: 'UNIDADES', uso10: 0.5, precioBase: 45.20, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TABLERO S/PREP.MADERA P.CJ.MET.TP.L 10X145X415MM', sap: '8002549', unidad: 'UNIDADES', uso10: 0.5, precioBase: 8.16, moneda: 'SOLES', tipo: 'AMBOS' },
    { nombre: 'TABLERO S/PREP.MADERA P.CJ.MET.TP.LT 13X200X490MM', sap: '8002551', unidad: 'UNIDADES', uso10: 0.5, precioBase: 18.24, moneda: 'SOLES', tipo: 'AMBOS' }
  ];

  get materialesFiltrados() {
    return this.materialesSMI.filter(item => {
      if (this.cantTotalMedidores === 0) return true;
      if (this.cantMonofasicos > 0 && this.cantTrifasicos === 0) {
        return item.tipo === 'MONOFASICO' || item.tipo === 'AMBOS';
      }
      if (this.cantTrifasicos > 0 && this.cantMonofasicos === 0) {
        return item.tipo === 'TRIFASICO' || item.tipo === 'AMBOS';
      }
      return true;
    });
  }

  calcularCantidad(item: any): number {
    let base = 0;
    if (item.tipo === 'MONOFASICO') {
      base = this.cantMonofasicos || 0;
    } else if (item.tipo === 'TRIFASICO') {
      base = this.cantTrifasicos || 0;
    } else {
      base = this.cantTotalMedidores || 0;
    }

    if (base <= 0) return 0;
    return Math.ceil((base / 10) * item.uso10);
  }

  obtenerPrecioSoles(item: any): number {
    if (item.moneda === 'DOLARES') {
      const tc = this.tipoCambio || 1; 
      return item.precioBase * tc;
    }
    return item.precioBase;
  }

  obtenerSubtotal(item: any): number {
    return this.calcularCantidad(item) * this.obtenerPrecioSoles(item);
  }

  get totalCotizacion(): number {
    let total = 0;
    this.materialesFiltrados.forEach(mat => {
      total += this.obtenerSubtotal(mat);
    });
    return total;
  }

  get mensualRM(): number {
    if (!this.asignacionRM || !this.mesesProyecto || this.mesesProyecto <= 0) return 0;
    return this.asignacionRM / this.mesesProyecto;
  }
  
  get mensualRMMateriales(): number { 
    return this.mensualRM * (this.distribucionRMMateriales / 100); 
  }
  
  get mensualRMManoObra(): number { 
    return this.mensualRM * ((100 - this.distribucionRMMateriales) / 100); 
  }

  get mensualIC(): number {
    if (!this.asignacionIC || !this.mesesProyecto || this.mesesProyecto <= 0) return 0;
    return this.asignacionIC / this.mesesProyecto;
  }
  
  get mensualICMateriales(): number { 
    return this.mensualIC * (this.distribucionICMateriales / 100); 
  }
  
  get mensualICManoObra(): number { 
    return this.mensualIC * ((100 - this.distribucionICMateriales) / 100); 
  }

  descargarPDF() {
    window.print(); 
  }
}
