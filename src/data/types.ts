export interface Country {
  name: string;
  flagId: string;
  capital: string;
  fact: string;
}

export type CountriesData = Record<string, Country>;