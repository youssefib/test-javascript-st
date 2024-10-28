function assignTasksWithPriorityAndDependencies(developers, tasks) {
    // Sort tasks by dependency count to ensure dependency order is respected
    tasks.sort((a, b) => a.dependencies.length - b.dependencies.length);
  
    // Track assigned tasks and developer workload
    const assignedTasks = {};
    const completedTasks = new Set();
    const unassignedTasks = [];
  
    tasks.forEach(task => {
      // Check if all dependencies are met
      const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));
      if (!dependenciesMet) {
        unassignedTasks.push(task);
        return;
      }
  
      // Try to assign task to a suitable developer
      let assigned = false;
      for (const dev of developers) {
        const devTasks = assignedTasks[dev.name] || { tasks: [], totalHours: 0 };
  
        // Check skill and available hours
        if (dev.skillLevel >= task.difficulty && (devTasks.totalHours + task.hoursRequired <= dev.maxHours)) {
          devTasks.tasks.push(task.taskName);
          devTasks.totalHours += task.hoursRequired;
          assignedTasks[dev.name] = devTasks;
          completedTasks.add(task.taskName);
          assigned = true;
          break;
        }
      }
  
      // If no developer could handle this task, mark it as unassigned
      if (!assigned) {
        unassignedTasks.push(task);
      }
    });
  
    // Format the result as required
    const result = developers.map(dev => ({
      name: dev.name,
      tasks: assignedTasks[dev.name]?.tasks || [],
      totalHours: assignedTasks[dev.name]?.totalHours || 0
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
  