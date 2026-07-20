use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CashExpense {
    pub id: Option<i64>,
    #[serde(rename = "cashRegisterId")]
    pub cash_register_id: i64,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    #[serde(rename = "establishmentName")]
    pub establishment_name: String,
    #[serde(rename = "nfeNumber")]
    pub nfe_number: Option<String>,
    pub category: String,
    pub value: f64,
    pub notes: Option<String>,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<CashExpense> {
    Ok(CashExpense {
        id: row.get(0)?,
        cash_register_id: row.get(1)?,
        reunion_id: row.get(2)?,
        establishment_name: row.get(3)?,
        nfe_number: row.get(4)?,
        category: row.get(5)?,
        value: row.get(6)?,
        notes: row.get(7)?,
        created_at: row.get(8)?,
    })
}

pub fn create_expense(conn: &Connection, data: CashExpense) -> Result<CashExpense> {
    conn.execute(
        "INSERT INTO cash_register_expenses (cashRegisterId, reunionId, establishmentName, nfeNumber, category, value, notes) VALUES (?1,?2,?3,?4,?5,?6,?7)",
        params![data.cash_register_id, data.reunion_id, data.establishment_name, data.nfe_number, data.category, data.value, data.notes],
    )?;
    let id = conn.last_insert_rowid();
    Ok(CashExpense { id: Some(id), created_at: Some(chrono::Utc::now().to_rfc3339()), ..data })
}

pub fn get_expenses_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Vec<CashExpense>> {
    let mut stmt = conn.prepare("SELECT id,cashRegisterId,reunionId,establishmentName,nfeNumber,category,value,notes,createdAt FROM cash_register_expenses WHERE reunionId=?1 ORDER BY createdAt ASC")?;
    let rows = stmt.query_map(params![reunion_id], map_row)?;
    rows.collect()
}

pub fn update_expense(conn: &Connection, id: i64, establishment_name: Option<String>, nfe_number: Option<Option<String>>, category: Option<String>, value: Option<f64>, notes: Option<Option<String>>) -> Result<()> {
    let mut updates: Vec<String> = Vec::new();
    let mut vals: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();
    if let Some(v) = establishment_name {
        updates.push(format!("establishmentName = ?{}", vals.len() + 1)); vals.push(Box::new(v));
    }
    if let Some(v) = nfe_number {
        updates.push(format!("nfeNumber = ?{}", vals.len() + 1)); vals.push(Box::new(v));
    }
    if let Some(v) = category {
        updates.push(format!("category = ?{}", vals.len() + 1)); vals.push(Box::new(v));
    }
    if let Some(v) = value {
        updates.push(format!("value = ?{}", vals.len() + 1)); vals.push(Box::new(v));
    }
    if let Some(v) = notes {
        updates.push(format!("notes = ?{}", vals.len() + 1)); vals.push(Box::new(v));
    }
    if updates.is_empty() { return Ok(()); }
    vals.push(Box::new(id));
    let sql = format!("UPDATE cash_register_expenses SET {} WHERE id = ?{}", updates.join(", "), vals.len());
    let refs: Vec<&dyn rusqlite::ToSql> = vals.iter().map(|p| p.as_ref()).collect();
    conn.execute(&sql, refs.as_slice())?;
    Ok(())
}

pub fn delete_expense(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM cash_register_expenses WHERE id=?1", params![id])?;
    Ok(())
}

pub fn get_total_expenses_by_reunion(conn: &Connection, reunion_id: i64) -> Result<f64> {
    let mut stmt = conn.prepare("SELECT COALESCE(SUM(value), 0) FROM cash_register_expenses WHERE reunionId=?1")?;
    Ok(stmt.query_row(params![reunion_id], |row| row.get(0))?)
}

pub fn get_totals_by_category(conn: &Connection, reunion_id: i64) -> Result<HashMap<String, f64>> {
    let mut stmt = conn.prepare("SELECT category, SUM(value) as total FROM cash_register_expenses WHERE reunionId=?1 GROUP BY category")?;
    let rows = stmt.query_map(params![reunion_id], |row| {
        Ok((row.get::<_, String>(0)?, row.get::<_, f64>(1)?))
    })?;
    let mut map = HashMap::new();
    for row in rows {
        let (cat, total) = row?;
        map.insert(cat, total);
    }
    Ok(map)
}
