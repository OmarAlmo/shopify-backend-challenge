import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error";

@ObjectType()
export class EventType {
    @Field(() => String) uuid : string
    @Field(() => String) organizationName: string
    @Field(() => String) title!: string;
    @Field(() => String) description!: string
    @Field(() => String) location!: string;
}

@InputType()
export class CreateEventInput {
    @Field() title: string
    @Field() description: string
    @Field() location: string
}

@InputType()
export class EditEventInput {
    @Field() uuid: string
    @Field({ nullable: true }) title: string
    @Field({ nullable: true }) description: string
    @Field({ nullable: true }) location: string
}

@ObjectType()
export class EventResponse {
    @Field(() => [FieldError], { nullable: true }) errors?: FieldError[]
    @Field(() => EventType, { nullable: true }) event?: EventType
}

