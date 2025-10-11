# Tarefa Atual: Reestruturação do Relacionamento entre Prontuários e Reuniões

**Lembre-se:** Este arquivo é a fonte única da verdade sobre o progresso da tarefa. Mantenha-o atualizado (Critérios de Aceitação, Progresso e Status das Subtarefas, Decisões, Descobertas, Bloqueios, etc etc).

---

## 📋 Descrição Original da Tarefa

O relacionamento de prontuários e reuniões precisa ser revisado como um todo no projeto. O Comportamento deve ser o seguinte: 

Reuniões possuem N prontuários, quando um prontuário é associado a uma reunião ele tem valor de atendimento, cesta básica, pode ser considerado emergencial etc. 
Um prontuário pode estar relacionado a N reuniões pois cada reunião acontece uma vez ao mês e um prontuário pode ser atentido novamente. 

Na tela de prontuários `/c:/Users/Pichau/Documents/Projetos/src/renderer/src/pages/TreatmentManager/TreatmentManager.tsx`  não deve existir a definição de valores, nem de associação de reunião, isso ocorre durante a reunião na tela de detalhes de uma reunião `/c:/Users/Pichau/Documents/Projetos/src/renderer/src/pages/Reunion/Reunion.tsx` 

Essa página deve mostrar a lista de prontuários que existe no sistema e ao acessar os seus detalhes saber se existem pendencias, pois depois da reunião um prontuário retorna e também o histórico dele, em quais reuniões ele foi atendido

---

## 📋 Descrição Macro da Tarefa

**Objetivo Principal:** Reestruturar o sistema para separar claramente a gestão de prontuários (entidades base) da gestão de atendimentos (prontuários associados a reuniões específicas), implementando um relacionamento N:N correto entre prontuários e reuniões.

**Contexto de Negócio:** Esta reestruturação é fundamental para o correto funcionamento do sistema de gestão da Obra da Piedade, permitindo que prontuários sejam reutilizados em múltiplas reuniões mensais, mantendo histórico completo de atendimentos e facilitando o controle de pendências e retornos.

**Critérios de Aceitação:**

- [ ] Prontuários são gerenciados como entidades independentes sem valores ou associações de reunião
- [ ] Atendimentos são criados apenas durante reuniões, associando prontuários a reuniões específicas
- [ ] TreatmentManager exibe lista de prontuários com status de pendências e histórico
- [ ] Reunion permite associar prontuários existentes e definir valores/cestas/flags específicas da reunião
- [ ] Detalhes de prontuário mostram histórico completo de atendimentos em reuniões
- [ ] Sistema mantém integridade referencial entre prontuários, reuniões e atendimentos
- [ ] Todas as tipagens TypeScript são específicas (sem uso de `any`)
- [ ] Interface responsiva e acessível mantendo padrões Chakra UI
- [ ] Validação completa de formulários com Zod schemas
- [ ] Testes de build e lint passando sem erros

---

## 📜 Regras Relevantes (`fetch_rules`)

- Abaixo estão as regras relevantes que devem ser seguidas para a execução da tarefa.
- Caso seja necessário, adicione novas regras que julgar relevantes a medida que for executando as subtarefas.

- Lista de regras relevantes:
  - **PROIBIÇÃO DE `any`:** Todas as tipagens devem ser específicas e bem definidas
  - **Padrões Chakra UI:** Manter consistência visual e de UX com componentes existentes
  - **Validação Zod:** Todos os formulários devem ter validação robusta
  - **Arquitetura Repository:** Manter padrão de repository para acesso a dados
  - **IPC Electron:** Comunicação segura entre frontend e backend via IPC handlers
  - **React Query:** Gerenciamento de estado servidor com cache e invalidação
  - **Responsividade:** Interface deve funcionar em diferentes resoluções

---

## 📝 Plano de Execução / Subtarefas

**Status:** Em Progresso

### Core Features

