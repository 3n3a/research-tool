import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnsTableComponent } from './dns-table.component';

describe('DnsTableComponent', () => {
  let component: DnsTableComponent;
  let fixture: ComponentFixture<DnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
