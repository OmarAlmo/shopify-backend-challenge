export const __prod__ = process.env.NODE_ENV === "production"
export const EMAIL_REGEX : RegExp = 
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const COOKIE_NAME = 'qid'
export const eventApplicantStatuses = ['Pending', 'Accepted', 'Rejected']