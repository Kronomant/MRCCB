use serde::Deserialize;
use serde_json::Value;
use tauri::State;
use crate::database::{DbState, reunion::*, prontuario::*, atendimento::*, unity::*, treatment::*, delivery::*, cash_register::*, cash_ticket::*, cash_expense::*};
use crate::config::{load_config, save_config, AppConfig};
use std::collections::HashMap;

// ── Helper macro to lock DB ─────────────────────────────────────────────────
macro_rules! db {
    ($state:expr) => {
        $state.0.lock().map_err(|e| e.to_string())?
    };
}

// ═══════════════════════════════════════════════════════════════════════════
//  REUNION COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn reunion_create(data: Reunion, state: State<'_, DbState>) -> Result<Reunion, String> {
    let db = db!(state);
    create_reunion(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reunion_get_all(filters: Option<ReunionFilters>, state: State<'_, DbState>) -> Result<Vec<Reunion>, String> {
    let db = db!(state);
    get_all_reunions(&db, filters).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reunion_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<Reunion>, String> {
    let db = db!(state);
    get_reunion_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reunion_update(data: Reunion, state: State<'_, DbState>) -> Result<Reunion, String> {
    let db = db!(state);
    update_reunion(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reunion_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_reunion(&db, id).map(|_| true).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRONTUARIO COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn prontuario_create(data: Prontuario, state: State<'_, DbState>) -> Result<Prontuario, String> {
    let db = db!(state);
    create_prontuario(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_all(state: State<'_, DbState>) -> Result<Vec<Prontuario>, String> {
    let db = db!(state);
    get_all_prontuarios(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<Prontuario>, String> {
    let db = db!(state);
    get_prontuario_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_by_number(number: i64, state: State<'_, DbState>) -> Result<Option<Prontuario>, String> {
    let db = db!(state);
    get_prontuario_by_number(&db, number).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_by_ids(ids: Vec<i64>, state: State<'_, DbState>) -> Result<Vec<Prontuario>, String> {
    let db = db!(state);
    get_prontuarios_by_ids(&db, ids).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_by_unity(unity_id: i64, state: State<'_, DbState>) -> Result<Vec<Prontuario>, String> {
    let db = db!(state);
    get_prontuarios_by_unity(&db, unity_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_get_active(state: State<'_, DbState>) -> Result<Vec<Prontuario>, String> {
    let db = db!(state);
    get_active_prontuarios(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_update(data: Prontuario, state: State<'_, DbState>) -> Result<Prontuario, String> {
    let db = db!(state);
    update_prontuario(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn prontuario_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_prontuario(&db, id).map(|_| true).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  ATENDIMENTO COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn atendimento_create(data: Atendimento, state: State<'_, DbState>) -> Result<Atendimento, String> {
    let db = db!(state);
    create_atendimento(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_get_all(state: State<'_, DbState>) -> Result<Vec<Atendimento>, String> {
    let db = db!(state);
    get_all_atendimentos(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_get_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Vec<Atendimento>, String> {
    let db = db!(state);
    get_atendimentos_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_get_by_prontuario(prontuario_id: i64, state: State<'_, DbState>) -> Result<Vec<Atendimento>, String> {
    let db = db!(state);
    get_atendimentos_by_prontuario(&db, prontuario_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<Atendimento>, String> {
    let db = db!(state);
    get_atendimento_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_update(data: Atendimento, state: State<'_, DbState>) -> Result<Atendimento, String> {
    let db = db!(state);
    update_atendimento(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_atendimento(&db, id).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn atendimento_toggle_delivery(id: i64, devolvido: bool, state: State<'_, DbState>) -> Result<(), String> {
    let db = db!(state);
    toggle_atendimento_delivery(&db, id, devolvido).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  UNITY COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn unity_create(data: Unity, state: State<'_, DbState>) -> Result<Unity, String> {
    let db = db!(state);
    create_unity(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unity_create_bulk(names: Vec<String>, state: State<'_, DbState>) -> Result<Vec<Unity>, String> {
    let db = db!(state);
    create_unities_bulk(&db, names).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unity_get_all(state: State<'_, DbState>) -> Result<Vec<Unity>, String> {
    let db = db!(state);
    get_all_unities(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unity_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<Unity>, String> {
    let db = db!(state);
    get_unity_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unity_update(data: Unity, state: State<'_, DbState>) -> Result<Unity, String> {
    let db = db!(state);
    update_unity(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unity_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_unity(&db, id).map(|_| true).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  TREATMENT COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn treatment_create(data: Treatment, state: State<'_, DbState>) -> Result<Treatment, String> {
    let db = db!(state);
    create_treatment(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn treatment_get_all(state: State<'_, DbState>) -> Result<Vec<Treatment>, String> {
    let db = db!(state);
    get_all_treatments(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn treatment_get_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Vec<Treatment>, String> {
    let db = db!(state);
    get_treatments_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn treatment_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<Treatment>, String> {
    let db = db!(state);
    get_treatment_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn treatment_update(data: Treatment, state: State<'_, DbState>) -> Result<Treatment, String> {
    let db = db!(state);
    update_treatment(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn treatment_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_treatment(&db, id).map(|_| true).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  DELIVERY COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn delivery_get_by_ids(prontuario_id: i64, reunion_id: i64, state: State<'_, DbState>) -> Result<Option<ProntuarioDelivery>, String> {
    let db = db!(state);
    get_by_ids(&db, prontuario_id, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_get_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Vec<ProntuarioDelivery>, String> {
    let db = db!(state);
    get_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_get_by_prontuario(prontuario_id: i64, state: State<'_, DbState>) -> Result<Vec<ProntuarioDelivery>, String> {
    let db = db!(state);
    get_by_prontuario(&db, prontuario_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_mark_delivered(prontuario_id: i64, reunion_id: i64, delivered_by: String, state: State<'_, DbState>) -> Result<ProntuarioDelivery, String> {
    let db = db!(state);
    mark_delivered(&db, prontuario_id, reunion_id, delivered_by).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_mark_returned(prontuario_id: i64, reunion_id: i64, returned_by: String, state: State<'_, DbState>) -> Result<ProntuarioDelivery, String> {
    let db = db!(state);
    mark_returned(&db, prontuario_id, reunion_id, returned_by).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_update_status(prontuario_id: i64, reunion_id: i64, status: String, by: String, state: State<'_, DbState>) -> Result<ProntuarioDelivery, String> {
    let db = db!(state);
    let now = chrono::Utc::now().to_rfc3339();
    let mut data = ProntuarioDelivery {
        id: None, prontuario_id, reunion_id, status: status.clone(),
        delivered_at: None, delivered_by: None, returned_at: None, returned_by: None,
        created_at: None, updated_at: None,
    };
    if status == "entregue" {
        data.delivered_at = Some(now.clone());
        data.delivered_by = Some(by);
    } else if status == "devolvido" {
        data.returned_at = Some(now.clone());
        data.returned_by = Some(by);
    }
    upsert_delivery(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_get_status_logs(entity_type: String, entity_id: i64, state: State<'_, DbState>) -> Result<Vec<StatusTransitionLog>, String> {
    let db = db!(state);
    get_status_logs(&db, &entity_type, entity_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_create_automatic_returns(reunion_id: i64, processed_by: String, state: State<'_, DbState>) -> Result<i64, String> {
    let db = db!(state);
    create_automatic_returns(&db, reunion_id, processed_by).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_get_for_next_month_return(state: State<'_, DbState>) -> Result<Vec<ProntuarioDelivery>, String> {
    let db = db!(state);
    get_for_next_month_return(&db).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delivery_get_summaries_by_reunions(reunion_ids: Vec<i64>, state: State<'_, DbState>) -> Result<Vec<DeliverySummary>, String> {
    let db = db!(state);
    get_summaries_by_reunions(&db, reunion_ids).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  CASH REGISTER COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[derive(Deserialize)]
pub struct CreateCashRegisterArgs {
    #[serde(rename = "reunionId")]
    pub reunion_id: i64,
    #[serde(rename = "openingValue")]
    pub opening_value: f64,
    #[serde(rename = "availableValue")]
    pub available_value: f64,
    #[serde(rename = "openingCounts")]
    pub opening_counts: Option<Value>,
}

#[derive(Deserialize)]
pub struct UpdateCashRegisterOpeningArgs {
    pub id: i64,
    pub data: UpdateCashRegisterOpeningData,
}

#[derive(Deserialize)]
pub struct UpdateCashRegisterOpeningData {
    #[serde(rename = "openingValue")]
    pub opening_value: f64,
    #[serde(rename = "availableValue")]
    pub available_value: f64,
    #[serde(rename = "openingCounts")]
    pub opening_counts: Option<Value>,
}

#[derive(Deserialize)]
pub struct CloseCashRegisterArgs {
    pub id: i64,
    #[serde(rename = "closingValue")]
    pub closing_value: f64,
    pub difference: f64,
    #[serde(rename = "closingCounts")]
    pub closing_counts: Option<Value>,
}

#[tauri::command]
pub fn cash_register_create(args: CreateCashRegisterArgs, state: State<'_, DbState>) -> Result<CashRegister, String> {
    let db = db!(state);
    create_cash_register(&db, args.reunion_id, args.opening_value, args.available_value, args.opening_counts).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_register_get_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Option<CashRegister>, String> {
    let db = db!(state);
    get_cash_register_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_register_get_by_id(id: i64, state: State<'_, DbState>) -> Result<Option<CashRegister>, String> {
    let db = db!(state);
    get_cash_register_by_id(&db, id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_register_update_opening(args: UpdateCashRegisterOpeningArgs, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    update_cash_register_opening(&db, args.id, args.data.opening_value, args.data.available_value, args.data.opening_counts)
        .map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_register_close(args: CloseCashRegisterArgs, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    close_cash_register(&db, args.id, args.closing_value, args.difference, args.closing_counts)
        .map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_register_reopen(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    reopen_cash_register(&db, id).map(|_| true).map_err(|e| e.to_string())
}

// ── Cash Ticket ──────────────────────────────────────────────────────────────

#[tauri::command]
pub fn cash_ticket_create(data: CashTicket, state: State<'_, DbState>) -> Result<CashTicket, String> {
    let db = db!(state);
    create_ticket(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_ticket_list_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Vec<CashTicket>, String> {
    let db = db!(state);
    get_tickets_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[derive(Deserialize)]
pub struct UpdateTicketArgs {
    pub id: i64,
    pub data: UpdateTicketData,
}
#[derive(Deserialize)]
pub struct UpdateTicketData {
    #[serde(rename = "volunteerName")]
    pub volunteer_name: Option<Option<String>>,
    pub value: Option<f64>,
    pub notes: Option<Option<String>>,
}

#[tauri::command]
pub fn cash_ticket_update(args: UpdateTicketArgs, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    update_ticket(&db, args.id, args.data.volunteer_name, args.data.value, args.data.notes)
        .map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_ticket_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_ticket(&db, id).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_ticket_total_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<f64, String> {
    let db = db!(state);
    get_total_tickets_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

// ── Cash Expense ─────────────────────────────────────────────────────────────

#[tauri::command]
pub fn cash_expense_create(data: CashExpense, state: State<'_, DbState>) -> Result<CashExpense, String> {
    let db = db!(state);
    create_expense(&db, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_expense_list_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<Vec<CashExpense>, String> {
    let db = db!(state);
    get_expenses_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[derive(Deserialize)]
pub struct UpdateExpenseArgs {
    pub id: i64,
    pub data: UpdateExpenseData,
}
#[derive(Deserialize)]
pub struct UpdateExpenseData {
    #[serde(rename = "establishmentName")]
    pub establishment_name: Option<String>,
    #[serde(rename = "nfeNumber")]
    pub nfe_number: Option<Option<String>>,
    pub category: Option<String>,
    pub value: Option<f64>,
    pub notes: Option<Option<String>>,
}

#[tauri::command]
pub fn cash_expense_update(args: UpdateExpenseArgs, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    update_expense(&db, args.id, args.data.establishment_name, args.data.nfe_number, args.data.category, args.data.value, args.data.notes)
        .map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_expense_delete(id: i64, state: State<'_, DbState>) -> Result<bool, String> {
    let db = db!(state);
    delete_expense(&db, id).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_expense_total_by_reunion(reunion_id: i64, state: State<'_, DbState>) -> Result<f64, String> {
    let db = db!(state);
    get_total_expenses_by_reunion(&db, reunion_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cash_expense_totals_by_category(reunion_id: i64, state: State<'_, DbState>) -> Result<HashMap<String, f64>, String> {
    let db = db!(state);
    get_totals_by_category(&db, reunion_id).map_err(|e| e.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════
//  SETTINGS COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

#[tauri::command]
pub fn settings_get(app: tauri::AppHandle) -> Result<AppConfig, String> {
    Ok(load_config(&app))
}

#[tauri::command]
pub async fn settings_select_db_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let (tx, rx) = std::sync::mpsc::channel::<Option<tauri_plugin_dialog::FilePath>>();
    app.dialog()
        .file()
        .set_title("Selecione a pasta para salvar o banco de dados")
        .pick_folder(move |path| {
            let _ = tx.send(path);
        });
    let result = rx.recv().map_err(|e| e.to_string())?;
    Ok(result.map(|p| p.to_string()))
}

#[tauri::command]
pub fn settings_save_db_path(folder_path: String, app: tauri::AppHandle) -> Result<bool, String> {
    let mut config = load_config(&app);
    config.db_path = std::path::PathBuf::from(&folder_path).join("database.sqlite");
    save_config(&app, &config)?;
    Ok(true)
}
