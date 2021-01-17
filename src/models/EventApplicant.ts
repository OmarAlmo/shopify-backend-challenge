import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class EventApplicant {
  @PrimaryKey({type: 'uuid'})
  uuid = uuidv4();

  @Property({type: 'text'})
  eventUuid: string

  @Property({type: 'text'})
  userUuid: string

  @Property()
  status!: string;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

}