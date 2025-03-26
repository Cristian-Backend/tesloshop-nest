import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { validRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

//@ApiTags('Products') // ApiTags no se utiliza mas. Lo hace por si solo. 
@Controller('products')
//@Auth() // aplicamos el decorador Auth , cualquiera d estas rutas necesitas estar autenticado.
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({status: 200, description: 'Product was created successfully', type: Product}) 
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related',})
  create(@Body() createProductDto: CreateProductDto,
  @GetUser() user: User // obtenemos el usuario autenticado
) {
    return this.productsService.create(createProductDto, user);
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
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto,
  @GetUser() user: User) {
    return this.productsService.update( id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(validRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) { 
    return this.productsService.remove(id);
  }
}
