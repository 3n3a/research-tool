import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopBarComponent } from './app-top-bar.component';

describe('AppTopBarComponent', () => {
  let component: AppTopBarComponent;
  let fixture: ComponentFixture<AppTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
