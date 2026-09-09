import React from 'react';
import { CheckCircle2, MapPin, Clock, DollarSign, RotateCcw } from 'lucide-react';
import { DEMO_BAKERY } from '../data';

interface Props {
  onReset: () => void;
}

export const StateSuccess: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Reservation Confirmed Badge */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Your bag is reserved</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Confirmed with {DEMO_BAKERY.name}. Show pickup code at counter.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-md shrink-0">
          Reserved
        </span>
      </div>

      {/* Main Reservation Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        {/* Pickup Code Display */}
        <div className="text-center py-6 px-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
            Counter Pickup Code
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-amber-400">
            {DEMO_BAKERY.pickupCode}
          </div>
          <p className="text-[11px] text-slate-400">
            Show this 4-digit code to bakery counter staff
          </p>
        </div>

        {/* Paid Details */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">Payment Status:</span>
            <span className="text-slate-900 font-bold font-mono">${DEMO_BAKERY.pricePerBag}.00 paid</span>
          </div>
          <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Demo Paid
          </span>
        </div>

        {/* Pickup Details Breakdown */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Pickup Details
          </h3>

          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  {DEMO_BAKERY.name} — {DEMO_BAKERY.location}
                </span>
                <span className="text-slate-500 block mt-0.5">{DEMO_BAKERY.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Pickup Window</span>
                <span className="text-slate-500 block mt-0.5">
                  Tonight: <strong className="text-slate-800">{DEMO_BAKERY.pickupWindow}</strong> (Strict counter closing)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Restart / Demo Reset */}
        <div className="pt-2">
          <button
            id="btn-restart-demo"
            onClick={onReset}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Prototype Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
};