- [ ] **Subtarefa 0: Replanejar o `current-work.md` após as dúvidas e decisões serem respondidas**

  - **Descrição:** A partir das respostas das dúvidas e decisões, caso houver, deve-se revisitar e redefinir o planejamento das subtarefas do `current-work.md`. As respostas das dúvidas e decisões estão na seção "Dúvidas e decisões" abaixo.
  - **Arquivos Envolvidos:** `@current-work.md`
  - **Dependências:** Nenhuma
  - **Status Atual:** Pronta para execução.

- [ ] **Subtarefa 1: Criar nova entidade Prontuario e atualizar tipagens globais**

  - **Descrição:** Criar interface Prontuario separada de Atendimento, atualizar global.d.ts e corrigir tipagens com `any`
  - **Arquivos Envolvidos:** `@src/renderer/src/types/global.d.ts`
  - **Dependências:** Nenhuma
  - **Tipagens Utilizadas:** 
    - `Prontuario` (nova interface)
    - `Atendimento` (interface atualizada)
    - `Column<T>` (interface existente)
    - `ReunionStatus` (enum existente)
  - **Status Atual:** Pronta para execução

- [ ] **Subtarefa 2: Criar schemas Zod para Prontuario**

  - **Descrição:** Implementar schemas de validação para criação e atualização de prontuários
  - **Arquivos Envolvidos:** `@src/renderer/src/schemas/prontuarioSchema.ts`
  - **Dependências:** Subtarefa 1 concluída
  - **Tipagens Utilizadas:**
    - `CreateProntuario` (type novo)
    - `UpdateProntuario` (type novo)
    - Schemas Zod para validação
  - **Status Atual:** Aguardando Subtarefa 1

- [ ] **Subtarefa 3: Implementar repository e handlers IPC para Prontuario**

  - **Descrição:** Criar repository SQLite e handlers IPC para CRUD de prontuários
  - **Arquivos Envolvidos:** 
    - `@src/main/database/prontuarioRepository.ts`
    - `@src/main/ipc/prontuarioHandlers.ts`
    - `@src/main/index.ts`
  - **Dependências:** Subtarefa 2 concluída
  - **Tipagens Utilizadas:**
    - `Prontuario` (interface)
    - `CreateProntuario` (type)
    - `UpdateProntuario` (type)
  - **Status Atual:** Aguardando Subtarefa 2

- [ ] **Subtarefa 4: Criar serviços frontend para Prontuario**

  - **Descrição:** Implementar serviços de comunicação IPC e hooks React Query para prontuários
  - **Arquivos Envolvidos:**
    - `@src/renderer/src/services/prontuarioService.ts`
    - `@src/renderer/src/hooks/prontuario/useProntuarios.tsx`
    - `@src/renderer/src/hooks/prontuario/useProntuario.tsx`
  - **Dependências:** Subtarefa 3 concluída
  - **Tipagens Utilizadas:**
    - `Prontuario` (interface)
    - `CreateProntuario` (type)
    - `UpdateProntuario` (type)
    - React Query types
  - **Status Atual:** Aguardando Subtarefa 3

- [ ] **Subtarefa 5: Reestruturar TreatmentManager para gerenciar apenas prontuários**

  - **Descrição:** Remover campos de valor/reunião, focar em dados básicos do prontuário, adicionar histórico e status
  - **Arquivos Envolvidos:** `@src/renderer/src/pages/TreatmentManager/TreatmentManager.tsx`
  - **Dependências:** Subtarefa 4 concluída
  - **Tipagens Utilizadas:**
    - `Prontuario` (interface)
    - `Atendimento` (interface para histórico)
    - `Column<Prontuario>` (type para tabela)
    - React Hook Form types
  - **Status Atual:** Aguardando Subtarefa 4

- [ ] **Subtarefa 6: Criar componente de detalhes de prontuário com histórico**

  - **Descrição:** Implementar visualização detalhada com histórico de atendimentos e status de pendências
  - **Arquivos Envolvidos:** `@src/renderer/src/pages/TreatmentManager/ProntuarioDetail.tsx`
  - **Dependências:** Subtarefa 5 concluída
  - **Tipagens Utilizadas:**
    - `Prontuario` (interface)
    - `Atendimento` (interface)
    - Chakra UI component types
  - **Status Atual:** Aguardando Subtarefa 5

