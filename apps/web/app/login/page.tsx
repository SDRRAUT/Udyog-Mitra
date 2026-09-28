'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import {
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Check,
  Sparkles,
  Clock,
  CheckCircle2,
  Factory,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const demoRoles = [
    {
      id: 'ENTREPRENEUR',
      label: 'Entrepreneur',
      dept: 'Applicant / Factory',
      icon: '🏭',
      name: 'Rahul Patil',
      org: 'Rahul Foods & Dairy Agro Ltd, Pune',
      email: 'entrepreneur.demo@mahsetu.in',
      badge: 'Applicant',
      targetPath: '/entrepreneur/dashboard',
      description: 'Single window clearance filing, CAF, & deemed RTS tracking',
    },
    {
      id: 'MPCB_OFFICER',
      label: 'MPCB Officer',
      dept: 'Pollution Control',
      icon: '🧪',
      name: 'Dr. Suresh Deshmukh',
      org: 'Maharashtra Pollution Control Board',
      email: 'mpcb.officer@mahsetu.in',
      badge: 'MPCB Officer',
      targetPath: '/department/queue',
      description: 'Statutory CTE/CTO consent review & environmental scrutiny',
    },
    {
      id: 'DISH_OFFICER',
      label: 'DISH Safety',
      dept: 'Factories & Health',
      icon: '⚙️',
      name: 'Shri. M. R. Patil',
      org: 'Industrial Safety & Health Directorate',
      email: 'dish.officer@mahsetu.in',
      badge: 'DISH Safety',
      targetPath: '/department/dashboard',
      description: 'Factory plan approvals, worker safety, & joint inspection',
    },
    {
      id: 'STATE_ADMIN',
      label: 'State Admin',
      dept: 'Mantralaya Command',
      icon: '🏛️',
      name: 'State MSIS Admin',
      org: 'Single Window Cell, Mantralaya',
      email: 'admin.msis@mahsetu.in',
      badge: 'State Command',
      targetPath: '/admin',
      description: 'Cross-department escalation, RTS compliance & appellate audit',
    },
  ];

  const [activeRole, setActiveRole] = useState(demoRoles[0]);
  const [identifier, setIdentifier] = useState(demoRoles[0].email);
  const [password, setPassword] = useState('demo-access-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // When user clicks a role inside the card
  const handleSelectRole = (roleItem: typeof demoRoles[0]) => {
    setActiveRole(roleItem);
    setIdentifier(roleItem.email);
    setPassword('demo-access-2026');
    setError('');
    setMessage(`Switched to ${roleItem.label} (${roleItem.name})`);
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      await api.auth.sendOTP(identifier);
      setMessage(`OTP sent to ${identifier}. Use Demo code: 123456`);
      setStep('OTP');
    } catch (err: any) {
      console.warn('Backend send OTP error, using client fallback:', err);
      setMessage(`Demo OTP active. Use: 123456`);
      setStep('OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide an official email or mobile number.');
      return;
    }

    if (authMode === 'OTP' && step === 'CREDENTIALS') {
      await handleSendOtp();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let res: any = null;
      try {
        await api.auth.sendOTP(identifier);
        res = await api.auth.verifyOTP(identifier, '123456');
      } catch (backendErr) {
        console.warn('Backend API unavailable, executing authorized demo login:', backendErr);
      }

      const userToLogin = (res && res.accessToken && res.user)
        ? res.user
        : {
            id: `usr-${activeRole.id.toLowerCase()}-1`,
            name: activeRole.name,
            email: identifier,
            role: activeRole.id === 'STATE_ADMIN'
              ? 'SUPER_ADMIN'
              : activeRole.id.includes('OFFICER')
              ? 'OFFICER'
              : 'ENTREPRENEUR',
            department: activeRole.dept,
          };
      const tokenToLogin = (res && res.accessToken) ? res.accessToken : 'demo-jwt-token-rts-2026';

      setIsSuccess(true);
      login(userToLogin, tokenToLogin);
      setTimeout(() => {
        router.push(activeRole.targetPath);
      }, 300);
    } catch (err: any) {
      setError('Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      const digits = val.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-lime-100 selection:text-lime-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center justify-center">
        {/* =========================================================================
            TABLET FRAME (Signature Bezel Container matching reference image)
            ========================================================================= */}
        <div className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] border-[10px] sm:border-[14px] border-[#181D27] bg-[#D8EEDC] shadow-[0_30px_70px_-15px_rgba(15,23,42,0.25)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] items-stretch">
            
            {/* ---------------------------------------------------------------------
                LEFT SIDE: 3D Aesthetic Scene & Character
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 relative p-6 sm:p-10 flex flex-col justify-between overflow-hidden bg-[#D8EEDC]">
              {/* Background 3D Workspace Scene */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/login_3d_workspace.jpg"
                  alt="Modern Entrepreneur Workspace in Maharashtra"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                {/* Subtle soft gradient blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Minimalist Clock / RTS Status Badge in Top Left */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RTS Act 2015 · Deemed Clearances Active</span>
                </div>
              </div>

              {/* Floating Bottom Card: Fast-Track TAT */}
              <div className="relative z-10 mt-auto pt-10">
                <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-md max-w-sm hidden sm:block">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Single Window Digital Gateway
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Access statutory parallel clearance pipelines across MPCB, DISH, Fire & MIDC with 14.8 day average turnaround.
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                RIGHT SIDE: Floating Rounded White Card
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 p-4 sm:p-8 lg:p-10 flex items-center justify-center lg:justify-end z-10">
              
              <div className="w-full max-w-[460px] bg-white rounded-3xl sm:rounded-[2.25rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between space-y-6">
                
                {/* Brand Logo & Switcher Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#84CC16] text-slate-900 flex items-center justify-center font-extrabold text-sm shadow-xs">
                      UM
                    </div>
                    <div>
                      <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                        UDYOG MITRA
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Government of Maharashtra
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    SSO v2.6
                  </span>
                </div>

                {/* Card Title */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Portal Sign In
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 font-normal">
                    Select your official role to enter the statutory clearance portal.
                  </p>
                </div>

                {/* ===================================================================
                    LOGIN RELATED ROLES (Inside the Card as explicitly requested)
                    =================================================================== */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Select Access Role:
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {demoRoles.map((r) => {
                      const isSelected = activeRole.id === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleSelectRole(r)}
                          className={cn(
                            'p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5',
                            isSelected
                              ? 'border-[#84CC16] bg-[#F7FEE7] text-slate-900 shadow-xs ring-1 ring-[#84CC16]'
                              : 'border-slate-200/90 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                          )}
                        >
                          <span className="text-lg shrink-0">{r.icon}</span>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {r.label}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {r.dept}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Role Description Banner */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="truncate">
                      <strong className="text-slate-900">{activeRole.name}:</strong>{' '}
                      {activeRole.description}
                    </span>
                  </div>
                </div>

                {/* Notifications & Status Banners */}
                {message && (
                  <div className="p-3 rounded-2xl bg-[#F7FEE7] border border-[#D9F99D] text-xs text-lime-900 flex items-center justify-between">
                    <span className="truncate">{message}</span>
                    <span className="text-[10px] font-mono font-bold bg-white text-lime-700 px-2 py-0.5 rounded-full border border-lime-200 shrink-0 ml-2">
                      Ready
                    </span>
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {error}
                  </div>
                )}

                {/* ===================================================================
                    FORM INPUTS (Matching Reference Style: Soft rounded pills)
                    =================================================================== */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {step === 'CREDENTIALS' ? (
                    <>
                      {/* Email Address Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600">
                          Official Email / Identifier
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Email address"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent transition shadow-2xs"
                            required
                          />
                        </div>
                      </div>

                      {/* Password / Passcode Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-slate-600">
                            Password / Security Passcode
                          </label>
                          <button
                            type="button"
                            onClick={() => setAuthMode(authMode === 'PASSWORD' ? 'OTP' : 'PASSWORD')}
                            className="text-[11px] text-[#2A47C9] hover:underline font-semibold"
                          >
                            {authMode === 'PASSWORD' ? 'Use OTP Instead' : 'Use Password'}
                          </button>
                        </div>

                        {authMode === 'PASSWORD' ? (
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Password"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent transition shadow-2xs pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                            A 6-digit OTP will be dispatched to your registered address upon submission.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* OTP 6-Digit Verification Step */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-600">
                          Enter 6-Digit Passcode
                        </label>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          Demo OTP: 123456
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-10 sm:w-11 h-12 text-center text-lg font-mono font-bold rounded-2xl border border-slate-200 bg-white text-slate-900 focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16] focus:outline-none shadow-2xs"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep('CREDENTIALS')}
                        className="text-[11px] text-[#2A47C9] hover:underline block pt-1"
                      >
                        ← Back to credentials
                      </button>
                    </div>
                  )}

                  {/* ===================================================================
                      PRIMARY ACTION BUTTON (Vibrant Lime Green matching reference)
                      =================================================================== */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#84CC16] hover:bg-[#74B610] active:bg-[#65A30D] text-slate-900 font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span>Authenticating...</span>
                    ) : isSuccess ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Verified! Redirecting...</span>
                      </>
                    ) : step === 'OTP' ? (
                      <>
                        <span>Verify & Enter {activeRole.label} Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : authMode === 'OTP' ? (
                      <>
                        <span>Send Authentication OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Sign In as {activeRole.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* ===================================================================
                    SSO / QUICK AUTH PROVIDERS ("or sign in with")
                    =================================================================== */}
                <div className="space-y-3 pt-1">
                  <div className="relative text-center text-xs text-slate-400">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200/80" />
                    </div>
                    <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      or sign in with
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    {/* Google / NSWS */}
                    <button
                      type="button"
                      onClick={() => handleSelectRole(demoRoles[0])}
                      className="w-10 h-10 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition hover:scale-105"
                      title="National Single Window System (NSWS)"
                    >
                      <span className="font-bold text-xs">G</span>
                    </button>

                    {/* DigiLocker / Aadhaar */}
                    <button
                      type="button"
                      onClick={() => handleSelectRole(demoRoles[1])}
                      className="w-10 h-10 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition hover:scale-105"
                      title="DigiLocker / Aadhaar e-Sign"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </button>

                    {/* Parivesh / Govt ID */}
                    <button
                      type="button"
                      onClick={() => handleSelectRole(demoRoles[3])}
                      className="w-10 h-10 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs transition hover:scale-105"
                      title="State Mantralaya SSO"
                    >
                      <Building2 className="w-4 h-4 text-[#2A47C9]" />
                    </button>
                  </div>
                </div>

                {/* Legal & Statutory Note */}
                <p className="text-[11px] text-center text-slate-400 leading-normal font-normal">
                  By signing in you authenticate under the{' '}
                  <span className="font-semibold text-slate-700">Maharashtra RTS Act 2015</span> and agree to official data security terms.
                </p>

                {/* Bottom Switcher Link */}
                <div className="text-center pt-1 border-t border-slate-100 text-xs text-slate-500">
                  <span>Need an account? </span>
                  <Link
                    href="/entrepreneur/onboarding"
                    className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Register Enterprise
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
