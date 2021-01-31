import React from "react";
import "./Task.scss";

const Task = ({ task, index }) => (
  <li className="task" key={index}>
    <div className="task__content">{task.text}</div>
    <div className="task__meta">
      {task.value} ・ {task.type}
    </div>
  </li>
);

export default Task;
