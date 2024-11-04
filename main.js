function assignTasksWithPriorityAndDependencies(developers, tasks) {
  tasks.sort((a, b) => b.priority - a.priority || b.difficulty - a.difficulty);
  developers.sort((a, b) => b.skillLevel - a.skillLevel);

  const developerAssignments = developers.map(developer => ({
      name: developer.name,
      assignedTasks: [],
      hoursAllocated: 0
  }));

  const tasksPendingAssignment = [];

  tasks.forEach(task => {
      let taskAssigned = false;
      for (let i = 0; i < developers.length; i++) {
          const currentDeveloper = developers[i];
          const allDependenciesResolved = task.dependencies.every(dependency =>
              developerAssignments.some(result => result.assignedTasks.includes(dependency))
          );

          if (currentDeveloper.skillLevel >= task.difficulty && 
              allDependenciesResolved &&
              developerAssignments[i].hoursAllocated + task.hoursRequired <= currentDeveloper.maxHours &&
              currentDeveloper.preferredTaskType === task.taskType) {
              developerAssignments[i].assignedTasks.push(task.taskName);
              developerAssignments[i].hoursAllocated += task.hoursRequired;
              taskAssigned = true;
              break;
          }
      }

      if (!taskAssigned) {
          tasksPendingAssignment.push(task.taskName);
      }
  });

  return {
      developerTaskDistribution: developerAssignments,
      tasksNotAssigned: tasksPendingAssignment
  };
}

const developerTeam = [
   { name: 'Alice', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
   { name: 'Bob', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' },
   { name: 'Charlie', skillLevel: 5, maxHours: 35, preferredTaskType: 'refactor' },
];

const projectTasks = [
   { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
   { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
   { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
   { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
   { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] },
];

console.log(assignTasksWithPriorityAndDependencies(developerTeam, projectTasks));
