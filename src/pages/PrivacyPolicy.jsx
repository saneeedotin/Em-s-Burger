import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, MapPin, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-4 mb-12 border-b border-dark/10 pb-8">
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/60 hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Data Protection</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight">
          Privacy Policy
        </h1>
        
        <p className="text-dark/60 text-sm font-medium">
          Effective Date: <strong>29 August 2026</strong> • Last Updated: <strong>29 August 2026</strong>
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10 text-dark/80 text-sm sm:text-base leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-3">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            1. Introduction & Overview
          </h2>
          <p>
            Welcome to <strong>EM'S BURGERS</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how your data is collected, used, and safeguarded when you visit our website, dine in using our Table QR menus, or register for our loyalty program in Chembur, Mumbai.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-4">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            2. Information We Collect
          </h2>
          <p>
            We only collect information necessary to provide our digital dining and rewards experience:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-dark/70 text-sm">
            <li><strong>Account & Contact Data:</strong> Name, email address, and unique customer identifier (EMCODE) when you register or sign in using Google.</li>
            <li><strong>Dining & Order Information:</strong> Selected menu items, dietary preferences (e.g. Pure Veg), special preparation instructions, dining mode (Table Number or Reception Pick-up), and order timestamp.</li>
            <li><strong>Loyalty Program Data:</strong> Burger Club stamps (0–10) and Beverage Club stamps (0–10) accumulated towards free rewards.</li>
            <li><strong>Technical & Session Data:</strong> Local storage state (e.g., active cart items, table session tokens) used to provide seamless navigation.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-4">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            3. Google Sign-In & User Data
          </h2>
          <p>
            When you sign in via <strong>Google OAuth</strong>:
          </p>
          <div className="bg-cream-light p-4 rounded-2xl border border-dark/5 space-y-2 text-sm text-dark/80">
            <div className="flex items-center gap-2 font-bold text-dark">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Limited Scope Authentication</span>
            </div>
            <p>
              We only request access to basic profile identity (`email`, `name`, and profile picture) to automatically assign your unique EMCODE and track your reward stamps. We do not access your contacts, Google Drive, or any sensitive private account data.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-3">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            4. How We Use Your Information
          </h2>
          <p>Your information is used strictly to:</p>
          <ul className="space-y-1.5 list-disc pl-5 text-dark/70 text-sm">
            <li>Process, prepare, and deliver your food orders to your table or reception.</li>
            <li>Maintain real-time kitchen status updates and live order notifications.</li>
            <li>Credit loyalty reward stamps for free burgers and beverages.</li>
            <li>Prevent fraud and maintain database security.</li>
          </ul>
          <p className="font-bold text-dark text-sm pt-2">
            We will NEVER sell, rent, or trade your personal data to any third-party advertisers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-3">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            5. Security & Data Storage
          </h2>
          <p>
            All application data is hosted on <strong>Google Firebase / Google Cloud Platform</strong> infrastructure utilizing industry-standard SSL encryption in transit and AES-256 encryption at rest. Firestore collection access is strictly governed by authenticated security rules.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-dark/10 shadow-sm space-y-3">
          <h2 className="font-heading font-black text-2xl text-dark flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            6. Your Rights & Data Deletion Requests
          </h2>
          <p>
            You have the right to inspect, update, or request the permanent deletion of your profile and order history. To request complete removal from our database, you can speak directly with restaurant management or contact us at:
          </p>
          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-sm space-y-1">
            <div className="font-bold text-primary">EM'S BURGERS Data Privacy</div>
            <div>Email: <a href="mailto:privacy@emsburgers.com" className="text-primary hover:underline font-bold">privacy@emsburgers.com</a> / <a href="mailto:saneeedotin@gmail.com" className="text-primary hover:underline font-bold">saneeedotin@gmail.com</a></div>
            <div>Phone: <a href="tel:+919820098200" className="text-primary hover:underline font-bold">+91 98200 98200</a></div>
            <div>Address: 20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur Camp, Mumbai - 400074</div>
          </div>
        </section>

      </div>

      {/* Footer Back Button */}
      <div className="mt-12 text-center">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95"
        >
          <span>Return to Homepage</span>
        </Link>
      </div>

    </div>
  );
}
