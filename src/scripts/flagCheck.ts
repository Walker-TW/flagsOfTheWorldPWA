import fs from 'fs';
import path from 'path';
import countriesData from '../data/countries.json';

const flagsDir = path.resolve(process.cwd(), 'public/nationalFlags');
const countries = Object.entries(countriesData);

const missing: string[] = [];
const found: string[] = [];

for (const [key, country] of countries) {
  const flagPath = path.join(flagsDir, `${country.flagId}.svg`);
  
  if (fs.existsSync(flagPath)) {
    found.push(`✅ ${key} → ${country.flagId}.svg`);
  } else {
    missing.push(`❌ ${key} (${country.name}) → ${country.flagId}.svg NOT FOUND`);
  }
}

console.log('\n=== FLAG CHECK RESULTS ===\n');
console.log(`✅ Found:  ${found.length}`);
console.log(`❌ Missing: ${missing.length}`);
console.log(`📦 Total:  ${countries.length}`);

if (missing.length > 0) {
  console.log('\n=== MISSING FLAGS ===\n');
  missing.forEach(m => console.log(m));
}

// Also check for SVGs in the folder that have NO matching country
const svgFiles = fs.readdirSync(flagsDir).filter(f => f.endsWith('.svg'));
const usedFlagIds = new Set(countries.map(([, c]) => `${c.flagId}.svg`));
const orphaned = svgFiles.filter(f => !usedFlagIds.has(f));

if (orphaned.length > 0) {
  console.log('\n=== SVGs WITH NO MATCHING COUNTRY ===\n');
  orphaned.forEach(f => console.log(`⚠️  ${f}`));
}