import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Building2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthViewProps {
  isDark?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = () => {
  const { login, signup, authError, clearError, isConfigured } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    clearError();
    setValidationError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const validate = (): boolean => {
    setValidationError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setValidationError('Email address is required.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (!password) {
      setValidationError('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return false;
    }

    // Signup specific validation
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    clearError();

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
    } catch {
      // Error handled and mapped inside AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentError = validationError || authError;

  return (
    <div className="min-h-screen w-full bg-canvas flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-pos/5 dark:bg-pos/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white shadow-lg shadow-brand/20 mb-4 transition-transform hover:scale-105">
            <Building2 size={28} strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink font-display">
            RealVest
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-3 mt-1">
            Real Estate Intelligence & Investment Advisor
          </p>
        </div>

        {/* Configuration Notice if env vars are missing */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-warn-soft/60 border border-warn/30 text-ink text-xs space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-warn">
              <AlertCircle size={16} />
              <span>Firebase Environment Configuration Required</span>
            </div>
            <p className="text-ink-2 leading-relaxed">
              To connect your real Firebase project, add your credentials to <code className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-[11px]">frontend/.env</code>.
            </p>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-surface rounded-2xl border border-line p-6 sm:p-8 shadow-card backdrop-blur-sm">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 mb-6 rounded-xl bg-surface-soft border border-line">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-surface text-brand shadow-xs border border-line/60'
                  : 'text-ink-3 hover:text-ink hover:bg-surface/50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-surface text-brand shadow-xs border border-line/60'
                  : 'text-ink-3 hover:text-ink hover:bg-surface/50'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink">
              {mode === 'login' ? 'Welcome back' : 'Get started with RealVest'}
            </h2>
            <p className="text-xs text-ink-3 mt-1">
              {mode === 'login'
                ? 'Sign in to access your investment dashboard and insights'
                : 'Create an account to start analyzing institutional-grade real estate'}
            </p>
          </div>

          {/* Error Message Box */}
          {currentError && (
            <div className="mb-5 p-3 rounded-lg bg-neg-soft/80 border border-neg/20 text-neg text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{currentError}</div>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setValidationError(null);
                }}
                className="text-neg/70 hover:text-neg font-bold ml-1 cursor-pointer"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                  Full Name <span className="text-ink-3 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-3">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-soft border border-line text-ink text-sm placeholder:text-ink-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Email Address <span className="text-neg">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-3">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-soft border border-line text-ink text-sm placeholder:text-ink-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink-2">
                  Password <span className="text-neg">*</span>
                </label>
                {mode === 'signup' && (
                  <span className="text-[11px] text-ink-3">min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-3">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-surface-soft border border-line text-ink text-sm placeholder:text-ink-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-3 hover:text-ink cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                  Confirm Password <span className="text-neg">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-3">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-soft border border-line text-ink text-sm placeholder:text-ink-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-brand hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to RealVest' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick toggle at bottom */}
          <div className="mt-6 pt-5 border-t border-line text-center text-xs text-ink-3">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-brand font-semibold hover:underline cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-brand font-semibold hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Feature Highlights beneath card */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-surface/50 border border-line/60">
            <div className="w-7 h-7 mx-auto rounded-lg bg-brand-soft text-brand flex items-center justify-center mb-1.5">
              <TrendingUp size={14} />
            </div>
            <span className="block text-[11px] font-semibold text-ink">94.8% Accuracy</span>
            <span className="block text-[10px] text-ink-3">Valuation ML</span>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-line/60">
            <div className="w-7 h-7 mx-auto rounded-lg bg-pos-soft text-pos flex items-center justify-center mb-1.5">
              <ShieldCheck size={14} />
            </div>
            <span className="block text-[11px] font-semibold text-ink">Secure Access</span>
            <span className="block text-[10px] text-ink-3">Firebase Auth</span>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-line/60">
            <div className="w-7 h-7 mx-auto rounded-lg bg-warn-soft text-warn flex items-center justify-center mb-1.5">
              <Sparkles size={14} />
            </div>
            <span className="block text-[11px] font-semibold text-ink">AI Advisor</span>
            <span className="block text-[10px] text-ink-3">Gemini 3.7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthView;
