import React from 'react'
import { Page, Text, View, Document, Image } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RecordType } from '../../hooks/records/useRecords'
import logoPDF from '../../assets/logo-pdf.png'
import { styles } from './ValuesProtocolDocument.style'

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

interface ValuesProtocolDocumentProps {
  records: RecordType[]
  unities: Unity[]
  prontuarios: Prontuario[]
  date: string
  basketValue?: number
  institutionName?: string
}

export const ValuesProtocolDocument: React.FC<ValuesProtocolDocumentProps> = ({
  records = [],
  unities = [],
  prontuarios = [],
  date,
  basketValue = 0,
  institutionName = 'Congregação Cristã no Brasil - Obra da Piedade',
}) => {
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  const docTitle = `Protocolo_Valores_${
    date ? format(parseISO(date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  }`

  // Group records by unity
  const unityBreakdown = React.useMemo(() => {
    if (!records || !unities || !prontuarios) return []

    const prontuarioMap = new Map<number, Prontuario>()
    prontuarios.forEach((p) => prontuarioMap.set(p.id, p))

    const unityMap = new Map<number, Unity>()
    unities.forEach((u) => unityMap.set(u.id, u))

    const breakdown = new Map<number, {
      unityName: string
      atendimentosCount: number
      atendimentoCost: number
      cestasCount: number
      cestasCost: number
      totalCost: number
      items: RecordType[]
    }>()

    records.forEach((record) => {
      let unityId = 0
      let unityName = 'Outros / Sem Unidade'

      const prontuario = prontuarioMap.get(record.prontuarioId)
      if (prontuario) {
        unityId = prontuario.unityId
        const unity = unityMap.get(unityId)
        if (unity) {
          unityName = unity.name
        }
      }

      const existing = breakdown.get(unityId) || {
        unityName,
        atendimentosCount: 0,
        atendimentoCost: 0,
        cestasCount: 0,
        cestasCost: 0,
        totalCost: 0,
        items: []
      }

      const basketCost = record.cestas * basketValue

      existing.atendimentosCount += 1
      existing.atendimentoCost += record.valor
      existing.cestasCount += record.cestas
      existing.cestasCost += basketCost
      existing.totalCost += record.valor + basketCost
      existing.items.push(record)

      breakdown.set(unityId, existing)
    })

    return Array.from(breakdown.values()).sort((a, b) => a.unityName.localeCompare(b.unityName))
  }, [records, unities, prontuarios, basketValue])

  return (
    <Document title={docTitle}>
      <Page size="A4" orientation="landscape" style={styles.valuesProtocol__page}>
        {/* HEADER */}
        <View style={styles.valuesProtocol__header}>
          <Image src={logoPDF} style={styles.valuesProtocol__logo} />
          <Text style={styles.valuesProtocol__institution}>{institutionName}</Text>
          <Text style={styles.valuesProtocol__title}>Fechamento de Caixa – Detalhamento por Casa de Oração</Text>
          <Text style={styles.valuesProtocol__date}>{formattedDate}</Text>
          <View style={styles.valuesProtocol__legend}>
            <Text style={styles.valuesProtocol__legendItem}>Protocolo | Atend. | Cestas</Text>
            <Text style={styles.valuesProtocol__legendItem}>C: possui cesta</Text>
            <Text style={styles.valuesProtocol__legendItem}>A: Ministério</Text>
            <Text style={styles.valuesProtocol__legendItem}>R: Roupas</Text>
          </View>
        </View>

        {unityBreakdown.length === 0 ? (
          <Text style={styles.valuesProtocol__emptyRow}>Nenhum atendimento registrado nesta reunião</Text>
        ) : (
          <View style={styles.valuesProtocol__body}>
            {unityBreakdown.map((group) => {
              const chunkSize = 10
              const totalRecords = group.items.length

              const chunks: RecordType[][] = []
              for (let i = 0; i < totalRecords; i += chunkSize) {
                chunks.push(group.items.slice(i, i + chunkSize))
              }

              const K = chunks.length

              return (
                <View
                  key={group.unityName}
                  wrap={false}
                  style={[styles.valuesProtocol__card, { width: `${K * 13}%` }]}
                >
                  {/* Unity header */}
                  <Text style={styles.valuesProtocol__cardHeader}>
                    {group.unityName}
                  </Text>

                  {/* Columns side by side */}
                  <View style={styles.valuesProtocol__cardColumns}>
                    {chunks.map((chunk, chunkIndex) => (
                      <View
                        key={chunkIndex}
                        style={[styles.valuesProtocol__cardColumn, { width: `${100 / K}%` }]}
                      >
                        {chunk.map((item) => {
                          const hasCesta = item.cestas > 0
                          const hasMinist = item.ministerio
                          const hasRoupas = item.roupas
                          const tags = [hasMinist ? 'A' : '', hasRoupas ? 'R' : '', hasCesta ? 'C' : ''].filter(Boolean).join(' ')
                          return (
                            <View
                              key={item.id}
                              wrap={false}
                              style={styles.valuesProtocol__item}
                            >
                              {/* Prontuário number + tags */}
                              <View style={styles.valuesProtocol__itemHeader}>
                                <Text style={styles.valuesProtocol__itemNumber}>{item.prontuarioNumber}</Text>
                                {tags ? (
                                  <Text style={styles.valuesProtocol__itemTags}>
                                    {tags}
                                  </Text>
                                ) : null}
                              </View>

                              {/* Attendance value */}
                              <Text style={styles.valuesProtocol__itemValue}>
                                {formatBRL(item.valor)}
                              </Text>

                              {/* Basket info */}
                              {hasCesta ? (
                                <Text style={styles.valuesProtocol__itemBasket}>
                                  {item.cestas}x cesta = {formatBRL(item.cestas * basketValue)}
                                </Text>
                              ) : null}
                            </View>
                          )
                        })}
                      </View>
                    ))}
                  </View>

                  {/* Unity subtotal */}
                  <View style={styles.valuesProtocol__subtotal}>
                    <View style={styles.valuesProtocol__subtotalRow}>
                      <Text style={styles.valuesProtocol__subtotalLabel}>Qtd. Atend.:</Text>
                      <Text style={styles.valuesProtocol__subtotalValue}>{group.atendimentosCount}</Text>
                    </View>
                    <View style={styles.valuesProtocol__subtotalRow}>
                      <Text style={styles.valuesProtocol__subtotalLabel}>Val. Atend.:</Text>
                      <Text style={styles.valuesProtocol__subtotalValue}>{formatBRL(group.atendimentoCost)}</Text>
                    </View>
                    <View style={styles.valuesProtocol__subtotalRow}>
                      <Text style={styles.valuesProtocol__subtotalLabel}>Qtd. Cestas:</Text>
                      <Text style={styles.valuesProtocol__subtotalValue}>{group.cestasCount}</Text>
                    </View>
                    <View style={styles.valuesProtocol__subtotalRow}>
                      <Text style={styles.valuesProtocol__subtotalLabel}>Val. Cestas:</Text>
                      <Text style={styles.valuesProtocol__subtotalValue}>{formatBRL(group.cestasCost)}</Text>
                    </View>
                    <View style={styles.valuesProtocol__subtotalTotalRow}>
                      <Text style={styles.valuesProtocol__subtotalTotalLabel}>Total:</Text>
                      <Text style={styles.valuesProtocol__subtotalTotalValue}>{formatBRL(group.totalCost)}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Grand total bar */}
        {unityBreakdown.length > 0 && (
          <View style={styles.valuesProtocol__grandTotal}>
            <View style={styles.valuesProtocol__grandTotalRow}>
              <Text style={styles.valuesProtocol__grandTotalLabel}>
                TOTAL GERAL:
              </Text>
              <Text style={styles.valuesProtocol__grandTotalValue}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.totalCost, 0))}
              </Text>
            </View>

            <View style={styles.valuesProtocol__grandTotalSubrow}>
              <Text style={styles.valuesProtocol__grandTotalDetailLabel}>
                Total Atendimentos: {unityBreakdown.reduce((a, g) => a + g.atendimentosCount, 0)} atendimentos
              </Text>
              <Text style={styles.valuesProtocol__grandTotalDetailValue}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.atendimentoCost, 0))}
              </Text>
            </View>

            <View style={styles.valuesProtocol__grandTotalDetailRow}>
              <Text style={styles.valuesProtocol__grandTotalDetailLabel}>
                Total Cestas: {unityBreakdown.reduce((a, g) => a + g.cestasCount, 0)} cestas
              </Text>
              <Text style={styles.valuesProtocol__grandTotalDetailValue}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.cestasCost, 0))}
              </Text>
            </View>
          </View>
        )}

        <Text
          style={styles.valuesProtocol__footer}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
