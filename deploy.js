import ghpages from 'gh-pages';
import { execSync } from 'child_process';

// O anki aktif branch adını alıyoruz
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log(`🚀 Deploying to GitHub Pages from branch: ${currentBranch}...`);

ghpages.publish('dist', {
  branch: 'gh-pages', // Dağıtımın yapılacağı hedef branch
  dest: currentBranch, // Alt klasör ismi (branch adı ile aynı)
  add: true,           // Diğer branch klasörlerini silme, üzerine ekle
}, (err) => {
  if (err) {
    console.error('❌ Deployment error:', err);
  } else {
    console.log(`✅ Successfully deployed to /RDLGenerator/${currentBranch}/`);
  }
});