import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column('bool', {
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [ValidRoles])
  roles: ValidRoles[];
}
