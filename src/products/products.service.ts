import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService') // es un console.log pero de nestjs

  // UTILIZAMOS EL CONTRUCTOR Y EL INJECTREPOSITORY PARA INYECTAR EL REPOSITORIO DE PRODUCTO(entity)
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,  // entity
    
    @InjectRepository(ProductImage)//
    private readonly productImageRepository: Repository<ProductImage>,  // entity para crear instancias.

    private readonly datasource: DataSource

  ){}
    
    
  async create(createProductDto: CreateProductDto) {
   try {

    const {images = [], ...productDetails } = createProductDto
    //1- creo el registro
    const product = this.productRepository.create({
      ...productDetails, 
      images: images.map(image=> this.productImageRepository.create({url: image})) // explicacion:
    })
    
    //2- guardo el registro en base de datos
    await this.productRepository.save(product)

    return {...product, images};
    
   } catch (error) {
   
    this.handleDBException(error) // lo creamos al final para que no se repita el codigo
    
   }
  }

  // TODO: paginar 
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
            images: true // esto es para que me traiga las imagenes de cada producto
        }
    });

    return products.map(product => ({
        ...product, // spread operator para copiar todas las propiedades de product
        images: product.images.map(img => img.url) // solo devuelvo la url de las imagenes
    }));
}

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) { // si es un uuid, busco por id
        product = await this.productRepository.findOneBy({ id: term }); // busco por id
    } else { // si no es un uuid, busco por slug o título
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        product = await queryBuilder
        
            .where("UPPER(product.title) = UPPER(:title) OR product.slug = :slug", { 
                title: term.toUpperCase(),
                slug: term.toLocaleLowerCase(),
            })
            .leftJoinAndSelect("product.images", "product.images") 
            .getOne();

        // Select * from Products where LOWER(title)="xx" or slug="xx"
    }

    if (!product) throw new NotFoundException(`Product with id ${term} not found`);

    return product;
}
  async findOnePlain(term:string){ //
    const {images = [], ...rest} = await this.findOne(term); 
    return {
      ...rest,
      images: images.map(img => img.url) // solo devuelvo la url de las imagenes
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({ // preload es para actualizar un registro.
      id: id,
      ...toUpdate ,
    })
    
    //si no existe el producto, preload devuelve null, por eso lo validamos
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    // Create queryRunner
    const queryRunner = this.datasource.createQueryRunner() // creamos un queryRunner para manejar transacciones
    await queryRunner.connect() //conectamos a la base de datos
    await queryRunner.startTransaction() // iniciamos la transacción
    try {

      if(images){ // si hay imagenes
        await queryRunner.manager.delete(ProductImage, {product: {id}}) // borramos todas las imagenes del producto // id del producto.
        // delete  * from producImage

        product.images = images.map(image => this.productImageRepository.create({url: image})) // creamos las nuevas imagenes
      } 
      await queryRunner.manager.save(product) // guardamos el producto actualizado

     //  await this.productRepository.save(product) // guardamos el producto actualizado

      await queryRunner.commitTransaction() // confirmamos la transacción
      await queryRunner.release() // liberamos el queryRunner

      return this.findOnePlain(id)



    } catch (error) {
      await queryRunner.rollbackTransaction() // deshacemos la transacción
      await queryRunner.release() // liberamos el queryRunner
      this.handleDBException(error) // lo creamos al final para que no se repita el codigo
    }

 
    
    
  }

 async remove(id: string) {
    const product = await this.findOne(id) // buscamos el id
    await this.productRepository.remove(product) // lo eliminamos

  }





  private handleDBException(error: any){ // manejo de errores de duplicidad.

    // console.log(error)
    if(error.code === '23505') // error de duplicado en postgres
      throw new BadRequestException(error.detail)

    this.logger.error(error) // es un console.log pero de nestjs
    throw new InternalServerErrorException('Unspected error, check logs')

  }

  async deleteAllProducts() {

    const query = this.productImageRepository.createQueryBuilder('product')

    try {
      await query.delete().where({}).execute() // borramos todos los productos

      
    } catch (error) {
      this.handleDBException(error)
      
    }

}

}
