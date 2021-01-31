import React from "react";
import "./Task.scss";

const Task = ({ task }) => (
  <li class="task">
    <div class="task__content">{task.text}</div>
    <div class="task__meta">
      {task.value} ・ {task.type}
    </div>
  </li>
);

export default Task;
