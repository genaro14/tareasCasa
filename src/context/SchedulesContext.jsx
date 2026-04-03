import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { schedulesApi, authApi } from '../services/api';

const SchedulesContext = createContext();

export const SchedulesProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [schedulesData, usersData] = await Promise.all([
        schedulesApi.getAll(),
        schedulesApi.getUsers()
      ]);
      setSchedules(schedulesData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch schedules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (data) => {
    try {
      const schedule = await schedulesApi.create(data);
      setSchedules(prev => [...prev, schedule]);
      setError(null);
      return schedule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSchedule = async (id, data) => {
    try {
      const schedule = await schedulesApi.update(id, data);
      setSchedules(prev => prev.map(s => s.id === id ? schedule : s));
      setError(null);
      return schedule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await schedulesApi.delete(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getSchedulesByDay = (day) => schedules.filter(s => s.day_of_week === day && s.is_recurring);

  const getSchedulesByDate = (date) => schedules.filter(s => s.schedule_date === date && !s.is_recurring);

  return (
    <SchedulesContext.Provider value={{ 
      schedules, 
      users,
      addSchedule, 
      updateSchedule, 
      deleteSchedule,
      getSchedulesByDay,
      getSchedulesByDate,
      loading,
      error,
      refresh: fetchSchedules
    }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);
