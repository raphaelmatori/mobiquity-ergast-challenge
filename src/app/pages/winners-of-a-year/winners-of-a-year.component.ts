import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { Item } from "src/app/shared/components/list/models/item.interface";
import { Driver } from "./../../models/driver.interface";
import { Paginate } from "./../../models/paginate.interface";
import { Race } from "./../../models/race.interface";
import { HeaderService } from "./../../shared/components/header/header.service";
import { ErgastService } from "./../../shared/services/ergast.service";
@Component({
  selector: "app-winners-of-a-year",
  templateUrl: "./winners-of-a-year.component.html",
  styleUrls: ["./winners-of-a-year.component.scss"],
})
export class WinnersOfAYearComponent implements OnInit, OnDestroy {
  @ViewChild("listItemContent", { static: true })
  itemContent!: TemplateRef<any>;

  isLoading = false;
  unsubscribe$ = new Subject<void>();
  yearBase: number = -1;
  items: Item[] = [];
  selectedDriver: Driver | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ergastService: ErgastService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.headerService.addGoBackTo("/");
  }

  private initData() {
    this.isLoading = true;
    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((params: ParamMap) => {
          const receivedYear = params.get("year");
          if (receivedYear) {
            this.headerService.setTitle("Year: " + receivedYear);
            this.yearBase = +receivedYear;
          }
          return this.fetchWorldChampionOfAYear();
        }),
        switchMap(() => this.fetchRacesData())
      )
      .subscribe();
  }

  private fetchWorldChampionOfAYear(): Observable<Driver> {
    return this.ergastService.getWorldChampionByYear(this.yearBase).pipe(
      take(1),
      tap((driver) => (this.selectedDriver = driver))
    );
  }

  private addRaceToItemsList(races: Race[]): void {
    races.forEach((race) => {
      this.items.push(this.mapRaceToListItem(race));
    });
  }

  private mapRaceToListItem(race: Race) {
    const isWorldChampion =
      race.Results[0]?.Driver.driverId === this.selectedDriver?.driverId;

    return {
      id: race.round.toString(),
      selected: isWorldChampion,
      title: race.raceName.toString(),
      additionalInfo: {
        winnerFullName: `${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName}`,
      },
    };
  }
  fetchRacesData(): Observable<Paginate> {
    return this.ergastService.getAllRacesWinnersOfAYear(this.yearBase).pipe(
      take(1),
      tap((page) => {
        this.addRaceToItemsList(page.results);
        this.isLoading = false;
      })
    );
  }

  selectedItemHandler(id: string) {
    console.log(id);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
