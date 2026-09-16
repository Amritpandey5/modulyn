import { describe, expect, it, afterEach } from 'vitest'
import { loadConfig } from '../src/index.js'
import { writeFileSync, unlinkSync } from 'node:fs'

describe("loadConfig", () => {
    afterEach(() => {
        delete process.env.MODULYN_TEST_VALUE;
        delete process.env.MODULYN_DEFAULT_VALUE;
        delete process.env.MODULYN_REQUIRED_VALUE;
        delete process.env.MODULYN_IMMUTABLE_VALUE;
        delete process.env.MODULYN_ENV_VALUE;
    })

    it("should load environment variables", () => {
        process.env.MODULYN_TEST_VALUE = "Hello Modulyn";

        const config = loadConfig();

        expect(config.MODULYN_TEST_VALUE).toBe("Hello Modulyn");
    })

    it("should return undefined for missing environment variables", () => {
        const config = loadConfig();

        expect(config.MODULYN_TEST_VALUE).toBeUndefined();
    })

    it("should throw when a required environment variable is missing", () => {
        expect(() =>
            loadConfig({
                required: ["MODULYN_REQUIRED_VALUE"],
            })
        ).toThrow(
            'Required environment variable "MODULYN_REQUIRED_VALUE" is missing'
        );
    });

    it("should use default values when the environment variable are missing", () => {
        const config = loadConfig({
            defaults: {
                MODULYN_DEFAULT_VALUE: "Default Value"
            },
        })

        expect(config.MODULYN_DEFAULT_VALUE).toBe("Default Value")
    })

    it("should prefer environment variables over default values", () => {
        process.env.MODULYN_DEFAULT_VALUE = "Environment Value";
        const config = loadConfig({
            defaults: {
                MODULYN_DEFAULT_VALUE: "Default Value"
            }
        })

        expect(config.MODULYN_DEFAULT_VALUE).toBe("Environment Value")
    })

    it("should treat an empty value as missing", () => {
        process.env.MODULYN_REQUIRED_VALUE = "";

        expect(() =>
            loadConfig({
                required: ["MODULYN_REQUIRED_VALUE"],
            })
        ).toThrow(
            'Required environment variable "MODULYN_REQUIRED_VALUE" is missing'
        );
    });

    it("should return an immutable configuration object", () => {
        const config = loadConfig({
            defaults: {
                MODULYN_IMMUTABLE_VALUE: "Original Value",
            },
        });

        expect(Object.isFrozen(config)).toBe(true);
    });

    it("should load variables from a .env file", () => {
        writeFileSync(
            ".env",
            "MODULYN_ENV_VALUE=Loaded From Env File"
        );

        const config = loadConfig();

        expect(config.MODULYN_ENV_VALUE).toBe("Loaded From Env File");

        unlinkSync(".env");
    });

    it("should prefer environment variables over .env values", () => {
        writeFileSync(
            ".env",
            "MODULYN_ENV_VALUE=Value From Env File"
        );

        process.env.MODULYN_ENV_VALUE = "Value From Process Env";

        const config = loadConfig();

        expect(config.MODULYN_ENV_VALUE).toBe("Value From Process Env");

        unlinkSync(".env");
    });

    it("should load variables from a custom env file", () => {
        writeFileSync(
            "custom.env",
            "MODULYN_CUSTOM_VALUE=Loaded From Custom Env File"
        );

        const config = loadConfig({
            envFile: "custom.env",
        });

        expect(config.MODULYN_CUSTOM_VALUE).toBe(
            "Loaded From Custom Env File"
        );

        unlinkSync("custom.env");
    });
})