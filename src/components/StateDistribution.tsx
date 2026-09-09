import React from 'react';
import { CheckCircle2, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { DEMO_BAKERY } from '../data';
import { WaitlistMember } from '../types';

interface Props {
  waitlist: WaitlistMember[];
  onOpenOffer: () => void;
}

export const StateDistribution: React.FC<Props> = ({
  waitlist,
  onOpenOffer,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Confirmed Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">3 Bags Confirmed</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {DEMO_BAKERY.name} physical count confirmed. Real-time offers dispatched.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-md shrink-0">
          Live Dispatch
        </span>
      </div>

      {/* Distribution Queue Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Automated Offer Dispatch Queue
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">First-Come, First-Served</span>
        </div>

        <div className="space-y-2">
          {waitlist.map((member, idx) => {
            const isOffered = idx < 3;
            const isUser = member.isCurrentUser;

            return (
              <div
                key={member.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isUser
                    ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200'
                    : isOffered
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-50/40 border-dashed border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isOffered
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isUser ? 'text-indigo-950 font-bold' : 'text-slate-900'}`}>
                        {member.name}
                      </span>
                      {isUser && (
                        <span className="text-[9px] uppercase font-bold tracking-wider bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Joined at {member.joinedTime}</span>
                  </div>
                </div>

                <div>
                  {isOffered ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Offer Sent (5 min hold)
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Standby
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Consumer Alert Callout */}
        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-3">
          <div className="flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-950">You have received an offer!</p>
              <p className="text-[11px] text-indigo-900/80 mt-0.5 leading-relaxed">
                Bag #3 has been allocated to you. You have a 5-minute countdown to accept or decline before reassignment.
              </p>
            </div>
          </div>

          <button
            id="btn-view-offer"
            onClick={onOpenOffer}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-slate-200"
          >
            Open Your Consumer Offer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logic summary note */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="text-[11px] text-slate-600">
          If an offer is declined or expires, the bag automatically shifts to Rank #4 (Sarah Torres).
        </span>
      </div>
    </div>
  );
};