- [ ] **Subtarefa 7: Atualizar Atendimento schema e repository**

  - **Descrição:** Ajustar Atendimento para referenciar Prontuario corretamente e remover campos desnecessários
  - **Arquivos Envolvidos:**
    - `@src/renderer/src/schemas/atendimentoSchema.ts`
    - `@src/main/database/atendimentoRepository.ts`
  - **Dependências:** Subtarefa 2 concluída
  - **Tipagens Utilizadas:**
    - `Atendimento` (interface atualizada)
    - `CreateAtendimento` (type atualizado)
    - `UpdateAtendimento` (type atualizado)
  - **Status Atual:** Aguardando Subtarefa 2

- [ ] **Subtarefa 8: Reestruturar página Reunion para gerenciar atendimentos**

  - **Descrição:** Modificar para permitir seleção de prontuários existentes e definição de valores/cestas específicos da reunião
  - **Arquivos Envolvidos:** `@src/renderer/src/pages/Reunion/Reunion.tsx`
  - **Dependências:** Subtarefas 4 e 7 concluídas
  - **Tipagens Utilizadas:**
    - `Prontuario` (interface)
    - `Atendimento` (interface)
    - `RecordType` (interface atualizada)
    - `Column<RecordType>` (type)
  - **Status Atual:** Aguardando Subtarefas 4 e 7

- [ ] **Subtarefa 9: Atualizar hook useRecords**

  - **Descrição:** Ajustar mapeamento entre Atendimento e RecordType para nova estrutura
  - **Arquivos Envolvidos:** `@src/renderer/src/hooks/records/useRecords.tsx`
  - **Dependências:** Subtarefa 8 concluída
  - **Tipagens Utilizadas:**
    - `RecordType` (interface atualizada)
    - `Atendimento` (interface)
    - `Prontuario` (interface)
  - **Status Atual:** Aguardando Subtarefa 8

### Database & Migration

- [ ] **Subtarefa 10: Criar migração de banco de dados**

  - **Descrição:** Implementar script de migração para separar dados existentes em Prontuario e Atendimento
  - **Arquivos Envolvidos:** `@src/main/database/migrations/001_separate_prontuario_atendimento.ts`
  - **Dependências:** Subtarefas 3 e 7 concluídas
  - **Tipagens Utilizadas:**
    - Database migration types
    - SQLite types
  - **Status Atual:** Aguardando Subtarefas 3 e 7

### Testing & Quality

- [ ] **Subtarefa 11: Corrigir erros de lint TypeScript**

  - **Descrição:** Resolver todos os erros de tipagem `any` identificados no código
  - **Arquivos Envolvidos:** 
    - `@src/renderer/src/pages/TreatmentManager/TreatmentManager.tsx`
    - `@src/renderer/src/pages/Reunion/Reunion.tsx`
  - **Dependências:** Subtarefas 5 e 8 concluídas
  - **Tipagens Utilizadas:** Todas as tipagens específicas definidas nas subtarefas anteriores
  - **Status Atual:** Aguardando Subtarefas 5 e 8

- [ ] **Subtarefa 12: Executar build e testes**

  - **Descrição:** Verificar se build passa sem erros e aplicação funciona corretamente
  - **Arquivos Envolvidos:** Projeto completo
  - **Dependências:** Todas as subtarefas anteriores concluídas
  - **Status Atual:** Aguardando conclusão das implementações

### Documentation & Polish

- [ ] **Subtarefa 13: Atualizar documentação e memory bank**

  - **Descrição:** Documentar mudanças arquiteturais e atualizar contexto técnico
  - **Arquivos Envolvidos:** 
    - `@ai/memorybank/technical-context.md`
    - `@ai/memorybank/software-architecture-and-patterns.md`
  - **Dependências:** Subtarefa 12 concluída
  - **Status Atual:** Aguardando conclusão da implementação

