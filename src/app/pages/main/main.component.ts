import { Component, OnInit } from "@angular/core";
import { take } from "rxjs";
import { Item } from "src/app/shared/components/list/models/item.interface";
import { Season } from "./../../models/season.interface";
import { ErgastService } from "./../../shared/services/ergast.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  private readonly PAGE_LIMIT = 30;

  items: Item[] = [];

  constructor(private ergastService: ErgastService) {}

  ngOnInit(): void {
    this.fetchSeasonsData();
  }

  private addSeasonsToItemsList(seasons: Season[]): void {
    seasons.forEach((season) => {
      this.items.unshift({
        id: season.season.toString(),
        title: season.season.toString(),
      });
    });
  }

  fetchSeasonsData() {
    this.ergastService
      .getSeasonsFromYearUntilNow(2005)
      .pipe(take(1))
      .subscribe((page) => this.addSeasonsToItemsList(page.results));
  }

  selectedItemHandler(id: string) {
    console.log(id);
  }
}
