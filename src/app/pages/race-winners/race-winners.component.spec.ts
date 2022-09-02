import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { httpAllRacesWinnersOfAYearMock } from "../../mocks/http-all-races-winners-of-a-year.mock";
import { emptyPageMock } from "../../mocks/http-empty-page.mock";
import { httpWorldChampionByYearMock } from "../../mocks/http-world-champion-by-year.mock";
import { ErgastService } from "../../shared/services/ergast.service";
import { Driver } from "./../../models/driver.interface";
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
            getWorldChampionByYear: () => of(httpWorldChampionByYearMock),
            getAllRacesWinnersOfAYear: () =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYearMock.MRData.RaceTable.Races,
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
    // Given
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Then
    expect(component).toBeTruthy();
  });

  it("should select item on item click", () => {
    // Given
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(console, "log");

    // When
    component.selectedItemHandler("123");

    // Then
    expect(console.log).toHaveBeenCalledWith("123");
  });

  it("should set loading to false after fetching races data", () => {
    // Given
    fixture = TestBed.createComponent(RaceWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.isLoading = true;

    // When
    component.fetchRacesData().subscribe();

    // Then
    expect(component.isLoading).toBe(false);
  });

  it("should throw an error when year is invalid", async () => {
    // Given
    await TestBed.configureTestingModule({
      declarations: [RaceWinnersComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {
          provide: ErgastService,
          useValue: {
            getWorldChampionByYear: () => of(httpWorldChampionByYearMock),
            getAllRacesWinnersOfAYear: () =>
              of({
                ...emptyPageMock,
                results: httpAllRacesWinnersOfAYearMock.MRData.RaceTable.Races,
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

    // Then
    expect(component.isLoading).toBe(false);
  });

  it("should throw an error when getWorldChampionByYear fails", async () => {
    // Given
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
                results: httpAllRacesWinnersOfAYearMock.MRData.RaceTable.Races,
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

    // Then
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it("should return false when shouldDisplayErrorMessage is called and errorMessage is null", () => {
    // Given
    component.errorMessage = null;

    // When
    const shouldDisplayErrorMessage = component.shouldDisplayErrorMessage();

    // Then
    expect(shouldDisplayErrorMessage).toBe(false);
  });

  it("should return true when shouldDisplayErrorMessage is called and errorMessage is not null", () => {
    // Given
    component.errorMessage = "any message here";

    // When
    const shouldDisplayErrorMessage = component.shouldDisplayErrorMessage();

    // Then
    expect(shouldDisplayErrorMessage).toBe(true);
  });

  it("should concatenate Driver's given name and family name", () => {
    // Given
    const driver: Driver =
      httpAllRacesWinnersOfAYearMock.MRData.RaceTable.Races[0].Results[0]
        .Driver;

    // When
    const result = component.getDriverFullName(driver);

    // Then
    expect(result).toEqual("Valtteri Bottas");
  });
});
