use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CashTicket {
    pub id: Option<i64>,
    #[serde(rename = "cashRegisterId")]
    pub cash_register_id: i64,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    #[serde(rename = "volunteerName")]
    pub volunteer_name: Option<String>,
    pub value: f64,
    pub notes: Option<String>,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<CashTicket> {
    Ok(CashTicket {
        id: row.get(0)?,
        cash_register_id: row.get(1)?,
        reunion_id: row.get(2)?,
        volunteer_name: row.get(3)?,
        value: row.get(4)?,
        notes: row.get(5)?,
        created_at: row.get(6)?,
    })
}

pub fn create_ticket(conn: &Connection, data: CashTicket) -> Result<CashTicket> {
    conn.execute(
        "INSERT INTO cash_register_tickets (cashRegisterId, reunionId, volunteerName, value, notes) VALUES (?1,?2,?3,?4,?5)",
        params![data.cash_register_id, data.reunion_id, data.volunteer_name, data.value, data.notes],
    )?;
    let id = conn.last_insert_rowid();
    Ok(CashTicket { id: Some(id), created_at: Some(chrono::Utc::now().to_rfc3339()), ..data })
}

pub fn get_tickets_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Vec<CashTicket>> {
    let mut stmt = conn.prepare("SELECT id,cashRegisterId,reunionId,volunteerName,value,notes,createdAt FROM cash_register_tickets WHERE reunionId=?1 ORDER BY createdAt ASC")?;
    let rows = stmt.query_map(params![reunion_id], map_row)?;
    rows.collect()
}

pub fn update_ticket(conn: &Connection, id: i64, volunteer_name: Option<Option<String>>, value: Option<f64>, notes: Option<Option<String>>) -> Result<()> {
    let mut updates: Vec<String> = Vec::new();
    let mut vals: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
    if let Some(vn) = volunteer_name {
        updates.push(format!("volunteerName = ?{}", vals.len() + 1));
        vals.push(Box::new(vn));
    }
    if let Some(v) = value {
        updates.push(format!("value = ?{}", vals.len() + 1));
        vals.push(Box::new(v));
    }
    if let Some(n) = notes {
        updates.push(format!("notes = ?{}", vals.len() + 1));
        vals.push(Box::new(n));
    }
    if updates.is_empty() { return Ok(()); }
    vals.push(Box::new(id));
    let sql = format!("UPDATE cash_register_tickets SET {} WHERE id = ?{}", updates.join(", "), vals.len());
    let params_refs: Vec<&dyn rusqlite::ToSql> = vals.iter().map(|p| p.as_ref()).collect();
    conn.execute(&sql, params_refs.as_slice())?;
    Ok(())
}

pub fn delete_ticket(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM cash_register_tickets WHERE id=?1", params![id])?;
    Ok(())
}

pub fn get_total_tickets_by_reunion(conn: &Connection, reunion_id: i64) -> Result<f64> {
    let mut stmt = conn.prepare("SELECT COALESCE(SUM(value), 0) FROM cash_register_tickets WHERE reunionId=?1")?;
    let total: f64 = stmt.query_row(params![reunion_id], |row| row.get(0))?;
    Ok(total)
}
