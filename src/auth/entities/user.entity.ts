import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
        select: false // para que la contraseña no se muestre
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

    @BeforeInsert()
    checkFieldBeforeInsert(){
        // para que cree el email en minusculas y sin espacios a los costados
        this.email = this.email.toLocaleLowerCase().trim() 
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){ // para actualizar.
        // para que actualice el email en minusculas y sin espacios a los costados
        this.email = this.email.toLocaleLowerCase().trim() 
    }

    
}
