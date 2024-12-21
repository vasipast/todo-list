import React, { Component } from "react";
import Task from "./components/Task";
import "./styles.css";

const generateRandomTask = (id) => {
  const titles = ["Задача 1", "Задача 2", "Задача 3", "Задача 4", "Задача 5"];
  const descriptions = [
    "Описание задачи 1",
    "Описание задачи 2",
    "Описание задачи 3",
    "Описание задачи 4",
    "Описание задачи 5",
  ];
  const priorities = ["срочно", "средне", "не срочно"];

  return {
    id: id,
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    completed: Math.random() < 0.5,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
  };
};

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      title: "",
      description: "",
      priority: "средне",
      searchTerm: "",
      selectedPriorities: [],
      showOnlyIncomplete: false,
      hasSearched: false,
      editTaskId: null,
      editTitle: "",
      editDescription: "",
      editPriority: "средне",
    };
  }

  handleSearch = () => {
    this.setState({ hasSearched: true });
  };

  handleAddTask = () => {
    const { title, description, priority } = this.state;
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
    };

    this.setState((prevState) => ({
      tasks: [...prevState.tasks, newTask],
      title: "",
      description: "",
      priority: "средне",
    }));
  };

  handleGenerateTasks = () => {
    const newTasks = [];
    for (let i = 0; i < 1000; i++) {
      newTasks.push(generateRandomTask(Date.now() + i));
    }
    this.setState((prevState) => ({
      tasks: [...prevState.tasks, ...newTasks],
    }));
  };

  handleToggleTask = (taskId) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  handleDeleteTask = (taskId) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task) => task.id !== taskId),
    }));
  };

  handleEditTask = (taskId) => {
    const task = this.state.tasks.find((task) => task.id === taskId);
    if (task) {
      this.setState({
        editTaskId: taskId,
        editTitle: task.title,
        editDescription: task.description,
        editPriority: task.priority,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  handleSaveEditTask = () => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === prevState.editTaskId
          ? {
              ...task,
              title: prevState.editTitle,
              description: prevState.editDescription,
              priority: prevState.editPriority,
            }
          : task
      ),
      editTaskId: null,
      editTitle: "",
      editDescription: "",
      editPriority: "средне",
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value.toLowerCase() });
  };

  handleFilterToggle = () => {
    this.setState((prevState) => ({
      showOnlyIncomplete: !prevState.showOnlyIncomplete,
      hasSearched: true,
    }));
  };

  handlePriorityChange = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      selectedPriorities: checked
        ? [...prevState.selectedPriorities, value]
        : prevState.selectedPriorities.filter((p) => p !== value),
    }));
  };

  filteredTasks = () => {
    const { tasks, searchTerm, selectedPriorities, showOnlyIncomplete } =
      this.state;
    return tasks.filter(
      (task) =>
        (task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)) &&
        (selectedPriorities.length === 0 ||
          selectedPriorities.includes(task.priority)) &&
        (!showOnlyIncomplete || !task.completed)
    );
  };

  availablePriorities = () => {
    return [...new Set(this.state.tasks.map((task) => task.priority))];
  };

  render() {
    const {
      title,
      description,
      priority,
      editTaskId,
      editTitle,
      editDescription,
      editPriority,
      showOnlyIncomplete,
      hasSearched,
    } = this.state;
    const filteredTasks = this.filteredTasks();
    const availablePriorities = this.availablePriorities();

    return (
      <div className="todo-app">
        <h1>TODO List</h1>

        <div className="search-task">
          <input
            type="text"
            placeholder="Поиск..."
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
          />
          <button onClick={this.handleSearch}>Поиск</button>
        </div>

        <div className="add-task">
          <input
            type="text"
            name="title"
            value={editTaskId ? editTitle : title}
            onChange={(e) =>
              editTaskId
                ? this.setState({ editTitle: e.target.value })
                : this.setState({ title: e.target.value })
            }
            placeholder="Заголовок"
          />
          <input
            type="text"
            name="description"
            value={editTaskId ? editDescription : description}
            onChange={(e) =>
              editTaskId
                ? this.setState({ editDescription: e.target.value })
                : this.setState({ description: e.target.value })
            }
            placeholder="Описание"
          />

          <select
            value={editTaskId ? editPriority : priority}
            onChange={(e) =>
              editTaskId
                ? this.setState({ editPriority: e.target.value })
                : this.setState({ priority: e.target.value })
            }
          >
            <option value="срочно">Срочно</option>
            <option value="средне">Средне</option>
            <option value="не срочно">Не срочно</option>
          </select>

          {editTaskId ? (
            <button onClick={this.handleSaveEditTask}>Сохранить</button>
          ) : (
            <button onClick={this.handleAddTask}>Добавить</button>
          )}

          {!editTaskId && (
            <button onClick={this.handleGenerateTasks}>
              Сгенерировать 1000 задач
            </button>
          )}
        </div>

        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={showOnlyIncomplete}
              onChange={this.handleFilterToggle}
            />
            Только невыполненные
          </label>
        </div>

        <div className="priority-filters">
          {availablePriorities.map((priority) => (
            <label key={priority}>
              <input
                type="checkbox"
                value={priority}
                onChange={this.handlePriorityChange}
              />
              {priority}
            </label>
          ))}
        </div>

        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onToggle={this.handleToggleTask}
                onDelete={this.handleDeleteTask}
                onEdit={this.handleEditTask}
              />
            ))
          ) : hasSearched ? (
            <div className="no-tasks-message">
              По вашим критериям ничего не найдено
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default TodoApp;
