import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertarComponent } from './insertar';

describe('Insertar', () => {
  let component: InsertarComponent;
  let fixture: ComponentFixture<InsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsertarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
