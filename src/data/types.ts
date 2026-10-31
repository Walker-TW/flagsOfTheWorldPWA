export type Continent =
  | "Africa"
  | "Antarctica"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

export interface Country {
  name: string;
  flagId: string;
  continent: Continent;
  capital: string;
  fact: string;
}

export type CountriesData = Array< Country>;
