class Logger {
    static log(message: string) {
        console.log(`<${new Date().toLocaleString()}> [LOG] ${Logger._getCallerInfo()} -> { ${message} }`);
    }

    static logError(message: string) {
        console.log(`<${new Date().toLocaleString()}> [ERROR] ${Logger._getCallerInfo()} -> { ${message} }`);
    }

    static logErrorAndExit(message: string) {
        console.log(`<${new Date().toLocaleString()}> [ERROR] ${Logger._getCallerInfo()} -> { ${message} }`);
        Deno.exit(-1);
    }

    static _getCallerInfo(): string | undefined {
        const stack: string | undefined = new Error().stack;
        return stack?.split("\n")[3].match(/at (.+)/)?.at(1);
    }
}

export default Logger;
