import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Item } from "@app-shared/components/list/models/item.interface";
import { ErgastService } from "@app-shared/services/ergast.service";
import { Season } from "@app/models/season.interface";
import { take } from "rxjs";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  @ViewChild("listItemContent", { static: true })
  itemContent!: TemplateRef<any>;

  isLoading = false;
  items: Item[] = [];

  constructor(private router: Router, private ergastService: ErgastService) {}

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
    this.isLoading = true;
    this.ergastService
      .getSeasonsFromYearUntilNow(2005)
      .pipe(take(1))
      .subscribe((page) => {
        this.addSeasonsToItemsList(page.results);
        this.isLoading = false;
      });
  }

  selectedItemHandler(id: string) {
    this.router.navigate(["race-winners", id]);
  }
}
