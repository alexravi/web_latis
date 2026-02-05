
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../src/assets/cities.json');
const outputPath = path.join(__dirname, '../src/assets/cities_lite.json');

console.log('Reading cities.json...');

try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const cities = JSON.parse(rawData);

    console.log(`Original count: ${cities.length}`);

    const optimized = cities.map(city => ({
        id: city.id,
        name: city.name,
        state_name: city.state_name,
        country_name: city.country_name,
        country_code: city.country_code
    }));

    fs.writeFileSync(outputPath, JSON.stringify(optimized));

    const originalSize = fs.statSync(inputPath).size / 1024 / 1024;
    const newSize = fs.statSync(outputPath).size / 1024 / 1024;

    console.log(`Optimized saved to: ${outputPath}`);
    console.log(`Original Size: ${originalSize.toFixed(2)} MB`);
    console.log(`New Size: ${newSize.toFixed(2)} MB`);

} catch (err) {
    console.error('Error processing cities:', err);
}
