import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { saveUser, captureReferralFromUrl, getActiveReferralCode } from '../utils/users';
import { UserCheck, Sparkles, Gift, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';

interface RegisterProps {
  onNavigate?: (view: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { login, setCurrentView } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ name: string; myReferralCode: string } | null>(null);

  useEffect(() => {
    // Check URL or localStorage for referral code
    const captured = captureReferralFromUrl() || getActiveReferralCode();
    if (captured) {
      setReferralCode(captured);
    }
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة / Please fill all required fields.');
      return;
    }

    try {
      const saved = saveUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password.trim(),
        referralCodeUsed: referralCode.trim() || undefined,
      });

      // Log in user in store context
      login(saved.email);
      setSuccessData({
        name: saved.name,
        myReferralCode: saved.myReferralCode,
      });
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء إنشاء الحساب / Registration error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>انضم لعائلة زيزو شوب كندا | Join Zezo Shop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            إنشاء حساب جديد / Register
          </h1>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            احصل على كود إحالة خاص بك، تتبع طلباتك، واستفد من عروض الشحن والدفع عند الاستلام.
          </p>
        </div>

        {/* Success Modal Card if registered */}
        {successData ? (
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-neutral-950">
                مرحباً بك، {successData.name}! 🎉
              </h3>
              <p className="text-xs text-neutral-600">
                تم إنشاء حسابك بنجاح وحفظه في سجل المشتركين.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
                <span>كود الإحالة الخاص بك / Your Referral Code</span>
                <Gift className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-mono font-black text-rose-600 text-center tracking-widest bg-white py-2 px-3 rounded-xl border border-rose-200 shadow-2xs">
                {successData.myReferralCode}
              </div>
              <p className="text-[11px] text-neutral-500 text-center">
                شاركه مع أصدقائك في كندا لكسب نقاط وخصومات حصرية!
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => handleNavigate('shop')}
                className="w-full py-3 bg-neutral-950 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>ابدأ التسوق الآن / Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('account')}
                className="w-full py-2.5 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
              >
                لوحة التحكم وحسابي / My Account
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  الاسم الكامل / Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Campbell"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  البريد الإلكتروني / Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.ca"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  رقم الهاتف الكندي / Phone Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="register-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (416) 555-0144"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  كلمة المرور / Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="register-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1 flex items-center justify-between">
                  <span>كود الإحالة (اختياري) / Referral Code (Optional)</span>
                  <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    خصم ترحيبي
                  </span>
                </label>
                <input
                  id="register-referral-code"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LIA-8821"
                  className="w-full px-3.5 py-2.5 uppercase font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 text-sm tracking-wider"
                />
                {referralCode && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ تم تطبيق كود الإحالة: {referralCode}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>إنشاء الحساب / Register Account</span>
              </button>
            </form>

            {/* Switch to Login */}
            <div className="pt-4 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600">
                لديك حساب بالفعل؟ / Already have an account?{' '}
                <button
                  id="switch-to-login-btn"
                  onClick={() => handleNavigate('login')}
                  className="font-bold text-neutral-950 hover:underline underline-offset-2 ml-1"
                >
                  تسجيل الدخول / Login
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>بياناتك محفوظة محلياً بأمان وفق معايير الخصوصية الكندية</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
