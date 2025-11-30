export interface Product  {
    id: number,
    title: string,
    originalTitle: string,
    language: string,
    runtime:number,
    genres:[string],
    plot:string,
    releaseYear: number,
    releaseDate: string,
    posterUrl: string,
    backdropUrl: string,
    trailerUrl: string,
    tmdbRating:number,
    director: string,
    languages:string,
    budget:string,
    revenue:string,
    production:string,
    awardsSummary:string


         
}
export interface Genres extends Product { 
   
}

export interface User {
  email: string;
  name: string;
  surname: string;
}
