import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import { ModulynError } from "@modulyn/core";

export interface ConfigOptions {
  required?: string[];
  defaults?: Record<string, string>;
  envFile?: string;
}

export type Config = Readonly<Record<string, string | undefined>>;

export function loadConfig(options: ConfigOptions = {}): Config {
  const envFile = options.envFile ?? ".env";

  let fileConfig: Record<string, string> = {};

  try {
    const envFilePath = resolve(envFile);
    const envFileContent = readFileSync(envFilePath, "utf-8");

    fileConfig = parse(envFileContent);
  } catch {
    // .env file is optional.
  }

  const config = {
    ...options.defaults,
    ...fileConfig,
    ...process.env,
  };

  for (const key of options.required ?? []) {
    if (!config[key]) {
      throw new ModulynError(
        "CONFIG_MISSING_REQUIRED",
        `Required environment variable "${key}" is missing`
      );
    }
  }

  return Object.freeze(config);
}