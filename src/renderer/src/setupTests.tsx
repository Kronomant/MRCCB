/**
 * Mocks centralizados para os testes dos componentes do domínio Reunion.
 *
 * IMPORTANTE: Este arquivo deve ser importado ANTES dos imports dos componentes
 * nos arquivos de teste, pois os `vi.mock` são hoisted pelo Vitest.
 * Basta importá-lo no topo de cada arquivo de teste para ativar todos os mocks aqui definidos.
 *
 * Uso:
 *   import './testMocks';
 */
import { vi } from 'vitest';

// ---------------------------------------------------------------------------
// @chakra-ui/react — mock completo com todos os primitivos utilizados nos testes
// ---------------------------------------------------------------------------

vi.mock('@chakra-ui/react', () => ({
  // Layout
  Box: ({ children, id, w, h, transition, ...props }: any) => (
    <div data-testid={id ?? 'box'} data-w={w} style={{ width: w }} {...props}>
      {children}
    </div>
  ),
  Flex: ({ children, id, ...props }: any) => (
    <div data-testid={id ?? 'flex'} {...props}>
      {children}
    </div>
  ),
  Stack: ({ children }: any) => <div data-testid="stack">{children}</div>,
  SimpleGrid: ({ children }: any) => <div data-testid="simple-grid">{children}</div>,
  Portal: ({ children }: any) => <div>{children}</div>,

  // Typography
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,

  // Form
  Button: ({ children, onClick, colorPalette, colorScheme, size, variant }: any) => (
    <button
      onClick={onClick}
      data-color-palette={colorPalette}
      data-color-scheme={colorScheme}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  ),
  InputGroup: ({ children }: any) => <div data-testid="input-group">{children}</div>,

  // Tag
  Tag: {
    Root: ({ children, colorPalette, ml }: any) => (
      <span data-testid="tag" data-color-palette={colorPalette}>
        {children}
      </span>
    ),
  },

  // Checkbox
  Checkbox: {
    Root: ({ children, checked, onClick, onCheckedChange }: any) => (
      <div
        data-testid="checkbox"
        data-checked={String(!!checked)}
        onClick={(e) => {
          onClick?.(e);
          onCheckedChange?.({ checked: !checked });
        }}
      >
        {children}
      </div>
    ),
    HiddenInput: () => <input type="checkbox" />,
    Control: () => <div data-testid="checkbox-control" />,
    Label: ({ children }: any) => <label>{children}</label>,
  },

  // Progress
  Progress: {
    Root: ({ children }: any) => <div data-testid="progress-root">{children}</div>,
    Track: ({ children }: any) => <div>{children}</div>,
    Range: () => <div data-testid="progress-range" />,
  },

  // Dialog
  DialogRoot: ({ children, open }: any) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogBody: ({ children }: any) => <div data-testid="dialog-body">{children}</div>,
  DialogFooter: ({ children }: any) => <div data-testid="dialog-footer">{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogCloseTrigger: () => <button data-testid="dialog-close-trigger">X</button>,
  DialogBackdrop: () => <div data-testid="dialog-backdrop" />,
  DialogPositioner: ({ children }: any) => <div data-testid="dialog-positioner">{children}</div>,

  // Select
  SelectRoot: ({ children, value, onValueChange }: any) => (
    <div data-testid="select-root" data-value={JSON.stringify(value)}>
      <button
        data-testid="select-trigger"
        onClick={() => onValueChange?.({ value: ['2'] })}
      />
      {children}
    </div>
  ),
  SelectLabel: ({ children }: any) => <label>{children}</label>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValueText: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, item }: any) => <div data-item={item}>{children}</div>,
  SelectItemText: ({ children }: any) => <span>{children}</span>,
  SelectPositioner: ({ children }: any) => <div>{children}</div>,

  // Combobox
  ComboboxRoot: ({ children, value, inputValue }: any) => (
    <div data-testid="combobox-root" data-value={JSON.stringify(value)} data-input-value={inputValue}>
      {children}
    </div>
  ),
  ComboboxInput: ({ placeholder, ...props }: any) => (
    <input data-testid="combobox-input" placeholder={placeholder} {...props} />
  ),
  ComboboxTrigger: () => <button data-testid="combobox-trigger" />,
  ComboboxContent: ({ children }: any) => <div data-testid="combobox-content">{children}</div>,
  ComboboxItem: ({ children, item, onPointerDown }: any) => (
    <div data-testid="combobox-item" data-item={JSON.stringify(item)} onPointerDown={onPointerDown}>
      {children}
    </div>
  ),
  ComboboxItemText: ({ children }: any) => <span>{children}</span>,
  ComboboxItemIndicator: () => <span />,
  ComboboxLabel: ({ children }: any) => <label>{children}</label>,
  ComboboxControl: ({ children }: any) => <div>{children}</div>,
  ComboboxPositioner: ({ children }: any) => <div>{children}</div>,
  ComboboxIndicatorGroup: ({ children }: any) => <div>{children}</div>,
  ComboboxClearTrigger: () => <button data-testid="combobox-clear" />,
}));

