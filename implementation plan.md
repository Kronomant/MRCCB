# Plano de Migração: Electron → Tauri (Revisado)

> **PWA descartada como requisito funcional** → O servidor HTTP Express + WebSocket (maior bloqueador) pode ser completamente removido.

## 🟢 Status Atual: Migração Concluída com Sucesso! 🎉

**Todas as Fases Finalizadas:**
- **Fase 1 (Limpeza):** Servidor HTTP e WebSockets removidos. Lógica de broadcast eliminada.
- **Fase 2 (Setup Tauri):** Instalação da toolchain Rust, configuração do `src-tauri` (`Cargo.toml`, `tauri.conf.json`, `build.rs`), ícones do aplicativo gerados.
- **Fase 3 (Backend Rust):** 100% da camada de dados reescrita em Rust com `rusqlite` e `DbState` (`Mutex<Connection>`). Todos os 9 repositórios, migrations idempotentes e comandos mapeados.
- **Fase 4 & 5 (Frontend & Settings):** Substituição total de `window.electron.ipcRenderer.invoke` por `@tauri-apps/api/core` `invoke()`. Diálogos migrados para `@tauri-apps/plugin-dialog`.
- **Fase 6 (Limpeza de Arquivos Legados & Build Config):** Removidas pastas legadas do Electron (`src/main/`, `src/preload/`, `electron.vite.config.ts`, `electron-builder.yml`, `tsconfig.node.json`), limpas dependências do Electron no `package.json`, criado `vite.config.ts` raiz.
- **Validação:** Compilação Rust (`cargo check`) passou sem erros. Build do frontend (`vite build`) e verificação de tipos (`tsc --noEmit`) 100% limpos.

---

## Arquitetura Atual vs. Proposta

```
ELECTRON (atual)                       TAURI (proposto)
─────────────────────────────          ──────────────────────────────────
src/main/ (Node.js)                    src-tauri/ (Rust)
  ├── index.ts                           ├── src/
  ├── config.ts                          │   ├── main.rs
  ├── database/                          │   ├── config.rs
  │   ├── db.ts (better-sqlite3)         │   ├── database/
  │   ├── migrations/ (5 files)          │   │   ├── db.rs (rusqlite)
  │   └── *Repository.ts (9 files)       │   │   ├── migrations.rs
  ├── ipc/ (8 handlers)                  │   │   └── *_repository.rs
  ├── server/ ← REMOVER                  │   ├── commands/ (8 módulos)
  └── windows/                           │   └── lib.rs
                                         ├── Cargo.toml
src/preload/ (contextBridge)            └── tauri.conf.json
  └── index.ts ← REMOVER
                                       src/renderer/ (React - praticamente igual)
src/renderer/                            ├── src/
  └── src/services/*.ts                  │   └── services/*.ts ← trocar invoke
    → window.electron.ipcRenderer          → @tauri-apps/api/core invoke()
```

---

## O Que Será Removido

| Arquivo/Módulo | Motivo |
|---|---|
| `src/main/server/httpServer.ts` | Servia a PWA — descartada |
| `src/main/server/routes/` (6 arquivos) | Routes Express da API REST para PWA |
| `src/preload/index.ts` | Específico do Electron (contextBridge) |
| `electron.vite.config.ts` | Substituído por `vite.config.ts` standalone |
| `electron-builder.yml` | Substituído por `tauri.conf.json` |
| `src/pwa/` | Mantido no repositório mas não compilado/distribuído |
| Dependências: `express`, `ws`, `cors`, `@electron-toolkit/*`, `electron`, `electron-vite`, `electron-builder`, `electron-rebuild` | Não necessárias no Tauri |
| 34 chamadas `broadcast()` em 6 arquivos IPC | Sem mais PWA, sem broadcasting |

---

## Mapeamento Completo de IPC Channels → Tauri Commands

### Reunions (5 channels)
| Channel Electron | Tauri Command |
|---|---|
| `reunion:create` | `reunion_create` |
| `reunion:getById` | `reunion_get_by_id` |
| `reunion:all` | `reunion_get_all` |
| `reunion:update` | `reunion_update` |
| `reunion:delete` | `reunion_delete` |

### Prontuários (6 channels)
| Channel Electron | Tauri Command |
|---|---|
| `prontuario:getAll` | `prontuario_get_all` |
| `prontuario:getById` | `prontuario_get_by_id` |
| `prontuario:getByNumber` | `prontuario_get_by_number` |
| `prontuario:getByIds` | `prontuario_get_by_ids` |
| `prontuario:getByUnity` | `prontuario_get_by_unity` |
| `prontuario:getActive` | `prontuario_get_active` |
| `prontuario:create` | `prontuario_create` |
| `prontuario:update` | `prontuario_update` |
| `prontuario:delete` | `prontuario_delete` |

