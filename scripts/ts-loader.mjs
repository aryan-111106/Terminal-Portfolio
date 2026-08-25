import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file:')) {
    let targetPath;
    if (specifier.startsWith('file:')) {
      targetPath = fileURLToPath(specifier);
    } else if (context.parentURL) {
      targetPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    } else {
      targetPath = path.resolve(specifier);
    }

    // If targetPath exists as is and is file
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      return nextResolve(specifier, context);
    }

    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', path.sep + 'index.ts', path.sep + 'index.js'];
    for (const ext of extensions) {
      const candidate = targetPath + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return {
          url: pathToFileURL(candidate).href,
          shortCircuit: true
        };
      }
    }
  }

  return nextResolve(specifier, context);
}
