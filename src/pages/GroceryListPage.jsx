import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2, Plus, Trash2, Check, RotateCcw, RefreshCw } from 'lucide-react';

const GroceryListPage = () => {
  const { groceryItems, addGroceryItem, removeGroceryItem, toggleGroceryItemActive, resetToTemplate, loading, error } = useGrocery();
  const [newItemName, setNewItemName] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleAddItem = async () => {
    if (newItemName.trim() === '') return;
    setSaving(true);
    try {
      await addGroceryItem(newItemName.trim());
      setNewItemName('');
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveItem = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}" de la lista?`)) return;
    try {
      await removeGroceryItem(id);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleGroceryItemActive(id);
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  const handleResetToTemplate = async () => {
    if (!window.confirm('¿Restaurar la lista con los productos básicos del mes? Los productos actuales se marcarán como activos.')) return;
    setResetting(true);
    try {
      await resetToTemplate();
    } catch (err) {
      console.error('Failed to reset to template:', err);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeItems = groceryItems.filter(item => item.is_active);
  const completedItems = groceryItems.filter(item => !item.is_active);

  return (
    <div className="p-2 sm:p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">🛒 Supermercado</h1>
        <button
          onClick={handleResetToTemplate}
          disabled={resetting}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded-lg transition-colors"
        >
          {resetting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          <span>Nuevo mes</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add item - sticky on mobile */}
      <div className="sticky top-0 bg-background z-10 pb-3 pt-1">
        <div className="flex gap-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Agregar producto..."
            className="flex-grow text-lg h-12"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button 
            onClick={handleAddItem} 
            variant="primary" 
            disabled={saving}
            className="h-12 w-12 p-0 rounded-full"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus size={24} />}
          </Button>
        </div>
      </div>

      {/* Active items */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground">
          Por Comprar ({activeItems.length})
        </h2>
        {activeItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            ¡Lista vacía! Agrega productos arriba.
          </p>
        ) : (
          <ul className="space-y-2">
            {activeItems.map(item => (
              <li 
                key={item.id} 
                className="flex items-center gap-3 p-2 rounded-lg bg-white border shadow-sm"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Marcar como comprado"
                >
                  <Check size={24} strokeWidth={3} />
                </button>
                <span className="flex-grow text-lg font-medium text-foreground">
                  {item.name}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600 flex items-center justify-center transition-colors"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completed items */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
            Comprados ({completedItems.length})
          </h2>
          <ul className="space-y-2">
            {completedItems.map(item => (
              <li 
                key={item.id} 
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border opacity-70"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Devolver a la lista"
                >
                  <RotateCcw size={20} />
                </button>
                <span className="flex-grow text-lg text-muted-foreground line-through">
                  {item.name}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600 flex items-center justify-center transition-colors"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroceryListPage;
