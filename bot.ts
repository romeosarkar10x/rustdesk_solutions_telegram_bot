import * as Telegram from "https://deno.land/x/grammy@v1.32.0/mod.ts";
import { Config } from "./config.ts";
import * as AWS from "./aws.ts";
import Logger from "./logger.ts";

const authorizedUserIds = [];
authorizedUserIds.push();

class Bot {
    _awsClient: AWS.Client;
    _telegramBot: Telegram.Bot;
    _username: Promise<string | null>;
    _init: Promise<void>;
    _config: Config;

    constructor(config: Config) {
        this._config = config;
        this._awsClient = new AWS.Client(config);
        this._telegramBot = new Telegram.Bot(config.telegramBotToken);
        this._username = this._getUsername();
        this._username.then((value: string | null): void => {
            console.log(value);
        });

        this._init = this._telegramBot.init();
        this._init.then(this._onInit.bind(this));
    }
    _onInit(this: Bot) {
        /* webhook handler */
        console.log(`https://${this._config.host}`);
        // this._telegramBot.api.setWebhook(`https://${this._config.host}`);
        Deno.serve({
            port: this._config.port,
        }, this._handler.bind(this));

        this._telegramBot.on("message", async (message): Promise<void> => {
            console.log("message");
            const chat = message.chat;
            const type = chat.type;

            const text = message.message.text;

            if (text === undefined) {
                return;
            }

            console.log(text);
            const chatId: number = message.chatId;
            const html: string | null = await this._reply(text, type === "private");

            if (html === null) {
                return;
            }

            this._telegramBot.api.sendMessage(chatId, html, { parse_mode: "HTML" });
        });
    }

    _handler(req: Request): Response {
        console.log("hit");
        if (req.method !== "POST") {
            return new Response(null, {
                status: 404,
            });
        }

        const url = new URL(req.url);

        if (url.pathname !== "/") {
            return new Response(null, {
                status: 404,
            });
        }
        req.json().then(this._update.bind(this)).catch((e) => {
            if (e instanceof Error) {
                Logger.log(e.message);
            }
        });

        return new Response(null, {
            status: 200,
        });
    }

    _update(body: any): void {
        console.log(body);
        this._telegramBot.handleUpdate(body);
    }
    _help(): string {
        return `<b>Available Commands:</b>

<ul>
  <li><b>/start</b> - Starts the EC2 instance for the RustDesk server and updates the DNS records if required.</li>
  <li><b>/stop</b> - Stops the EC2 instance to conserve resources.</li>
  <li><b>/status</b> - Provides the current status of the EC2 instance (e.g., running or stopped).</li>
  <li><b>/metrics</b> - Displays server performance metrics and statistics.</li>
  <li><b>/help</b> - Lists all available commands and their descriptions.</li>
  <li><b>/key</b> - [Functionality description required]</li>
  <li><b>/</b> - [Functionality description required]</li>
</ul>

<i>Use the commands as needed to manage the server efficiently.</i>
`;
    }

    async _start(): Promise<string> {
        try {
            await this._awsClient.startInstance();
            return "[SUCCESS]";
        } catch (e) {
            if (e instanceof Error) {
                return `[ERROR] -> { ${e?.message}}`;
            }
        }

        return "[ERROR]";
    }

    async _stop(): Promise<string> {
        try {
            await this._awsClient.stopInstance();
        } catch (e) {
            if (e instanceof Error) {
                return `[ERROR] -> { ${e.message} }`;
            }
        }

        return "[ERROR]";
    }

    async _status(): Promise<string> {
        try {
            const output: AWS.InstanceDescription = await this._awsClient.describeInstance();
        } catch (e) {
            if (e instanceof Error) {
                return `[ERROR] -> { ${e.message} }`;
            }
        }

        return "hello";
    }

    _metrics() {
        return "[metrics]";
    }

    _invalid() {
        return "I'm sorry, I didn't recognize that command. Please check /help for a list of valid commands.";
    }

    async _reply(text: string, isPrivate: boolean): Promise<string | null> {
        if (isPrivate) {
            return this._replyPrivate(text);
        }

        // console.log(isPrivate);
        // function parse(text: string) {
        // let ret = {
        // command: "",
        // handle: "",
        // invalidHandle: false,
        // };

        // if (text[0] !== "/") {
        // return ret;
        // }

        // let flagHandle = false;

        // for (let i = 1; i < text.length; i++) {
        // if (text[i] == "@") {
        // flagHandle = true;
        // } else {
        // if (flagHandle) {
        // if (
        // !(("a" <= text[i] && text[i] <= "z") ||
        // ("0" <= text[i] && text[i] <= "9") || text[i] == "_")
        // ) {
        // ret.invalidHandle = true;
        // break;
        // }

        // ret.handle += text[i];
        // } else {
        // ret.command += text[i];
        // }
        // }
        // }

        // console.log(ret);
        // return ret;
        // }

        // const { command, handle, invalidHandle } = parse(text);

        // if (isPrivate && handle !== "") {
        // return "";
        // }

        // if (command === "") {
        // return "";
        // }

        // if (!isPrivate && (invalidHandle || handle !== config.botUserName)) {
        // return "";
        // }

        // switch (command) {
        // case "help":
        // return this._help();

        // case "start":
        // return await this._start();

        // case "stop":
        // return await this._stop();

        // case "status":
        // return await this._status();

        // case "metrics":
        // return this._metrics();
        // }

        return this._invalid();
    }

    async _replyPrivate(text: string): Promise<string | null> {
        if (text.length == 0 || text.at(0) !== "/") {
            return null;
        }

        const command: string = text.substring(1);

        switch (command) {
            case "help":
                return this._help();

            case "start":
                return await this._start();

            case "stop":
                return await this._stop();

            case "status":
                return await this._status();

            case "metrics":
                return this._metrics();
        }

        return this._invalid();
    }
    async _getUsername(): Promise<string> {
        return (await this._telegramBot.api.getMe()).username;
    }
}

export default Bot;
