'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isRegister) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            email,
            name: name || `Student ${studentId}`,
            password,
            role: 'customer',
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccessMsg('Account registered successfully! Logging you in...');
          await login(studentId, password);
          router.push('/');
        } else {
          setErrorMsg(data.message || 'Registration failed. Student ID or Email may exist.');
        }
      } catch {
        setErrorMsg('Network error occurred during registration.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      const success = await login(studentId, password);
      setLoading(false);

      if (success) {
        if (studentId.toLowerCase() === 'admin') {
          router.push('/canteen');
        } else {
          router.push('/');
        }
      } else {
        setErrorMsg('Invalid Student ID or password. (Try: student1 / pass123)');
      }
    }
  };

  const handleQuickDemo = async (role: 'student' | 'admin') => {
    setErrorMsg('');
    setLoading(true);
    if (role === 'admin') {
      const ok = await login('admin', 'adminpass');
      setLoading(false);
      if (ok) router.push('/canteen');
      else setErrorMsg('Could not login as admin demo.');
    } else {
      const ok = await login('12345', 'pass123');
      setLoading(false);
      if (ok) router.push('/');
      else setErrorMsg('Could not login as student demo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f4f4f4]">
      {/* Wrapper matching FINAL_LOGIN.html */}
      <div className="w-full max-w-4xl bg-white border-2 border-black rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Dark Hero Info Panel */}
        <div className="bg-black text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="inline-block bg-neutral-900 text-teal-400 border border-neutral-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
              Cd: Zaika Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome {isRegister ? 'to the Club' : 'Back!'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Order fresh canteen meals, grab fast study snacks, and track live kitchen preparation
              timers directly with your student ID.
            </p>
          </div>

          {/* Demo account quick login helper */}
          <div className="relative z-10 pt-6 border-t border-neutral-800 space-y-2">
            <span className="text-[11px] text-neutral-400 block font-semibold">
              Instant Demo Sign-in:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Student Demo (12345)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="bg-neutral-900 hover:bg-neutral-800 text-teal-400 border border-neutral-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Canteen Manager Demo (admin)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-black">
              {isRegister ? 'Sign Up for Zaika' : 'Student & Staff Login'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isRegister
                ? 'Create a campus account with your Student ID.'
                : 'Enter your credentials to access your food orders.'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-md mb-4">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-md mb-4 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Student ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 12345 or student1 or admin"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Campus Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-neutral-800 text-white font-bold py-3 rounded-md text-xs sm:text-sm transition-colors shadow-md disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            {isRegister ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-black font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-black font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

