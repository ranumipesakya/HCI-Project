import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Check } from 'lucide-react';
import { BrandLogo, LogoIcon } from './Logo';

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignup) {
      // Signup validation
      if (!name) {
        setError('Please enter your name');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setIsLoading(true);
      // Simulate signup - in production, this would call an API
      setTimeout(() => {
        setIsLoading(false);
        setSignupSuccess(true);
        // After showing success, switch to login mode
        setTimeout(() => {
          setIsSignup(false);
          setSignupSuccess(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setName('');
        }, 1500);
      }, 1000);
    } else {
      // Login
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(email);
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('google-user@example.com');
    }, 1000);
  };

  const handleAppleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('apple-user@example.com');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1E24] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C3E50' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <LogoIcon size="lg" withAnimation />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#2C3E50] dark:text-[#E5E7EB]">
            KONTUR
          </h1>
          <p className="text-[#6b6560] dark:text-[#9CA3AF] mt-2">
            {isSignup ? 'Create Your Account' : 'Designer Workspace'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white dark:bg-[#2D333A] rounded-3xl shadow-xl p-8 border border-[#E8E4DE] dark:border-[#3F454D]">
          {signupSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                Account Created!
              </h2>
              <p className="text-[#6b6560] dark:text-[#9CA3AF]">
                Redirecting to login...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input (Signup only) */}
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Designer"
                      className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789] transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="designer@furniture.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? 'Create a password' : '••••••••'}
                    className="w-full pl-12 pr-12 py-3 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6560] dark:text-[#9CA3AF] hover:text-[#2C3E50] dark:hover:text-[#E5E7EB] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input (Signup only) */}
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-[#2C3E50] dark:text-[#E5E7EB] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560] dark:text-[#9CA3AF]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder='Confirm your password'
                      className="w-full pl-12 pr-12 py-3 bg-[#F5F5F5] dark:bg-[#1A1E24] border border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A3C4BC] dark:focus:ring-[#86A789] transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#2C3E50] dark:bg-[#86A789] text-white dark:text-[#1A1E24] py-3 rounded-xl font-semibold hover:bg-[#1a2530] dark:hover:bg-[#6B8B6D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignup ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {!signupSuccess && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E4DE] dark:border-[#3F454D]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-[#2D333A] text-[#6b6560] dark:text-[#9CA3AF]">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </motion.button>

                <motion.button
                  onClick={handleAppleLogin}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-[#E8E4DE] dark:border-[#3F454D] rounded-xl text-[#2C3E50] dark:text-[#E5E7EB] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#1A1E24] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </motion.button>
              </div>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-[#6b6560] dark:text-[#9CA3AF]">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="ml-1 text-[#2C3E50] dark:text-[#86A789] font-semibold hover:underline"
                  >
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b6560] dark:text-[#9CA3AF] text-sm mt-6">
          {isSignup 
            ? 'Create an account to start designing' 
            : 'Demo: Enter any email and password to login'}
        </p>
      </motion.div>
    </div>
  );
}
