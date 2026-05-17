import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import logoPDF from '../../assets/logo-pdf.png'

const DENOMINATIONS = [
  { value: 200, label: 'R$ 200' },
  { value: 100, label: 'R$ 100' },
  { value: 50, label: 'R$ 50' },
  { value: 20, label: 'R$ 20' },
  { value: 10, label: 'R$ 10' },
  { value: 5, label: 'R$ 5' },
  { value: 2, label: 'R$ 2' },
  { value: 1, label: 'R$ 1' },
  { value: 0.5, label: 'R$ 0,50' },
  { value: 0.25, label: 'R$ 0,25' },
  { value: 0.1, label: 'R$ 0,10' },
  { value: 0.05, label: 'R$ 0,05' },
]

const CATEGORY_LABELS: Record<string, string> = {
  fuel: 'Combustível',
  food: 'Alimentação',
  small_goods: 'Bens',
  maintenance: 'Manutenção',
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '16px 24px',
    fontFamily: 'Helvetica',
    fontSize: 8,
  },
  header: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 6,
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 65,
  },
  logo: {
    width: 55,
    height: 55,
    position: 'absolute',
    left: 0,
    top: 0,
    objectFit: 'contain',
  },
  institution: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  date: { fontSize: 8, color: '#333' },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 2,
    color: '#222',
  },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 2 },
  rowAlt: { backgroundColor: '#FAFAFA' },
  headerRow: { flexDirection: 'row', backgroundColor: '#F0F0F0', paddingVertical: 3, fontWeight: 'bold' },
  cell: { flex: 1, fontSize: 7, paddingHorizontal: 2 },
  cellRight: { flex: 1, fontSize: 7, paddingHorizontal: 2, textAlign: 'right' },
  cellCenter: { flex: 1, fontSize: 7, paddingHorizontal: 2, textAlign: 'center' },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 3,
    backgroundColor: '#F5F5F5',
  },
  denomWrapper: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  denomTable: { flex: 1 },
  denomTableTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#E8EEF8',
    paddingVertical: 3,
    marginBottom: 2,
    color: '#1a3a6b',
  },
  summaryBlock: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3,
    padding: 8,
  },
  summaryGroup: { marginBottom: 6 },
  summaryGroupTitle: { fontSize: 7, fontWeight: 'bold', color: '#666', marginBottom: 3, textTransform: 'uppercase' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  summaryLabel: { fontSize: 8, color: '#333' },
  summaryValue: { fontSize: 8, color: '#333', fontWeight: 'bold' },
  summaryDivider: { borderBottomWidth: 1, borderBottomColor: '#DDD', marginVertical: 4 },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  summaryTotalLabel: { fontSize: 9, fontWeight: 'bold' },
  summaryTotalValue: { fontSize: 9, fontWeight: 'bold' },
  infoBlock: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 6,
  },
  infoItem: { fontSize: 8, color: '#444' },
  emptyRow: { fontSize: 7, color: '#999', padding: 4, textAlign: 'center', fontStyle: 'italic' },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    textAlign: 'center',
    fontSize: 7,
    color: 'grey',
  },
})

interface ClosingDocumentProps {
  institutionName: string
  date: string
  openingValue: number
  availableValue: number
  openingCounts: DenominationCounts | null
  closingValue: number
  closingCounts: DenominationCounts | null
  closingDifference: number
  tickets: CashTicket[]
  expenses: CashExpense[]
  totalAttendances: number
  atendimentoCount: number
  cestasCount: number
  totalTickets: number
  totalExpenses: number
}

const DenomTable: React.FC<{ title: string; counts: DenominationCounts | null }> = ({ title, counts }) => {
  const total = DENOMINATIONS.reduce((acc, d) => acc + d.value * (counts?.[d.value] ?? 0), 0)

  return (
    <View style={styles.denomTable}>
      <Text style={styles.denomTableTitle}>{title}</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, { flex: 2 }]}>Denominação</Text>
        <Text style={styles.cellCenter}>Qtd</Text>
        <Text style={styles.cellRight}>Subtotal</Text>
      </View>
      {DENOMINATIONS.map((d, i) => {
        const qty = counts?.[d.value] ?? 0
        const subtotal = d.value * qty
        return (
          <View key={d.value} style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
            <Text style={[styles.cell, { flex: 2 }]}>{d.label}</Text>
            <Text style={styles.cellCenter}>{qty > 0 ? qty : '—'}</Text>
            <Text style={styles.cellRight}>{subtotal > 0 ? formatBRL(subtotal) : '—'}</Text>
          </View>
        )
      })}
      <View style={styles.totalRow}>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>TOTAL</Text>
        <Text style={styles.cellCenter} />
        <Text style={[styles.cellRight, { fontWeight: 'bold' }]}>{formatBRL(total)}</Text>
      </View>
    </View>
  )
}

