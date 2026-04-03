import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
  const { addMeal, updateMeal, deleteMeal, getMealName, loading: mealsLoading } = useMenu();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [almuerzoInput, setAlmuerzoInput] = useState('');
  const [meriendaInput, setMeriendaInput] = useState('');
  const [cenaInput, setCenaInput] = useState('');
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
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setAlmuerzoInput(getMealName(today, 'almuerzo') || '');
    setMeriendaInput(getMealName(today, 'merienda') || '');
    setCenaInput(getMealName(today, 'cena') || '');
  };

  const handleSaveMeal = async (mealType) => {
    const input = mealType === 'almuerzo' ? almuerzoInput : mealType === 'merienda' ? meriendaInput : cenaInput;
    if (input.trim() === '') return;
    setSaving(true);
    try {
      if (getMealName(selectedDate, mealType)) {
        await updateMeal(selectedDate, mealType, input);
      } else {
        await addMeal(selectedDate, mealType, input);
      }
      if (mealType === 'almuerzo') setAlmuerzoInput('');
      else if (mealType === 'merienda') setMeriendaInput('');
      else setCenaInput('');
    } catch (err) {
      console.error('Failed to save meal:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (mealType) => {
    setSaving(true);
    try {
      await deleteMeal(selectedDate, mealType);
      if (mealType === 'almuerzo') setAlmuerzoInput('');
      else if (mealType === 'merienda') setMeriendaInput('');
      else setCenaInput('');
    } catch (err) {
      console.error('Failed to delete meal:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setAlmuerzoInput(getMealName(newDate, 'almuerzo') || '');
    setMeriendaInput(getMealName(newDate, 'merienda') || '');
    setCenaInput(getMealName(newDate, 'cena') || '');
  };

  if (mealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-left">Menú Semanal</h1>

      <div className="mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-4">
        {weekDates.map(date => (
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
              <p className="text-muted-foreground text-sm">Almuerzo:</p>
              <p className="font-semibold text-foreground mb-2">{getMealName(date, 'almuerzo') || 'Sin asignar'}</p>
              
              <p className="text-muted-foreground text-sm">Merienda:</p>
              <p className="font-semibold text-foreground mb-2">{getMealName(date, 'merienda') || 'Sin asignar'}</p>
              
              <p className="text-muted-foreground text-sm">Cena:</p>
              <p className="font-semibold text-foreground">{getMealName(date, 'cena') || 'Sin asignar'}</p>
            </CardContent>
          </Card>
        ))}
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gestionar comidas para {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Almuerzo */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Almuerzo</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={almuerzoInput}
                  onChange={(e) => setAlmuerzoInput(e.target.value)}
                  placeholder="Nombre del plato"
                  className="flex-grow"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveMeal('almuerzo')}
                />
                <Button onClick={() => handleSaveMeal('almuerzo')} variant="primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : getMealName(selectedDate, 'almuerzo') ? 'Actualizar' : 'Agregar'}
                </Button>
                {getMealName(selectedDate, 'almuerzo') && (
                  <Button onClick={() => handleDeleteMeal('almuerzo')} variant="destructive" disabled={saving}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>

            {/* Merienda */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Merienda</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={meriendaInput}
                  onChange={(e) => setMeriendaInput(e.target.value)}
                  placeholder="Nombre del plato"
                  className="flex-grow"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveMeal('merienda')}
                />
                <Button onClick={() => handleSaveMeal('merienda')} variant="primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : getMealName(selectedDate, 'merienda') ? 'Actualizar' : 'Agregar'}
                </Button>
                {getMealName(selectedDate, 'merienda') && (
                  <Button onClick={() => handleDeleteMeal('merienda')} variant="destructive" disabled={saving}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>

            {/* Cena */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cena</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={cenaInput}
                  onChange={(e) => setCenaInput(e.target.value)}
                  placeholder="Nombre del plato"
                  className="flex-grow"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveMeal('cena')}
                />
                <Button onClick={() => handleSaveMeal('cena')} variant="primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : getMealName(selectedDate, 'cena') ? 'Actualizar' : 'Agregar'}
                </Button>
                {getMealName(selectedDate, 'cena') && (
                  <Button onClick={() => handleDeleteMeal('cena')} variant="destructive" disabled={saving}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
