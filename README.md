# Check Translated Content MDN

**[CrystalDev](https://crystaldev.org/) is making an effort to translate MDN content to Brazilian Portuguese. This script is part of that effort.**

This script checks the status of a list of URLs for translated content on MDN and updates a Notion page with the results.
Every time the script runs, it will clear the current Notion page and update it with the updated results.

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

2. Run the script

```bash
npm start
```
