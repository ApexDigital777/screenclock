import React, { useState } from 'react';
import { Bell, Plus, Trash2, Check, X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ThemeConfig, Alarm } from '../types';

interface AlarmWidgetProps {
  theme: ThemeConfig;
  alarms: Alarm[];
  setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
}

export const AlarmWidget: React.FC<AlarmWidgetProps> = ({
  theme,
  alarms,
  setAlarms,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('07:00');

  const addAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime) return;

    const newAlarm: Alarm = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      time: newTime,
      label: newLabel.trim() || 'Alerta Geral',
      enabled: true,
      repeat: false,
    };

    const updated = [newAlarm, ...alarms].sort((a, b) => a.time.localeCompare(b.time));
    setAlarms(updated);
    localStorage.setItem('futur_saver_alarms', JSON.stringify(updated));

    setNewLabel('');
    setShowAddForm(false);
  };

  const removeAlarm = (id: string) => {
    const updated = alarms.filter((a) => a.id !== id);
    setAlarms(updated);
    localStorage.setItem('futur_saver_alarms', JSON.stringify(updated));
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map((a) => {
      if (a.id === id) {
        return { ...a, enabled: !a.enabled };
      }
      return a;
    });
    setAlarms(updated);
    localStorage.setItem('futur_saver_alarms', JSON.stringify(updated));
  };

  // Resolve custom accent hex
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  return (
    <div
      id="alarm-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" style={{ color: hexColor }} />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Subsistema Alarmes</h3>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
            title="Adicionar Alarme"
          >
            {showAddForm ? <X className="w-3.5 h-3.5 text-slate-400" /> : <Plus className="w-3.5 h-3.5" style={{ color: hexColor }} />}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={addAlarm} className="mb-3 p-2.5 rounded bg-slate-950/80 border border-slate-800 animate-fadeIn">
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Horário</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-slate-600"
                  required
                />
              </div>
              <div className="flex-[2]">
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Rótulo / Nota</label>
                <input
                  type="text"
                  placeholder="Ex: Reunião"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-slate-600 placeholder-slate-600"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-center py-1 bg-emerald-950/85 hover:bg-emerald-900/90 text-emerald-400 font-mono text-[10px] uppercase rounded border border-emerald-900 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3" /> Salvar Alarme
            </button>
          </form>
        )}

        <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
          {alarms.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-slate-900 rounded-lg">
              <AlertTriangle className="w-4 h-4 mx-auto text-slate-600 mb-1" />
              <span className="text-[10px] font-mono text-slate-505 block">Nenhum alarme operacional.</span>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  alarm.enabled
                    ? 'border-slate-800 bg-slate-950/50'
                    : 'border-slate-900/40 bg-slate-950/20 opacity-55'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-slate-100">{alarm.time}</span>
                    {alarm.enabled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" style={{ color: hexColor }} />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 truncate max-w-[130px]">{alarm.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                      alarm.enabled
                        ? 'border-emerald-900/50 text-emerald-400 bg-emerald-950/20'
                        : 'border-slate-800 text-slate-500 bg-slate-900/30'
                    }`}
                  >
                    {alarm.enabled ? 'ATIVO' : 'DESATIVADO'}
                  </button>

                  <button
                    onClick={() => removeAlarm(alarm.id)}
                    className="p-1 rounded text-rose-500 hover:text-rose-100 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Excluir Alarme"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/40 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>SISTEMA DE SEGURANÇA</span>
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-slate-600" />
          <span>SINO ON</span>
        </div>
      </div>
    </div>
  );
};
