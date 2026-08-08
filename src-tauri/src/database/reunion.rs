use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Reunion {
    pub id: Option<i64>,
    pub name: String,
    pub value: Option<f64>,
    #[serde(rename = "basketValue")]
    pub basket_value: Option<f64>,
    #[serde(rename = "treatmentQuantity")]
    pub treatment_quantity: Option<i64>,
    #[serde(rename = "foodBasketQuantity")]
    pub food_basket_quantity: Option<i64>,
    pub date: Option<String>,
    pub status: Option<String>,
    #[serde(rename = "totalAtendimentoValue", skip_serializing_if = "Option::is_none")]
    pub total_atendimento_value: Option<f64>,
    #[serde(rename = "totalBasketValue", skip_serializing_if = "Option::is_none")]
    pub total_basket_value: Option<f64>,
    #[serde(rename = "deliveredQuantity", skip_serializing_if = "Option::is_none")]
    pub delivered_quantity: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct ReunionFilters {
    #[serde(rename = "startDate")]
    pub start_date: Option<String>,
    #[serde(rename = "endDate")]
    pub end_date: Option<String>,
    pub status: Option<String>,
}

pub fn create_reunion(conn: &Connection, data: Reunion) -> Result<Reunion> {
    conn.execute(
        "INSERT INTO reunions (name, value, basketValue, treatmentQuantity, foodBasketQuantity, date, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            data.name,
            data.value,
            data.basket_value,
            data.treatment_quantity,
            data.food_basket_quantity,
            data.date,
            data.status,
        ],
    )?;
    let id = conn.last_insert_rowid();
    Ok(Reunion { id: Some(id), ..data })
}

pub fn get_all_reunions(conn: &Connection, filters: Option<ReunionFilters>) -> Result<Vec<Reunion>> {
    let mut query = String::from("
        SELECT
            r.id, r.name, r.value, r.basketValue, r.date, r.status,
            COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id), 0) as treatmentQuantity,
            COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) as foodBasketQuantity,
            COALESCE((SELECT SUM(a.value) FROM atendimentos a WHERE a.reunionId = r.id), 0) as totalAtendimentoValue,
            COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) * r.basketValue as totalBasketValue,
            COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id AND a.devolvido = 1), 0) as deliveredQuantity
        FROM reunions r
    ");

    let mut conditions: Vec<String> = Vec::new();
    let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if let Some(ref f) = filters {
        if let Some(ref start) = f.start_date {
            conditions.push(format!("r.date >= ?{}", params_vec.len() + 1));
            params_vec.push(Box::new(start.clone()));
        }
        if let Some(ref end) = f.end_date {
            conditions.push(format!("r.date <= ?{}", params_vec.len() + 1));
            params_vec.push(Box::new(end.clone()));
        }
        if let Some(ref status) = f.status {
            conditions.push(format!("r.status = ?{}", params_vec.len() + 1));
            params_vec.push(Box::new(status.clone()));
        }
    }

    if !conditions.is_empty() {
        query.push_str(&format!(" WHERE {}", conditions.join(" AND ")));
    }
    query.push_str(" ORDER BY r.date DESC");

    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();
    let mut stmt = conn.prepare(&query)?;

    let rows = stmt.query_map(params_refs.as_slice(), |row| {
        Ok(Reunion {
            id: row.get(0)?,
            name: row.get(1)?,
            value: row.get(2)?,
            basket_value: row.get(3)?,
            date: row.get(4)?,
            status: row.get(5)?,
            treatment_quantity: row.get(6)?,
            food_basket_quantity: row.get(7)?,
            total_atendimento_value: row.get(8)?,
            total_basket_value: row.get(9)?,
            delivered_quantity: row.get(10)?,
        })
    })?;

    rows.collect()
}

pub fn get_reunion_by_id(conn: &Connection, id: i64) -> Result<Option<Reunion>> {
    let mut stmt = conn.prepare("
        SELECT
            r.id, r.name, r.value, r.basketValue, r.date, r.status,
            COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id), 0) as treatmentQuantity,
            COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) as foodBasketQuantity,
            COALESCE((SELECT SUM(a.value) FROM atendimentos a WHERE a.reunionId = r.id), 0) as totalAtendimentoValue,
            COALESCE((SELECT SUM(a.foodBasketQuantity) FROM atendimentos a WHERE a.reunionId = r.id), 0) * r.basketValue as totalBasketValue,
            COALESCE((SELECT COUNT(*) FROM atendimentos a WHERE a.reunionId = r.id AND a.devolvido = 1), 0) as deliveredQuantity
        FROM reunions r
        WHERE r.id = ?1
    ")?;
    let mut rows = stmt.query_map(params![id], |row| {
        Ok(Reunion {
            id: row.get(0)?,
            name: row.get(1)?,
            value: row.get(2)?,
            basket_value: row.get(3)?,
            date: row.get(4)?,
            status: row.get(5)?,
            treatment_quantity: row.get(6)?,
            food_basket_quantity: row.get(7)?,
            total_atendimento_value: row.get(8)?,
            total_basket_value: row.get(9)?,
            delivered_quantity: row.get(10)?,
        })
    })?;
    Ok(rows.next().transpose()?)
}

pub fn update_reunion(conn: &Connection, data: Reunion) -> Result<Reunion> {
    let id = data.id.ok_or_else(|| rusqlite::Error::InvalidQuery)?;
    conn.execute(
        "UPDATE reunions SET name=?1, value=?2, basketValue=?3, treatmentQuantity=?4, foodBasketQuantity=?5, date=?6, status=?7 WHERE id=?8",
        params![
            data.name, data.value, data.basket_value,
            data.treatment_quantity, data.food_basket_quantity,
            data.date, data.status, id,
        ],
    )?;
    get_reunion_by_id(conn, id).map(|r| r.unwrap_or(data))
}

pub fn delete_reunion(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM atendimentos WHERE reunionId = ?1", params![id])?;
    conn.execute("DELETE FROM reunions WHERE id = ?1", params![id])?;
    Ok(())
}
