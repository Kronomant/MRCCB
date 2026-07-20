use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::Manager;

const CONFIG_FILE_NAME: &str = "settings.json";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    #[serde(rename = "dbPath")]
    pub db_path: PathBuf,
}

pub fn get_config_path(app: &tauri::AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("failed to get app data dir")
        .join(CONFIG_FILE_NAME)
}

pub fn load_config(app: &tauri::AppHandle) -> AppConfig {
    let config_path = get_config_path(app);
    if config_path.exists() {
        if let Ok(data) = fs::read_to_string(&config_path) {
            if let Ok(config) = serde_json::from_str::<AppConfig>(&data) {
                return config;
            }
        }
    }
    // Default: database.sqlite next to the executable
    let default_path = std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("database.sqlite");
    AppConfig { db_path: default_path }
}

pub fn save_config(app: &tauri::AppHandle, config: &AppConfig) -> Result<(), String> {
    let config_path = get_config_path(app);
    // Ensure parent directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(config_path, json).map_err(|e| e.to_string())?;
    Ok(())
}
