# Check Translated Content MDN

**[CrystalDev](https://crystaldev.org/) is making an effort to translate MDN content to Brazilian Portuguese. This script is part of that effort.**

This script checks the status of a list of URLs for translated content on MDN and updates the TODO.md file.

## How to use

1. Clone this repository

2. Install dependencies

```bash
npm install
```

1. Copy the `.env.example` file to `.env` and fill in the variables:

```bash
cp .env.example .env
```

Make sure to update the `.env` file with the correct value for `LANGUAGE_CODE`.

This is the language code for the language you want to check. For example, if you want to check the status of the Brazilian Portuguese translation, you should use `pt-BR`.

2. Run the script

```bash
npm start
```
