import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { httpAllRacesWinnersOfAYear } from "./../../mocks/http-all-races-winners-of-a-year.mock";
import { emptyPageMock } from "./../../mocks/http-empty-page.mock";
import { httpWorldChampionByYear } from "./../../mocks/http-world-champion-by-year.mock";
import { ErgastService } from "./../../shared/services/ergast.service";
import { WinnersOfAYearComponent } from "./winners-of-a-year.component";

describe("WinnersOfAYearComponent", () => {
  let component: WinnersOfAYearComponent;
  let fixture: ComponentFixture<WinnersOfAYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WinnersOfAYearComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getWorldChampionByYear: (str: string) =>
              of(httpWorldChampionByYear),
            getAllRacesWinnersOfAYear: (str: string) =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYear.MRData.RaceTable.Races,
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ year: 2020 })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WinnersOfAYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select item on item click", () => {
    spyOn(console, "log");
    component.selectedItemHandler("123");
    expect(console.log).toHaveBeenCalledWith("123");
  });

  it("should set loading to false after fetching races data", () => {
    component.isLoading = true;
    component.fetchRacesData().subscribe();

    expect(component.isLoading).toBe(false);
  });
});
