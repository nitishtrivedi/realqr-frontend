import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnquiryComponent } from './manage-enquiry.component';

describe('ManageEnquiryComponent', () => {
  let component: ManageEnquiryComponent;
  let fixture: ComponentFixture<ManageEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