---

## 📊 Contexto de Curto Prazo / Notas da Sessão

### Objetivo Imediato

**Próxima Ação:** Iniciar Subtarefa 1 - Criar nova entidade Prontuario e atualizar tipagens globais

### Arquivos Relevantes

- `@src/renderer/src/types/global.d.ts` - Tipagens globais que precisam ser atualizadas
- `@src/renderer/src/pages/TreatmentManager/TreatmentManager.tsx` - Página que precisa ser reestruturada
- `@src/renderer/src/pages/Reunion/Reunion.tsx` - Página que precisa ser reestruturada
- `@src/renderer/src/schemas/treatmentSchema.ts` - Schema que precisa ser ajustado
- `@ai/memorybank/technical-context.md` - Contexto técnico do projeto

### Decisões Técnicas Recentes

- Separar Prontuario (prontuário base) de Atendimento (atendimento em reunião específica)
- Manter padrão Repository existente para nova entidade
- Usar React Query para gerenciamento de estado
- Implementar migração de dados para preservar informações existentes

### Descobertas Importantes

- **Arquitetura:** Sistema atual mistura conceitos de prontuário e atendimento
- **Tipagens:** Múltiplos erros de lint por uso de `any` em customRender
- **Relacionamento:** Necessário implementar N:N entre prontuários e reuniões
- **UX:** TreatmentManager deve focar em gestão de prontuários, não atendimentos
- **Histórico:** Importante manter rastreabilidade de atendimentos por prontuário

### Bloqueios Atuais

Nenhum bloqueio identificado no momento.

### Próximos Passos Após Esta Sessão

1. Implementar nova interface Prontuario em global.d.ts
2. Corrigir tipagens com `any` nas tabelas
3. Criar schemas Zod para validação de prontuários
4. Implementar repository e handlers IPC

### Log de Progresso

- Análise completa da estrutura atual realizada
- Identificados problemas de arquitetura e tipagem
- Plano detalhado de reestruturação criado
- Próximas ações definidas com dependências claras

## Dúvidas e decisões

1. **Estrutura da entidade Prontuario**
   - Opção 1: Apenas campos básicos (id, number, unityId, ministry)
     - Prós: Simplicidade, foco na identificação básica
     - Contras: Pode precisar de campos adicionais futuramente
   - Opção 2: Incluir campos de controle (createdAt, updatedAt, status)
     - Prós: Melhor rastreabilidade e controle
     - Contras: Maior complexidade inicial
   - Opção 3: Incluir campos de pessoa atendida (nome, documento, etc.)
     - Prós: Informações mais completas do prontuário
     - Contras: Maior complexidade, possível impacto em privacidade
   - Resposta: [Aguardando definição do usuário]

2. **Migração de dados existentes**
   - Opção 1: Migração automática preservando todos os dados
     - Prós: Não há perda de informações
     - Contras: Complexidade na migração, possíveis inconsistências
   - Opção 2: Reset do banco com dados limpos
     - Prós: Estrutura limpa e consistente
     - Contras: Perda de dados históricos
   - Opção 3: Migração manual com validação
     - Prós: Controle total sobre a qualidade dos dados
     - Contras: Processo mais demorado
   - Resposta: [Aguardando definição do usuário]

3. **Interface de seleção de prontuários na reunião**
   - Opção 1: Dropdown simples com busca
     - Prós: Interface familiar e simples
     - Contras: Pode ser limitado com muitos prontuários
   - Opção 2: Modal com tabela e busca avançada
     - Prós: Melhor experiência com grandes volumes
     - Contras: Maior complexidade de implementação
   - Opção 3: Autocomplete com criação rápida
     - Prós: Fluxo rápido, permite criar prontuários na hora
     - Contras: Pode gerar inconsistências
   - Resposta: [Aguardando definição do usuário]