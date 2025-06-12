# MindLift
MindLift is your daily dose of motivation, mindset mastery, and personal growth. Unlock your full potential with empowering content designed to elevate your thinking and transform your life.

## Environment Setup

Copy `.env.example` to `.env` and fill in the required values before running the application:

```bash
cp .env.example .env
# edit .env with your secrets
```

The configuration loader in `config.js` reads these variables securely and exposes them for use in the project.

## Running the Example

To see the configuration loader in action, run:

```bash
node index.js
```

This script will print some of the loaded configuration values.
