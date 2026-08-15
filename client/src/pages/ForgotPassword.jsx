import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || cooldown > 0) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || 'If an account exists with that email, a password reset link has been sent.');
      setCooldown(30);
      
      // Auto-clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0b10]">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#1e202e_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none bg-primary-container/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none bg-secondary/5 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10 my-8"
      >
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden glass-panel border border-white/10"
          style={{ background: 'rgba(18, 19, 26, 0.75)', backdropFilter: 'blur(24px)' }}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">lock_reset</span>
              <h1 className="font-display-lg text-2xl font-bold text-on-surface mb-2">Forgot Password?</h1>
              <p className="text-sm text-on-surface-variant font-body-md">
                Enter your email address and we'll send you a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="p-3 rounded-xl text-xs flex items-center bg-error/10 border border-error/20 text-error"
                  >
                    <span className="material-symbols-outlined text-base mr-2">error_outline</span>
                    {error}
                  </motion.div>
                )}
                {message && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="p-3 rounded-xl text-xs flex items-center bg-primary/10 border border-primary/20 text-primary"
                  >
                    <span className="material-symbols-outlined text-base mr-2">check_circle</span>
                    {message}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:border-primary-container bg-surface-container-lowest/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || cooldown > 0}
                whileHover={(!loading && cooldown === 0) ? { scale: 1.01, boxShadow: '0 0 20px rgba(0,245,160,0.3)' } : {}}
                whileTap={(!loading && cooldown === 0) ? { scale: 0.98 } : {}}
                className="w-full py-4 mt-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-primary-container text-on-primary-container text-black"
                style={{ cursor: (loading || cooldown > 0) ? 'not-allowed' : 'pointer', opacity: (loading || cooldown > 0) ? 0.7 : 1 }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
