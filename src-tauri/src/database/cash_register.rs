use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CashRegister {
    pub id: Option<i64>,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    #[serde(rename = "openingValue")]
    pub opening_value: f64,
    #[serde(rename = "availableValue")]
    pub available_value: f64,
    #[serde(rename = "openingCounts")]
    pub opening_counts: Option<Value>,
    #[serde(rename = "closingValue")]
    pub closing_value: Option<f64>,
    #[serde(rename = "closingDifference")]
    pub closing_difference: Option<f64>,
    #[serde(rename = "closingCounts")]
    pub closing_counts: Option<Value>,
    pub status: String,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

fn parse_counts(raw: Option<String>) -> Option<Value> {
    raw.and_then(|s| serde_json::from_str(&s).ok())
}

fn serialize_counts(counts: &Option<Value>) -> Option<String> {
    counts.as_ref().and_then(|v| {
        if v.is_null() { None } else { serde_json::to_string(v).ok() }
    })
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<CashRegister> {
    let opening_counts_str: Option<String> = row.get(4)?;
    let closing_counts_str: Option<String> = row.get(7)?;
    Ok(CashRegister {
        id: row.get(0)?,
        reunion_id: row.get(1)?,
        opening_value: row.get(2)?,
        available_value: row.get(3)?,
        opening_counts: parse_counts(opening_counts_str),
        closing_value: row.get(5)?,
        closing_difference: row.get(6)?,
        closing_counts: parse_counts(closing_counts_str),
        status: row.get(8)?,
        created_at: row.get(9)?,
        updated_at: row.get(10)?,
    })
}

pub fn create_cash_register(conn: &Connection, reunion_id: i64, opening_value: f64, available_value: f64, opening_counts: Option<Value>) -> Result<CashRegister> {
    // Return existing if already exists (idempotent)
    if let Some(existing) = get_cash_register_by_reunion(conn, reunion_id)? {
        return Ok(existing);
    }
    conn.execute(
        "INSERT INTO cash_register (reunionId, openingValue, availableValue, openingCounts, status)
         VALUES (?1, ?2, ?3, ?4, 'open')",
        params![reunion_id, opening_value, available_value, serialize_counts(&opening_counts)],
    )?;
    let id = conn.last_insert_rowid();
    Ok(CashRegister {
        id: Some(id),
        reunion_id,
        opening_value,
        available_value,
        opening_counts,
        closing_value: None,
        closing_difference: None,
        closing_counts: None,
        status: "open".to_string(),
        created_at: None,
        updated_at: None,
    })
}

pub fn get_cash_register_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Option<CashRegister>> {
    let mut stmt = conn.prepare(
        "SELECT id,reunionId,openingValue,availableValue,openingCounts,closingValue,closingDifference,closingCounts,status,createdAt,updatedAt
         FROM cash_register WHERE reunionId=?1"
    )?;
    let mut rows = stmt.query_map(params![reunion_id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn get_cash_register_by_id(conn: &Connection, id: i64) -> Result<Option<CashRegister>> {
    let mut stmt = conn.prepare(
        "SELECT id,reunionId,openingValue,availableValue,openingCounts,closingValue,closingDifference,closingCounts,status,createdAt,updatedAt
         FROM cash_register WHERE id=?1"
    )?;
    let mut rows = stmt.query_map(params![id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn update_cash_register_opening(conn: &Connection, id: i64, opening_value: f64, available_value: f64, opening_counts: Option<Value>) -> Result<()> {
    conn.execute(
        "UPDATE cash_register SET openingValue=?1, availableValue=?2, openingCounts=?3, updatedAt=CURRENT_TIMESTAMP WHERE id=?4",
        params![opening_value, available_value, serialize_counts(&opening_counts), id],
    )?;
    Ok(())
}

pub fn close_cash_register(conn: &Connection, id: i64, closing_value: f64, difference: f64, closing_counts: Option<Value>) -> Result<()> {
    conn.execute(
        "UPDATE cash_register SET closingValue=?1, closingDifference=?2, closingCounts=?3, status='closed', updatedAt=CURRENT_TIMESTAMP WHERE id=?4",
        params![closing_value, difference, serialize_counts(&closing_counts), id],
    )?;
    Ok(())
}

pub fn reopen_cash_register(conn: &Connection, id: i64) -> Result<()> {
    conn.execute(
        "UPDATE cash_register SET status='open', closingValue=NULL, closingDifference=NULL, closingCounts=NULL, updatedAt=CURRENT_TIMESTAMP WHERE id=?1",
        params![id],
    )?;
    Ok(())
}
