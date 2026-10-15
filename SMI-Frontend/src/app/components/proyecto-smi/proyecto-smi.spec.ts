import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProyectoSmiComponent } from './proyecto-smi';

describe('ProyectoSmi', () => {
  let component: ProyectoSmiComponent;
  let fixture: ComponentFixture<ProyectoSmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoSmiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectoSmiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
