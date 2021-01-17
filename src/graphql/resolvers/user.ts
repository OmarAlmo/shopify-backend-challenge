import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../Context";
import { UserRegistrationInput, UserResponse, UserType } from "../types/user";
import { LoginInput } from "../types/login"
import { User } from "../../models/User";
import { validEmail, validPassword } from "../../services/inputValidation";

@Resolver()
export class UserResolver {
    @Query(() => UserType, { nullable: true})
    async currentUser(@Ctx() { em, req } : Context){
        if (!(req.session as any).userUuid){
            return null
        }
        const user = await em.findOne(User, { uuid: (req.session as any).userUuid });
        return user
    }
    

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg('input') input: UserRegistrationInput,
        @Ctx() { em, req}: Context) : Promise<UserResponse>
        {   
            if (!validEmail(input.email)){
                return {
                    errors:[{
                        field: 'email',
                        message: 'Email is not valid. Please insert a valid email.'
                    }]
                }
            }

            if (! validPassword(input.password)){
                return {
                    errors:[{
                        field: 'password',
                        message: 'Password is too short, please insert a password with minimum of 8 characters.'
                    }]
                }
            }
            const hashedPassword = await argon2.hash(input.password)
            const user = em.create(User, {
                email: input.email.toLocaleLowerCase(),
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
            });
            try {
                await em.persistAndFlush(user);
            } catch(err) {
                if (err.detail.includes('already exists')){
                    return {
                        errors: [{
                            field: 'email',
                            message: 'Account already exists'
                        }]
                    }
                }
                return {
                    errors:[{
                        field: 'email',
                        message: 'Error registering account, please try again later or contact us.'
                    }]
                }
            }
            // auto log in after creattion
            (req.session as any).userUuid = user.uuid;
            return { user };
        }

    @Mutation(() => UserResponse, { nullable: true })
    async loginUser(
        @Arg('input') input: LoginInput,
        @Ctx() { em, req }: Context) : Promise<UserResponse>
        {
            const user = await em.findOne(User, { email: input.email.toLocaleLowerCase() });
            if (!user){
                return {
                    errors:[{
                        field: 'Credentials',
                        message: 'Invalid login credentials'
                    }]
                }
            }
            const valid = await argon2.verify(user.password, input.password);
            if (!valid){
                return {
                    errors:[{
                        field: 'Credentials',
                        message: 'Invalid login credentials'
                    }]
                }
            }
            (req.session as any).userUuid = user.uuid;
            return { user };
        }
    
        @Mutation(() => UserResponse)
    async updateUser(
        @Arg('input') input: UserRegistrationInput,
        @Ctx() { em, req }: Context
    ) : Promise<UserResponse> {
        if (!(req.session as any).userUuid){
            return {
                errors: [{
                    field: 'email',
                    message: 'Please login.'
                }]
            }
        }
        const user = await em.findOne(User, { uuid: (req.session as any).userUuid })
        
        // Validate inputs
        if (typeof input.email !== 'undefined'){ user.email = input.email.toLocaleLowerCase()}
        if (typeof input.firstName !== 'undefined'){ user.firstName = input.firstName}
        if (typeof input.lastName !== 'undefined'){ user.lastName = input.lastName}
        if (typeof input.password !== 'undefined'){ 
            if (! validPassword(input.password)){
                return {
                    errors:[{
                        field: 'password',
                        message: 'Password is too short, please insert a password with minimum of 8 characters.'
                    }]
                }
            }
            user.password = await argon2.hash(input.password) 
        }

        try {
            await em.persistAndFlush(user);
        } catch(err) {
            if (err.detail.includes('already exists')){
                return {
                    errors: [{
                        field: 'email',
                        message: 'Account already exists'
                    }]
                }
            }
            return {
                errors:[{
                    field: 'email',
                    message: `Error registering account, please try again later or contact us.\n${err}`
                }]
            }
        }
        return { user }
    }

    @Mutation(() => Boolean)
    logoutUser(@Ctx() { req }: Context) : boolean
    {
        req.session.destroy((err) => {
            console.log(err)
        })
        return true
    }
} 
     
