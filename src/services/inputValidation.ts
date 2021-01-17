import { EMAIL_REGEX } from '../constants';

export function validPassword(password:string) : boolean {
    return (password.length >= 8)
}

export function validEmail(email:string) : boolean {
    return EMAIL_REGEX.test(email)
}
