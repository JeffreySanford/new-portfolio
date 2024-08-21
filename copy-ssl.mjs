import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { from, of, Observable } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'apps', 'backend', '.env', 'ssl');
const destDir = path.join(__dirname, 'apps', 'backend', 'dist', 'ssl');

const files = ['server.key', 'server.crt'];

function compareFiles(src, dest) {
  return new Observable(subscriber => {
    exec(`fc /b "${src}" "${dest}" > nul`, error => {
      if (error) {
        subscriber.next(false); // Files are different or dest doesn't exist
      } else {
        subscriber.next(true); // Files are the same
      }
      subscriber.complete();
    });
  });
}

function copyFile(src, dest) {
  return new Observable(subscriber => {
    fs.copyFile(src, dest, err => {
      if (err) {
        subscriber.error(err);
      } else {
        subscriber.next();
        subscriber.complete();
      }
    });
  });
}

function ensureDirExists(dir) {
  return new Observable(subscriber => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, { recursive: true }, err => {
        if (err) {
          subscriber.error(err);
        } else {
          subscriber.next();
          subscriber.complete();
        }
      });
    } else {
      subscriber.next();
      subscriber.complete();
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
    return ensureDirExists(destDir).pipe(
      mergeMap(() => {
        if (!fs.existsSync(src)) {
          console.error(`Source file not found: ${src}`);
          return of(`Source file not found: ${src}`);
        }
        return compareFiles(src, dest);
      }),
      mergeMap(areSame => {
        if (!areSame) {
          return copyFile(src, dest).pipe(
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