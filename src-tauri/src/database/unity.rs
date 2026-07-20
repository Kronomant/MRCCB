use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Unity {
    pub id: Option<i64>,
    pub name: String,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<Unity> {
    Ok(Unity {
        id: row.get(0)?,
        name: row.get(1)?,
        created_at: row.get(2)?,
        updated_at: row.get(3)?,
    })
}

pub fn create_unity(conn: &Connection, data: Unity) -> Result<Unity> {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO unities (name, createdAt, updatedAt) VALUES (?1, ?2, ?3)",
        params![data.name, now, now],
    )?;
    let id = conn.last_insert_rowid();
    Ok(Unity { id: Some(id), created_at: Some(now.clone()), updated_at: Some(now), ..data })
}

pub fn create_unities_bulk(conn: &Connection, names: Vec<String>) -> Result<Vec<Unity>> {
    let now = chrono::Utc::now().to_rfc3339();
    let mut results = Vec::new();
    for name in names {
        let trimmed = name.trim().to_string();
        conn.execute(
            "INSERT INTO unities (name, createdAt, updatedAt) VALUES (?1, ?2, ?3)",
            params![trimmed, now, now],
        )?;
        results.push(Unity {
            id: Some(conn.last_insert_rowid()),
            name: trimmed,
            created_at: Some(now.clone()),
            updated_at: Some(now.clone()),
        });
    }
    Ok(results)
}

pub fn get_all_unities(conn: &Connection) -> Result<Vec<Unity>> {
    let mut stmt = conn.prepare("SELECT id, name, createdAt, updatedAt FROM unities ORDER BY name ASC")?;
    let rows = stmt.query_map([], map_row)?;
    rows.collect()
}

pub fn get_unity_by_id(conn: &Connection, id: i64) -> Result<Option<Unity>> {
    let mut stmt = conn.prepare("SELECT id, name, createdAt, updatedAt FROM unities WHERE id=?1")?;
    let mut rows = stmt.query_map(params![id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn update_unity(conn: &Connection, data: Unity) -> Result<Unity> {
    let id = data.id.ok_or(rusqlite::Error::InvalidQuery)?;
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE unities SET name=?1, updatedAt=?2 WHERE id=?3",
        params![data.name, now, id],
    )?;
    Ok(Unity { updated_at: Some(now), ..data })
}

pub fn delete_unity(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM unities WHERE id=?1", params![id])?;
    Ok(())
}
