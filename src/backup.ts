import { join, dirname } from 'node:path';
import { existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { toUrl } from './util';

const DEFAULT_STAGING_DIR = '/tmp/data';

export interface BackupOptions {
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dest: string;
  database?: string;
  stagingDir?: string;
  mariaDbExecutable?: string;
}

export async function performBackup(opts: BackupOptions) {
  const stagingDir = await prepare(opts.stagingDir);
  await runMariaDbBackup({ ...opts, stagingDir });
  await uploadResult(toUrl(opts.dest), stagingDir);
}

export async function prepare(
  stagingDir = DEFAULT_STAGING_DIR
): Promise<string> {
  const jobId = Math.random().toString(36).substring(7);
  const jobDir = join(stagingDir, jobId);
  if (!existsSync(jobDir)) {
    mkdirSync(jobDir, { recursive: true });
  }
  return jobDir;
}

export async function runMariaDbBackup(
  opts: BackupOptions & { stagingDir: string }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const {
      mariaDbExecutable,
      stagingDir,
      dbHost,
      dbPort,
      dbUser,
      dbPassword,
      database
    } = opts;

    const args = createMariaDbBackupArgs(
      dbHost,
      dbPort,
      dbUser,
      dbPassword,
      database
    );
    console.log(args);
    const mariaDbBackup = mariaDbExecutable || 'mariadb-dump';

    const process = spawn(mariaDbBackup, args, {
      cwd: stagingDir
    });
    process.stdout.on('data', (data) => {
      appendFileSync(join(stagingDir, 'backup.sql'), data);
    });
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    process.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`MariaDB backup failed with exit code ${code}`));
      }
    });
  });
}

export function createMariaDbBackupArgs(
  dbHost: string,
  dbPort: string,
  dbUser: string,
  dbPassword: string,
  database?: string
) {
  return [
    `--host=${dbHost}`,
    `--port=${dbPort}`,
    `--user=${dbUser}`,
    `--password=${dbPassword}`,
    database ? database : '--all-databases'
  ];
}

export async function uploadResult(dest: URL, stagingDir: string) {
  console.log(`Uploading backup to ${dest}`);
  if (dest.protocol === 's3:') {
    const { status, stderr } = spawnSync('aws', [
      's3',
      'cp',
      '--recursive',
      stagingDir,
      dest.toString()
    ]);
    if (status !== 0) {
      if (stderr) {
        console.log(stderr.toString());
      }
      throw new Error('Upload failed');
    }
    console.log(`Uploaded backup to ${dest.toString()}`);
  } else {
    throw new Error(`Unsupported protocol for upload: ${dest.protocol}`);
  }
}
