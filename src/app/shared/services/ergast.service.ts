import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "./../../../environments/environment";
import { DriverStanding } from "./../../model/driver-standing.interface";
import { Race } from "./../../model/race.interface";
import { Season } from "./../../model/season.interface";

@Injectable({
  providedIn: "root",
})
export class ErgastService {
  private readonly API_F1_SERIES = environment.apiF1Series;
  private readonly ENDPOINTS = environment.endpoints;
  private readonly CONFIG = environment.config;

  private readonly INITIAL_YEAR_FOR_F1_SERIES = 1950;
  private readonly CURRENT_YEAR = new Date().getFullYear();

  private readonly YEAR_OUT_OF_RANGE_ERROR_MESSAGE = `The 'year' parameter must be in the interval ${this.INITIAL_YEAR_FOR_F1_SERIES} ~ ${this.CURRENT_YEAR}`;

  constructor(private httpClient: HttpClient) {}

  public getSeasons(
    offset: number = 0,
    limit: number = this.CONFIG.pagination.pageLimit
  ): Observable<Season[]> {
    return this.httpClient
      .get<any>(
        `${this.API_F1_SERIES}/${this.ENDPOINTS.seasons}?offset=${offset}&limit=${limit}`
      )
      .pipe(map((response) => response?.MRData?.SeasonTable?.Seasons));
  }

  public getSeasonsBetweenYearInterval(
    initialYear: number,
    finalYear: number
  ): Observable<Season[]> {
    if (initialYear > finalYear) {
      let aux = initialYear;
      initialYear = finalYear;
      finalYear = aux;
    }

    // This calculation assumes that there will be one and only one, F1 competition each year.
    const limit = finalYear - initialYear + 1;
    const offset = initialYear - this.INITIAL_YEAR_FOR_F1_SERIES;

    return this.getSeasons(offset, limit);
  }

  public getSeasonsFromYearUntilNow(year: number): Observable<Season[]> {
    if (year < this.INITIAL_YEAR_FOR_F1_SERIES || year > this.CURRENT_YEAR) {
      throw new Error(this.YEAR_OUT_OF_RANGE_ERROR_MESSAGE);
    }
    return this.getSeasonsBetweenYearInterval(year, this.CURRENT_YEAR);
  }

  public getWorldChampionByYear(year: number): Observable<DriverStanding[]> {
    return this.httpClient
      .get<any>(
        `${this.API_F1_SERIES}/${this.ENDPOINTS.worldChampionByYear(year)}`
      )
      .pipe(
        map((response) => response?.MRData?.StandingsTable?.StandingsLists)
      );
  }

  public getAllRacesWinnersOfAYear(year: number): Observable<Race[]> {
    return this.httpClient
      .get<any>(`${this.API_F1_SERIES}/${this.ENDPOINTS.allRacesWinnersOfAYear(year)}`)
      .pipe(map((response) => response?.MRData?.RaceTable?.Races));
  }
}