export const ClosingDocument: React.FC<ClosingDocumentProps> = ({
  institutionName,
  date,
  availableValue,
  openingCounts,
  closingValue,
  closingCounts,
  closingDifference,
  tickets,
  expenses,
  totalAttendances,
  atendimentoCount,
  cestasCount,
  totalTickets,
  totalExpenses,
}) => {
  const formattedDate = date
    ? format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  const totalSaidas = totalAttendances + totalTickets + totalExpenses
  const saldoEsperado = availableValue - totalSaidas
  const diffColor = Math.abs(closingDifference) >= 0.01 ? '#CC0000' : '#006600'

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image src={logoPDF} style={styles.logo} />
          <Text style={styles.institution}>{institutionName}</Text>
          <Text style={styles.title}>Fechamento de Caixa</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* DENOMINAÇÕES */}
        <Text style={styles.sectionTitle}>Contagem de Cédulas e Moedas</Text>
        <View style={styles.denomWrapper}>
          <DenomTable title="Abertura" counts={openingCounts} />
          <DenomTable title="Fechamento" counts={closingCounts} />
        </View>

        {/* PASSAGENS */}
        <Text style={styles.sectionTitle}>Passagens de Voluntários</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, { flex: 0.4 }]}>#</Text>
          <Text style={[styles.cell, { flex: 3 }]}>Voluntário</Text>
          <Text style={styles.cellRight}>Valor</Text>
          <Text style={[styles.cell, { flex: 3 }]}>Observação</Text>
        </View>
        {tickets.length === 0 ? (
          <Text style={styles.emptyRow}>Nenhum registro</Text>
        ) : (
          tickets.map((t, i) => (
            <View key={t.id} style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
              <Text style={[styles.cell, { flex: 0.4 }]}>{i + 1}</Text>
              <Text style={[styles.cell, { flex: 3 }]}>{t.volunteerName || '—'}</Text>
              <Text style={styles.cellRight}>{formatBRL(t.value)}</Text>
              <Text style={[styles.cell, { flex: 3 }]}>{t.notes || '—'}</Text>
            </View>
          ))
        )}
        {tickets.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.cell, { flex: 4.4, fontWeight: 'bold' }]}>Total Passagens</Text>
            <Text style={[styles.cellRight, { fontWeight: 'bold' }]}>{formatBRL(totalTickets)}</Text>
            <Text style={[styles.cell, { flex: 3 }]} />
          </View>
        )}

        {/* NOTAS DE GASTO */}
        <Text style={styles.sectionTitle}>Notas de Gasto</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, { flex: 0.4 }]}>#</Text>
          <Text style={[styles.cell, { flex: 3 }]}>Estabelecimento</Text>
          <Text style={[styles.cell, { flex: 2 }]}>Categoria</Text>
          <Text style={[styles.cell, { flex: 2 }]}>NF-e</Text>
          <Text style={styles.cellRight}>Valor</Text>
        </View>
        {expenses.length === 0 ? (
          <Text style={styles.emptyRow}>Nenhum registro</Text>
        ) : (
          expenses.map((e, i) => (
            <View key={e.id} style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
              <Text style={[styles.cell, { flex: 0.4 }]}>{i + 1}</Text>
              <Text style={[styles.cell, { flex: 3 }]}>{e.establishmentName}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{CATEGORY_LABELS[e.category] ?? e.category}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{e.nfeNumber || '—'}</Text>
              <Text style={styles.cellRight}>{formatBRL(e.value)}</Text>
            </View>
          ))
        )}
        {expenses.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.cell, { flex: 7.4, fontWeight: 'bold' }]}>Total Despesas</Text>
            <Text style={[styles.cellRight, { fontWeight: 'bold' }]}>{formatBRL(totalExpenses)}</Text>
          </View>
        )}

        {/* RESUMO FINANCEIRO */}
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <View style={styles.summaryBlock}>

          <View style={styles.summaryGroup}>
            <Text style={styles.summaryGroupTitle}>Entradas</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor Disponibilizado</Text>
              <Text style={styles.summaryValue}>{formatBRL(availableValue)}</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryGroup}>
            <Text style={styles.summaryGroupTitle}>Saídas</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Atendimentos</Text>
              <Text style={styles.summaryValue}>{formatBRL(totalAttendances)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Passagens</Text>
              <Text style={styles.summaryValue}>{formatBRL(totalTickets)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Despesas (Notas de Gasto)</Text>
              <Text style={styles.summaryValue}>{formatBRL(totalExpenses)}</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>TOTAL SAÍDAS</Text>
            <Text style={styles.summaryTotalValue}>{formatBRL(totalSaidas)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryGroup}>
            <Text style={styles.summaryGroupTitle}>Saldo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Saldo Esperado</Text>
              <Text style={styles.summaryValue}>{formatBRL(saldoEsperado)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Saldo Físico Contado</Text>
              <Text style={styles.summaryValue}>{formatBRL(closingValue)}</Text>
            </View>
          </View>

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>DIFERENÇA</Text>
            <Text style={[styles.summaryTotalValue, { color: diffColor }]}>
              {formatBRL(closingDifference)}
            </Text>
          </View>
        </View>

        {/* INFORMAÇÕES GERAIS */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoItem}>Atendimentos realizados: {atendimentoCount}</Text>
          <Text style={styles.infoItem}>Cestas distribuídas: {cestasCount}</Text>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
