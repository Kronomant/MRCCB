import { getDb } from '../db'

export function migrateDeliveryStatus(): void {
  const db = getDb()

  const columns = db.prepare("PRAGMA table_info('atendimentos')").all() as Array<{ name: string }>

  const hasRepresentacao = columns.some((c) => c.name === 'representacao')
  const hasDevolvido = columns.some((c) => c.name === 'devolvido')

  if (!hasRepresentacao) {
    db.exec('ALTER TABLE atendimentos RENAME COLUMN returned TO representacao')
  }

  if (!hasDevolvido) {
    db.exec('ALTER TABLE atendimentos ADD COLUMN devolvido INTEGER NOT NULL DEFAULT 0')

    const hasProntuarioDeliveryStatus = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='prontuario_delivery_status'"
      )
      .get()

    if (hasProntuarioDeliveryStatus) {
      db.exec(`
        UPDATE atendimentos
        SET devolvido = 1
        WHERE EXISTS (
          SELECT 1 FROM prontuario_delivery_status pds
          WHERE pds.prontuarioId = atendimentos.prontuarioId
            AND pds.reunionId = atendimentos.reunionId
            AND pds.status IN ('entregue', 'devolvido')
        )
      `)
    }
  }
}
