export const environment = {
  production: true,
  apiUrl: "https://ergast.com/api/",
  endpoints: {
    seasons: "seasons.json",
    worldChampionByYear: (year: number) => `${year}/driverStandings/1.json`,
    allRacesWinnersOfAYear: (year: number) => `${year}/results/1.json`,
  },
};
