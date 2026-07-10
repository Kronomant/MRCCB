import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RecordType } from '../../hooks/records/useRecords'
import logoPDF from '../../assets/logo-pdf.png'

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '16px 24px',
    fontFamily: 'Helvetica',
    fontSize: 7,
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
    width: 85,
    height: 85,
    position: 'absolute',
    left: 0,
    top: 0,
    objectFit: 'contain',
  },
  institution: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  date: { fontSize: 8, color: '#333' },
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
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={logoPDF} style={styles.logo} />
          <Text style={styles.institution}>{institutionName}</Text>
          <Text style={styles.title}>Fechamento de Caixa – Detalhamento por Casa de Oração</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4, gap: 12 }}>
            <Text style={{ fontSize: 6, color: '#555' }}>Protocolo | Atend. | Cestas</Text>
            <Text style={{ fontSize: 6, color: '#555' }}>C: possui cesta</Text>
            <Text style={{ fontSize: 6, color: '#555' }}>A: Ministério</Text>
            <Text style={{ fontSize: 6, color: '#555' }}>R: Roupas</Text>
          </View>
        </View>

        {unityBreakdown.length === 0 ? (
          <Text style={styles.emptyRow}>Nenhum atendimento registrado nesta reunião</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
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
                  style={{
                    width: `${K * 11}%`,
                    marginBottom: 4,
                    paddingRight: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    borderWidth: 0.5,
                    borderColor: '#DDD',
                    borderRadius: 2,
                    padding: 3,
                    backgroundColor: '#FAFBFC',
                    flexGrow: 1,
                  }}
                >
                  {/* Unity header */}
                  <Text
                    style={{
                      fontSize: 7,
                      fontWeight: 'bold',
                      backgroundColor: '#E8EEF8',
                      color: '#1a3a6b',
                      padding: 3,
                      textAlign: 'center',
                      marginBottom: 3,
                    }}
                  >
                    {group.unityName}
                  </Text>

                  {/* Columns side by side */}
                  <View style={{ flexDirection: 'row', gap: 4, flexGrow: 1 }}>
                    {chunks.map((chunk, chunkIndex) => (
                      <View
                        key={chunkIndex}
                        style={{
                          width: `${100 / K}%`,
                          display: 'flex',
                          flexDirection: 'column',
                          flexGrow: 1,
                        }}
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
                              style={{
                                marginBottom: 3,
                                paddingBottom: 2,
                                borderBottomWidth: 1,
                                borderBottomColor: '#DDD',
                                borderStyle: 'dashed',
                              }}
                            >
                              {/* Prontuário number + tags */}
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{item.prontuarioNumber}</Text>
                                {tags ? (
                                  <Text style={{ fontSize: 6, marginLeft: 2, fontWeight: 'bold', color: '#444' }}>
                                    {tags}
                                  </Text>
                                ) : null}
                              </View>

                              {/* Attendance value */}
                              <Text style={{ fontSize: 7, color: '#222' }}>
                                {formatBRL(item.valor)}
                              </Text>

                              {/* Basket info */}
                              {hasCesta ? (
                                <Text style={{ fontSize: 6, color: '#555' }}>
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
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#1a3a6b',
                      paddingTop: 3,
                      marginTop: 'auto',
                      gap: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 5.5, color: '#555' }}>Qtd. Atend.:</Text>
                      <Text style={{ fontSize: 5.5, color: '#222', fontWeight: 'bold' }}>{group.atendimentosCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 5.5, color: '#555' }}>Val. Atend.:</Text>
                      <Text style={{ fontSize: 5.5, color: '#222', fontWeight: 'bold' }}>{formatBRL(group.atendimentoCost)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 5.5, color: '#555' }}>Qtd. Cestas:</Text>
                      <Text style={{ fontSize: 5.5, color: '#222', fontWeight: 'bold' }}>{group.cestasCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 5.5, color: '#555' }}>Val. Cestas:</Text>
                      <Text style={{ fontSize: 5.5, color: '#222', fontWeight: 'bold' }}>{formatBRL(group.cestasCost)}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderTopWidth: 0.5,
                        borderTopColor: '#DDD',
                        paddingTop: 2,
                        marginTop: 1,
                      }}
                    >
                      <Text style={{ fontSize: 6, fontWeight: 'bold', color: '#1a3a6b' }}>Total:</Text>
                      <Text style={{ fontSize: 6, fontWeight: 'bold', color: '#1a3a6b' }}>{formatBRL(group.totalCost)}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Grand total bar */}
        {unityBreakdown.length > 0 && (
          <View
            style={{
              marginTop: 6,
              borderTopWidth: 1,
              borderTopColor: '#333',
              paddingTop: 4,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 2,
                marginBottom: 1,
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#1a3a6b' }}>
                TOTAL GERAL:
              </Text>
              <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#1a3a6b' }}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.totalCost, 0))}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#DDD', paddingTop: 2 }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#555' }}>
                Total Atendimentos: {unityBreakdown.reduce((a, g) => a + g.atendimentosCount, 0)} atendimentos
              </Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#222' }}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.atendimentoCost, 0))}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#555' }}>
                Total Cestas: {unityBreakdown.reduce((a, g) => a + g.cestasCount, 0)} cestas
              </Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#222' }}>
                {formatBRL(unityBreakdown.reduce((a, g) => a + g.cestasCost, 0))}
              </Text>
            </View>
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
