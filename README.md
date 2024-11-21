# Telegram Bot for RustDesk Solutions

This is a Telegram bot built using [Deno](https://deno.land/) and the [grammY framework](https://grammy.dev/). The bot
is designed to manage server tasks, handle user authentication, and provide seamless interaction with RustDesk server
solutions.

## Features

- **Server Management**:
  - Start and stop the EC2 instance for the RustDesk server.
  - Check the server status.
  - View server performance metrics.
- **User Management**:
  - Add and remove authorized users dynamically.
  - Secure authentication using RSA-based UUID signing.
- **General Commands**:
  - Help menu to display all available commands.

---

## Supported Commands

### Server Management

- `/start` - Starts the RustDesk server instance.
- `/stop` - Stops the RustDesk server instance.
- `/status` - Displays the current status of the server.
- `/metrics` - Shows server performance metrics.

### User Management

- `/add` - Adds a user to the bot’s authorized user list (admin only).
- `/remove` - Removes a user from the bot’s authorized user list (admin only).

### General

- `/help` - Lists all available commands with descriptions.

---

## Requirements

- **Deno**: Install Deno from [https://deno.land/](https://deno.land/).
- **RSA Key Pair**: The bot uses RSA-based UUID signing for secure user authentication. Generate an RSA key pair using
  OpenSSL or a similar tool.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/romeosarkar10x/rustdesk_solutions_telegram_bot.git
   cd rustdesk_solutions_telegram_bot
   ```

2. Install Deno if not already installed:
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

3. Set up your environment:
   - Create a `.env` file with the following variables:
     ```env
     TELEGRAM_BOT_TOKEN=<Your Telegram Bot Token>
     RSA_PUBLIC_KEY=<Path to RSA Public Key>
     ```

4. Install dependencies:
   ```bash
   deno task install
   ```

---

## Running the Bot

To start the bot, simply run:

```bash
deno task dev
```

The bot will automatically set up the webhook for you on port `443`. Ensure your server is accessible publicly and has a
valid SSL certificate.

---

## Authentication Flow

1. The bot generates a unique UUID for authentication.
2. Users sign the UUID using their private RSA key and send the signature to the bot.
3. The bot verifies the signature using the corresponding public RSA key.
4. If the signature is valid, the user is added to the authorized list.

---

## Development Notes

- This project uses Deno for a lightweight and secure runtime.
- The bot framework is built on grammY for seamless interaction with the Telegram Bot API.
- For security, ensure the RSA keys are kept private and never hardcoded into the codebase.

---

## Future Enhancements

- Add support for multiple server configurations.
- Improve logging and error handling.
- Implement persistent storage for user authentication.

---

Feel free to contribute or raise issues on the
[GitHub repository](https://github.com/romeosarkar10x/rustdesk_solutions_telegram_bot.git)! 😊
