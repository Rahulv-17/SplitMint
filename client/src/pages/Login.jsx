import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await googleLogin(tokenResponse);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Google login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login failed. Please try again.'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0b10]">
      {/* ── ATMOSPHERIC BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#1e202e_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none bg-primary-container/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none bg-secondary/5 blur-[140px]" />

      {/* ── CENTERED GLASSMORPHISM CARD ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10 my-8"
      >
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden glass-panel border border-white/10"
          style={{
            background: 'rgba(18, 19, 26, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Top glow line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />

          <div className="p-8 sm:p-10">
            {/* Brand & Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-3">
                <h1 className="font-display-lg text-4xl font-bold text-primary tracking-tight">SplitMint</h1>
              </Link>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-label-sm">
                Premium Finance. Simplified.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="p-3 rounded-xl text-xs flex items-center bg-error/10 border border-error/20 text-error"
                  >
                    <span className="material-symbols-outlined text-base mr-2">error_outline</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant font-label-sm mb-2 block">
                  Email Address
                </label>
                <input
                  type="email" 
                  required 
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="name@company.com"
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:border-primary-container bg-surface-container-lowest/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant font-label-sm block">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline transition-colors font-label-sm">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required 
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition-all focus:border-primary-container bg-surface-container-lowest/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01, boxShadow: '0 0 20px rgba(0,245,160,0.3)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-4 mt-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-primary-container text-on-primary-container text-black"
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    LOG IN
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-3 text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-semibold">or continue with</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            {/* Custom Google Button */}
            <motion.button
              type="button"
              onClick={() => handleGoogleAuth()}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors bg-surface-container-high/50 border border-white/10 text-on-surface"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </motion.button>


            <p className="text-center mt-6 text-xs text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
