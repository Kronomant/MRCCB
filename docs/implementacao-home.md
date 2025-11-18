# Página Inicial (Home)

## Objetivo
Fornecer uma landing page limpa e intuitiva, sem menu lateral, com logo centralizado e dois cards de ações: Reuniões e Prontuários.

## Localização do Código
- Componente: `src/renderer/src/pages/Home/Home.tsx`
- Export: `src/renderer/src/pages/Home/index.ts`
- Rotas: `src/renderer/src/routes/AppRoutes.tsx`

## Estrutura
- Layout: `Flex` centralizado, fundo `bg.muted`, espaçamento responsivo com `Stack`.
- Logo: `Image` (SVG) alterna entre `logo.svg` e `white-logo.svg` conforme modo de cor.
- Cards: `Card.Root` com `Card.Body`, ícones `react-icons` (`FiCalendar`, `FiFileText`).
- Ações: Botões com `colorPalette` distinto (`blue` para Reuniões e `teal` para Prontuários).

## Navegação
- `useNavigate()` para rotas:
  - `'/reunioes'` → Gerenciador de Reuniões
  - `'/prontuarios'` → Gerenciador de Prontuários

## Acessibilidade
- `alt` no logo.
- `aria-label` nos botões e `role="region"` nos cards.
- Contraste assegurado por paletas `blue.*` e `teal.*` com fundo claro/escuro.

## Responsividade
- `Stack` muda de `column` (mobile) para `row` (desktop).
- Dimensões do logo proporcionais: `180–240px`.

## Animações
- Transições suaves em hover dos cards: `transform` e `box-shadow` com easing.

## Performance
- SVGs locais otimizados; poucos componentes na árvore → carregamento < 2s.

## Como editar/estender
- Adicionar novos cards duplicando o padrão de `Card.Root` com paleta única.
- Ajustar paletas via `colorPalette` para manter contraste.

## Referências
- Logos: `src/renderer/src/assets/logo.svg`, `src/renderer/src/assets/white-logo.svg`.