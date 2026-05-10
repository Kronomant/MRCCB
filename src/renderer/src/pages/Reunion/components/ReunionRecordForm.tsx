import {
  Stack,
  Checkbox,
  SelectRoot,
  SelectLabel,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectItemText,
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxControl,
  ComboboxPositioner,
  ComboboxIndicatorGroup,
  ComboboxClearTrigger,
  Portal
} from '@chakra-ui/react'
import { createListCollection } from '@ark-ui/react/collection'
import { CurrencyInput, Input } from '../../../components'
import { RecordType } from '../../../hooks/records/useRecords'
import { LABEL_COLORS } from '../useReunionBehavior'

type CollectionItem = { label: string; value: string }

interface ReunionRecordFormProps {
  record: RecordType
  prontuarioSearch: string
  isNewProntuario: boolean
  selectedUnityId: number | null
  filteredProntuarios: CollectionItem[]
  collection: ReturnType<typeof createListCollection<CollectionItem>>
  unities: Unity[] | undefined
  onRecordChange: (updates: Partial<RecordType>) => void
  onProntuarioSelect: (val: string) => void
  onProntuarioSearch: (val: string) => void
  onUnityChange: (id: number) => void
}

export const ReunionRecordForm = ({
  record,
  prontuarioSearch,
  isNewProntuario,
  selectedUnityId,
  filteredProntuarios,
  collection,
  unities,
  onRecordChange,
  onProntuarioSelect,
  onProntuarioSearch,
  onUnityChange
}: ReunionRecordFormProps) => (
  <Stack gap={6}>
    <ComboboxRoot
      collection={collection}
      value={
        record.prontuarioId
          ? [String(record.prontuarioId)]
          : isNewProntuario && record.prontuarioNumber
            ? [`new-${record.prontuarioNumber}`]
            : []
      }
      onValueChange={(details) => onProntuarioSelect(details.value[0] || '')}
      onInputValueChange={(details) => onProntuarioSearch(details.inputValue)}
      inputValue={prontuarioSearch}
      allowCustomValue
    >
      <ComboboxLabel>Prontuário</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder="Selecione ou digite um prontuário" />
        <ComboboxIndicatorGroup>
          <ComboboxClearTrigger />
          <ComboboxTrigger />
        </ComboboxIndicatorGroup>
      </ComboboxControl>
      <Portal>
        <ComboboxPositioner>
          <ComboboxContent>
            {filteredProntuarios.map((item) => (
              <ComboboxItem
                key={item.value}
                item={item}
                onPointerDown={(e) => e.preventDefault()}
              >
                <ComboboxItemText>
                  {item.value.startsWith('new-') ? `+ Criar "${item.label}"` : item.label}
                </ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </ComboboxPositioner>
      </Portal>
    </ComboboxRoot>

    <SelectRoot
      collection={createListCollection<CollectionItem>({
        items: (unities || []).map((u) => ({ label: u.name, value: String(u.id) }))
      })}
      value={[selectedUnityId ? String(selectedUnityId) : '']}
      onValueChange={(details: { value: string[] }) => onUnityChange(Number(details.value[0]))}
    >
      <SelectLabel>Unidade</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Selecione a unidade" />
      </SelectTrigger>
      <SelectContent>
        {(unities || []).map((u) => (
          <SelectItem key={u.id} item={String(u.id)}>
            <SelectItemText>{u.name}</SelectItemText>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>

    <CurrencyInput
      label="Valor"
      value={record.valor}
      onChange={(val) => onRecordChange({ valor: val })}
    />

    <Input
      label="Quantidade de Cestas"
      type="number"
      value={record.cestas}
      onFocus={(e) => e.target.select()}
      onChange={(e) => onRecordChange({ cestas: Number(e.target.value) })}
    />

    <Stack gap={2} mt={2}>
      <Checkbox.Root
        checked={record.ministerio}
        onCheckedChange={(details) => onRecordChange({ ministerio: !!details.checked })}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Ministério</Checkbox.Label>
      </Checkbox.Root>

      {Object.keys(LABEL_COLORS).map((flag) => (
        <Checkbox.Root
          key={flag}
          checked={record.labels.includes(flag)}
          onCheckedChange={(details) => {
            const checked = !!details.checked
            const newLabels = checked
              ? [...record.labels, flag]
              : record.labels.filter((l) => l !== flag)
            onRecordChange({ labels: newLabels })
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{flag}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </Stack>
  </Stack>
)
