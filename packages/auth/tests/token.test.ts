import { describe, it, expect } from 'vitest'

import { generateToken, verifyToken } from '../src/token'


describe("token", () => {
    const payload = {
        userId: "123",
        role: "client"
    };

    const secret = "amritpandey2314@ass";

    it("should generate a valid token ", () => {
        const options = { expiresIn: 7 };

        const token = generateToken(payload, secret, options);

        expect(token).toBeDefined();
        expect(token).toBeTypeOf("string");
    });

    it("should verify a valid token", () => {

        const options = { expiresIn: 7 };

        const token = generateToken(payload, secret, options);
        const res = verifyToken(token, secret);

        expect(res).toBeDefined();
        expect(res.userId).toBe(payload.userId);
        expect(res.role).toBe(payload.role);

    });

    it("should reject a token with the wrong secret", () => {
        const options = { expiresIn: 7 };

        const token = generateToken(payload, secret, options);
        const wrongSecret = "wrong-secret"; 

        expect(() => {
            verifyToken(token, wrongSecret);
        }).toThrow();
    });

    it("should reject a tampered token", () => {
        const options = { expiresIn: 7 };

        const token = generateToken(payload, secret, options);

        const parts = token.split(".");

        const tamperedPayload = Buffer.from(
            JSON.stringify({
                userId: "123",
                role: "admin"
            })
        ).toString("base64url");

        const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

        expect(() => {
            verifyToken(tamperedToken, secret);
        }).toThrow();
    });

    it("should reject an expired token", () => {
        const expiredToken = generateToken(payload, secret, {
            expiresIn: -1
        });

        expect(() => {
            verifyToken(expiredToken, secret);
        }).toThrow();
    });
})