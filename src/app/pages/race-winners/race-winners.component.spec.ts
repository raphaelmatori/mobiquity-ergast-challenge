import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { httpAllRacesWinnersOfAYear } from "../../mocks/http-all-races-winners-of-a-year.mock";
import { emptyPageMock } from "../../mocks/http-empty-page.mock";
import { httpWorldChampionByYear } from "../../mocks/http-world-champion-by-year.mock";
import { ErgastService } from "../../shared/services/ergast.service";
import { RaceWinnersComponent } from "./race-winners.component";

describe("RaceWinnersComponent", () => {
  let component: RaceWinnersComponent;
  let fixture: ComponentFixture<RaceWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaceWinnersComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getWorldChampionByYear: () => of(httpWorldChampionByYear),
            getAllRacesWinnersOfAYear: () =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYear.MRData.RaceTable.Races,
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                year: 2020,
              })
            ),
          },
        },
      ],
    }).compileComponents();
  });

  it("should create", () => {
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should select item on item click", () => {
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(console, "log");
    component.selectedItemHandler("123");
    expect(console.log).toHaveBeenCalledWith("123");
  });

  it("should set loading to false after fetching races data", () => {
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.isLoading = true;
    component.fetchRacesData().subscribe();

    expect(component.isLoading).toBe(false);
  });

  it("should throw an error when year is invalid", async () => {
    await TestBed.configureTestingModule({
      declarations: [RaceWinnersComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getWorldChampionByYear: () => of(httpWorldChampionByYear),
            getAllRacesWinnersOfAYear: () =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYear.MRData.RaceTable.Races,
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                year: "wrong",
              })
            ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it("should throw an error when getWorldChampionByYear fails", async () => {
    await TestBed.configureTestingModule({
      declarations: [RaceWinnersComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getWorldChampionByYear: () => {
              throw Error("error");
            },
            getAllRacesWinnersOfAYear: () =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYear.MRData.RaceTable.Races,
              }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                year: 2020,
              })
            ),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;

    spyOn(component["ergastService"], "getWorldChampionByYear").and.callFake(
      () => {
        return throwError(() => new Error("test"));
      }
    );

    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it("should return false when shouldDisplayErrorMessage is called and errorMessage is null", () => {
    component.errorMessage = null;
    expect(component.shouldDisplayErrorMessage()).toBe(false);
  });

  it("should return true when shouldDisplayErrorMessage is called and errorMessage is not null", () => {
    component.errorMessage = "any message here";
    expect(component.shouldDisplayErrorMessage()).toBe(true);
  });

  it("should concatenate Driver's given name and family name", () => {
    const result = component.getDriverFullName(
      httpAllRacesWinnersOfAYear.MRData.RaceTable.Races[0].Results[0].Driver
    );
    expect(result).toEqual("Valtteri Bottas");
  });
});
