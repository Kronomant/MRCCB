use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProntuarioDelivery {
    pub id: Option<i64>,
    #[serde(rename = "prontuarioId")]
    pub prontuario_id: i64,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    pub status: String,
    #[serde(rename = "deliveredAt", skip_serializing_if = "Option::is_none")]
    pub delivered_at: Option<String>,
    #[serde(rename = "deliveredBy", skip_serializing_if = "Option::is_none")]
    pub delivered_by: Option<String>,
    #[serde(rename = "returnedAt", skip_serializing_if = "Option::is_none")]
    pub returned_at: Option<String>,
    #[serde(rename = "returnedBy", skip_serializing_if = "Option::is_none")]
    pub returned_by: Option<String>,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatusTransitionLog {
    pub id: Option<i64>,
    #[serde(rename = "entityType")]
    pub entity_type: String,
    #[serde(rename = "entityId")]
    pub entity_id: i64,
    #[serde(rename = "previousStatus")]
    pub previous_status: String,
    #[serde(rename = "newStatus")]
    pub new_status: String,
    #[serde(rename = "changedBy")]
    pub changed_by: String,
    #[serde(rename = "changedAt", skip_serializing_if = "Option::is_none")]
    pub changed_at: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeliverySummary {
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    pub pendente: i64,
    pub entregue: i64,
    pub devolvido: i64,
}

fn map_delivery_row(row: &rusqlite::Row) -> rusqlite::Result<ProntuarioDelivery> {
    Ok(ProntuarioDelivery {
        id: row.get(0)?,
        prontuario_id: row.get(1)?,
        reunion_id: row.get(2)?,
        status: row.get(3)?,
        delivered_at: row.get(4)?,
        delivered_by: row.get(5)?,
        returned_at: row.get(6)?,
        returned_by: row.get(7)?,
        created_at: row.get(8)?,
        updated_at: row.get(9)?,
    })
}

pub fn get_by_ids(conn: &Connection, prontuario_id: i64, reunion_id: i64) -> Result<Option<ProntuarioDelivery>> {
    let mut stmt = conn.prepare("SELECT id,prontuarioId,reunionId,status,deliveredAt,deliveredBy,returnedAt,returnedBy,createdAt,updatedAt FROM prontuario_delivery_status WHERE prontuarioId=?1 AND reunionId=?2")?;
    let mut rows = stmt.query_map(params![prontuario_id, reunion_id], map_delivery_row)?;
    Ok(rows.next().transpose()?)
}

pub fn get_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Vec<ProntuarioDelivery>> {
    let mut stmt = conn.prepare("SELECT id,prontuarioId,reunionId,status,deliveredAt,deliveredBy,returnedAt,returnedBy,createdAt,updatedAt FROM prontuario_delivery_status WHERE reunionId=?1")?;
    let rows = stmt.query_map(params![reunion_id], map_delivery_row)?;
    rows.collect()
}

pub fn get_by_prontuario(conn: &Connection, prontuario_id: i64) -> Result<Vec<ProntuarioDelivery>> {
    let mut stmt = conn.prepare("SELECT id,prontuarioId,reunionId,status,deliveredAt,deliveredBy,returnedAt,returnedBy,createdAt,updatedAt FROM prontuario_delivery_status WHERE prontuarioId=?1")?;
    let rows = stmt.query_map(params![prontuario_id], map_delivery_row)?;
    rows.collect()
}

pub fn upsert_delivery(conn: &Connection, data: ProntuarioDelivery) -> Result<ProntuarioDelivery> {
    let now = chrono::Utc::now().to_rfc3339();
    if let Some(existing) = get_by_ids(conn, data.prontuario_id, data.reunion_id)? {
        conn.execute(
            "UPDATE prontuario_delivery_status SET status=?1, deliveredAt=?2, deliveredBy=?3, returnedAt=?4, returnedBy=?5, updatedAt=?6 WHERE prontuarioId=?7 AND reunionId=?8",
            params![
                data.status,
                data.delivered_at.as_deref().or(existing.delivered_at.as_deref()),
                data.delivered_by.as_deref().or(existing.delivered_by.as_deref()),
                data.returned_at.as_deref().or(existing.returned_at.as_deref()),
                data.returned_by.as_deref().or(existing.returned_by.as_deref()),
                now,
                data.prontuario_id,
                data.reunion_id,
            ],
        )?;
        Ok(ProntuarioDelivery { updated_at: Some(now), ..data })
    } else {
        conn.execute(
            "INSERT INTO prontuario_delivery_status (prontuarioId,reunionId,status,deliveredAt,deliveredBy,returnedAt,returnedBy,createdAt,updatedAt) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
            params![
                data.prontuario_id, data.reunion_id, data.status,
                data.delivered_at, data.delivered_by, data.returned_at, data.returned_by,
                now, now,
            ],
        )?;
        let id = conn.last_insert_rowid();
        Ok(ProntuarioDelivery { id: Some(id), created_at: Some(now.clone()), updated_at: Some(now), ..data })
    }
}

fn create_log(conn: &Connection, log: StatusTransitionLog) -> Result<()> {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO status_transition_log (entityType,entityId,previousStatus,newStatus,changedBy,changedAt,notes) VALUES (?1,?2,?3,?4,?5,?6,?7)",
        params![log.entity_type, log.entity_id, log.previous_status, log.new_status, log.changed_by, now, log.notes],
    )?;
    Ok(())
}

pub fn get_status_logs(conn: &Connection, entity_type: &str, entity_id: i64) -> Result<Vec<StatusTransitionLog>> {
    let mut stmt = conn.prepare("SELECT id,entityType,entityId,previousStatus,newStatus,changedBy,changedAt,notes FROM status_transition_log WHERE entityType=?1 AND entityId=?2 ORDER BY changedAt DESC")?;
    let rows = stmt.query_map(params![entity_type, entity_id], |row| {
        Ok(StatusTransitionLog {
            id: row.get(0)?,
            entity_type: row.get(1)?,
            entity_id: row.get(2)?,
            previous_status: row.get(3)?,
            new_status: row.get(4)?,
            changed_by: row.get(5)?,
            changed_at: row.get(6)?,
            notes: row.get(7)?,
        })
    })?;
    rows.collect()
}

pub fn mark_delivered(conn: &Connection, prontuario_id: i64, reunion_id: i64, delivered_by: String) -> Result<ProntuarioDelivery> {
    let now = chrono::Utc::now().to_rfc3339();
    let existing = get_by_ids(conn, prontuario_id, reunion_id)?;
    let previous_status = existing.as_ref().map(|e| e.status.clone()).unwrap_or_else(|| "pendente".to_string());
    let result = upsert_delivery(conn, ProntuarioDelivery {
        id: None, prontuario_id, reunion_id,
        status: "entregue".to_string(),
        delivered_at: Some(now.clone()),
        delivered_by: Some(delivered_by.clone()),
        returned_at: None, returned_by: None, created_at: None, updated_at: None,
    })?;
    create_log(conn, StatusTransitionLog {
        id: None, entity_type: "prontuario_delivery".to_string(),
        entity_id: result.id.unwrap_or(0), previous_status, new_status: "entregue".to_string(),
        changed_by: delivered_by,
        notes: Some(format!("Prontuário {} marcado como entregue na reunião {}", prontuario_id, reunion_id)),
        changed_at: None,
    })?;
    Ok(result)
}

pub fn mark_returned(conn: &Connection, prontuario_id: i64, reunion_id: i64, returned_by: String) -> Result<ProntuarioDelivery> {
    let now = chrono::Utc::now().to_rfc3339();
    let existing = get_by_ids(conn, prontuario_id, reunion_id)?;
    let previous_status = existing.as_ref().map(|e| e.status.clone()).unwrap_or_else(|| "pendente".to_string());
    let result = upsert_delivery(conn, ProntuarioDelivery {
        id: None, prontuario_id, reunion_id,
        status: "devolvido".to_string(),
        delivered_at: None, delivered_by: None,
        returned_at: Some(now.clone()),
        returned_by: Some(returned_by.clone()),
        created_at: None, updated_at: None,
    })?;
    create_log(conn, StatusTransitionLog {
        id: None, entity_type: "prontuario_delivery".to_string(),
        entity_id: result.id.unwrap_or(0), previous_status, new_status: "devolvido".to_string(),
        changed_by: returned_by,
        notes: Some(format!("Prontuário {} marcado como devolvido na reunião {}", prontuario_id, reunion_id)),
        changed_at: None,
    })?;
    Ok(result)
}

pub fn get_for_next_month_return(conn: &Connection) -> Result<Vec<ProntuarioDelivery>> {
    let mut stmt = conn.prepare("SELECT id,prontuarioId,reunionId,status,deliveredAt,deliveredBy,returnedAt,returnedBy,createdAt,updatedAt FROM prontuario_delivery_status WHERE status='entregue' AND returnedAt IS NULL ORDER BY deliveredAt ASC")?;
    let rows = stmt.query_map([], map_delivery_row)?;
    rows.collect()
}

pub fn create_automatic_returns(conn: &Connection, reunion_id: i64, processed_by: String) -> Result<i64> {
    let for_return = get_for_next_month_return(conn)?;
    let mut count = 0i64;
    for delivery in for_return {
        if get_by_ids(conn, delivery.prontuario_id, reunion_id)?.is_none() {
            let result = upsert_delivery(conn, ProntuarioDelivery {
                id: None, prontuario_id: delivery.prontuario_id, reunion_id,
                status: "pendente".to_string(),
                delivered_at: None, delivered_by: None, returned_at: None, returned_by: None,
                created_at: None, updated_at: None,
            })?;
            create_log(conn, StatusTransitionLog {
                id: None, entity_type: "prontuario_delivery".to_string(),
                entity_id: delivery.id.unwrap_or(0),
                previous_status: "entregue".to_string(), new_status: "pendente".to_string(),
                changed_by: processed_by.clone(),
                notes: Some(format!("Prontuário {} automaticamente incluído para retorno na reunião {}", delivery.prontuario_id, reunion_id)),
                changed_at: None,
            })?;
            let _ = result;
            count += 1;
        }
    }
    Ok(count)
}

pub fn get_summaries_by_reunions(conn: &Connection, reunion_ids: Vec<i64>) -> Result<Vec<DeliverySummary>> {
    if reunion_ids.is_empty() { return Ok(vec![]); }
    let placeholders: Vec<String> = (1..=reunion_ids.len()).map(|i| format!("?{}", i)).collect();
    let sql = format!(
        "SELECT reunionId,
            SUM(CASE WHEN status='pendente' THEN 1 ELSE 0 END) AS pendente,
            SUM(CASE WHEN status='entregue' THEN 1 ELSE 0 END) AS entregue,
            SUM(CASE WHEN status='devolvido' THEN 1 ELSE 0 END) AS devolvido
         FROM prontuario_delivery_status WHERE reunionId IN ({}) GROUP BY reunionId",
        placeholders.join(",")
    );
    let refs: Vec<&dyn rusqlite::ToSql> = reunion_ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(refs.as_slice(), |row| {
        Ok(DeliverySummary {
            reunion_id: row.get(0)?,
            pendente: row.get(1)?,
            entregue: row.get(2)?,
            devolvido: row.get(3)?,
        })
    })?;
    rows.collect()
}
