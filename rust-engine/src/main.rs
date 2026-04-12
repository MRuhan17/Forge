use axum::{
    extract::{Path, State},
    routing::{get, post, delete},
    Json, Router,
};
use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use tokio::time::{sleep, Duration};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
enum TaskStatus {
    Pending,
    Running,
    Completed,
    Failed,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Task {
    id: Uuid,
    name: String,
    status: TaskStatus,
    output: String,
    progress: u8,
    timestamp: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
struct CreateTaskRequest {
    id: Option<Uuid>,
    name: String,
}

type SharedState = Arc<DashMap<Uuid, Task>>;

#[tokio::main]
async fn main() {
    let state = Arc::new(DashMap::new());

    let app = Router::new()
        .route("/tasks", post(start_task).get(list_tasks))
        .route("/tasks/:id", get(task_details).delete(stop_task))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3002").await.unwrap();
    println!("Forge Rust Engine running on http://127.0.0.1:3002");
    axum::serve(listener, app).await.unwrap();
}

async fn start_task(
    State(state): State<SharedState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Json<Task> {
    let id = payload.id.unwrap_or_else(Uuid::new_v4);
    let task = Task {
        id,
        name: payload.name.clone(),
        status: TaskStatus::Running,
        output: String::new(),
        progress: 0,
        timestamp: Utc::now(),
    };

    state.insert(id, task.clone());

    // Simulation of async background execution with progress
    let state_clone = state.clone();
    tokio::spawn(async move {
        for i in 1..=10 {
            sleep(Duration::from_secs(1)).await;
            if let Some(mut t) = state_clone.get_mut(&id) {
                if matches!(t.status, TaskStatus::Failed) { break; } // Stopped
                t.progress = i * 10;
                if i == 10 {
                    t.status = TaskStatus::Completed;
                    t.output = format!("Finished processing {}", t.name);
                }
            } else {
                break;
            }
        }
    });

    Json(task)
}

async fn list_tasks(State(state): State<SharedState>) -> Json<Vec<Task>> {
    let tasks = state.iter().map(|kv| kv.value().clone()).collect();
    Json(tasks)
}

async fn task_details(
    Path(id): Path<Uuid>,
    State(state): State<SharedState>,
) -> Result<Json<Task>, String> {
    if let Some(task) = state.get(&id) {
        Ok(Json(task.clone()))
    } else {
        Err("Task not found".to_string())
    }
}

async fn stop_task(
    Path(id): Path<Uuid>,
    State(state): State<SharedState>,
) -> Result<Json<Task>, String> {
    if let Some(mut task) = state.get_mut(&id) {
        task.status = TaskStatus::Failed;
        task.output = "Task stopped manually".to_string();
        Ok(Json(task.clone()))
    } else {
        Err("Task not found".to_string())
    }
}
