import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  // Main page block style
  valuesProtocol__page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '16px 24px',
    fontFamily: 'Helvetica',
    fontSize: 8.5,
  },
  // Header element styles
  valuesProtocol__header: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 6,
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 65,
  },
  valuesProtocol__logo: {
    width: 85,
    height: 85,
    position: 'absolute',
    left: 0,
    top: 0,
    objectFit: 'contain',
  },
  valuesProtocol__institution: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  valuesProtocol__title: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  valuesProtocol__date: { 
    fontSize: 9.5, 
    color: '#333' 
  },
  valuesProtocol__legend: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 4, 
    gap: 12 
  },
  valuesProtocol__legendItem: { 
    fontSize: 7.5, 
    color: '#555' 
  },
  valuesProtocol__emptyRow: { 
    fontSize: 9, 
    color: '#999', 
    padding: 4, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
  valuesProtocol__body: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 4, 
    marginTop: 4 
  },

  // Card element styles
  valuesProtocol__card: {
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
  },
  valuesProtocol__cardHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: '#E8EEF8',
    color: '#1a3a6b',
    padding: 3,
    textAlign: 'center',
    marginBottom: 3,
  },
  valuesProtocol__cardColumns: { 
    flexDirection: 'row', 
    gap: 4, 
    flexGrow: 1 
  },
  valuesProtocol__cardColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  // Item element styles
  valuesProtocol__item: {
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    borderStyle: 'dashed',
  },
  valuesProtocol__itemHeader: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  valuesProtocol__itemNumber: { 
    fontSize: 11.5, 
    fontWeight: 'bold' 
  },
  valuesProtocol__itemTags: { 
    fontSize: 7.5, 
    marginLeft: 2, 
    fontWeight: 'bold', 
    color: '#444' 
  },
  valuesProtocol__itemValue: { 
    fontSize: 8.5, 
    color: '#222' 
  },
  valuesProtocol__itemBasket: { 
    fontSize: 7.5, 
    color: '#555' 
  },

  // Subtotal element styles
  valuesProtocol__subtotal: {
    borderTopWidth: 1,
    borderTopColor: '#1a3a6b',
    paddingTop: 3,
    marginTop: 'auto',
    gap: 2,
  },
  valuesProtocol__subtotalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  valuesProtocol__subtotalLabel: { 
    fontSize: 7.5, 
    color: '#555' 
  },
  valuesProtocol__subtotalValue: { 
    fontSize: 7.5, 
    color: '#222', 
    fontWeight: 'bold' 
  },
  valuesProtocol__subtotalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
    paddingTop: 2,
    marginTop: 1,
  },
  valuesProtocol__subtotalTotalLabel: { 
    fontSize: 8.5, 
    fontWeight: 'bold', 
    color: '#1a3a6b' 
  },
  valuesProtocol__subtotalTotalValue: { 
    fontSize: 8.5, 
    fontWeight: 'bold', 
    color: '#1a3a6b' 
  },

  // Grand total element styles
  valuesProtocol__grandTotal: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 4,
    flexDirection: 'column',
    gap: 2,
  },
  valuesProtocol__grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 2,
    marginBottom: 1,
  },
  valuesProtocol__grandTotalLabel: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1a3a6b' 
  },
  valuesProtocol__grandTotalValue: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1a3a6b' 
  },
  valuesProtocol__grandTotalSubrow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 0.5, 
    borderTopColor: '#DDD', 
    paddingTop: 2 
  },
  valuesProtocol__grandTotalDetailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  valuesProtocol__grandTotalDetailLabel: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    color: '#555' 
  },
  valuesProtocol__grandTotalDetailValue: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    color: '#222' 
  },

  valuesProtocol__footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
})
