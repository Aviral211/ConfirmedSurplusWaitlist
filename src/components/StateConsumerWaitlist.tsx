import React from 'react';
import { Clock, Users, CheckCircle2, ShieldCheck, ArrowRight, Store } from 'lucide-react';
import { DEMO_BAKERY } from '../data';

interface Props {
  hasJoined: boolean;
  onJoin: () => void;
  onLeave?: () => void;
  onProceedToMerchant: () => void;
}

export const StateConsumerWaitlist: React.FC<Props> = ({
  hasJoined,
  onJoin,
  onLeave,
  onProceedToMerchant,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Bakery Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md w-fit mb-2 border border-indigo-100">
              <Store className="w-3.5 h-3.5" />
              Bakery Waitlist
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {DEMO_BAKERY.name} — {DEMO_BAKERY.location}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{DEMO_BAKERY.address}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900">${DEMO_BAKERY.pricePerBag}.00</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">per surplus bag</span>
          </div>
        </div>

        {/* Core Notice */}
        <div className="my-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200/80">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 text-xs tracking-tight">
                Tonight's surplus has not been confirmed yet.
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Surplus is never offered until the merchant confirms actual leftover quantities near closing (approx. 7:15 PM).
              </p>
            </div>
          </div>
        </div>

        {/* Waitlist Status Info */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estimated Pickup</span>
            <span className="text-sm font-bold text-slate-900">{DEMO_BAKERY.pickupWindow}</span>
            <span className="text-[10px] text-slate-500 block">Tonight Only</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Waitlist Size</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-900">
                {hasJoined ? '3 in queue' : '2 people waiting'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">{hasJoined ? 'You are #3' : 'First-come basis'}</span>
          </div>
        </div>

        {/* Action Button */}
        {!hasJoined ? (
          <div className="space-y-3">
            <button
              id="btn-join-waitlist"
              onClick={onJoin}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-200"
            >
              <Users className="w-4 h-4" />
              Join Tonight's Waitlist
            </button>
            <div className="text-center">
              <button
                id="btn-skip-to-merchant"
                onClick={onProceedToMerchant}
                className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                Or proceed directly to Step 2: Merchant Confirmation
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs tracking-tight">You have joined tonight's waitlist</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    You are <strong>#3</strong> in line. You will receive a time-limited offer alert immediately once the merchant confirms surplus.
                  </p>
                </div>
              </div>
              {onLeave && (
                <button
                  id="btn-leave-waitlist"
                  onClick={onLeave}
                  className="text-[10px] text-emerald-700 hover:text-rose-600 underline font-medium cursor-pointer shrink-0"
                >
                  Leave
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                No payment until offer accepted
              </span>
              <button
                id="btn-simulate-closing"
                onClick={onProceedToMerchant}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                Proceed to Merchant Confirm
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Concept Explanation Box */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Core Principle</p>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Traditional surplus apps sell speculative inventory hours in advance, leading to merchant cancellation friction. This waitlist model reduces false promises by confirming surplus first.
        </p>
      </div>
    </div>
  );
};
