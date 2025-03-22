import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from '../auth/decorators';
import { validRoles } from '../auth/interfaces';

@Controller('products')
//@Auth() // aplicamos el decorador Auth , cualquiera d estas rutas necesitas estar autenticado.
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(validRoles.admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term' ) term: string) { 
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(validRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update( id, updateProductDto);
  }

  @Delete(':id')
  @Auth(validRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) { // PARSEUUID es un pipe que convierte el id a UUID
    return this.productsService.remove(id);
  }
}
