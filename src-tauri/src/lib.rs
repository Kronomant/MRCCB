pub mod database;
pub mod config;
pub mod commands;

use database::{init_db, DbState};
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let conn = init_db(app.handle())
                .expect("Failed to initialize database");
            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Reunion
            commands::reunion_create,
            commands::reunion_get_all,
            commands::reunion_get_by_id,
            commands::reunion_update,
            commands::reunion_delete,
            // Prontuario
            commands::prontuario_create,
            commands::prontuario_get_all,
            commands::prontuario_get_by_id,
            commands::prontuario_get_by_number,
            commands::prontuario_get_by_ids,
            commands::prontuario_get_by_unity,
            commands::prontuario_get_active,
            commands::prontuario_update,
            commands::prontuario_delete,
            // Atendimento
            commands::atendimento_create,
            commands::atendimento_get_all,
            commands::atendimento_get_by_reunion,
            commands::atendimento_get_by_prontuario,
            commands::atendimento_get_by_id,
            commands::atendimento_update,
            commands::atendimento_delete,
            commands::atendimento_toggle_delivery,
            // Unity
            commands::unity_create,
            commands::unity_create_bulk,
            commands::unity_get_all,
            commands::unity_get_by_id,
            commands::unity_update,
            commands::unity_delete,
            // Treatment
            commands::treatment_create,
            commands::treatment_get_all,
            commands::treatment_get_by_reunion,
            commands::treatment_get_by_id,
            commands::treatment_update,
            commands::treatment_delete,
            // Delivery
            commands::delivery_get_by_ids,
            commands::delivery_get_by_reunion,
            commands::delivery_get_by_prontuario,
            commands::delivery_mark_delivered,
            commands::delivery_mark_returned,
            commands::delivery_update_status,
            commands::delivery_get_status_logs,
            commands::delivery_create_automatic_returns,
            commands::delivery_get_for_next_month_return,
            commands::delivery_get_summaries_by_reunions,
            // Cash Register
            commands::cash_register_create,
            commands::cash_register_get_by_reunion,
            commands::cash_register_get_by_id,
            commands::cash_register_update_opening,
            commands::cash_register_close,
            commands::cash_register_reopen,
            // Cash Ticket
            commands::cash_ticket_create,
            commands::cash_ticket_list_by_reunion,
            commands::cash_ticket_update,
            commands::cash_ticket_delete,
            commands::cash_ticket_total_by_reunion,
            // Cash Expense
            commands::cash_expense_create,
            commands::cash_expense_list_by_reunion,
            commands::cash_expense_update,
            commands::cash_expense_delete,
            commands::cash_expense_total_by_reunion,
            commands::cash_expense_totals_by_category,
            // Settings
            commands::settings_get,
            commands::settings_select_db_folder,
            commands::settings_save_db_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
