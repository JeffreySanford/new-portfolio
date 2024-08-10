const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { from, of } = require('rxjs');
const { map, mergeMap, catchError } = require('rxjs/operators');

const srcDir = path.join(__dirname, 'apps', 'backend', '.env', 'ssl');
const destDir = path.join(__dirname, 'apps', 'backend', 'dist', 'ssl');

const files = ['server.key', 'server.crt'];

function compareFiles(src, dest) {
  return new Promise((resolve, reject) => {
    exec(`fc /b "${src}" "${dest}" > nul`, (error) => {
      if (error) {
        resolve(false); // Files are different or dest doesn't exist
      } else {
        resolve(true); // Files are the same
      }
    });
  });
}

function copyFile(src, dest) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function ensureDirExists(dir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

from(files).pipe(
  mergeMap(file => {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    console.log(`Checking file: ${file}`);
    console.log(`Source path: ${src}`);
    console.log(`Destination path: ${dest}`);
    return from(ensureDirExists(destDir)).pipe(
      mergeMap(() => {
        if (!fs.existsSync(src)) {
          console.error(`Source file not found: ${src}`);
          return of(`Source file not found: ${src}`);
        }
        return from(compareFiles(src, dest));
      }),
      mergeMap(areSame => {
        if (!areSame) {
          return from(copyFile(src, dest)).pipe(
            map(() => `Copied ${src} to ${dest}`),
            catchError(err => of(`Failed to copy ${src} to ${dest}: ${err}`))
          );
        } else {
          return of(`${dest} is up to date`);
        }
      })
    );
  })
).subscribe({
  next: msg => console.log(msg),
  error: err => {
    console.error('Script failed:', err);
    process.exit(1);
  },
  complete: () => {
    console.log('Script completed successfully');
    process.exit(0);
  }
});