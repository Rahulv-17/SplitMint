import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, { token, password });
      setMessage(res.data.message || 'Password reset successfully.');
      setFormData({ password: '', confirmPassword: '' });
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
              <span className="material-symbols-outlined text-4xl text-primary mb-4">key</span>
              <h1 className="font-display-lg text-2xl font-bold text-on-surface mb-2">Reset Password</h1>
              <p className="text-sm text-on-surface-variant font-body-md">
                Enter your new secure password below.
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
                    className="p-3 rounded-xl text-xs flex items-center bg-primary/10 border border-primary/20 text-primary flex-col gap-3 items-start"
                  >
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-base mr-2">check_circle</span>
                      {message}
                    </div>
                    <Link to="/login" className="px-4 py-2 bg-primary text-black rounded-lg text-xs font-bold self-start mt-2">
                      Go to Login
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {!message && (
                <>
                  <div>
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant font-label-sm mb-2 block">
                      New Password
                    </label>
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

                  <div>
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant font-label-sm mb-2 block">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required 
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={onChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:border-primary-container bg-surface-container-lowest/60 border border-white/10 text-on-surface placeholder:text-on-surface-variant/40"
                    />
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
                    ) : 'Reset Password'}
                  </motion.button>
                </>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
