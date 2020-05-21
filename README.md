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
# npm ??? There's currently no build process but gzipping 💎⚡️.

# Deploy
# npm ??? Currently using my old gulp-based AWS publisher
# (https://github.com/robwierzbowski/publisher), but let's build a script with
# less dependencies (s3cmd-based?) before we make it official.
```
