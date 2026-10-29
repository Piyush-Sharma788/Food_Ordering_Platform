'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  User,
  GraduationCap,
  BookOpen,
  Mail,
  ShoppingBag,
  LogOut,
  LogIn,
  ShieldCheck,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { user, loginModalOpen, setLoginModalOpen, login, logout } = useAuth();
  const [studentIdInput, setStudentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const success = await login(studentIdInput, passwordInput || 'pass123');
    setLoading(false);

    if (!success) {
      setErrorMsg('Invalid Student ID or password. (Demo: student1 / pass123)');
    } else {
      setStudentIdInput('');
      setPasswordInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-teal-400" />
            <h2 className="font-bold text-base tracking-wide">
              {user ? 'Student Profile' : 'Student Authentication'}
            </h2>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-neutral-200">
                <div className="w-12 h-12 bg-neutral-900 text-teal-400 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">{user.name}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span className="capitalize">{user.role.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm text-neutral-700 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-neutral-500">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>Student ID:</span>
                  </span>
                  <span className="font-semibold text-neutral-900">{user.studentId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-neutral-500">
                    <GraduationCap className="w-4 h-4 text-neutral-400" />
                    <span>Academic Year:</span>
                  </span>
                  <span className="font-semibold text-neutral-900">{user.year || '3rd Year'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-neutral-500">
                    <BookOpen className="w-4 h-4 text-neutral-400" />
                    <span>Branch:</span>
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {user.branch || 'Computer Science'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-neutral-500">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>Email:</span>
                  </span>
                  <span className="font-semibold text-neutral-900 truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
                  <span className="flex items-center space-x-2 text-neutral-500">
                    <ShoppingBag className="w-4 h-4 text-teal-600" />
                    <span>Orders Completed:</span>
                  </span>
                  <span className="font-bold text-teal-700">{user.orderCount || 0}</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-neutral-500 mb-4">
                Enter your registered Student ID to access your profile, order history, and discount benefits.
              </p>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-md mb-3 border border-red-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleQuickLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Student ID or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. 12345 or student1@example.com"
                    className="w-full text-sm border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Default: pass123"
                    className="w-full text-sm border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-md text-sm transition-colors mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : 'Log In'}</span>
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-neutral-200 text-center text-xs text-neutral-500">
                New student?{' '}
                <a
                  href="/login"
                  onClick={() => setLoginModalOpen(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create an account
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

