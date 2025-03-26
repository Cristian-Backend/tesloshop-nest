import { Product } from '../../products/entities/product.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

   @Column('text',{
        select: false
   })
    password: string;

   @Column('text')
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Product, 
        (product) => product.user) 
      
        product:Product

    @BeforeInsert()
    checkFieldBeforeInsert(){
       
        this.email = this.email.toLocaleLowerCase().trim() 
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){ 
       
        this.email = this.email.toLocaleLowerCase().trim() 
    }

    
}
