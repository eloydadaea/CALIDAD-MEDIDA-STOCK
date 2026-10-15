import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService, MaterialItem } from '../../services/stock';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html'
})
export class InicioComponent implements OnInit {

  @ViewChild('graficoTopEgresos') graficoTopEgresos!: ElementRef;
  @ViewChild('graficoBalance') graficoBalance!: ElementRef;

  chartTop: any;
  chartBalance: any;

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.stockService.obtenerStock().subscribe({
      next: (data) => {
        this.procesarDatos(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar datos en Inicio:', err)
    });
  }

  procesarDatos(data: MaterialItem[]) {
    let ingresos = 0;
    let egresos = 0;
    const salidasConsolidadas: { [key: string]: { nombre: string, cantidad: number } } = {};

    data.forEach(item => {
      const cant = Number(item.cantidad) || 0;
      
      if (cant > 0 && item.proveedor !== 'RESERVA INTERNA') {
        ingresos += cant;
      } else {
        const absCant = Math.abs(cant);
        egresos += absCant;
        
  
        const sap = item.codigo_sap;
        if (sap && sap !== '-' && sap.trim() !== '') {
          if (!salidasConsolidadas[sap]) {
            salidasConsolidadas[sap] = { nombre: item.nombre_material, cantidad: 0 };
          }
          salidasConsolidadas[sap].cantidad += absCant;
        }
      }
    });


    const topEgresos = Object.values(salidasConsolidadas)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);


    setTimeout(() => {
      this.renderizarGraficos(ingresos, egresos, topEgresos);
    }, 100);
  }

  renderizarGraficos(ingresos: number, egresos: number, topEgresos: {nombre: string, cantidad: number}[]) {
    if (this.chartTop) this.chartTop.destroy();
    if (this.chartBalance) this.chartBalance.destroy();


    const nombresTop = topEgresos.map(m => m.nombre);
    const cantidadesTop = topEgresos.map(m => m.cantidad);

    this.chartTop = new Chart(this.graficoTopEgresos.nativeElement, {
      type: 'bar',
      data: {
        labels: nombresTop.length ? nombresTop : ['Sin salidas registradas'],
        datasets: [{
          label: 'Unidades Retiradas',
          data: cantidadesTop.length ? cantidadesTop : [0],
          backgroundColor: '#c62828', 
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });


    this.chartBalance = new Chart(this.graficoBalance.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Movimientos'],
        datasets: [
          {
            label: 'Total Ingresado',
            data: [ingresos],
            backgroundColor: '#2e7d32',
            borderRadius: 4
          },
          {
            label: 'Total Retirado',
            data: [egresos],
            backgroundColor: '#c62828', 
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }
}