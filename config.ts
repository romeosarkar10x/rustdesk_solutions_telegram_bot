import * as fs from "node:fs";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";
import Logger from "./logger.ts";

interface Config {
    telegramBotToken: string;
    awsRegion: string;
    awsAccessKeyId: string;
    awsAccessKeySecret: string;
    awsInstanceId: string;
    host: string;
    port: number;
    // key: string;
    // cert: string;
}

env({ export: true });

const config: Config = (() => {
    if (!Deno.env.has("TELEGRAM_BOT_TOKEN")) {
        Logger.logErrorAndExit("Missing `TELEGRAM_BOT_TOKEN` environment variable.");
    }

    if (!Deno.env.has("AWS_REGION")) {
        Logger.logErrorAndExit("Missing `AWS_REGION` environment variable.");
    }

    if (!Deno.env.has("AWS_ACCESS_KEY_ID")) {
        Logger.logErrorAndExit("Missing `AWS_ACCESS_KEY_ID` environment variable.");
    }

    if (!Deno.env.has("AWS_ACCESS_KEY_SECRET")) {
        Logger.logErrorAndExit("Missing `AWS_ACCESS_KEY_SECRET` environment variable.");
    }

    if (!Deno.env.has("HOST")) {
        Logger.logErrorAndExit("Missing `HOST` environment variable.");
    }

    if (!Deno.env.has("PORT")) {
        Logger.logErrorAndExit("Missing `PORT` environment variable.");
    }

    return {
        telegramBotToken: Deno.env.get("TELEGRAM_BOT_TOKEN") as string,
        awsRegion: Deno.env.get("AWS_REGION") as string,
        awsAccessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") as string,
        awsAccessKeySecret: Deno.env.get("AWS_SECRET_ACCESS_KEY") as string,
        awsInstanceId: Deno.env.get("AWS_INSTANCE_ID") as string,
        host: Deno.env.get("HOST") as string,
        port: +(Deno.env.get("PORT") as string),
        // key: fs.readFileSync(`./keys/privkey1.pem`, "ascii"),
        // cert: fs.readFileSync(`./keys/fullchain1.pem`, "ascii"),
    };
})();

export { config };
export type { Config };
