import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadedChildComponent } from './loaded-child.component';

describe('LoadedChildComponent', () => {
  let component: LoadedChildComponent;
  let fixture: ComponentFixture<LoadedChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadedChildComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadedChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
