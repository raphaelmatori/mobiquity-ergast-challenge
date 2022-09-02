import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { httpSeasonsMock } from "./../../mocks/http-seasons.mock";
import { ErgastService } from "./../../shared/services/ergast.service";

import { emptyPageMock } from "src/app/mocks/http-empty-page.mock";
import { MainComponent } from "./main.component";

describe("MainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getSeasonsFromYearUntilNow: () =>
              of({
                ...emptyPageMock,
                results: httpSeasonsMock.MRData.SeasonTable.Seasons,
              }),
          },
        },
      ],
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