// ---------------------------------------------------------------------------
// react-icons/fi — ícones como spans com data-testid
// ---------------------------------------------------------------------------
vi.mock('react-icons/fi', () => ({
  FiSearch: () => <span data-testid="fi-search" />,
  FiFilter: () => <span data-testid="fi-filter" />,
  FiPlus: () => <span data-testid="fi-plus" />,
  FiEye: () => <span data-testid="fi-eye" />,
  FiTrash2: () => <span data-testid="fi-trash" />,
  FiFileText: () => <span data-testid="fi-file-text" />,
  FiDollarSign: () => <span data-testid="icon-dollar" />,
  FiShoppingBag: () => <span data-testid="icon-bag" />,
  FiPackage: () => <span data-testid="icon-package" />,
  FiTrendingUp: () => <span data-testid="icon-trending" />,
  FiUsers: () => <span data-testid="icon-users" />,
  FiGift: () => <span data-testid="icon-gift" />,
  FiClipboard: () => <span data-testid="icon-clipboard" />,
}));

// ---------------------------------------------------------------------------
// @shared/components — componentes compartilhados da aplicação
// ---------------------------------------------------------------------------
vi.mock('@shared/components', () => ({
  Input: ({ value, onChange, label, type, borderRadius, onFocus, 'data-testid': testId }: any) => (
    <input
      data-testid={testId ?? (type === 'number' ? 'number-input' : 'search-input')}
      aria-label={label}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      data-border-radius={borderRadius}
    />
  ),
  CurrencyInput: ({ label, value, onChange }: any) => (
    <input
      data-testid="currency-input"
      aria-label={label}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  ),
  DrawerForm: ({
    children,
    isOpen,
    onClose,
    title,
    primaryLabel,
    secondaryLabel,
    onPrimaryAction,
    headerActions,
  }: any) =>
    isOpen ? (
      <div data-testid="drawer-form">
        <div data-testid="drawer-header">
          <span data-testid="drawer-title">{title}</span>
          {headerActions && <div data-testid="drawer-header-actions">{headerActions}</div>}
          <button data-testid="drawer-close" onClick={onClose}>
            {secondaryLabel}
          </button>
          <button data-testid="drawer-save" onClick={onPrimaryAction}>
            {primaryLabel}
          </button>
        </div>
        <div data-testid="drawer-body">{children}</div>
      </div>
    ) : null,
  PageHeader: ({ children, title, onBack }: any) => (
    <div data-testid="page-header">
      <button data-testid="back-button" onClick={onBack}>
        Voltar
      </button>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  BaseTable: ({ data, columns, isLoading, drawerOpen }: any) => (
    <div data-testid="base-table" data-loading={isLoading} data-drawer-open={drawerOpen}>
      {data.map((row: any) => (
        <div key={row.id} data-testid={`row-${row.id}`}>
          {columns.map((col: any) => (
            <div key={col.accessor ?? col.header}>
              {col.customRender ? col.customRender(row) : row[col.accessor]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

// ---------------------------------------------------------------------------
// @shared/components/ui/tooltip
// ---------------------------------------------------------------------------
vi.mock('./shared/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
}));

// ---------------------------------------------------------------------------
// @reunion/constants
// ---------------------------------------------------------------------------
vi.mock('@reunion/constants', () => ({
  REUNION_LABEL_COLORS: {
    Emergencial: 'red',
    'Somente roupas': 'blue',
  },
}));

// ---------------------------------------------------------------------------
// @ark-ui/react/collection
// ---------------------------------------------------------------------------
vi.mock('@ark-ui/react/collection', () => ({
  createListCollection: vi.fn((opts: any) => opts),
}));

// ---------------------------------------------------------------------------
// date-fns
// ---------------------------------------------------------------------------
vi.mock('date-fns', () => ({
  format: vi.fn(() => '15 de Janeiro de 2024'),
  parseISO: vi.fn((d: string) => d),
}));

vi.mock('date-fns/locale', () => ({
  ptBR: {},
}));

