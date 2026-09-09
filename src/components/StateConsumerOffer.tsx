import React, { useState, useEffect } from 'react';
import { Clock, Check, X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { DEMO_BAKERY } from '../data';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
  onExpire: () => void;
}

export const StateConsumerOffer: React.FC<Props> = ({
  onAccept,
  onDecline,
  onExpire,
}) => {
  // 5 minute countdown (300 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(300);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percentLeft = (timeLeft / 300) * 100;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Consumer View Alert Badge */}
      <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center justify-between text-xs shadow-sm border border-slate-800">
        <span className="tracking-wider uppercase flex items-center gap-2 text-[10px] font-bold text-amber-400">
          <Clock className="w-4 h-4" />
          Time-Limited Offer Received
        </span>
        <span className="bg-indigo-600/60 border border-indigo-400/40 px-2.5 py-0.5 rounded text-white font-mono text-[11px] font-bold">
          {formattedTime}
        </span>
      </div>

      {/* Main Offer Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 border border-indigo-100">
            Confirmed Surplus Ready
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            A surplus bag is available.
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {DEMO_BAKERY.name} — {DEMO_BAKERY.location} packaged 3 bags. Bag #3 is allocated to you.
          </p>
        </div>

        {/* Store & Price Container */}
        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100 space-y-4">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Bakery Store</p>
            <p className="text-base font-bold text-slate-800">{DEMO_BAKERY.name} — {DEMO_BAKERY.location}</p>
            <p className="text-xs text-slate-500">{DEMO_BAKERY.address}</p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Surplus Price</p>
              <p className="text-xl font-bold text-slate-900 font-mono">${DEMO_BAKERY.pricePerBag}.00</p>
              <p className="text-[10px] text-slate-400">($15+ retail value)</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Pickup Window</p>
              <p className="text-sm font-bold text-slate-900">{DEMO_BAKERY.pickupWindow}</p>
              <p className="text-[10px] text-slate-500">Tonight Only</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer Block */}
        <div className="text-center py-4 px-6 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="inline-flex flex-col items-center">
            <div className="text-3xl font-mono font-light text-amber-400 tracking-wider">
              {formattedTime}
            </div>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">
              Time to decide before auto-reassignment
            </p>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-1000 ${
                percentLeft < 30 ? 'bg-rose-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Held counter reservation</span>
            <button
              onClick={() => setTimeLeft(5)}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              Simulate 5s left
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            id="btn-accept-offer"
            onClick={onAccept}
            className="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-200"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            Accept Offer & Reserve Bag (${DEMO_BAKERY.pricePerBag}.00)
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="btn-decline-offer"
              onClick={onDecline}
              className="w-full py-3 px-4 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <X className="w-3.5 h-3.5" />
              Decline & Release Bag
            </button>

            <button
              id="btn-trigger-expire"
              onClick={onExpire}
              className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Simulate Expiration
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          If you decline or the timer expires, this bag will be offered to the next person on the waitlist with no penalty.
        </p>
      </div>
    </div>
  );
};
