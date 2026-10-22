import React, { useState } from 'react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Send, Search, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function MessagesPage() {
  const { user, role } = useAuthStore();
  const [activeThreadId, setActiveThreadId] = useState('t1');
  const [replyText, setReplyText] = useState('');

  const [threads, setThreads] = useState([
    {
      id: 't1',
      participant: role === 'STUDENT' ? 'Prof. Priya Sharma' : 'Rahul Sharma',
      initials: role === 'STUDENT' ? 'PS' : 'RS',
      roleText: role === 'STUDENT' ? 'Professor · Data Structures' : 'Student · CS 301',
      lastMessage: 'Office hours are open if you need help with AVL trees.',
      time: '10 min ago',
      unread: false,
      messages: [
        {
          id: 'm1',
          sender: 'Prof. Priya Sharma',
          text: 'Hello Rahul, please make sure your Assignment 1 AVL tree submission passes all unit tests.',
          time: '9:30 AM',
          isMe: role === 'PROFESSOR',
        },
        {
          id: 'm2',
          sender: 'Rahul Sharma',
          text: 'Yes Professor! Double rotations and benchmarks are verified in the submission report.',
          time: '9:42 AM',
          isMe: role === 'STUDENT',
        },
        {
          id: 'm3',
          sender: 'Prof. Priya Sharma',
          text: 'Excellent work. Office hours are open if you need help with AVL trees or Dijkstra.',
          time: '10:05 AM',
          isMe: role === 'PROFESSOR',
        },
      ],
    },
    {
      id: 't2',
      participant: 'Neha Patel',
      initials: 'NP',
      roleText: 'Student · CS 301',
      lastMessage: 'Submitted the graph traversal questions.',
      time: '1 hr ago',
      unread: true,
      messages: [
        {
          id: 'm20',
          sender: 'Neha Patel',
          text: 'Submitted the graph traversal questions.',
          time: 'Yesterday',
          isMe: false,
        },
      ],
    },
  ]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: user?.name || 'Me',
      text: replyText.trim(),
      time: 'Just now',
      isMe: true,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: newMsg.text,
            }
          : t
      )
    );
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Messages</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Direct communication between students, faculty, and teaching assistants.
        </p>
      </div>

      {/* Work In Progress Notice */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-soft">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
            Work in Progress · Preview Mode
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            The real-time direct messaging backend service is currently in development. The conversation threads, replies, and sample messages shown below contain demonstrative dummy data for user interface testing and verification.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink-border shadow-soft h-[600px] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Thread List (4 cols) */}
        <div className="md:col-span-4 border-r border-ink-border p-4 flex flex-col justify-between">
          <div>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div className="space-y-1">
              {threads.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveThreadId(th.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    th.id === activeThreadId
                      ? 'bg-brand-50 border border-brand-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar initials={th.initials} size="sm" color="brand" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-ink truncate">
                        {th.participant}
                      </p>
                      <p className="text-[10px] text-ink-muted truncate">
                        {th.lastMessage}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-muted shrink-0 ml-2">
                    {th.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Conversation Pane (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-50/50">
          {/* Thread Header */}
          <div className="p-4 bg-white border-b border-ink-border flex items-center gap-3">
            <Avatar initials={activeThread.initials} size="md" color="violet" />
            <div>
              <h3 className="text-sm font-bold text-ink">{activeThread.participant}</h3>
              <p className="text-[11px] text-ink-muted">{activeThread.roleText}</p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {activeThread.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.isMe
                      ? 'bg-brand-500 text-white rounded-br-xs'
                      : 'bg-white border border-ink-border text-ink rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-ink-muted mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Reply Composer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-ink-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Reply to ${activeThread.participant}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs py-2.5 px-4 rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <Button variant="primary" size="sm" type="submit" icon={Send}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
