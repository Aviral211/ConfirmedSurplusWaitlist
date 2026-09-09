import React from 'react';
import { Send, Store, Sparkles, AlertCircle } from 'lucide-react';
import { DEMO_BAKERY } from '../data';

interface Props {
  bagCount: number;
  onConfirm: () => void;
}

export const StateMerchantConfirm: React.FC<Props> = ({
  bagCount,
  onConfirm,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Merchant Header Indicator */}
      <div className="bg-slate-900 text-slate-100 px-5 py-3 rounded-xl flex items-center justify-between text-xs shadow-sm">
        <span className="font-bold tracking-wider uppercase flex items-center gap-2 text-[10px] text-amber-400">
          <Store className="w-4 h-4 text-amber-400" />
          Merchant Closing Terminal (7:15 PM)
        </span>
        <span className="text-slate-400 text-[11px] font-medium">{DEMO_BAKERY.name} — {DEMO_BAKERY.location}</span>
      </div>

      {/* Main Merchant Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        <div>
          <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2 border border-amber-200/60">
            Physical Inventory Count
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Confirm Tonight's Actual Surplus
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Count actual leftover pastries at closing and trigger instant 1-tap dispatch to waitlisted consumers.
          </p>
        </div>

        {/* Ultra-Simple Form Inputs / Summary */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                Surplus Bag Quantity
              </span>
              <span className="text-xs text-slate-600 font-medium">Actual leftover bags packed at counter</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-bold text-slate-900 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                {bagCount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Fixed Price
              </span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                ${DEMO_BAKERY.pricePerBag}.00
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">per surplus bag</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Pickup Window
              </span>
              <span className="text-sm font-bold text-slate-900">
                {DEMO_BAKERY.pickupWindow}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tonight Only</span>
            </div>
          </div>
        </div>

        {/* Merchant Effort Highlight */}
        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-slate-900">Low-effort management:</strong> 1 click notifies the top {bagCount} waitlisted customers automatically.
          </span>
        </div>

        {/* Submit Action */}
        <button
          id="btn-confirm-offers"
          onClick={onConfirm}
          className="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-200"
        >
          <Send className="w-4 h-4 text-amber-400" />
          Confirm & Send Offers
        </button>
      </div>

      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          Merchant effort is restricted to confirming only what physically exists. No listings are published in advance.
        </p>
      </div>
    </div>
  );
};
