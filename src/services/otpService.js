import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_hr66lq6';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_a4uounh';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'PJxI5gZ91dz4F5tLi';

/**
 * Generates a secure 6-digit numeric OTP code
 */
export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends and saves an OTP code for a given email address
 * @param {string} email - Destination email
 * @param {string} purpose - 'signup' or 'login'
 * @param {string} name - Optional user's name
 * @returns {Promise<{success: boolean, code?: string, message?: string}>}
 */
export async function sendOtpToEmail(email, purpose = 'signup', name = 'Customer') {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const code = generateOtpCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes expiry

    // 1. Save in Firestore
    const otpDocRef = doc(db, 'email_otps', normalizedEmail);
    await setDoc(otpDocRef, {
      code,
      email: normalizedEmail,
      purpose,
      name,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    // 2. Dispatch real email via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: normalizedEmail,
          email: normalizedEmail,
          to_name: name,
          name: name,
          otp_code: code,
          passcode: code,
          time: "10 minutes",
          purpose: purpose === 'signup' ? 'Account Registration' : 'Account Login',
          app_name: "EM's Burgers",
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log(`[EmailJS] OTP email successfully dispatched to ${normalizedEmail}`);
    } catch (emailError) {
      console.error('EmailJS dispatch failed:', emailError);
      return { 
        success: false, 
        message: emailError.text || emailError.message || 'Failed to send OTP to email. Please check your email address.' 
      };
    }

    return { success: true, code };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: error.message || 'Failed to send verification code.' };
  }
}

/**
 * Verifies a 6-digit OTP code against Firestore
 * @param {string} email - The user's email
 * @param {string} inputCode - 6-digit code entered by user
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function verifyOtpCode(email, inputCode) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const otpDocRef = doc(db, 'email_otps', normalizedEmail);
    const otpDoc = await getDoc(otpDocRef);

    if (!otpDoc.exists()) {
      return { success: false, message: 'No OTP found. Please request a new code.' };
    }

    const data = otpDoc.data();
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      // Clean up expired OTP
      await deleteDoc(otpDocRef);
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    if (data.code !== inputCode.trim()) {
      return { success: false, message: 'Incorrect verification code. Please try again.' };
    }

    // Code is valid! Clean it up so it can't be reused
    await deleteDoc(otpDocRef);
    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: error.message || 'Failed to verify OTP.' };
  }
}
