import {describe , expect , it } from 'vitest'

import {ModulynError} from '../src/errors'

describe('ModulynError',()=>{
    it("should create an error with the correct properties", ()=>{
        const error  = new ModulynError(
            "AUTH_INVALID_CREDENTIALS",
            "Email or password is incorrect",
            401
        )

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ModulynError);

        expect(error.name).toBe("ModulynError");
        expect(error.message).toBe("Email or password is incorrect");
        expect(error.code).toBe("AUTH_INVALID_CREDENTIALS");
        expect(error.statusCode).toBe(401);
    });

    it("should use 500 as the default status code",() =>{
        const error = new ModulynError(
            "INTERNAL_ERROR",
            "Something went wrong"
        );

        expect(error.statusCode).toBe(500)
    })

    
})