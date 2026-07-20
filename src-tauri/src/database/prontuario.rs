use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Prontuario {
    pub id: Option<i64>,
    pub number: i64,
    #[serde(rename = "unityId")]
    pub unity_id: i64,
    pub ministry: bool,
    pub status: String,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
    #[serde(rename = "hasPendingDelivery", skip_serializing_if = "Option::is_none")]
    pub has_pending_delivery: Option<bool>,
}

// The complex sub-query for hasPendingDelivery, extracted to avoid repetition.
const PENDING_DELIVERY_SUBQUERY: &str = "
    (
        EXISTS (
            SELECT 1
            FROM atendimentos a
            LEFT JOIN prontuario_delivery_status pds
                ON pds.prontuarioId = a.prontuarioId AND pds.reunionId = a.reunionId
            WHERE a.prontuarioId = p.id
                AND a.devolvido = 0
                AND (pds.status IS NULL OR (pds.status <> 'entregue' AND pds.status <> 'devolvido'))
        )
        OR EXISTS (
            SELECT 1
            FROM prontuario_delivery_status pds
            WHERE pds.prontuarioId = p.id
                AND pds.status = 'pendente'
                AND NOT EXISTS (
                    SELECT 1
                    FROM atendimentos a
                    WHERE a.prontuarioId = p.id
                        AND a.reunionId = pds.reunionId
                        AND a.devolvido = 1
                )
        )
    ) AS hasPendingDelivery
";

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<Prontuario> {
    let ministry_int: i64 = row.get(3)?;
    let pending_int: i64 = row.get(7).unwrap_or(0);
    Ok(Prontuario {
        id: row.get(0)?,
        number: row.get(1)?,
        unity_id: row.get(2)?,
        ministry: ministry_int != 0,
        status: row.get(4)?,
        created_at: row.get(5)?,
        updated_at: row.get(6)?,
        has_pending_delivery: Some(pending_int != 0),
    })
}

pub fn create_prontuario(conn: &Connection, data: Prontuario) -> Result<Prontuario> {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO prontuarios (number, unityId, ministry, status, createdAt, updatedAt)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            data.number,
            data.unity_id,
            if data.ministry { 1 } else { 0 },
            data.status,
            now,
            now,
        ],
    )?;
    let id = conn.last_insert_rowid();
    Ok(Prontuario {
        id: Some(id),
        created_at: Some(now.clone()),
        updated_at: Some(now),
        has_pending_delivery: Some(false),
        ..data
    })
}

pub fn get_all_prontuarios(conn: &Connection) -> Result<Vec<Prontuario>> {
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p ORDER BY p.number ASC",
        PENDING_DELIVERY_SUBQUERY
    );
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], map_row)?;
    rows.collect()
}

pub fn get_prontuario_by_id(conn: &Connection, id: i64) -> Result<Option<Prontuario>> {
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p WHERE p.id = ?1",
        PENDING_DELIVERY_SUBQUERY
    );
    let mut stmt = conn.prepare(&sql)?;
    let mut rows = stmt.query_map(params![id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn get_prontuario_by_number(conn: &Connection, number: i64) -> Result<Option<Prontuario>> {
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p WHERE p.number = ?1",
        PENDING_DELIVERY_SUBQUERY
    );
    let mut stmt = conn.prepare(&sql)?;
    let mut rows = stmt.query_map(params![number], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn get_prontuarios_by_ids(conn: &Connection, ids: Vec<i64>) -> Result<Vec<Prontuario>> {
    if ids.is_empty() {
        return Ok(vec![]);
    }
    let placeholders: Vec<String> = (1..=ids.len()).map(|i| format!("?{}", i)).collect();
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p WHERE p.id IN ({})",
        PENDING_DELIVERY_SUBQUERY,
        placeholders.join(",")
    );
    let mut stmt = conn.prepare(&sql)?;
    let params_refs: Vec<&dyn rusqlite::ToSql> = ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();
    let rows = stmt.query_map(params_refs.as_slice(), map_row)?;
    rows.collect()
}

pub fn get_prontuarios_by_unity(conn: &Connection, unity_id: i64) -> Result<Vec<Prontuario>> {
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p WHERE p.unityId = ?1 ORDER BY p.number ASC",
        PENDING_DELIVERY_SUBQUERY
    );
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![unity_id], map_row)?;
    rows.collect()
}

pub fn get_active_prontuarios(conn: &Connection) -> Result<Vec<Prontuario>> {
    let sql = format!(
        "SELECT p.id, p.number, p.unityId, p.ministry, p.status, p.createdAt, p.updatedAt, {} FROM prontuarios p WHERE p.status = 'active' ORDER BY p.number ASC",
        PENDING_DELIVERY_SUBQUERY
    );
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], map_row)?;
    rows.collect()
}

pub fn update_prontuario(conn: &Connection, data: Prontuario) -> Result<Prontuario> {
    let id = data.id.ok_or(rusqlite::Error::InvalidQuery)?;
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE prontuarios SET number=?1, unityId=?2, ministry=?3, status=?4, updatedAt=?5 WHERE id=?6",
        params![
            data.number,
            data.unity_id,
            if data.ministry { 1 } else { 0 },
            data.status,
            now,
            id,
        ],
    )?;
    Ok(Prontuario { updated_at: Some(now), ..data })
}

pub fn delete_prontuario(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM prontuarios WHERE id = ?1", params![id])?;
    Ok(())
}
