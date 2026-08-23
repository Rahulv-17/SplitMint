import React, { useContext, useState, useRef, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cropper from 'react-easy-crop';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Cropper state
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 250;
    canvas.height = 250;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      250,
      250
    );

    // As Base64 string
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      setLoading(true);
      setMessage('');
      setError('');
      
      // Save avatar to backend immediately
      const res = await axios.put(`${API}/api/auth/me`, { name, avatar: croppedImage });
      
      // Update local storage/context by reloading or we can just show success since token refresh handles it
      // For instant UI update, dispatch a custom event or force reload if context isn't updating deeply
      window.location.reload(); 
      
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      setError('Failed to crop and save image');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.put(`${API}/api/auth/me`, { name });
      setMessage('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      await axios.put(`${API}/api/auth/update-password`, {
        currentPassword,
        newPassword
      });
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto min-h-[calc(100vh-80px)] relative">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-on-surface">Settings</h1>
          <p className="text-on-surface-variant mt-2">Manage your account preferences.</p>
        </div>

        <div className="space-y-8 pb-24">
          {/* Profile Section */}
          <section className="bg-surface-container/50 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">person_outline</span>
              <h3 className="text-lg font-semibold">Profile Information</h3>
            </div>

            {message && (
              <div className="p-3 rounded-xl text-xs flex items-center bg-primary/10 border border-primary/20 text-primary mb-4">
                <span className="material-symbols-outlined text-base mr-2">check_circle</span>
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-xl text-xs flex items-center bg-error/10 border border-error/20 text-error mb-4">
                <span className="material-symbols-outlined text-base mr-2">error_outline</span>
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar Upload */}
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors flex items-center justify-center bg-surface-container-high text-3xl font-bold text-primary relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    name ? name.charAt(0).toUpperCase() : 'U'
                  )}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="flex-1 space-y-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">Full Name</label>
                    <input
                      className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">Email Address</label>
                    <input
                      className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface-variant cursor-not-allowed outline-none font-body-md"
                      readOnly
                      type="email"
                      value={user?.email || ''}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-primary-container text-black font-semibold text-sm hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : 'Save Name'}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Security Section */}
          {!user?.googleId && (
            <section className="bg-surface-container/50 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">lock</span>
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>

              {passwordMessage && (
                <div className="p-3 rounded-xl text-xs flex items-center bg-primary/10 border border-primary/20 text-primary mb-4">
                  <span className="material-symbols-outlined text-base mr-2">check_circle</span>
                  {passwordMessage}
                </div>
              )}
              {passwordError && (
                <div className="p-3 rounded-xl text-xs flex items-center bg-error/10 border border-error/20 text-error mb-4">
                  <span className="material-symbols-outlined text-base mr-2">error_outline</span>
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">Current Password</label>
                  <input
                    className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">New Password</label>
                  <input
                    className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant">Confirm New Password</label>
                  <input
                    className="w-full bg-surface-container-lowest/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary-container focus:ring-0 text-on-background transition-all outline-none font-body-md placeholder:text-on-surface-variant/40"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-on-background font-semibold text-sm hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Update Password'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Danger Zone */}
          <section className="bg-error/5 rounded-2xl p-6 border border-error/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <h3 className="text-lg font-semibold text-error">Danger Zone</h3>
            </div>
            <p className="text-on-surface-variant text-sm mb-4">Sign out of your account on this device.</p>
            <button
              onClick={logout}
              className="px-6 py-2.5 rounded-xl border border-error/30 text-error text-sm font-semibold hover:bg-error/10 transition-colors"
            >
              Sign Out
            </button>
          </section>
        </div>

        {/* Cropping Modal */}
        {isCropping && imageSrc && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="bg-surface-container-low w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-headline-md text-on-surface">Crop Profile Picture</h3>
                <button 
                  onClick={() => { setIsCropping(false); setImageSrc(null); fileInputRef.current.value = null; }}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="relative w-full h-[400px] bg-black">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">zoom_out</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">zoom_in</span>
                </div>
                
                <button
                  onClick={handleSaveCrop}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary-container text-black font-semibold hover:bg-primary transition-colors flex items-center justify-center"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Save Profile Picture'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
