import {describe , expect ,it, vi} from 'vitest'
import {createLogger} from "../src/index"


describe("Logger",()=>{
    it("should create a logger",()=>{
        const logger  = createLogger();

        expect(logger).toBeDefined();
        expect(logger.debug).toBeTypeOf("function");
        expect(logger.info).toBeTypeOf("function");
        expect(logger.warn).toBeTypeOf("function");
        expect(logger.error).toBeTypeOf("function");
    })

    it("should log info messages",()=>{
        const spy = vi.spyOn(console,"log").mockImplementation(()=>{});

        const logger = createLogger();

        logger.info("Server Started");

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining("Server Started")
        );

        spy.mockRestore();
    });

    it("should log warning messages",()=>{
        const spy = vi.spyOn(console,"warn").mockImplementation(()=>{});

        const logger = createLogger();

        logger.warn("Database is slow");

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenLastCalledWith(
            expect.stringContaining("Database is slow")
        );

        spy.mockRestore();

    });

    it("should log error messages",()=>{
        const spy = vi.spyOn(console,"error").mockImplementation(()=>{});
        
        const logger = createLogger();

        logger.error("Failed to connect");

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenLastCalledWith(
            expect.stringContaining("Failed to connect")
        );

        spy.mockRestore();
    });

    it("should log debug message when debug level is enable", ()=>{
        const spy = vi.spyOn(console,"debug").mockImplementation(()=>{});

        const logger = createLogger({
            level:"debug"
        });

        logger.debug("Debug messages");

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenLastCalledWith(
            expect.stringContaining("Debug messages")
        );

        spy.mockRestore();
    })

    it("should include metadata", ()=>{
        const spy = vi.spyOn(console,"log").mockImplementation(()=>{});
        const logger = createLogger();

        logger.info("User registered",{
            userId:"123",
            email:"user@example.com"
        });

        expect(spy).toHaveBeenCalledOnce();

        const output = spy.mock.calls[0][0];

        expect(output).toContain("User registered");
        expect(output).toContain("userId");
        expect(output).toContain("123")

        spy.mockRestore();
    })

    it("should use info as the default log level", () => {
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => {});

    const logger = createLogger();

    logger.debug("Debug message");

    expect(debugSpy).not.toHaveBeenCalled();

    debugSpy.mockRestore();
  });

  it("should suppress debug and info when level is warn", () => {
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => {});

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const logger = createLogger({
      level: "warn",
    });

    logger.debug("Debug message");
    logger.info("Info message");
    logger.warn("Warning message");

    expect(debugSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledOnce();

    debugSpy.mockRestore();
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("should include a timestamp", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    const logger = createLogger();

    logger.info("Server started");

    const output = spy.mock.calls[0][0];

    expect(output).toMatch(
      /^\[\d{4}-\d{2}-\d{2}T.*\]/
    );

    spy.mockRestore();
  });


})
