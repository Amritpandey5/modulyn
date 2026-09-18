import {describe,it,expect} from "vitest"

import {createEmailService,EmailTransport,EmailData} from '../src/index'
import { rejects } from "node:assert";



describe("Email Service",()=>{
    it("should send an email with the correct data",async ()=>{
        const options = {
            host:"smtp.example.com",
            port:587,
            username:"test@example.com",
            password:"Passpword",
            from:"test@example.com"
        };

        let capturedEmail:EmailData | undefined;

        const fakeTransport:EmailTransport = {
            sendMail(data:EmailData){
                capturedEmail=data
                return Promise.resolve();
            }
        }

        const service = createEmailService(options,fakeTransport);

        await service.send({
            to:"fake@example.com", subject:"checking transport", text:"checking fake transport",html:"<p>HI there </p>"
        });


        expect(capturedEmail).toBeDefined();
        expect(capturedEmail?.to).toBe("fake@example.com")
        expect(capturedEmail?.subject).toBe("checking transport")
        expect(capturedEmail?.text).toBe("checking fake transport");
        expect(capturedEmail?.html).toBe("<p>HI there </p>");
        expect(capturedEmail?.from).toBe("test@example.com")
    });

    it("should send an email without html info",async()=>{
        const options = {
            host:"smtp.example.com",
            port:587,
            username:"test@example.com",
            password:"Passpword",
            from:"test@example.com"
        }

        let capturedData:EmailData | undefined;
        
        const fakeTransport:EmailTransport = {
            sendMail(data){
                capturedData = data;
                return Promise.resolve();
            }
        }

        const service = createEmailService(options,fakeTransport);

        await service.send({
            to:"fake@example.com", subject:"checking transport", text:"checking fake transport"
        })

        expect(service).toBeDefined();
        expect(service.send).toBeTypeOf("function");

        expect(capturedData).toBeDefined();
        expect(capturedData?.from).toBe("test@example.com")
        expect(capturedData?.to).toBe("fake@example.com")
        expect(capturedData?.subject).toBe("checking transport")
        expect(capturedData?.text).toBe("checking fake transport")
        expect(capturedData?.html).toBeUndefined();
    })

    it("should propagate transport error", async()=>{

        const options = {
            host:"smtp.example.com",
            port:587,
            username:"test@example.com",
            password:"Passpword",
            from:"test@example.com"
        }

        const fakeTransport:EmailTransport={
            sendMail(data){
                return Promise.reject(new Error("SMTP connection failed"));
            }
        }
        const service = createEmailService(options,fakeTransport);

        await expect(service.send({to:"fake@example.com", subject:"checking transport", text:"checking fake transport"})).rejects.toThrow("SMTP connection failed")

    })
});

