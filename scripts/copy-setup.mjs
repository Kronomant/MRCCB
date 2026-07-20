import fs from 'fs';
import path from 'path';

let targetDir = path.join(process.cwd(), 'src-tauri/target');

// Verifica se existe um target customizado no config.toml do cargo
const cargoConfigPath = path.join(process.cwd(), 'src-tauri/.cargo/config.toml');
if (fs.existsSync(cargoConfigPath)) {
  const configContent = fs.readFileSync(cargoConfigPath, 'utf8');
  const targetDirMatch = configContent.match(/target-dir\s*=\s*["']([^"']+)["']/);
  if (targetDirMatch && targetDirMatch[1]) {
    targetDir = targetDirMatch[1];
  }
}

const sourceDir = path.join(targetDir, 'release/bundle/nsis');
const destDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(sourceDir)) {
  const files = fs.readdirSync(sourceDir);
  let found = false;
  for (const file of files) {
    if (file.endsWith('.exe')) {
      fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
      console.log(`✅ Setup copiado com sucesso para a pasta dist: ${file}`);
      found = true;
    }
  }
  if (!found) {
    console.log(`⚠️ Nenhum executável (.exe) encontrado na pasta de build do Tauri: ${sourceDir}`);
  }
} else {
  console.log(`⚠️ Pasta de build do Tauri não encontrada: ${sourceDir}`);
}
