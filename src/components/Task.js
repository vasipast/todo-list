import React, { Component } from "react";

class Task extends Component {
  render() {
    const { task, onToggle, onDelete, onEdit } = this.props;
    return (
      <div className={`task ${task.completed ? "completed" : ""}`}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div className="task-details">
          <span className="task-title">{task.title}</span>
          <span className="task-description">{task.description}</span>
          <span className="task-priority">{task.priority}</span>
        </div>
        <button className="edit-button" onClick={() => onEdit(task.id)}>
          Редактировать
        </button>
        <button className="delete-button" onClick={() => onDelete(task.id)}>
          Удалить
        </button>
      </div>
    );
  }
}

export default React.memo(Task);
