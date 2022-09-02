import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { httpAllRacesWinnersOfAYear } from "../../mocks/http-all-races-winners-of-a-year.mock";
import { httpWorldChampionByYear } from "../../mocks/http-world-champion-by-year.mock";
import { environment } from "./../../../environments/environment";
import { httpSeasonsMock } from "./../../mocks/http-seasons.mock";
import { ErgastService } from "./ergast.service";

describe("ErgastService", () => {
  const API_F1_SERIES = environment.apiF1Series;
  const ENDPOINTS = environment.endpoints;
  const CONFIG = environment.config;

  let service: ErgastService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ErgastService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call getSeasons without passing pagination parameters ", () => {
    const limit = 30;

    service.getSeasons().subscribe((page) => {
      expect(page.results.length).toBe(limit);
    });

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.seasons}?offset=0&limit=${limit}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(httpSeasonsMock);
  });

  it("should call getSeasons passing pagination parameters ", () => {
    const offset = 10;
    const limit = 20;

    service.getSeasons(offset, limit).subscribe((page) => {
      expect(page.results.length).toBe(limit);
    });

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.seasons}?offset=${offset}&limit=${limit}`
    );

    expect(req.request.method).toBe("GET");
  });

  it("should call getSeasonsBetweenYearInterval with a range between a given year interval", () => {
    const initialYear = 2015;
    const finalYear = 2000;
    const offset = 50; // skip the first 50 -> from 1950 until 1999
    const limit = 16; // get 16 -> from 2000 until 2015

    spyOn(service, "getSeasons").and.callThrough();
    service.getSeasonsBetweenYearInterval(initialYear, finalYear).subscribe();

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.seasons}?offset=${offset}&limit=${limit}`
    );

    expect(req.request.method).toBe("GET");
    req.flush(httpSeasonsMock);

    expect(service.getSeasons).toHaveBeenCalledTimes(1);
  });

  it("should call getSeasonsFromYearUntilNow with a given year and return the season list from that year until now", () => {
    const givenYear = 2015;
    const currentYear = new Date().getFullYear();
    const limit = currentYear - givenYear + 1;
    const offset = givenYear - CONFIG.initialYearForF1Series;
    spyOn(service, "getSeasonsBetweenYearInterval").and.callThrough();

    service.getSeasonsFromYearUntilNow(givenYear).subscribe();

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.seasons}?offset=${offset}&limit=${limit}`
    );

    expect(req.request.method).toBe("GET");
    req.flush(httpSeasonsMock);

    expect(service.getSeasonsBetweenYearInterval).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when the given year is less than the initial year for f1 series", () => {
    const givenYear = 1949;
    spyOn(service, "getSeasonsBetweenYearInterval").and.callThrough();
    expect(function () {
      service.getSeasonsFromYearUntilNow(givenYear);
    }).toThrow();
  });

  it("should return the F1 World Champion for a given year", () => {
    const givenYear = 2015;

    service.getWorldChampionByYear(givenYear).subscribe();

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.worldChampionByYear(givenYear)}`
    );

    expect(req.request.method).toBe("GET");
    req.flush(httpWorldChampionByYear);
  });

  it("should get all winners of a race for a given year", () => {
    const givenYear = 2015;

    service.getAllRacesWinnersOfAYear(givenYear).subscribe();

    const req = httpMock.expectOne(
      `${API_F1_SERIES}/${ENDPOINTS.allRacesWinnersOfAYear(givenYear)}`
    );

    expect(req.request.method).toBe("GET");
    req.flush(httpAllRacesWinnersOfAYear);
  });
});
