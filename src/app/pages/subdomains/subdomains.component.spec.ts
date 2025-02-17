import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdomainsComponent } from './subdomains.component';

describe('SubdomainsComponent', () => {
  let component: SubdomainsComponent;
  let fixture: ComponentFixture<SubdomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdomainsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
