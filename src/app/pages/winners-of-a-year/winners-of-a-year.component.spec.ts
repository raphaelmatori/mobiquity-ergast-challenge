import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { WinnersOfAYearComponent } from "./winners-of-a-year.component";

describe("WinnersOfAYearComponent", () => {
  let component: WinnersOfAYearComponent;
  let fixture: ComponentFixture<WinnersOfAYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WinnersOfAYearComponent],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WinnersOfAYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
