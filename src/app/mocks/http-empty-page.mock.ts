import { Paginate } from "./../models/paginate.interface";
export const emptyPageMock = {
  limit: 0,
  offset: 0,
  total: 0,
  results: [],
} as Paginate;
