import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'product_images'})
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;

    //muchas imagenes pertenenecen a un producto
    @ManyToOne(
        () => Product, //entidad product
        (product) => product.images, //propiedad images de la entidad product
        {onDelete: 'CASCADE'} //si se elimina el producto se eliminan las imagenes
    )
    product:Product; //entity product

}