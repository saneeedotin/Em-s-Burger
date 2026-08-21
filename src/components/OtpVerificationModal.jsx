import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

export function OtpVerificationModal({
  isOpen,
  email,
  name,
  purpose = 'signup',
  onVerify,
  onResend,
  onClose,
  initialCode = '' // for debug/demo support
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [shake, setShake] = useState(false);
  const [debugHint, setDebugHint] = useState(initialCode);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError('');
      setResendCooldown(60);
      setDebugHint(initialCode);
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
    }
  }, [isOpen, initialCode]);

  // Resend countdown timer
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only numbers allowed

    const newDigits = [...digits];
    // Take the last character if multiple typed
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // If all 6 digits entered, auto-trigger verify
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleComplete(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newDigits = pastedData.split('');
      setDigits(newDigits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
      handleComplete(pastedData);
    }
  };

  const handleComplete = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      triggerShake();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await onVerify(code);
      if (!res?.success) {
        setError(res?.message || 'Invalid verification code.');
        triggerShake();
      }
    } catch (err) {
      setError(err.message || 'Verification failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const res = await onResend();
      if (res?.success) {
        setResendCooldown(60);
        if (res.code) {
          setDebugHint(res.code);
        }
      } else {
        setError(res?.message || 'Failed to resend code.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={
            shake
              ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={shake ? { duration: 0.4 } : { duration: 0.3 }}
          className="w-full max-w-md bg-cream-light rounded-4xl p-6 sm:p-8 border-4 border-primary/20 shadow-2xl relative overflow-hidden"
        >
          {/* Top Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/60 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to form</span>
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-dark">
              VERIFY YOUR EMAIL
            </h2>
            <p className="text-xs sm:text-sm text-dark/70 font-medium">
              We sent a 6-digit verification code to:
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-100 border border-primary/30 text-primary text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="flex justify-between gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                disabled={loading}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-mono font-black rounded-2xl border-2 transition-all outline-none ${
                  digit
                    ? 'border-primary bg-white text-dark shadow-sm'
                    : 'border-dark/15 bg-cream text-dark focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15'
                }`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => handleComplete()}
            disabled={loading || digits.join('').length !== 6}
            className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-cream font-heading font-extrabold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Continue</span>
              </>
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center text-xs text-dark/70 font-medium">
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span className="font-bold text-dark/50">
                Resend in <span className="font-mono">{resendCooldown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary font-heading font-extrabold hover:underline inline-flex items-center gap-1"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
