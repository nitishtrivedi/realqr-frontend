import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnquiryComponent } from './edit-enquiry.component';

describe('EditEnquiryComponent', () => {
  let component: EditEnquiryComponent;
  let fixture: ComponentFixture<EditEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
