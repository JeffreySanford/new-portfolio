/**
 * Retrieves the HTTPS options for the application.
 * 
 * @returns The HTTPS options object containing the key and certificate.
 * key: The key file. locat is in the secrets folder.
 * cert: The certificate file. located in the secrets folder.
 * @throws An error if the key or certificate file is not found.
 * 
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

export function getHttpsOptions() {
  const envPath = join(__dirname, '..', '.env');
  const keyPath = join(__dirname, '..', 'secrets', 'key.pem');
  const certPath = join(__dirname, '..', 'secrets', 'cert.pem');

  // Check for the presence of the .env file
  if (existsSync(envPath)) {
    console.log('.env file is present');
  } else {
    console.log('.env file is not present');
  }

  // Check for the presence of the key.pem file
  if (existsSync(keyPath)) {
    console.log('key.pem file is present');
  } else {
    console.log('key.pem file is not present');
  }

  // Check for the presence of the cert.pem file
  if (existsSync(certPath)) {
    console.log('cert.pem file is present');
  } else {
    console.log('cert.pem file is not present');
  }

  return {
    key: existsSync(keyPath) ? readFileSync(keyPath) : undefined,
    cert: existsSync(certPath) ? readFileSync(certPath) : undefined,
  };
}