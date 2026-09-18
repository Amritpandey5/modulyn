import {createTransport}  from 'nodemailer' 


export type EmailOptions = {
    host:string,
    port:number,
    username:string,
    password:string,
    from:string
}

export type SendEmailOptions = {
    to:string,
    subject:string,
    text:string,
    html?:string
}



export interface EmailService {
    send:(options:SendEmailOptions)=> Promise<void>;
}

export type EmailData = {
    to:string,
    subject:string,
    text:string,
    html?:string,
    from:string
} 


export interface EmailTransport{
    sendMail(data:EmailData):Promise<unknown>;
}

export function createEmailService(options:EmailOptions,customTransport?:EmailTransport):EmailService{

    const transport = customTransport ? customTransport :
    createTransport({ host:options.host, port:options.port, auth:{ user:options.username, pass:options.password } })

    return {
        async send(email : SendEmailOptions):Promise<void>{
            await transport.sendMail({
                from:options.from,
                to:email.to,
                subject:email.subject,
                text:email.text,
                html:email.html
            });
        }
    }
}