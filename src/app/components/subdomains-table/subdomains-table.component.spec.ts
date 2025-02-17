import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdomainsTableComponent } from './subdomains-table.component';

describe('SubdomainsTableComponent', () => {
  let component: SubdomainsTableComponent;
  let fixture: ComponentFixture<SubdomainsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdomainsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubdomainsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