### Atendimentos (4 channels)
| Channel Electron | Tauri Command |
|---|---|
| `atendimento:createOrUpdate` | `atendimento_create_or_update` |
| `atendimento:getByReunion` | `atendimento_get_by_reunion` |
| `atendimento:update` | `atendimento_update` |
| `atendimento:delete` | `atendimento_delete` |

### Cash Register (12 channels)
| Channel Electron | Tauri Command |
|---|---|
| `cashRegister:create` | `cash_register_create` |
| `cashRegister:getByReunion` | `cash_register_get_by_reunion` |
| `cashRegister:getById` | `cash_register_get_by_id` |
| `cashRegister:updateOpening` | `cash_register_update_opening` |
| `cashRegister:close` | `cash_register_close` |
| `cashRegister:reopen` | `cash_register_reopen` |
| `cashTicket:create` | `cash_ticket_create` |
| `cashTicket:listByReunion` | `cash_ticket_list_by_reunion` |
| `cashTicket:update` | `cash_ticket_update` |
| `cashTicket:delete` | `cash_ticket_delete` |
| `cashTicket:totalByReunion` | `cash_ticket_total_by_reunion` |
| `cashExpense:create` | `cash_expense_create` |
| `cashExpense:listByReunion` | `cash_expense_list_by_reunion` |
| `cashExpense:update` | `cash_expense_update` |
| `cashExpense:delete` | `cash_expense_delete` |
| `cashExpense:totalByReunion` | `cash_expense_total_by_reunion` |
| `cashExpense:totalsByCategory` | `cash_expense_totals_by_category` |

### Outros (9 channels)
| Channel Electron | Tauri Command |
|---|---|
| `prontuarioDelivery:*` (6 channels) | `delivery_*` |
| `treatment:*` (2 channels) | `treatment_*` |
| `unity:*` (5 channels) | `unity_*` |
| `settings:get` | `settings_get` |
| `settings:select-db-folder` | `settings_select_db_folder` |
| `settings:save-db-path` | `settings_save_db_path` |
| `server:getUrl` | **REMOVER** (não existe mais servidor) |
| `server:isDev` | `is_dev` (ou usar env var no frontend) |

---

## Fases de Migração

### Fase 1 — Limpeza e Preparação (1–2 dias)
1. Remover `src/main/server/` e as chamadas `broadcast()` dos 6 handlers IPC.
2. Remover `startHttpServer()` e `getServerUrl()` do `src/main/index.ts`.
3. Remover `server:getUrl` e `server:isDev` do IPC.
4. Atualizar o `package.json` (remover scripts `pwa:*`).
5. Centralizar todos os `window.electron.ipcRenderer.invoke(...)` em um arquivo `src/renderer/src/libs/tauriInvoke.ts` — facilita a troca em massa.

> [!TIP]
> Esta fase pode ser feita **ainda no Electron** e commitada separadamente. O app continua funcionando normalmente, apenas sem broadcasting para a PWA.

### Fase 2 — Setup Tauri (1 dia)
```bash
# Instalar Rust
winget install Rustlang.Rustup

# Adicionar Tauri CLI
pnpm add -D @tauri-apps/cli

# Inicializar Tauri no projeto
pnpm tauri init
```
Configurar `tauri.conf.json`:
```json
{
  "productName": "Gestão Obra da Piedade",
  "version": "1.3.6",
  "identifier": "com.ccb.gestao",
  "build": { "frontendDist": "../src/renderer/dist" },
  "app": {
    "windows": [{ "width": 1300, "height": 800, "minWidth": 1300, "minHeight": 800 }]
  }
}
```
Adicionar `plugins = ["dialog", "shell"]` no `Cargo.toml`.

### Fase 3 — Backend Rust: Database + Migrations (4–7 dias)
Portar `better-sqlite3` → `rusqlite`:

```toml
# src-tauri/Cargo.toml
[dependencies]
rusqlite = { version = "0.31", features = ["bundled"] }
serde = { version = "1", features = ["derive"] }
tauri = { version = "2", features = [] }
tauri-plugin-dialog = "2"
tauri-plugin-shell = "2"
```

