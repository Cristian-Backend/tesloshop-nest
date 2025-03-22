import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({name: "products"})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    title: string;

    @Column('float', { // es como number.
        default: 0
    }) 
    price: number;


    @Column({ // es lo mismo que la forma de titulo , podria haber puesto ('text)
        type: 'text',
        nullable: true
    })
    description: string;


    @Column('text',{
        unique: true
    })
    slug: string; // es como el nombre de la url.

    
    @Column('int',{
        default: 0
    })
    stock: number


    @Column('text', {
        array: true
    })
    sizes: string[]; // es un array de strings.



    @Column('text')
    gender: string; // hombre, mujer, niño

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]; // es un array de strings.

    // images
    // un producto puede tener muchas imagenes.
    @OneToMany(
        ()=> ProductImage, // es la entidad.
        (productImage)=> productImage.product, // es la relacion.
        {cascade: true , eager: true} //eager: true es para que se carguen las imagenes al momento de cargar el producto.
    )
    images?: ProductImage[];

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
