import React, { useState } from 'react';
import { SearchInput } from '../ui/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Bell, Plus, ChevronDown, Check, GraduationCap, Briefcase } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export function Topbar({ title, subtitle }) {
  const { role, user, switchRole } = useAuthStore();
  const navigate = useNavigate();

  // Modals & popovers state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleJoinClass = (e) => {
    e.preventDefault();
    if (classCode.trim().length >= 6) {
      setIsJoinSuccess(true);
      setTimeout(() => {
        setIsJoinSuccess(false);
        setIsJoinModalOpen(false);
        setClassCode('');
      }, 1200);
    }
  };

  const handleRoleToggle = () => {
    const nextRole = role === 'PROFESSOR' ? 'STUDENT' : 'PROFESSOR';
    switchRole(nextRole);
    navigate(nextRole === 'PROFESSOR' ? '/professor/overview' : '/student/home');
  };

  return (
    <>
      <header className="h-16 px-8 border-b border-ink-border bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        {/* Left: Dynamic Greeting or Page Title */}
        <div>
          {title ? (
            <div className="flex items-baseline gap-3">
              <h1 className="text-lg font-bold text-ink tracking-tight">{title}</h1>
              {subtitle && <span className="text-xs text-ink-muted">{subtitle}</span>}
            </div>
          ) : (
            <div>
              <h1 className="text-base font-bold text-ink tracking-tight">
                {role === 'PROFESSOR' ? 'Good morning, Dr. Park' : 'Good morning, Maya 👋'}
              </h1>
              <p className="text-[11px] text-ink-muted">
                {role === 'PROFESSOR'
                  ? 'Thursday, October 1 · Fall term'
                  : 'Thursday, October 1 · Week 6'}
              </p>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3.5">
          {/* Quick role switcher pill */}
          <button
            onClick={handleRoleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
            title="Click to toggle between Student and Professor view"
          >
            {role === 'PROFESSOR' ? (
              <>
                <Briefcase className="w-3.5 h-3.5" />
                <span>Prof View</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student View</span>
              </>
            )}
            <span className="text-[10px] text-brand-500 font-normal underline ml-0.5">switch</span>
          </button>

          {/* Search Bar */}
          <SearchInput placeholder="Search CampusFlow..." />

          {/* Contextual Action Button */}
          {role === 'STUDENT' ? (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setIsJoinModalOpen(true)}
              className="font-semibold text-xs border-slate-300"
            >
              Join a class
            </Button>
          ) : (
            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                iconRight={ChevronDown}
                onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                className="font-semibold text-xs"
              >
                Create
              </Button>
              {isCreateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-ink-border rounded-xl shadow-hero py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      alert('Create new course modal opened');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-ink"
                  >
                    New course
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      alert('Create assignment modal opened');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-ink"
                  >
                    New assignment
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      alert('Create quiz modal opened');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-ink"
                  >
                    New quiz
                  </button>
                  <div className="h-px bg-ink-border my-1" />
                  <button
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      alert('Post class announcement');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-brand-600"
                  >
                    Post announcement
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-lg border border-ink-border bg-white flex items-center justify-center text-ink-muted hover:text-ink hover:bg-slate-50 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-ink-border rounded-xl shadow-hero p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-ink-border mb-2">
                  <span className="font-bold text-ink">Notifications</span>
                  <span className="text-[10px] text-brand-600 font-semibold cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-brand-50/60 text-ink">
                    <p className="font-semibold text-xs">BIO 214 Quiz 2 is starting soon</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">Scheduled for today at 10:30 AM</p>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-slate-50 text-ink transition-colors">
                    <p className="font-semibold text-xs">Dr. Elena Park updated Cell Biology</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">Slides for Lecture 9 are ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Join a Class Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join a class"
        description="Enter the 6-digit class code provided by your instructor to enroll."
      >
        <form onSubmit={handleJoinClass} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
              Class Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="e.g. BIO214"
              className="w-full text-center tracking-widest text-lg font-mono font-bold uppercase py-3 border border-ink-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsJoinModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={classCode.length < 6}
            >
              {isJoinSuccess ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-white" /> Enrolled!
                </span>
              ) : (
                'Enroll now'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
