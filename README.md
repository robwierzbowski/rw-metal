# rw-metal

A close to the metal implementation of my mini-site. What's the minimum I need to pleasantly write and deploy a couple files to the internet?

## Setup

```bash
# Use the specified node version
nvm use

# Install dependencies
npm install

# Develop locally
npm start

# Subset fonts using https://github.com/filamentgroup/glyphhanger
npm start # Make the local development site available to glyphhanger
npm subset path/to/font

# Build for production
# There's currently no build process but gzipping 💎⚡️.

# Deploy
# npm ???
# I'm using my old gulp publisher package to deploy
# (https://github.com/robwierzbowski/publisher), but let's try building a script
# based off the s3cmd tool. Maybe see what zopfli can do over gzip.
```
