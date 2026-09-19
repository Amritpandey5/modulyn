import {describe , it , expect} from "vitest"
import {hashPassword,verifyPassword}  from '../src/password'

describe("hash",()=>{
    it("should hash the password correctly",async()=>{
        const password = "Amrit@123";

        const hashPass = await hashPassword(password);

        const verify = await verifyPassword(password,hashPass);

        expect(hashPass).toBeDefined();
        expect(hashPass).toBeTypeOf("string");
        expect(hashPass).not.toEqual(password);
        expect(verify).toBe(true);
    });

    it("should reject wrong password",async()=>{
        const password = "Amrit@123";
        const wrongPass = "asnjakjdsbsdc@df"

        const hashPass = await hashPassword(password);

        const verify = await verifyPassword(wrongPass,hashPass);

        expect(verify).toBe(false)
    });

    it("should generate different hashes for the same password",async()=>{
        const pass1 = "Amrit@123"
        const pass2 = "Amrit@123";

        const hash1 = await hashPassword(pass1);
        const hash2 = await hashPassword(pass2);

        expect(hash1).not.toEqual(hash2);
    });

    it("should reject broken/invalid hash",async()=>{
        const password = "Amrit@123";

        const hash = "not-a-valid-hash";

        await expect(
            verifyPassword(password,hash)
        ).rejects.toThrow()
    });
})