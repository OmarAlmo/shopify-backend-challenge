import argon2 from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../Context";
import { AdminRegistrationInput, AdminResponse, AdminUpdateInput } from "../types/admin";
import { LoginInput } from "../types/login";
import { Admin } from "../../models/Admin";
import { Event } from "../../models/Event";
import { validEmail, validPassword } from "../../services/inputValidation";

// import { COOKIE_NAME } from "../../constants";

@Resolver()
export class AdminResolver {
    @Query(() => AdminResponse, { nullable: true})
    async currentAdmin(@Ctx() { em, req } : Context){
        if (!(req.session as any).adminUuid){
            return {
                errors:[{
                    field: 'admin',
                    message: 'No admin.'
                }]
            }
        }
        const admin = await em.findOne(Admin, { uuid: (req.session as any).adminUuid });
        return { admin }
    }
    

    @Mutation(() => AdminResponse)
    async registerAdmin(
        @Arg('input') input: AdminRegistrationInput,
        @Ctx() { em, req}: Context) : Promise<AdminResponse>
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
            const admin = em.create(Admin, {
                email: input.email.toLocaleLowerCase(),
                password: hashedPassword,
                name: input.name,
                organizationName: input.organizationName,
                location: input.location
            });
            try {
                await em.persistAndFlush(admin);
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
            console.log("ADMIN---", admin);
            // auto log in after creattion
            (req.session as any).adminUuid = admin.uuid;
            return { admin };
        }

    @Mutation(() => AdminResponse, { nullable: true })
    async loginAdmin(
        @Arg('input') input: LoginInput,
        @Ctx() { em, req }: Context) : Promise<AdminResponse>
        {
            const admin = await em.findOne(Admin, { email: input.email.toLocaleLowerCase() });
            if (!admin){
                return {
                    errors:[{
                        field: 'email',
                        message: 'Invalid login credentials'
                    }]
                }
            }
            const valid = await argon2.verify(admin.password, input.password);
            if (!valid){
                return {
                    errors:[{
                        field: 'password',
                        message: 'Invalid login credentials'
                    }]
                }
            }
            (req.session as any).adminUuid = admin.uuid;
            return { admin };
        }
    
    @Mutation(() => AdminResponse)
    async updateAdmin(
        @Arg('input') input: AdminUpdateInput,
        @Ctx() { em, req }: Context
    ) : Promise<AdminResponse> {
        if (!(req.session as any).adminUuid){
            return {
                errors: [{
                    field: 'email',
                    message: 'Please login.'
                }]
            }
        }
        const adminUuid : string = (req.session as any).adminUuid
        const admin = await em.findOne(Admin, { uuid: adminUuid })
        
        // Validate inputs
        if (typeof input.email !== 'undefined'){ admin.email = input.email.toLocaleLowerCase()}
        if (typeof input.name !== 'undefined'){ admin.name = input.name}
        // update all events if organization name updated
        if (typeof input.organizationName !== 'undefined'){ 
            admin.organizationName = input.organizationName
            const events = await em.find(Event, { adminUuid: adminUuid })
            events.forEach(event => {
                event.organizationName = input.organizationName
            });
        }
        if (typeof input.location !== 'undefined'){ admin.location = input.location}
        if (typeof input.password !== 'undefined'){ 
            if (! validPassword(input.password)){
                return {
                    errors:[{
                        field: 'password',
                        message: 'Password is too short, please insert a password with minimum of 8 characters.'
                    }]
                }
            }
            admin.password = await argon2.hash(input.password) 
        }

        try {
            await em.persistAndFlush(admin);
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
        return { admin }
    }
    
    @Mutation(() => Boolean)
    logoutAdmin(@Ctx() { req }: Context) : boolean
    {
        req.session.destroy((err) => {
            console.log(err)
        })
        return true
    }
} 
     
