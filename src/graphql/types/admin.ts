import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error";


@ObjectType()
export class AdminType {
    @Field(() => String) uuid : string
    @Field(() => String) email!: string
    @Field(() => String) name!: string
    @Field(() => String) organizationName!: string
    @Field(() => String) location!: string
}


@InputType()
export class AdminRegistrationInput {
    @Field() email: string
    @Field() password: string
    @Field() name: string
    @Field() organizationName: string
    @Field() location: string
}

@InputType()
export class AdminUpdateInput {
    @Field(() => String, { nullable: true }) email: string
    @Field(() => String, { nullable: true }) password: string
    @Field(() => String, { nullable: true }) name: string
    @Field(() => String, { nullable: true }) organizationName: string
    @Field(() => String, { nullable: true }) location: string
}

@ObjectType()
export class AdminResponse {
    @Field(() => [FieldError], { nullable: true }) errors?: FieldError[]
    @Field(() => AdminType, { nullable: true }) admin?: AdminType
}
