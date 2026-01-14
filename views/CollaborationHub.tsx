
import React, { useState, useRef } from 'react';
import {
  ArrowLeft, ExternalLink, Check, X, Link as LinkIcon, User,
  Calendar, MessageCircle, FileUp, Send, FileCode, Archive, Globe, Mail, Music2, Clock, UploadCloud, Loader2
} from 'lucide-react';
import { CollaborationRequest, CollabMessage, ProjectFile } from '../types';

interface CollaborationHubProps {
  requests: CollaborationRequest[];
  isAdmin: boolean;
  onBack: () => void;
  onUpdateCollab: (id: string, status: CollaborationRequest['status'], liveLink?: string) => void;
  onSendMessage: (id: string, text: string, sender: 'admin' | 'user') => void;
  onUploadFile: (id: string, file: ProjectFile) => void;
}


const CollaborationHub: React.FC<CollaborationHubProps> = ({
  requests, isAdmin, onBack, onUpdateCollab
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRequest = requests.find(r => r.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in h-[calc(100vh-160px)]">
      {/* Sidebar - Request List */}
      <div className={`lg:col-span-4 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-slate-950/80 backdrop-blur pb-2 z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Requests</span>
          </button>
          <span className="bg-slate-900 px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase">
            {requests.length} Total
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center">
            <User className="mx-auto text-slate-700 mb-2" size={32} />
            <p className="text-slate-500 text-sm font-medium">No collaborations yet.</p>
          </div>
        ) : (
          requests.map(req => (
            <button
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${selectedId === req.id
                ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/10'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${req.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                  {req.status}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-slate-100 truncate">{req.senderName}</h4>
              <p className="text-xs text-slate-500 truncate">{req.projectType}</p>
            </button>
          ))
        )}
      </div>

      {/* Main Content - Workspace */}
      <div className={`lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
        {selectedRequest ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-indigo-500" />
                    {selectedRequest.senderName} ({selectedRequest.status})
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Email Action */}
                <a
                  href={`mailto:${selectedRequest.senderEmail}?subject=Re: TizzyBeatz Collaboration - ${selectedRequest.projectType}&body=Hi ${selectedRequest.senderName},%0D%0A%0D%0AI received your collaboration request regarding "${selectedRequest.projectType}".%0D%0A%0D%0A[Your message here]`}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    if (selectedRequest.status === 'pending') {
                      onUpdateCollab(selectedRequest.id, 'contacted');
                    }
                  }}
                >
                  <Mail size={18} /> <span className="hidden sm:inline">Reply via Email</span>
                </a>

                {isAdmin && selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => onUpdateCollab(selectedRequest.id, 'rejected')}
                    className="p-2 text-slate-400 hover:text-red-400 transition" title="Reject"
                  >
                    <X size={20} />
                  </button>
                )}
                {(selectedRequest.status === 'accepted' || selectedRequest.status === 'contacted') && (
                  <button
                    onClick={() => onUpdateCollab(selectedRequest.id, 'archived')}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 transition"
                  >
                    <Archive size={16} /> <span className="hidden sm:inline">Archive</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content Display */}
            <div className="p-8 space-y-8 overflow-y-auto">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Type</label>
                  <p className="text-lg font-bold text-white">{selectedRequest.projectType}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                  <p className="text-lg font-bold text-white font-mono break-all">{selectedRequest.senderEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Briefing</label>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.message || "No specific message provided."}
                </div>
              </div>

              {selectedRequest.demoUrl && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attached Demo</label>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                      <Music2 size={24} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-bold text-white">Demo Attachment</p>
                      <p className="text-xs text-slate-500">Preview Available</p>
                    </div>
                    <audio controls src={selectedRequest.demoUrl} className="h-10 w-full sm:w-64" />
                  </div>
                </div>
              )}

            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[32px] flex items-center justify-center text-slate-700 shadow-2xl relative">
              <MessageCircle size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Secure Uplink</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">Select a request to view details and establish communication.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default CollaborationHub;
