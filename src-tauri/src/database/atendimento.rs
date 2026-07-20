use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Atendimento {
    pub id: Option<i64>,
    #[serde(rename = "prontuarioId")]
    pub prontuario_id: i64,
    #[serde(rename = "prontuarioNumber")]
    pub prontuario_number: i64,
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    pub date: String,
    #[serde(rename = "aprovedValue")]
    pub aproved_value: bool,
    pub value: f64,
    #[serde(rename = "foodBasketQuantity")]
    pub food_basket_quantity: i64,
    #[serde(rename = "onlyClothes")]
    pub only_clothes: bool,
    pub emergency: bool,
    pub representacao: bool,
    pub devolvido: bool,
    pub repeat: bool,
    pub ministerio: bool,
    pub roupas: bool,
    #[serde(rename = "createdAt", skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(rename = "updatedAt", skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

fn map_row(row: &rusqlite::Row) -> rusqlite::Result<Atendimento> {
    Ok(Atendimento {
        id: row.get(0)?,
        prontuario_id: row.get(1)?,
        reunion_id: row.get(2)?,
        date: row.get(3)?,
        aproved_value: { let v: i64 = row.get(4)?; v != 0 },
        value: row.get(5)?,
        food_basket_quantity: row.get(6)?,
        only_clothes: { let v: i64 = row.get(7)?; v != 0 },
        emergency: { let v: i64 = row.get(8)?; v != 0 },
        representacao: { let v: i64 = row.get(9)?; v != 0 },
        devolvido: { let v: i64 = row.get(10)?; v != 0 },
        repeat: { let v: i64 = row.get(11)?; v != 0 },
        ministerio: { let v: i64 = row.get(12)?; v != 0 },
        roupas: { let v: i64 = row.get(13)?; v != 0 },
        created_at: row.get(14)?,
        updated_at: row.get(15)?,
        prontuario_number: row.get(16).unwrap_or(0),
    })
}

pub fn create_atendimento(conn: &Connection, data: Atendimento) -> Result<Atendimento> {
    conn.execute(
        "INSERT INTO atendimentos
            (prontuarioId, reunionId, date, aprovedValue, value, foodBasketQuantity,
             onlyClothes, emergency, representacao, devolvido, repeat, ministerio,
             roupas, createdAt, updatedAt, prontuarioNumber)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?14)",
        params![
            data.prontuario_id, data.reunion_id, data.date,
            if data.aproved_value { 1 } else { 0 },
            data.value, data.food_basket_quantity,
            if data.only_clothes { 1 } else { 0 },
            if data.emergency { 1 } else { 0 },
            if data.representacao { 1 } else { 0 },
            if data.devolvido { 1 } else { 0 },
            if data.repeat { 1 } else { 0 },
            if data.ministerio { 1 } else { 0 },
            if data.roupas { 1 } else { 0 },
            data.prontuario_number,
        ],
    )?;
    let id = conn.last_insert_rowid();
    get_atendimento_by_id(conn, id).map(|r| r.unwrap())
}

pub fn get_all_atendimentos(conn: &Connection) -> Result<Vec<Atendimento>> {
    let mut stmt = conn.prepare(
        "SELECT id,prontuarioId,reunionId,date,aprovedValue,value,foodBasketQuantity,
                onlyClothes,emergency,representacao,devolvido,repeat,ministerio,roupas,
                createdAt,updatedAt,prontuarioNumber
         FROM atendimentos ORDER BY date DESC"
    )?;
    let rows = stmt.query_map([], map_row)?;
    rows.collect()
}

pub fn get_atendimentos_by_reunion(conn: &Connection, reunion_id: i64) -> Result<Vec<Atendimento>> {
    let mut stmt = conn.prepare(
        "SELECT id,prontuarioId,reunionId,date,aprovedValue,value,foodBasketQuantity,
                onlyClothes,emergency,representacao,devolvido,repeat,ministerio,roupas,
                createdAt,updatedAt,prontuarioNumber
         FROM atendimentos WHERE reunionId=?1 ORDER BY date DESC"
    )?;
    let rows = stmt.query_map(params![reunion_id], map_row)?;
    rows.collect()
}

pub fn get_atendimentos_by_prontuario(conn: &Connection, prontuario_id: i64) -> Result<Vec<Atendimento>> {
    let mut stmt = conn.prepare(
        "SELECT id,prontuarioId,reunionId,date,aprovedValue,value,foodBasketQuantity,
                onlyClothes,emergency,representacao,devolvido,repeat,ministerio,roupas,
                createdAt,updatedAt,prontuarioNumber
         FROM atendimentos WHERE prontuarioId=?1 ORDER BY date DESC"
    )?;
    let rows = stmt.query_map(params![prontuario_id], map_row)?;
    rows.collect()
}

pub fn get_atendimento_by_id(conn: &Connection, id: i64) -> Result<Option<Atendimento>> {
    let mut stmt = conn.prepare(
        "SELECT id,prontuarioId,reunionId,date,aprovedValue,value,foodBasketQuantity,
                onlyClothes,emergency,representacao,devolvido,repeat,ministerio,roupas,
                createdAt,updatedAt,prontuarioNumber
         FROM atendimentos WHERE id=?1"
    )?;
    let mut rows = stmt.query_map(params![id], map_row)?;
    Ok(rows.next().transpose()?)
}

pub fn update_atendimento(conn: &Connection, data: Atendimento) -> Result<Atendimento> {
    let id = data.id.ok_or(rusqlite::Error::InvalidQuery)?;
    conn.execute(
        "UPDATE atendimentos SET
            prontuarioId=?1, reunionId=?2, date=?3, aprovedValue=?4, value=?5,
            foodBasketQuantity=?6, onlyClothes=?7, emergency=?8, representacao=?9,
            devolvido=?10, repeat=?11, ministerio=?12, roupas=?13, prontuarioNumber=?14,
            updatedAt=CURRENT_TIMESTAMP
         WHERE id=?15",
        params![
            data.prontuario_id, data.reunion_id, data.date,
            if data.aproved_value { 1 } else { 0 },
            data.value, data.food_basket_quantity,
            if data.only_clothes { 1 } else { 0 },
            if data.emergency { 1 } else { 0 },
            if data.representacao { 1 } else { 0 },
            if data.devolvido { 1 } else { 0 },
            if data.repeat { 1 } else { 0 },
            if data.ministerio { 1 } else { 0 },
            if data.roupas { 1 } else { 0 },
            data.prontuario_number,
            id,
        ],
    )?;
    get_atendimento_by_id(conn, id).map(|r| r.unwrap())
}

pub fn toggle_atendimento_delivery(conn: &Connection, id: i64, devolvido: bool) -> Result<()> {
    conn.execute(
        "UPDATE atendimentos SET devolvido=?1, updatedAt=CURRENT_TIMESTAMP WHERE id=?2",
        params![if devolvido { 1 } else { 0 }, id],
    )?;
    Ok(())
}

pub fn delete_atendimento(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM atendimentos WHERE id=?1", params![id])?;
    Ok(())
}
