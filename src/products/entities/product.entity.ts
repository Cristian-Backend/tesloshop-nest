import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: "products"})
export class Product {

    @ApiProperty({
        example: '1b7b3f23-e34e-4821-9ff4-df8e0b27d84c',
        description: "Product ID",
        uniqueItems: true
    }) 
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt teslo',
        description: "Product Title",
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    title: string;


    @ApiProperty({ 
        example: 0,
        description: "Product price",
    })
    @Column('float', { // es como number.
        default: 0
    }) 
    price: number;

    @ApiProperty({
        example: 'Descripcion del producto ',
        description: "Product Description",
        default: null,
    })
    @Column({ // es lo mismo que la forma de titulo , podria haber puesto ('text)
        type: 'text',
        nullable: true
    })
    description: string;


    @ApiProperty({
        example: 't-shirt-teslo',
        description: "Product Slug",
       uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string; // es como el nombre de la url.

    @ApiProperty({
        example: 0,
        description: "Product Stock",
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: "Product Sizes",
        
    })
    @Column('text', {
        array: true
    })
    sizes: string[]; // es un array de strings.


    @ApiProperty({
        example: 'unisex',
        description: "Product Gender",
    })
    @Column('text')
    gender: string; // hombre, mujer, niño

    @ApiProperty({
        example: ['t-shirt', 'clothes'],
        description: "Product Tags",
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]; // es un array de strings.

    // images
    // un producto puede tener muchas imagenes.
    @ApiProperty({
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        description: "Product Images",
        isArray: true,
        type: String,
        default: []
    })
    @OneToMany(
        ()=> ProductImage, // es la entidad.
        (productImage)=> productImage.product, // es la relacion.
        {cascade: true , eager: true} //eager: true es para que se carguen las imagenes al momento de cargar el producto.
    )
    images?: ProductImage[];


    @ManyToOne(
        ()=> User, // es la entidad.
        ( user )=> user.product, // es la relacion
        {eager:true} // eager: true es para que se cargue el usuario al momento de cargar el producto.
    )
    user:User // es el usuario que creo el producto.



    @BeforeInsert()  
    checkSlugInsert(){ //
        if(!this.slug){
            this.slug = this.title
            }
        
            this.slug = this.slug 
            .toLowerCase() // convierte el titulo a minuscula.
            .replaceAll(' ', '_') // quita los espacios y pone guiones en lugar de espacios.
            .replaceAll("'",'' )// quita las comillas simples.
    }

    
    @BeforeUpdate()
    checkSlugUpdate(){ 
        this.slug = this.slug
        .toLowerCase() // convierte el titulo a minuscula.
        .replaceAll(' ', '_') // quita los espacios y pone guiones en lugar de espacios.
        .replaceAll("'",'' )// quita las comillas simples.
    }
}   
