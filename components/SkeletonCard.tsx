import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="neo-brutalism-card flex flex-col h-full animate-pulse">
      <div className="relative aspect-[3/4] rounded-[56px] overflow-hidden mb-8 bg-slate-800/50 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute top-6 left-6 flex flex-col gap-3">
          <div className="w-20 h-6 bg-slate-700/50 rounded-xl"></div>
        </div>
        <div className="absolute bottom-8 left-8 right-8">
            <div className="w-3/4 h-8 bg-slate-700/50 rounded mb-2"></div>
            <div className="w-1/2 h-4 bg-slate-700/50 rounded"></div>
        </div>
      </div>
      <div className="px-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="w-24 h-4 bg-slate-700/50 rounded"></div>
          </div>
          <div className="w-16 h-8 bg-slate-700/50 rounded"></div>
        </div>
        <div className="w-full h-16 bg-slate-800/50 rounded-[28px]"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
