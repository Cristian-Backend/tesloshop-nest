import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @IsOptional()
  @IsPositive()
  @Type(() => Number) //enableImplicitConversion: true //Esta en el main de pokedex
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) //enableImplicitConversion: true //Esta en el main de pokedex
  offset?: number;

}