import React, { useState } from 'react';
import { ListTodo, Plus, Trash2, Check, X, Shield, FileText } from 'lucide-react';
import { ThemeConfig, Reminder } from '../types';

interface ReminderWidgetProps {
  theme: ThemeConfig;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

export const ReminderWidget: React.FC<ReminderWidgetProps> = ({
  theme,
  reminders,
  setReminders,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newRem: Reminder = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      text: newText.trim(),
      priority: newPriority,
      completed: false,
    };

    const updated = [newRem, ...reminders];
    setReminders(updated);
    localStorage.setItem('futur_saver_reminders', JSON.stringify(updated));

    setNewText('');
    setShowAddForm(false);
  };

  const removeReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem('futur_saver_reminders', JSON.stringify(updated));
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    setReminders(updated);
    localStorage.setItem('futur_saver_reminders', JSON.stringify(updated));
  };

  // Get color configurations
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  const getPriorityBadge = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high':
        return 'text-rose-400 border-rose-900 bg-rose-950/20';
      case 'medium':
        return 'text-amber-400 border-amber-900 bg-amber-950/20';
      case 'low':
        default:
        return 'text-cyan-400 border-cyan-900 bg-cyan-950/20';
    }
  };

  const completedCount = reminders.filter((r) => r.completed).length;

  return (
    <div
      id="reminder-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" style={{ color: hexColor }} />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Terminal Lembretes</h3>
          </div>

          <div className="flex items-center gap-3">
            {reminders.length > 0 && (
              <span className="text-[10px] font-mono text-slate-500">
                {completedCount}/{reminders.length} OK
              </span>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
              title="Novo Lembrete"
            >
              {showAddForm ? <X className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5" style={{ color: hexColor }} />}
            </button>
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={addReminder} className="mb-3 p-2.5 rounded bg-slate-950/80 border border-slate-800 animate-fadeIn">
            <div className="mb-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Conteúdo do Lembrete</label>
              <input
                type="text"
                placeholder="Ex: Verificar..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-slate-600 placeholder-slate-700 font-mono"
                required
              />
            </div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Prioridade</span>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono border cursor-pointer uppercase transition-colors ${
                      newPriority === p
                        ? p === 'high'
                          ? 'border-rose-500 text-rose-400 bg-rose-950/40'
                          : p === 'medium'
                          ? 'border-amber-500 text-amber-400 bg-amber-950/40'
                          : 'border-cyan-500 text-cyan-400 bg-cyan-950/40'
                        : 'border-slate-900 text-slate-600 bg-slate-950'
                    }`}
                  >
                    {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-center py-1 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] uppercase rounded border border-slate-800 transition-colors cursor-pointer"
            >
              Arquivar Lembrete
            </button>
          </form>
        )}

        <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
          {reminders.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-slate-900 rounded-lg">
              <FileText className="w-4 h-4 mx-auto text-slate-600 mb-1" />
              <span className="text-[10px] font-mono text-slate-505 block">Nenhum registro ativo.</span>
            </div>
          ) : (
            reminders.map((rem) => (
              <div
                key={rem.id}
                className={`flex items-start justify-between p-2 rounded-lg border transition-all ${
                  rem.completed ? 'border-zinc-900 bg-zinc-950/15 opacity-55' : 'border-slate-800 bg-slate-950/50'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`p-0.5 mt-0.5 rounded border transition-colors cursor-pointer ${
                      rem.completed
                        ? 'border-emerald-600 bg-emerald-950/20 text-emerald-400'
                        : 'border-slate-800 hover:border-slate-500 text-transparent bg-slate-900'
                    }`}
                  >
                    <Check className="w-3 h-3 block stroke-[2.5]" />
                  </button>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={`text-xs break-words text-slate-200 transition-all ${
                        rem.completed ? 'line-through text-slate-600' : ''
                      }`}
                    >
                      {rem.text}
                    </span>
                    {!rem.completed && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-1.5 py-0.2 rounded border text-[8px] font-mono uppercase ${getPriorityBadge(rem.priority)}`}>
                          {rem.priority === 'high' ? 'Alta' : rem.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeReminder(rem.id)}
                  className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-950/25 transition-colors cursor-pointer ml-1.5"
                  title="Apagar Lembrete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/40 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>NOTAS DE REGISTRO</span>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-slate-600" />
          <span>ESTÁVEL</span>
        </div>
      </div>
    </div>
  );
};
