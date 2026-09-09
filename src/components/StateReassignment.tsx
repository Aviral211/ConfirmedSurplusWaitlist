import React from 'react';
import { Users, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { DEMO_BAKERY } from '../data';
import { WaitlistMember } from '../types';

interface Props {
  reason: 'declined' | 'expired';
  waitlist: WaitlistMember[];
  onReset: () => void;
}

export const StateReassignment: React.FC<Props> = ({
  reason,
  waitlist,
  onReset,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Reassignment Status Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">
              {reason === 'declined' ? 'Offer Declined' : 'Offer Expired'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bag #3 automatically reassigned to the next waitlisted consumer.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2.5 py-1 rounded-md shrink-0">
          Auto-Reassigned
        </span>
      </div>

      {/* Main Core Message Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950">
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs tracking-tight">
                This bag has automatically been offered to the next person on the waitlist.
              </h3>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                This helps more surplus food get claimed. Because you {reason === 'declined' ? 'passed on this offer' : 'did not respond within 5 minutes'}, the system immediately sent a time-limited offer to <strong>Sarah Torres</strong> (Rank #4).
              </p>
            </div>
          </div>
        </div>

        {/* Updated Waitlist Queue Visualization */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Updated Queue Status
          </h4>

          <div className="space-y-2">
            {/* Previous offer accepted items */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono">#1</span>
                <span className="font-bold text-slate-800">Maya Lin</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Reserved (Bag #1)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono">#2</span>
                <span className="font-bold text-slate-800">David Kim</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Reserved (Bag #2)
              </span>
            </div>

            {/* You (Declined/Expired) */}
            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-[10px] font-mono">#3</span>
                <span className="font-bold text-slate-900">You (Alex)</span>
              </div>
              <span className="text-rose-700 font-bold text-[11px]">
                {reason === 'declined' ? 'Declined' : 'Expired'}
              </span>
            </div>

            {/* Next Person: Sarah Torres (Now Offered Bag #3) */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 ring-1 ring-emerald-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] font-mono">#4</span>
                <div>
                  <span className="font-bold text-emerald-950">Sarah Torres</span>
                  <span className="text-[9px] text-emerald-700 block font-medium">Promoted from standby</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-emerald-200 text-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active Offer Dispatched (Bag #3)
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-100">
          <button
            id="btn-restart-from-reassign"
            onClick={onReset}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Full Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
};
