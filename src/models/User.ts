import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({type: 'uuid'})
  uuid = uuidv4();
  
  @Property({ type: 'text', unique: true})
  email!: string;

  @Property({ type: 'text', unique: true})
  password!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();
  
}