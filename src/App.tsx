/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppState, WaitlistMember } from './types';
import { INITIAL_WAITLIST, DEMO_BAKERY } from './data';
import { Header } from './components/Header';
import { StateConsumerWaitlist } from './components/StateConsumerWaitlist';
import { StateMerchantConfirm } from './components/StateMerchantConfirm';
import { StateDistribution } from './components/StateDistribution';
import { StateConsumerOffer } from './components/StateConsumerOffer';
import { StateSuccess } from './components/StateSuccess';
import { StateReassignment } from './components/StateReassignment';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('waitlist');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [bagCount, setBagCount] = useState<number>(3);
  const [reassignReason, setReassignReason] = useState<'declined' | 'expired'>('declined');
  const [waitlist, setWaitlist] = useState<WaitlistMember[]>(INITIAL_WAITLIST);

  const handleReset = () => {
    setCurrentState('waitlist');
    setHasJoined(false);
    setBagCount(3);
    setReassignReason('declined');
    setWaitlist(INITIAL_WAITLIST);
  };

  const handleJoinWaitlist = () => {
    setHasJoined(true);
  };

  const handleMerchantConfirm = () => {
    setCurrentState('distribution');
  };

  const handleOpenOffer = () => {
    setCurrentState('offer');
  };

  const handleAcceptOffer = () => {
    setCurrentState('success');
  };

  const handleDeclineOffer = () => {
    setReassignReason('declined');
    setCurrentState('reassignment');
  };

  const handleExpireOffer = () => {
    setReassignReason('expired');
    setCurrentState('reassignment');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header & Navigation */}
      <Header
        currentState={currentState}
        onStateSelect={(st) => setCurrentState(st)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {currentState === 'waitlist' && (
          <StateConsumerWaitlist
            hasJoined={hasJoined}
            onJoin={handleJoinWaitlist}
            onLeave={() => setHasJoined(false)}
            onProceedToMerchant={() => setCurrentState('merchant')}
          />
        )}

        {currentState === 'merchant' && (
          <StateMerchantConfirm
            bagCount={bagCount}
            onConfirm={handleMerchantConfirm}
          />
        )}

        {currentState === 'distribution' && (
          <StateDistribution
            waitlist={waitlist}
            onOpenOffer={handleOpenOffer}
          />
        )}

        {currentState === 'offer' && (
          <StateConsumerOffer
            onAccept={handleAcceptOffer}
            onDecline={handleDeclineOffer}
            onExpire={handleExpireOffer}
          />
        )}

        {currentState === 'success' && (
          <StateSuccess onReset={handleReset} />
        )}

        {currentState === 'reassignment' && (
          <StateReassignment
            reason={reassignReason}
            waitlist={waitlist}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-3.5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="font-medium text-slate-500">Confirmed Surplus Waitlist MVP • Frontend Clickable Prototype</span>
          <span className="font-mono text-slate-400">Bakery Demo: Sunrise Bakery (Bellevue)</span>
        </div>
      </footer>
    </div>
  );
}
