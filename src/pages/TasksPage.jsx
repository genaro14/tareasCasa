import React, { useState } from 'react';
import { useTasks } from '../context/TasksContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, Plus, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const TasksPage = () => {
  const { tasks, addTask, cycleTaskStatus, deleteTask, loading, error } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskName, setNewTaskName] = useState('');
  const [saving, setSaving] = useState(false);

  const getWeekDates = (startDate) => {
    const weekDates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(selectedDate);

  const changeWeek = (direction) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (direction * 7));
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddTask = async () => {
    if (newTaskName.trim() === '') return;
    setSaving(true);
    try {
      await addTask(newTaskName.trim(), selectedDate);
      setNewTaskName('');
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCycleStatus = async (id) => {
    try {
      await cycleTaskStatus(id);
    } catch (err) {
      console.error('Failed to cycle task status:', err);
    }
  };

  const getTasksForDate = (date) => tasks.filter(task => task.date === date);

  const getStatusColor = (status) => {
    switch (status) {
      case 'hecho': return 'text-green-500';
      case 'pendiente': return 'text-blue-500';
      case 'bloqueado': return 'text-orange-500';
      default: return 'text-blue-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'hecho': return 'bg-green-100';
      case 'pendiente': return 'bg-blue-100';
      case 'bloqueado': return 'bg-orange-100';
      default: return 'bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-left">Tareas del Hogar</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-4">
        {weekDates.map(date => {
          const dayTasks = getTasksForDate(date);
          return (
            <Card key={date} className="flex flex-col">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg capitalize">
                  {new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </CardHeader>
              <hr className="border-gray-200 mx-4" />
              <CardContent className="flex-grow text-left pt-3">
                {dayTasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sin tareas</p>
                ) : (
                  <ul className="space-y-1">
                    {dayTasks.map(task => (
                      <li 
                        key={task.id} 
                        className={`flex items-center cursor-pointer rounded px-1 py-0.5 ${getStatusBgColor(task.status)}`}
                        onClick={() => handleCycleStatus(task.id)}
                      >
                        <Circle 
                          size={12} 
                          className={`mr-2 fill-current ${getStatusColor(task.status)}`} 
                        />
                        <span className={`text-sm ${task.status === 'hecho' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" onClick={() => changeWeek(-1)}>
          <ChevronLeft size={20} />
          <span className="ml-1">Anterior</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={goToToday}>
          Hoy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => changeWeek(1)}>
          <span className="mr-1">Siguiente</span>
          <ChevronRight size={20} />
        </Button>
      </div>

      <div className="flex gap-4 mb-4 text-sm">
        <span className="flex items-center"><Circle size={12} className="mr-1 fill-current text-blue-500" /> Pendiente</span>
        <span className="flex items-center"><Circle size={12} className="mr-1 fill-current text-green-500" /> Hecho</span>
        <span className="flex items-center"><Circle size={12} className="mr-1 fill-current text-orange-500" /> Bloqueado</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nueva Tarea para {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nombre de la tarea"
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button onClick={handleAddTask} variant="primary" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={18} />}
            <span className="ml-1">Agregar</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
