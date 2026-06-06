#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_global_shortcut::GlobalShortcutExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_single_instance::init(|app, _args, _cwd| {
                let window = app.get_webview_window("main");
                if let Some(window) = window {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }),
        )
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    // We only registered CmdOrCtrl+Shift+H, so any pressed event toggles the window
                    if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        let window = app.get_webview_window("main");
                        if let Some(win) = window {
                            if let Ok(visible) = win.is_visible() {
                                if visible {
                                    let _ = win.hide();
                                } else {
                                    let _ = win.show();
                                    let _ = win.set_focus();
                                }
                            }
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Show window after a brief delay to avoid white flash on startup
            let win_clone = window.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(400));
                let _ = win_clone.show();
                let _ = win_clone.set_focus();
            });

            // Register global shortcut: Cmd/Ctrl + Shift + H
            app.global_shortcut()
                .register("CmdOrCtrl+Shift+H")?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}