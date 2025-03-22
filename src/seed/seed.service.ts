import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
    constructor(private ProductsService: ProductsService) {}
    async runSeed(){

     await this.insertNewProduct()
        return 'SEED EXECUTED';
    }


    private async insertNewProduct(){ 
       // INSERTAR PRODUCTO A LA BASE DE DATOS
      await  this.ProductsService.deleteAllProducts()

      const products = initialData.products // initial data viene del seed data, la información de los productos, parecido al dto que creamos

      const insertPromises = []
        products.forEach(product => { // recorro los productos y los inserto en la base de datos con el método create
            insertPromises.push(this.ProductsService.create(product))  // inserto el producto
        })

         await Promise.all(insertPromises) // espero a que todos los productos se hayan insertado

      return true
    }
}
