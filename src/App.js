import store from "store";
import moment from "moment";
import * as _ from "lodash";

import data from "./Data";

import React from "react";
import Task from "./component/Task/Task";
import Card from "./component/Card/Card";
import "./App.scss";

export default function App() {
  const totalCapacity = 150;
  let currentCapacity = totalCapacity;

  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const checkIfDailyTasksEmpty = () => {
    const dailyTasks = store.get("dailyTasks");

    // If dailyTasks object already present do nothing
    if (!_.isEmpty(dailyTasks)) {
      return;
    }

    // Else create default dailyTask object
    store.set("dailyTasks", {
      list: { big: null, smaller: null },
      lastUpdated: moment()
    });
  };

  const updateCapacity = value => {
    if (currentCapacity <= 0) return;
    currentCapacity -= value;
  };

  const generateBigTask = list => {
    let bigTask = list[randomIntFromInterval(0, list.length - 1)];
    updateCapacity(bigTask.value);
    return bigTask;
  };

  const hasValidCapacity = (list, target) => {
    // There exist an item in the remaining list which has value < current capacity
    if (currentCapacity <= 0) return false;
    return _.find(list, item => item.value < target);
  };

  const generateSmallerTasks = list => {
    // Tmporarly generating one task for now
    return [list[randomIntFromInterval(0, list.length - 1)]];
    // Generate 3 small tasks
    let newList = [];
    let chosenTask = null;
    let remainingList = _.without(list, chosenTask);

    /* 
      - Repeat until it's still possible to create smaller tasks that can be created from remaining list.

      - Possibility criteria: Remaining list must have at-least one task with value less than remaining capacity.
    */
    while (!!hasValidCapacity(remainingList, currentCapacity)) {
      //Choose the next task at random from the remaining list
      chosenTask =
        remainingList[randomIntFromInterval(0, remainingList.length - 1)];

      /* 
        If chosen task has greater value than current capacity, 
        then discard that task and chose again.
      */
      if (chosenTask.value > currentCapacity) break;

      // Else, add the chosen task in newly generated list
      newList.push(chosenTask);

      // Remove the chosen task from remaining tasks list
      remainingList = _.without(remainingList, chosenTask);
      updateCapacity(chosenTask.value);
    }

    return newList;
  };

  const listHTML = type => {
    let dailyTasks = store.get("dailyTasks").list;
    switch (type) {
      case "big":
        return <Task task={dailyTasks.big} index={0} />;
      case "smaller":
        return dailyTasks.smaller.map((taskItem, index) => (
          <Task task={taskItem} index={index} />
        ));
    }
  };

  // Generate today's tasks after validating some assumptions
  (() => {
    const dailyTasks = store.get("dailyTasks");

    // Check if daily tasks are saved in local storage or not
    checkIfDailyTasksEmpty();

    // Checking time difference since last set of tasks generated
    // If last update is less than 24 hours from now do nothing.
    if (moment(dailyTasks.lastUpdated).diff(moment(), "hours") > 24) {
      return;
    }
    // Else create new set of daily tasks

    // Partitioning the data list into two separate lists,
    // based on the values of tasks
    let lists = _.partition(data, task => task.value > 50);

    // Creating new set of daily tasks and saving it in localStorage simultaneously
    store.set("dailyTasks", {
      list: {
        big: generateBigTask(lists[0]), // List with big tasks
        smaller: generateSmallerTasks(lists[1]) // List with smaller tasks
      },
      lastUpdated: moment()
    });
  })();

  return (
    <div class="wrapper">
      <Card heading="Big Task" list={listHTML("big")} selector="big" />
      <Card
        heading="Smaller Tasks"
        list={listHTML("smaller")}
        selector="smaller"
      />
    </div>
  );
}
