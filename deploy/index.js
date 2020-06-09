// Compress and deploy files to AWS s3.
// Must `brew install awscli` and configure AWS creds first.
const { execSync } = require('child_process');
const { extname, relative } = require('path');
const recursiveReaddir = require('recursive-readdir');

const distDir = './dist';
const bucket = 'robwierzbowski.com';

const hour = 3600;
const day = hour * 24;
const farFuture = `max-age=${day * 365}`;
const nearFuture = `max-age=${hour * 2}`;
const noCache = 'no-cache';

// TEMP: commenting out file types that I'm not using yet
const types = [
  // Near future
  // {
  //   ext: 'ico',
  //   contentType: 'image/x-icon',
  //   cacheControl: nearFuture,
  //   gzip: true,
  // },

  // Far future
  // {
  //   ext: 'css',
  //   contentType: 'text/css',
  //   cacheControl: farFuture,
  //   gzip: true,
  // },
  // {
  //   ext: 'js',
  //   contentType: 'application/javascript',
  //   cacheControl: farFuture,
  //   gzip: true,
  // },
  // {
  //   ext: 'gif',
  //   contentType: '',
  //   cacheControl: farFuture,
  //   gzip: false,
  // },
  // {
  //   ext: 'jpeg',
  //   contentType: '',
  //   cacheControl: farFuture,
  //   gzip: false,
  // },
  // {
  //   ext: 'jpg',
  //   contentType: '',
  //   cacheControl: farFuture,
  //   gzip: false,
  // },
  // {
  //   ext: 'png',
  //   contentType: '',
  //   cacheControl: farFuture,
  //   gzip: false,
  // },
  {
    ext: 'svg',
    contentType: '',
    cacheControl: farFuture,
    gzip: true,
    // gzip: true,
  },
  // {
  //   ext: 'webp',
  //   contentType: '',
  //   cacheControl: farFuture,
  //   gzip: false,
  // },
  {
    ext: 'woff',
    contentType: 'font/woff',
    cacheControl: farFuture,
    gzip: false,
  },
  {
    ext: 'woff2',
    contentType: 'font/woff2',
    cacheControl: farFuture,
    gzip: false,
  },

  // No cache
  {
    ext: 'html',
    contentType: 'text/html',
    cacheControl: noCache,
    gzip: true,
  },
  // {
  //   ext: 'json',
  //   contentType: '',
  //   cacheControl: noCache,
  //   gzip: true,
  // },
  // {
  //   ext: 'txt',
  //   contentType: '',
  //   cacheControl: noCache,
  //   gzip: true,
  // },
  // {
  //   ext: 'pdf',
  //   contentType: '',
  //   cacheControl: noCache,
  //   gzip: false,
  // },
];

const clean = () => {
  console.log(`Removing ${distDir}`);
  execSync(`rm -r ${distDir}`);
};

// TODO: Do we need to add any filtering?
const copy = () => {
  console.log(`Copying source files to ${distDir}`);
  execSync(`mkdir ${distDir}`);
  execSync(`cp -r ./src/** ${distDir}`);
};

const zopfli = () => {
  types
    .filter(({ gzip }) => gzip)
    .forEach(type => {
      console.log(`Compressing ${type.ext} files`);
      execSync(`find ${distDir} -iname '*.${type.ext}' -exec zopfli -i50 {} \\; -exec mv {}.gz {} \\; `);
    });
};

const publish = () => {
  recursiveReaddir(distDir, (err, files) => {
    if (err) { throw err; }

    console.log(`\nDeploying site to ${bucket}`);

    files.forEach(file => {
      const deployPath = relative(distDir, file);
      const ext = extname(file);
      const options = types.find(type => ext === `.${type.ext}`);

      // Move on if the type has no deploy configuration (e.g., if a system or
      // log file gets in there).
      if (typeof options === 'undefined') { return; }

      const command = [
        'aws',
        's3api',
        'put-object',
        `--bucket ${bucket}`,
        `--key ${deployPath}`,
        `--body ${file}`,
        options.cacheControl && `--cache-control ${options.cacheControl}`,
        options.contentType && `--content-type ${options.contentType}`,
        options.gzip && `--content-encoding gzip`,
      ].filter(Boolean).join(' ');

      console.log(`Deploying ${deployPath}`);
      console.log(`via: ${command}`);
      execSync(command);
      console.log(`...done.\n`);
    });
  });
};

clean();
copy();
zopfli();
publish();