Estrutura do backend Rust:
```
src-tauri/src/
├── main.rs           ← app::run()
├── lib.rs            ← registra todos os commands
├── config.rs         ← loadConfig/saveConfig via app_data_dir
├── database/
│   ├── mod.rs        ← DbState (Mutex<Connection>)
│   ├── migrations.rs ← run_migrations() equivale ao db.ts
│   ├── reunion.rs
│   ├── prontuario.rs
│   ├── atendimento.rs
│   ├── cash_register.rs
│   ├── cash_ticket.rs
│   ├── cash_expense.rs
│   ├── delivery.rs
│   ├── treatment.rs
│   └── unity.rs
└── commands/
    ├── mod.rs
    ├── reunion.rs    ← #[tauri::command] fn reunion_create(...)
    ├── prontuario.rs
    ├── atendimento.rs
    ├── cash.rs
    ├── delivery.rs
    ├── treatment.rs
    ├── unity.rs
    └── settings.rs
```

Exemplo de conversão de um handler:
```rust
// src-tauri/src/commands/reunion.rs
use tauri::State;
use crate::database::{DbState, reunion::*};

#[tauri::command]
pub fn reunion_create(
    data: ReunionData,
    state: State<'_, DbState>,
) -> Result<Reunion, String> {
    let db = state.0.lock().map_err(|e| e.to_string())?;
    create_reunion(&db, data).map_err(|e| e.to_string())
}
```

### Fase 4 — Frontend: trocar IPC calls (1–2 dias)

Criar `src/renderer/src/libs/tauriInvoke.ts` como camada de abstração:
```ts
import { invoke } from '@tauri-apps/api/core'
export { invoke }
```

Alterar cada service:
```ts
// ANTES (Electron)
window.electron.ipcRenderer.invoke('reunion:create', data)

// DEPOIS (Tauri)
import { invoke } from '@tauri-apps/api/core'
invoke<Reunion>('reunion_create', { data })
```

Remover `src/renderer/src/env.d.ts` (tipagem do `window.electron`).

### Fase 5 — Settings: seletor de pasta (0.5 dia)
```ts
// ANTES: ipcRenderer.invoke('settings:select-db-folder')
// DEPOIS:
import { open } from '@tauri-apps/plugin-dialog'
const folder = await open({ directory: true, title: 'Selecione a pasta para o banco de dados' })
```

### Fase 6 — Build config e CI/CD (1 dia)
Substituir `electron-builder.yml` por configuração no `tauri.conf.json` e atualizar o workflow:

```yaml
# .github/workflows/release.yml
jobs:
  release:
    runs-on: windows-2022
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Build and release
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: v__VERSION__
          releaseName: 'v__VERSION__'
          releaseDraft: true
```

---

## Trade-offs Revisados (sem PWA)

| Aspecto | Electron | Tauri | Veredito |
|---|---|---|---|
| Instalador | ~100 MB | ~5–10 MB | ✅ Tauri |
| RAM | ~200 MB | ~50 MB | ✅ Tauri |
| Esforço de migração | — | ~8–13 dias | — |
| Complexidade do backend | Node.js (TS) | Rust | ⚠️ Tauri |
| Manutenção futura | TypeScript puro | Rust + TS | ⚠️ Tauri |
| Servidor HTTP | ~~Necessário~~ Removido | Não necessário | ✅ Tauri |
| Toolchain | Node.js apenas | Node.js + Rust + MSVC | ⚠️ Tauri |

---

## Estimativa de Esforço Revisada

| Fase | Descrição | Esforço |
|---|---|---|
| 1 | Limpeza (remover servidor, broadcast) | 0.5–1 dia |
| 2 | Setup Tauri + Cargo.toml | 0.5–1 dia |
| 3 | Backend Rust (DB + 10 repositories + commands) | **4–7 dias** |
| 4 | Frontend: trocar ~35 IPC calls | 1–2 dias |
| 5 | Plugin dialog (settings) | 0.5 dia |
| 6 | CI/CD | 0.5–1 dia |
| **Total** | | **~7–13 dias** |

> [!NOTE]
> A Fase 3 é o único gargalo real. Alguém com experiência em Rust fica no limite inferior (4 dias); sem experiência Rust, esteja preparado para 2–3 semanas.

---

## Dependências Finais (Tauri)

**Remover do `package.json`:**
```
electron, electron-vite, electron-builder, electron-rebuild
@electron-toolkit/preload, @electron-toolkit/utils, @electron-toolkit/tsconfig
@electron-toolkit/eslint-config-prettier, @electron-toolkit/eslint-config-ts
express, cors, ws
@types/express, @types/cors, @types/ws
better-sqlite3, @types/better-sqlite3
```

**Adicionar:**
```
@tauri-apps/api           ← frontend IPC
@tauri-apps/cli           ← build tool (devDep)
@tauri-apps/plugin-dialog ← seletor de pasta/arquivo
@tauri-apps/plugin-shell  ← openExternal
```
