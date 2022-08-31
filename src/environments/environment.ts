// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiF1Series: "https://ergast.com/api/f1",
  endpoints: {
    seasons: "seasons.json",
    worldChampionByYear: (year: number) => `${year}/driverStandings/1.json`,
    allRacesWinnersOfAYear: (year: number) => `${year}/results/1.json`,
  },
  config: {
    pagination: {
      pageLimit: 30
    },
    initialYearForF1Series: 1950
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
