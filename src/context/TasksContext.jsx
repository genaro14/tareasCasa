import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksApi, authApi } from '../services/api';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await tasksApi.getAll();
      const normalizedTasks = data.map(task => ({
        id: task.id,
        name: task.task_name,
        date: task.due_date.split('T')[0],
        status: task.status || 'pendiente'
      }));
      setTasks(normalizedTasks);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (name, date) => {
    try {
      const task = await tasksApi.create({ task_name: name, due_date: date });
      setTasks(prev => [...prev, {
        id: task.id,
        name: task.task_name,
        date: task.due_date.split('T')[0],
        status: task.status || 'pendiente'
      }]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cycleTaskStatus = async (id) => {
    try {
      const task = await tasksApi.cycleStatus(id);
      setTasks(prev =>
        prev.map(t => t.id === id ? {
          ...t,
          status: task.status
        } : t)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksApi.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      addTask, 
      cycleTaskStatus, 
      deleteTask,
      loading,
      error,
      refresh: fetchTasks
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
