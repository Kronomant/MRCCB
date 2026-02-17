# Guia de Estilo (Renderer)

## Paleta e Tokens
- Utilize tokens do sistema: `bg`, `bg.muted`, `fg`, `fg.muted`.
- Para estados/ações, prefira `colorPalette` (ex.: `blue`, `teal`, `gray`, `green`).
- Destaques leves: fundos `.50` (ex.: `blue.50`) e textos `.600/.700`.

## Espaçamento e Layout
- Use `p`, `m`, `gap`, `mb` nos níveis `3–6`.
- Estruture com `Flex`, `Stack` e `Box`, evitando CSS manual quando possível.
- Raio padrão: `borderRadius="md|lg"`.

## Componentes
- `Card.Root` + `Card.Body` para blocos de ação/agrupamento.
- `Button` com `variant="solid|outline"` e `colorPalette` semântico.
- `Heading` e `Text` para títulos e descrições, respeitando `size` e hierarquia visual.

## Acessibilidade
- Sempre defina `alt` para imagens e `aria-label` em botões icônicos.
- Evite texto em cores com contraste insuficiente; teste com WCAG AA.
- Tamanho de alvo tocável ≥ 44x44px.

## Animações
- Suaves e discretas: `transition: transform/box-shadow 200–300ms ease`.
- Evite animações intrusivas ou contínuas.

## Responsividade
- Mobile primeiro: direções `Stack` em `column` e mudança para `row` a partir de `md`.
- Dimensões fluidas: `w="100%"`, `maxW` para contêineres.

## Boas Práticas
- Evite cores arbitrárias; use paletas do tema.
- Mantenha consistência de linguagem visual entre páginas.
- Reutilize componentes existentes (Input, PageHeader, DrawerForm) quando aplicável.