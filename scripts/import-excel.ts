#!/usr/bin/env ts-node
/**
 * Skeleton script to import CSV data (exported from Excel) into the database using Prisma.
 * WARNING: This is a scaffold. Review and adapt to your Prisma schema before running.
 *
 * Usage: npx ts-node scripts/import-excel.ts path/to/file.csv
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

async function confirm(prompt: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<boolean>((resolve) => {
    rl.question(prompt + ' (type YES to continue) ', (ans) => {
      rl.close();
      resolve(ans === 'YES');
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: npx ts-node scripts/import-excel.ts path/to/file.csv');
    process.exit(2);
  }
  const file = path.resolve(args[0]);
  if (!fs.existsSync(file)) {
    console.error('File not found:', file);
    process.exit(2);
  }

  const csv = fs.readFileSync(file, 'utf8');
  const parsed = Papa.parse(csv, { header: true });
  if (parsed.errors.length) {
    console.warn('CSV parse errors:', parsed.errors);
  }

  console.log(`Parsed ${parsed.data.length} rows. Preview:`);
  console.log(parsed.data.slice(0, 3));

  const ok = await confirm('Proceed to write to database?');
  if (!ok) {
    console.log('Aborted.');
    process.exit(0);
  }

  const prisma = new PrismaClient();
  try {
    for (const row of parsed.data as any[]) {
      // TODO: map CSV columns to Prisma models. Example:
      // await prisma.user.upsert({ where: { email: row.email }, update: { name: row.name }, create: { name: row.name, email: row.email } })
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('Import complete (skeleton). Implement mapping logic before use.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
