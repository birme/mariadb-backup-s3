#! /usr/bin/env node

import { Command } from 'commander';
import { performBackup } from './backup';

const cli = new Command();
cli
  .description('Backup MariaDB database and upload to S3')
  .addHelpText(
    'after',
    'Environment variables:\n  DB_URL: MariaDB connection URL\n' +
      '  AWS_ACCESS_KEY_ID: AWS access key ID\n' +
      '  AWS_SECRET_ACCESS_KEY: AWS secret access key\n' +
      '  AWS_REGION: AWS region\n' +
      '  AWS_SESSION_TOKEN: AWS session token\n'
  )
  .option('--executable <mariadbDumpExec>', 'Path to mariadb-dump executable')
  .argument('<s3Url>', 'S3 URL to upload the backup')
  .action(async (s3Url, options) => {
    try {
      if (!process.env.DB_URL) {
        throw new Error('DB_URL environment variable is required');
      }
      const dbUrl = new URL(process.env.DB_URL);
      if (dbUrl.protocol !== 'mysql:' && dbUrl.protocol !== 'mariadb:') {
        throw new Error('Invalid DB_URL: not a MariaDB URL');
      }
      await performBackup({
        database: dbUrl.pathname.slice(1),
        dbHost: dbUrl.hostname,
        dbPort: dbUrl.port || '3306',
        dbUser: dbUrl.username,
        dbPassword: dbUrl.password,
        dest: s3Url,
        mariaDbExecutable: options.executable
      });
    } catch (err) {
      console.log((err as Error).message);
    }
  });

cli.parseAsync(process.argv);
