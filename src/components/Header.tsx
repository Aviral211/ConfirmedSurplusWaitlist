import React from 'react';
import { AppState } from '../types';
import { RotateCcw, Store, User } from 'lucide-react';

interface Props {
  currentState: AppState;
  onStateSelect: (state: AppState) => void;
  onReset: () => void;
}

const STEPS: { id: AppState; label: string; number: string; role: 'Consumer' | 'Merchant' }[] = [
  { id: 'waitlist', label: 'Waitlist', number: '1', role: 'Consumer' },
  { id: 'merchant', label: 'Merchant Confirm', number: '2', role: 'Merchant' },
  { id: 'distribution', label: 'Distribution Status', number: '3', role: 'Consumer' },
  { id: 'offer', label: 'Consumer Offer', number: '4', role: 'Consumer' },
  { id: 'success', label: 'Success / Pickup', number: '5', role: 'Consumer' },
  { id: 'reassignment', label: 'Reassignment', number: '6', role: 'Consumer' },
];

export const Header: React.FC<Props> = ({
  currentState,
  onStateSelect,
  onReset,
}) => {
  const currentStep = STEPS.find((s) => s.id === currentState);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        {/* Top Branding & Meta controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-md text-xs tracking-wider shadow-xs">
              CS
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Confirmed Surplus Waitlist <span className="text-slate-400 font-normal hidden sm:inline">— Interactive Prototype</span>
              </h1>
              <p className="text-[11px] text-slate-500">
                Surplus is never offered until merchant confirms physical inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-header-reset"
              onClick={onReset}
              title="Reset prototype state"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors cursor-pointer border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Step Navigation Bar / State Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {STEPS.map((step) => {
              const isActive = currentState === step.id;

              return (
                <button
                  id={`nav-tab-${step.id}`}
                  key={step.id}
                  onClick={() => onStateSelect(step.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-indigo-600 border border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                      : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                      isActive ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active View Role Tag */}
          <div className="shrink-0 self-start sm:self-center">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                currentStep?.role === 'Merchant'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {currentStep?.role === 'Merchant' ? (
                <>
                  <Store className="w-3 h-3 text-amber-700" />
                  Merchant View
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-indigo-600" />
                  Consumer View
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
