function assignTasksWithPriorityAndDependencies(developers, tasks) {
    // Track assigned tasks, developer workloads, and completed tasks
    const assignedTasks = {};
    const completedTasks = new Set();
    const unassignedTasks = [];
  
    // Initialize developers' workload records
    developers.forEach(dev => {
      assignedTasks[dev.name] = { tasks: [], totalHours: 0 };
    });
  
    tasks.forEach(task => {
      // Check if all dependencies are completed before assigning the task
      const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));
      if (!dependenciesMet) {
        unassignedTasks.push(task);
        return;
      }
  
      // Attempt to assign the task to an available developer
      let assigned = false;
      for (const dev of developers) {
        const devTasks = assignedTasks[dev.name];
  
        // Check if the developer has the required skill level and enough available hours
        if (dev.skillLevel >= task.difficulty && devTasks.totalHours + task.hoursRequired <= dev.maxHours) {
          devTasks.tasks.push(task.taskName);
          devTasks.totalHours += task.hoursRequired;
          completedTasks.add(task.taskName);
          assigned = true;
          break;
        }
      }
  
      // If no developer could take the task, add it to unassigned tasks
      if (!assigned) {
        unassignedTasks.push(task);
      }
    });
  
    // Format the final result for each developer
    const result = developers.map(dev => ({
      name: dev.name,
      tasks: assignedTasks[dev.name].tasks,
      totalHours: assignedTasks[dev.name].totalHours
    }));
  
    return {
      assignedDevelopers: result,
      unassignedTasks: unassignedTasks.map(task => task.taskName)
    };
  }
  
  // Example usage
  const developers = [
    { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
    { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
    { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
  ];
  
  const tasks = [
    { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
    { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
    { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
    { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
    { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] },
  ];
  
console.log(assignTasksWithPriorityAndDependencies(developers, tasks));
  