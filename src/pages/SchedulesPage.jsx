import React, { useState } from 'react';
import { useSchedules } from '../context/SchedulesContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, Plus, Trash2, Edit2, X, Check, Calendar, EyeOff, Eye, Repeat, CalendarDays } from 'lucide-react';

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const WEEKDAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const DAY_LABELS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

const COLOR_CLASSES = {
  'purple-dark': 'bg-purple-700 text-white',
  'purple': 'bg-purple-500 text-white',
  'yellow': 'bg-yellow-400 text-gray-900',
  'pink': 'bg-pink-400 text-white',
  'blue': 'bg-blue-500 text-white',
  'green': 'bg-green-500 text-white',
  'red': 'bg-red-500 text-white',
  'gray': 'bg-gray-400 text-white'
};

const SchedulesPage = () => {
  const { schedules, users, addSchedule, updateSchedule, deleteSchedule, getSchedulesByDay, getSchedulesByDate, loading, error } = useSchedules();
  
  const [showForm, setShowForm] = useState(false);
  const [showWeekend, setShowWeekend] = useState(false);
  const [holidayDays, setHolidayDays] = useState(new Set());
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff)).toISOString().split('T')[0];
  });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    is_recurring: true,
    day_of_week: 'lunes',
    schedule_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    user_ids: []
  });
  const [saving, setSaving] = useState(false);

  const visibleDays = showWeekend ? DAYS : WEEKDAYS;

  const getWeekDates = () => {
    const dates = {};
    const start = new Date(selectedWeekStart);
    DAYS.forEach((day, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates[day] = date.toISOString().split('T')[0];
    });
    return dates;
  };

  const weekDates = getWeekDates();

  const changeWeek = (direction) => {
    const current = new Date(selectedWeekStart);
    current.setDate(current.getDate() + (direction * 7));
    setSelectedWeekStart(current.toISOString().split('T')[0]);
  };

  const goToThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setSelectedWeekStart(new Date(today.setDate(diff)).toISOString().split('T')[0]);
  };

  const toggleHoliday = (day) => {
    setHolidayDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      is_recurring: true,
      day_of_week: 'lunes',
      schedule_date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '10:00',
      user_ids: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setFormData({
      title: schedule.title,
      is_recurring: schedule.is_recurring,
      day_of_week: schedule.day_of_week || 'lunes',
      schedule_date: schedule.schedule_date || new Date().toISOString().split('T')[0],
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
      user_ids: schedule.users.map(u => u.id)
    });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    setSaving(true);
    try {
      const submitData = {
        title: formData.title,
        is_recurring: formData.is_recurring,
        start_time: formData.start_time,
        end_time: formData.end_time,
        user_ids: formData.user_ids
      };
      
      if (formData.is_recurring) {
        submitData.day_of_week = formData.day_of_week;
      } else {
        submitData.schedule_date = formData.schedule_date;
      }
      
      if (editingId) {
        await updateSchedule(editingId, submitData);
      } else {
        await addSchedule(submitData);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    try {
      await deleteSchedule(id);
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const toggleUser = (userId) => {
    setFormData(prev => ({
      ...prev,
      user_ids: prev.user_ids.includes(userId)
        ? prev.user_ids.filter(id => id !== userId)
        : [...prev.user_ids, userId]
    }));
  };

  const formatTime = (time) => time?.slice(0, 5) || time;

  const getColorClass = (color) => COLOR_CLASSES[color] || COLOR_CLASSES.gray;

  const getSchedulesForDay = (day) => {
    const recurring = getSchedulesByDay ? getSchedulesByDay(day) : schedules.filter(s => s.day_of_week === day);
    const dateSpecific = getSchedulesByDate ? getSchedulesByDate(weekDates[day]) : [];
    return [...recurring, ...dateSpecific].sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Horarios</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowWeekend(!showWeekend)} 
            variant="ghost"
            size="sm"
          >
            {showWeekend ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-1 hidden sm:inline">{showWeekend ? 'Ocultar finde' : 'Mostrar finde'}</span>
          </Button>
          <Button onClick={() => setShowForm(true)} variant="primary">
            <Plus size={18} className="mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Horario' : 'Nuevo Horario'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Clases de inglés, Médico, etc."
                  required
                />
              </div>

              {/* Recurring toggle */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_recurring: true }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      formData.is_recurring 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Repeat size={16} />
                    <span>Semanal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_recurring: false }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      !formData.is_recurring 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <CalendarDays size={16} />
                    <span>Fecha específica</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.is_recurring ? 'Día de la semana' : 'Fecha'}
                  </label>
                  {formData.is_recurring ? (
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData(prev => ({ ...prev, day_of_week: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {DAYS.map(day => (
                        <option key={day} value={day}>{DAY_LABELS[day]}</option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <Input
                        type="date"
                        value={formData.schedule_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, schedule_date: e.target.value }))}
                        required
                      />
                      {formData.schedule_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(formData.schedule_date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hora inicio</label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hora fin</label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Participantes</label>
                <div className="flex flex-wrap gap-2">
                  {users.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        formData.user_ids.includes(user.id)
                          ? getColorClass(user.color)
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {user.username}
                      {formData.user_ids.includes(user.id) && <Check size={14} className="inline ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={18} />}
                  <span className="ml-1">{editingId ? 'Actualizar' : 'Guardar'}</span>
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  <X size={18} />
                  <span className="ml-1">Cancelar</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => changeWeek(-1)}>
          ← Anterior
        </Button>
        <Button variant="ghost" size="sm" onClick={goToThisWeek}>
          Esta semana
        </Button>
        <Button variant="ghost" size="sm" onClick={() => changeWeek(1)}>
          Siguiente →
        </Button>
      </div>

      {/* Weekly view */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showWeekend ? 'lg:grid-cols-7' : 'lg:grid-cols-5'}`}>
        {visibleDays.map(day => {
          const daySchedules = getSchedulesForDay(day);
          const isHoliday = holidayDays.has(day);
          const dateStr = weekDates[day];
          const dateObj = new Date(dateStr + 'T12:00:00');
          return (
            <Card key={day} className={`flex flex-col ${isHoliday ? 'opacity-50 bg-gray-100' : ''}`}>
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1" />
                  <div className="flex-1 text-center">
                    <CardTitle className="text-lg">{DAY_LABELS[day]}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => toggleHoliday(day)}
                      className={`p-1 rounded hover:bg-gray-200 transition-colors ${isHoliday ? 'text-orange-500' : 'text-gray-400'}`}
                      title={isHoliday ? 'Quitar feriado' : 'Marcar feriado'}
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>
                {isHoliday && <p className="text-xs text-orange-500 font-medium">Feriado</p>}
              </CardHeader>
              <hr className="border-gray-200 mx-4" />
              <CardContent className="flex-grow pt-3 space-y-2">
                {isHoliday ? (
                  <p className="text-muted-foreground text-sm text-center italic">Sin actividades</p>
                ) : daySchedules.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center">Sin horarios</p>
                ) : (
                  daySchedules.map(schedule => (
                    <div
                      key={schedule.id}
                      className={`p-2 rounded-lg border group relative ${
                        schedule.is_recurring 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            {!schedule.is_recurring && <CalendarDays size={12} className="text-blue-500" />}
                            <p className="font-medium text-sm truncate">{schedule.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {schedule.users.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {schedule.users.map(user => (
                            <span
                              key={user.id}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClass(user.color)}`}
                            >
                              {user.username}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
          <span>Semanal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200"></div>
          <span>Fecha específica</span>
        </div>
        <span className="text-gray-300">|</span>
        {users.map(user => (
          <span key={user.id} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${getColorClass(user.color).split(' ')[0]}`}></span>
            {user.username}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SchedulesPage;
