import fs from 'fs';
import path from 'path';
import xml2json from 'xml2json';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');
const outputDir = path.join(__dirname, 'src', 'templates');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const cleanXmlJson = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanXmlJson);
  }

  const cleaned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleaned[key] = cleanXmlJson(obj[key]);
    }
  }

  // Boş olan $t değerlerini temizle
  if (Object.prototype.hasOwnProperty.call(cleaned, '$t') && cleaned['$t'] === '') {
    delete cleaned['$t'];
  }

  // Eğer sadece $t kaldıysa (ve doluysa), değeri doğrudan döndür
  const keys = Object.keys(cleaned);
  if (keys.length === 1 && keys[0] === '$t') {
    return cleaned['$t'];
  }

  return cleaned;
};

try {
    const xmlFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.xml'));

    xmlFiles.forEach(file => {
        const xmlPath = path.join(assetsDir, file);
        const jsonFile = file.replace('.xml', '.json');
        const outputPath = path.join(outputDir, jsonFile);

        try {
            const xmlContent = fs.readFileSync(xmlPath, 'utf8');
            const rawJson = xml2json.toJson(xmlContent, { object: true, alternateTextNode: false });
            const myJson = cleanXmlJson(rawJson);
            fs.writeFileSync(outputPath, JSON.stringify(myJson, null, 2), 'utf8');
            console.log(`JSON saved to ${outputPath}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err.message);
        }
    });
} catch (error) {
    console.error('Error reading assets directory:', error);
}
