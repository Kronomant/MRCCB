use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Treatment {
    pub id: Option<i64>,
    #[serde(rename = "enchiridionId")]
    pub enchiridion_id: i64,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    #[serde(rename = "unityId")]
    pub unity_id: i64,
    pub date: String,
    #[serde(rename = "aprovedValue")]
    pub aproved_value: bool,
    pub value: f64,
    #[serde(rename = "foodBasketQuantity")]
    pub food_basket_quantity: i64,
    #[serde(rename = "onlyClothes")]
    pub only_clothes: bool,
    pub emergency: bool,
    pub returned: bool,
    pub repeat: bool,
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<Treatment> {
    Ok(Treatment {
        id: row.get(0)?,
        enchiridion_id: row.get(1)?,
        reunion_id: row.get(2)?,
        unity_id: row.get(3)?,
        date: row.get(4)?,
        aproved_value: { let v: i64 = row.get(5)?; v != 0 },
        value: row.get(6)?,
        food_basket_quantity: row.get(7)?,
        only_clothes: { let v: i64 = row.get(8)?; v != 0 },
        emergency: { let v: i64 = row.get(9)?; v != 0 },
        returned: { let v: i64 = row.get(10)?; v != 0 },
        repeat: { let v: i64 = row.get(11)?; v != 0 },
    })
}

pub fn create_treatment(conn: &Connection, data: Treatment) -> Result<Treatment> {
    conn.execute(
        "INSERT INTO treatments (enchiridionId, reunionId, unityId, date, aprovedValue, value, foodBasketQuantity, onlyClothes, emergency, returned, repeat)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)",
        params![
            data.enchiridion_id, data.reunion_id, data.unity_id, data.date,
            if data.aproved_value { 1 } else { 0 }, data.value, data.food_basket_quantity,
            if data.only_clothes { 1 } else { 0 },
            if data.emergency { 1 } else { 0 },
            if data.returned { 1 } else { 0 },
            if data.repeat { 1 } else { 0 },
        ],
    )?;
    let id = conn.last_insert_rowid();
    Ok(Treatment { id: Some(id), ..data })
}

pub fn get_all_treatments(conn: &Connection) -> Result<Vec<Treatment>> {
    let mut stmt = conn.prepare("SELECT id,enchiridionId,reunionId,unityId,date,aprovedValue,value,foodBasketQuantity,onlyClothes,emergency,returned,repeat FROM treatments ORDER BY date DESC")?;
    let rows = stmt.query_map([], map_row)?;
    rows.collect()
}

pub fn get_treatments_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Vec<Treatment>> {
    let mut stmt = conn.prepare("SELECT id,enchiridionId,reunionId,unityId,date,aprovedValue,value,foodBasketQuantity,onlyClothes,emergency,returned,repeat FROM treatments WHERE reunionId=?1")?;
    let rows = stmt.query_map(params![reunion_id], map_row)?;
    rows.collect()
}

pub fn get_treatment_by_id(conn: &Connection, id: i64) -> Result<Option<Treatment>> {
    let mut stmt = conn.prepare("SELECT id,enchiridionId,reunionId,unityId,date,aprovedValue,value,foodBasketQuantity,onlyClothes,emergency,returned,repeat FROM treatments WHERE id=?1")?;
    let mut rows = stmt.query_map(params![id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn update_treatment(conn: &Connection, data: Treatment) -> Result<Treatment> {
    let id = data.id.ok_or(rusqlite::Error::InvalidQuery)?;
    conn.execute(
        "UPDATE treatments SET enchiridionId=?1,reunionId=?2,unityId=?3,date=?4,aprovedValue=?5,value=?6,foodBasketQuantity=?7,onlyClothes=?8,emergency=?9,returned=?10,repeat=?11 WHERE id=?12",
        params![
            data.enchiridion_id, data.reunion_id, data.unity_id, data.date,
            if data.aproved_value { 1 } else { 0 }, data.value, data.food_basket_quantity,
            if data.only_clothes { 1 } else { 0 },
            if data.emergency { 1 } else { 0 },
            if data.returned { 1 } else { 0 },
            if data.repeat { 1 } else { 0 },
            id,
        ],
    )?;
    Ok(data)
}

pub fn delete_treatment(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM treatments WHERE id=?1", params![id])?;
    Ok(())
}
