import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const pkgPath = path.join(process.cwd(), 'package.json');
const tauriConfPath = path.join(process.cwd(), 'src-tauri/tauri.conf.json');
const cargoTomlPath = path.join(process.cwd(), 'src-tauri/Cargo.toml');

// 1. Pega a versão principal do package.json
const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const newVersion = pkgData.version;

console.log(`🔄 Sincronizando versão ${newVersion} para os arquivos do Tauri...`);

// 2. Atualiza tauri.conf.json
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
if (tauriConf.version !== newVersion) {
  tauriConf.version = newVersion;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
  console.log('✅ tauri.conf.json atualizado.');
} else {
  console.log('✅ tauri.conf.json já estava na versão correta.');
}

// 3. Atualiza Cargo.toml
let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
const cargoVersionRegex = /^version\s*=\s*".*?"/m;
if (cargoToml.match(cargoVersionRegex)) {
  cargoToml = cargoToml.replace(cargoVersionRegex, `version = "${newVersion}"`);
  fs.writeFileSync(cargoTomlPath, cargoToml);
  console.log('✅ Cargo.toml atualizado.');
}

// 4. Tenta atualizar o Cargo.lock automaticamente
try {
  console.log('⚙️ Atualizando Cargo.lock...');
  // O nome aqui tem que bater com o nome do [package] no Cargo.toml
  execSync('cargo update -p gestao-obra-piedade', { cwd: path.join(process.cwd(), 'src-tauri'), stdio: 'ignore' });
  console.log('✅ Cargo.lock atualizado.');
} catch (e) {
  console.log('⚠️ Aviso: não foi possível atualizar o Cargo.lock. Quando você rodar o próximo build, o Rust atualizará ele automaticamente.');
}

console.log('🎉 Todas as versões foram sincronizadas!');
