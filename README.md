# 🧾 Sistema de Gestão de Reuniões da Obra da Piedade - Congregação Cristã no Brasil

Aplicação desktop criada com **Electron + React + TypeScript**, para facilitar o controle de reuniões, atendimentos e distribuição de cestas básicas.

---

## 📦 Tecnologias

- ⚛️ [React](https://reactjs.org/)
- 🧠 [TypeScript](https://www.typescriptlang.org/)
- 💄 [Chakra UI](https://chakra-ui.com/) — UI simples e acessível
- 📦 [Electron](https://www.electronjs.org/) — Aplicação desktop multiplataforma
- 🛣️ [React Router DOM](https://reactrouter.com/) — Navegação entre telas
- 📁 Dropbox SDK (futuramente) — Integração com armazenamento em nuvem
- 📊 Exportação de relatórios em XLSX/PDF (em breve)

---

## 🧱 Estrutura do Projeto

```
src/
├── main/              # Código principal do Electron
├── preload/           # Comunicação segura entre Electron e Renderer
├── renderer/          # Interface com React
│   ├── src/
│   │   ├── assets/         # Imagens, ícones e recursos visuais
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Hooks customizados
│   │   ├── pages/          # Páginas principais
│   │   ├── routes/         # Definição das rotas
│   │   ├── services/       # Lógica de dados (mocks, api, etc)
│   │   ├── styles/         # Estilos globais
│   │   ├── types/          # Tipagens globais
│   │   ├── utils/          # Funções utilitárias
│   │   ├── App.tsx         # Componente raiz
│   │   ├── env.d.ts        # Tipagem do ambiente
│   │   ├── main.tsx        # Entrada principal do React
│   │   └── index.html      # HTML base
```

---

## 🚀 Como rodar o projeto

1. **Clone o repositório**

```bash
git clone https://github.com/Kronomant/MRCCB/tree/main
cd seu-repo
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o ambiente de desenvolvimento**

```bash
npm run dev
```

4. **Build para produção**

```bash
npm run build
```

---

## 🛠️ Funcionalidades (MVP)

- ✅ Cadastro e listagem de **reuniões**
- ✅ Registro de **atendimentos**
- ✅ Tabela interativa com **busca, filtros e paginação**
- ✅ Interface intuitiva e responsiva com Chakra UI
- 🔜 Exportação de relatórios
- 🔜 Integração com Dropbox
- 🔜 Autenticação (mínima)

---

## 🌿 Estratégia de Branches

Para manter o projeto organizado e com um fluxo de desenvolvimento eficiente, adotamos a seguinte estratégia de branches:

- **`main`**: Contém a versão mais estável e pronta para produção.
- **`dev`**: Branch de desenvolvimento principal. Todas as funcionalidades prontas são integradas aqui antes de irem para `main`.
- **`feature/nome-da-funcionalidade`**: Para cada nova funcionalidade ou melhoria, crie uma branch a partir de `dev`.

### 🔁 Fluxo de trabalho

1. Crie uma nova branch a partir de `dev`:

   ```bash
   git checkout dev
   git pull
   git checkout -b feature/nome-da-funcionalidade
   ```

2. Desenvolva sua funcionalidade.

3. Faça commit e push da branch:

   ```bash
   git add .
   git commit -m "feat: adiciona nome-da-funcionalidade"
   git push origin feature/nome-da-funcionalidade
   ```

4. Abra um **Pull Request** da sua branch para `dev`.

5. Após testes e validação, faremos o merge em `main` quando houver uma versão estável.

---

## ✨ Contribuição

Contribuições são muito bem-vindas! Abra uma issue ou envie um PR com suas ideias ou melhorias. 🙌

---

> Feito com 💙 para apoiar a organização e transparência nas ações sociais da Congregação Cristã no Brasil.
