import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopVerificationComponent } from './shop-verification.component';

describe('ShopVerificationComponent', () => {
  let component: ShopVerificationComponent;
  let fixture: ComponentFixture<ShopVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
