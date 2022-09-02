import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { MainComponent } from "./main.component";

describe("MainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select item on item click", () => {
    spyOn(component["router"], "navigate").and.callFake(() =>
      Promise.resolve(true)
    );
    component.selectedItemHandler("123");
    expect(component["router"].navigate).toHaveBeenCalledWith([
      "race-winners",
      "123",
    ]);
  });
});
