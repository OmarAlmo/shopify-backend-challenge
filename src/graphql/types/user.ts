import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./error";


@ObjectType()
export class UserType {
    @Field(() => String) uuid : string
    @Field(() => String) email!: string
    @Field(() => String) firstName!: string
    @Field(() => String) lastName!: string
}

@InputType()
export class UserRegistrationInput {
    @Field(() => String, { nullable: true }) email: string
    @Field(() => String, { nullable: true }) password: string
    @Field(() => String, { nullable: true }) firstName: string
    @Field(() => String, { nullable: true }) lastName: string
}

@InputType()
export class UserUpdateInput {
    @Field() email: string
    @Field() password: string
    @Field() firstName: string
    @Field() lastName: string
}

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], { nullable: true }) errors?: FieldError[]
    @Field(() => UserType, { nullable: true }) user?: UserType
}
