import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getAllUsers } from '../utils/users';
import { LogIn, ArrowRight, ShieldCheck, Mail, Lock, Sparkles, UserCheck } from 'lucide-react';

interface LoginProps {
  onNavigate?: (view: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, setCurrentView } = useStore();

  const [email, setEmail] = useState('liam.campbell@zezo.ca');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNavigate = (view: any) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      setCurrentView(view);
      try {
        window.history.pushState({}, '', view === 'home' ? '/' : `/${view}`);
      } catch (e) {
        // fallback
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('يرجى إدخال البريد الإلكتروني / Please enter your email.');
      return;
    }

    const users = getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setError('هذا الحساب غير مسجل. يرجى إنشاء حساب جديد أولاً / User not found.');
      return;
    }

    // Password validation if user set one
    if (user.password && password && user.password !== password) {
      setError('كلمة المرور غير صحيحة / Incorrect password.');
      return;
    }

    // Successfully log in
    login(user.email);
    setSuccess(`تم تسجيل الدخول بنجاح! مرحباً بك يا ${user.name}`);

    setTimeout(() => {
      handleNavigate('account');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            <span>تسجيل الدخول / Welcome Back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            حساب زيزو شوب / Zezo Account
          </h1>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            سجل دخولك لمتابعة حالة الشحن، مراجعة طلباتك، وإدارة كود الإحالة الخاص بك.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                البريد الإلكتروني / Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="liam.campbell@zezo.ca"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                كلمة المرور / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="submit-login-btn"
              type="submit"
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول / Sign In</span>
            </button>
          </form>

          {/* Quick Demo Login Preset */}
          <div className="pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => {
                login('liam.campbell@zezo.ca');
                setSuccess('تم الدخول كحساب تجريبي (Liam Campbell)');
                setTimeout(() => handleNavigate('account'), 500);
              }}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-neutral-600" />
              <span>⚡ تسجيل دخول تجريبي سريع / Quick Demo Login</span>
            </button>
          </div>

          {/* Switch to Register */}
          <div className="pt-3 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-600">
              ليس لديك حساب بعد؟ / Don't have an account?{' '}
              <button
                id="switch-to-register-btn"
                onClick={() => handleNavigate('register')}
                className="font-bold text-neutral-950 hover:underline underline-offset-2 ml-1"
              >
                إنشاء حساب جديد / Register
              </button>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>حماية وتشفير البيانات المحلية / Secure Local Storage Session</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
