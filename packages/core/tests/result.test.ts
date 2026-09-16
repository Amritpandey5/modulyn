import { describe , expect , it } from "vitest";
import type {Result} from '../src/result.js';

describe("Result",()=>{
    it("should represent a successful result",()=>{
        const result : Result<string,Error>={
            success:true,
            data:"Hello Modulyn"
        };

        expect(result.success).toBe(true);
        
        if(result.success){
            expect(result.data).toBe("Hello Modulyn");
        }

    });

    it("should represent a failed result", () =>{
        const error = new Error("Something went wrong");

        const result : Result<string,Error> = {
            success :false,
            error,
        };

        expect(result.success).toBe(false);
        
        if(!result.success){
            expect(result.error).toBe(error)
        }
    })
})