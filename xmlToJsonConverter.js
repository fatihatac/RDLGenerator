import fs from 'fs';
import path from 'path';
import xml2json from 'xml2json';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const xmlPath = path.join(__dirname, 'src', 'assets', 'ARACFORM.xml');

const cleanXmlJson = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanXmlJson);
  }

  const cleaned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cleaned[key] = cleanXmlJson(obj[key]);
    }
  }

  // Boş olan $t değerlerini temizle
  if (cleaned.hasOwnProperty('$t') && cleaned['$t'] === '') {
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
   const xmlContent = fs.readFileSync(xmlPath, 'utf8');
   const rawJson = xml2json.toJson(xmlContent, { object: true, alternateTextNode: false });
   const myJson = cleanXmlJson(rawJson);
  const outputDir = path.join(__dirname, 'src', 'templates');
  const outputPath = path.join(outputDir, 'ARACFORM.json');
  fs.writeFileSync(outputPath, JSON.stringify(myJson, null, 2), 'utf8');
  console.log(`JSON saved to ${outputPath}`);
} catch (error) {
  console.error('Error converting XML to JSON:', error);
}
