import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ErgastService } from "@app-shared/services/ergast.service";
import { RaceWinnersComponent } from "./pages/race-winners/race-winners.component";
import { F1Service } from "./shared/services/interfaces/f1.service.interface";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainComponent } from "./pages/main/main.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { ListComponent } from "./shared/components/list/list.component";
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    MainComponent,
    RaceWinnersComponent,
    HeaderComponent,
    SpinnerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: F1Service,
      useClass: ErgastService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
