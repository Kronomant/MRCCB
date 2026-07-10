import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import logoPDF from '../../assets/logo-pdf.png'

// Interfaces (simplified based on what we need)
interface RecordType {
  id: number
  prontuarioId: number
  prontuarioNumber: number
  ministerio: boolean
  roupas: boolean
  valor: number
  cestas: number
  labels: string[]
  valorTotalAprovado: boolean
  delivered: boolean
}

interface Unity {
  id: number
  name: string
}

interface Prontuario {
  id: number
  unityId: number
  number: number
}

interface ProtocolDocumentProps {
  records: RecordType[]
  unities: Unity[]
  prontuarios: Prontuario[]
  date: string
  institutionName?: string
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '16px 24px',
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 65
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    left: 0,
    top: 0,
    objectFit: 'contain'
  },
  institution: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2
  },
  date: {
    fontSize: 8,
    color: '#333'
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    gap: 10
  },
  legendItem: {
    fontSize: 7,
    color: '#333'
  },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  unityColumn: {
    width: '9%', // Fits ~10-11 columns in landscape
    marginBottom: 4,
    paddingRight: 2
  },
  unityHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 3,
    backgroundColor: '#F0F0F0',
    padding: 2,
    textAlign: 'center'
  },
  recordBlock: {
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    borderStyle: 'dashed',
    paddingBottom: 2
  },
  recordInfo: {
    fontSize: 8,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  prontuarioText: {
    fontSize: 11, // Increased size for visibility
    fontWeight: 'bold'
  },
  tags: {
    fontSize: 7,
    marginLeft: 2,
    fontWeight: 'bold'
  },
  dashedLine: {
    marginTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dashed'
  },
  label: {
    fontSize: 6,
    color: '#666',
    marginTop: 1
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey'
  }
})

export const ProtocolDocument: React.FC<ProtocolDocumentProps> = ({
  records,
  unities,
  prontuarios,
  date,
  institutionName = 'Congregação Cristã no Brasil - Obra da Piedade'
}) => {
  // Group records by Unity
  const groupedRecords = React.useMemo(() => {
    const groups: Record<number, RecordType[]> = {}

    records.forEach((record) => {
      // Find unity for this record
      const prontuario = prontuarios.find((p) => p.id === record.prontuarioId)
      const unityId = prontuario?.unityId

      if (unityId) {
        if (!groups[unityId]) groups[unityId] = []
        groups[unityId].push(record)
      } else {
        if (!groups[-1]) groups[-1] = []
        groups[-1].push(record)
      }
    })

    return groups
  }, [records, prontuarios])

  const getUnityName = (id: number) => {
    if (id === -1) return 'Outros / Sem Unidade'
    return unities.find((u) => u.id === id)?.name || 'Desconhecida'
  }

  const chunkedColumns = React.useMemo(() => {
    const columns: Array<{
      key: string
      unityId: number
      unityName: string
      records: RecordType[]
    }> = []

    const chunkSize = 7

    Object.entries(groupedRecords).forEach(([unityIdStr, unityRecords]) => {
      const unityId = Number(unityIdStr)
      const name = getUnityName(unityId)
      const totalRecords = unityRecords.length

      if (totalRecords === 0) return

      const chunks: RecordType[][] = []
      for (let i = 0; i < totalRecords; i += chunkSize) {
        chunks.push(unityRecords.slice(i, i + chunkSize))
      }

      chunks.forEach((chunkRecords, chunkIndex) => {
        let displayName = name
        if (chunks.length > 1) {
          displayName = `${name} (${chunkIndex + 1}/${chunks.length})`
        }
        columns.push({
          key: `${unityId}-${chunkIndex}`,
          unityId,
          unityName: displayName,
          records: chunkRecords
        })
      })
    })

    return columns
  }, [groupedRecords, unities])

  const getTags = (record: RecordType) => {
    const tags: string[] = []
    if (record.ministerio) tags.push('A')
    if (record.roupas) tags.push('R')
    if (record.cestas > 0) tags.push('C')
    if (record.valorTotalAprovado || record.labels.includes('Valor total aprovado')) tags.push('T')

    return tags.join(' ')
  }

  // Format date
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoPDF} style={styles.logo} />
          <Text style={styles.institution}>{institutionName}</Text>
          <Text style={styles.title}>Protocolo da Reunião</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={styles.legend}>
            <Text style={styles.legendItem}>C: Cesta</Text>
            <Text style={styles.legendItem}>T: Total Aprovado</Text>
            <Text style={styles.legendItem}>A: Ministério</Text>
            <Text style={styles.legendItem}>R: Roupas</Text>
          </View>
        </View>

        <View style={styles.body}>
          {chunkedColumns.map((col) => {
            return (
              <View key={col.key} style={styles.unityColumn} wrap={false}>
                <Text style={styles.unityHeader}>{col.unityName}</Text>
                {col.records.map((record) => (
                  <View key={record.id} style={styles.recordBlock} wrap={false}>
                    <View style={styles.recordInfo}>
                      <Text style={styles.prontuarioText}>{record.prontuarioNumber}</Text>
                      <Text style={styles.tags}>{getTags(record)}</Text>
                    </View>

                    {/* Date Line */}
                    <View style={{ marginTop: 2 }}>
                      <Text style={{ fontSize: 6 }}>Data:</Text>
                      <View style={styles.dashedLine} />
                    </View>

                    {/* Signature Line */}
                    <View style={{ marginTop: 4 }}>
                      <Text style={{ fontSize: 6 }}>Assinatura:</Text>
                      <View style={styles.dashedLine} />
                    </View>
                  </View>
                ))}
              </View>
            )
          })}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
