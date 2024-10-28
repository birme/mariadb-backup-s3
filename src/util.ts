import path from 'node:path';

export function toUrl(url: string) {
  return url.match(/^[a-z0-9]+:.*/)
    ? new URL(url)
    : new URL(`file://${path.resolve(url)}`);
}

export function toLocalDir(url: URL) {
  if (!url.protocol || url.protocol === 'file:') {
    return path.dirname(url.pathname);
  } else {
    throw new Error('Invalid URL: not a file URL');
  }
}
