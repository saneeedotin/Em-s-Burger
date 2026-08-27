import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Settings2, RefreshCw } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Logo } from '../../components/Logo';

export function AdminQRGenerator() {
  const [tableCount, setTableCount] = useState(15);
  const [domain, setDomain] = useState(window.location.origin);
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrGenerateToken = async () => {
      try {
        const tokenRef = doc(db, 'metadata', 'qr_token');
        const tokenSnap = await getDoc(tokenRef);
        if (tokenSnap.exists() && tokenSnap.data().token) {
          setQrToken(tokenSnap.data().token);
        } else {
          // Generate a new token if one doesn't exist
          const newToken = Math.random().toString(36).substring(2, 8);
          await setDoc(tokenRef, { token: newToken, updatedAt: new Date().toISOString() });
          setQrToken(newToken);
        }
      } catch (err) {
        console.error("Error fetching QR token:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrGenerateToken();
  }, []);

  const handleResetToken = async () => {
    if (window.confirm("WARNING: This will instantly invalidate all existing printed QR codes. Are you sure?")) {
      try {
        const newToken = Math.random().toString(36).substring(2, 8);
        const tokenRef = doc(db, 'metadata', 'qr_token');
        await setDoc(tokenRef, { token: newToken, updatedAt: new Date().toISOString() });
        setQrToken(newToken);
        alert("Success! Security token has been reset. Please print the new QR codes.");
      } catch (err) {
        console.error("Error resetting token:", err);
        alert("Failed to reset token.");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  if (loading) {
    return <div className="p-8 text-center text-dark/60">Loading QR Generator...</div>;
  }

  return (
    <div className="space-y-8 bg-cream min-h-screen">
      {/* Configuration Header - Hidden during print */}
      <div className="print:hidden bg-white p-6 rounded-2xl shadow-sm border border-dark/10 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-dark">
            <Settings2 className="w-6 h-6 text-accent" />
            <h2 className="font-heading font-black text-2xl">QR Code Generator</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark/70">Number of Tables</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={tableCount}
                onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
                className="w-full sm:w-32 px-4 py-2 bg-cream rounded-xl border-2 border-dark/10 focus:border-accent outline-none font-bold"
              />
            </div>
            <div className="space-y-1.5 flex-1 max-w-sm">
              <label className="text-sm font-bold text-dark/70">Domain URL (Optional override)</label>
              <input 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-2 bg-cream rounded-xl border-2 border-dark/10 focus:border-accent outline-none font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleResetToken}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Security Token
          </button>
          <button 
            onClick={handlePrint}
            className="bg-accent hover:bg-accent-hover text-dark px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Printer className="w-5 h-5" />
            Print QR Codes
          </button>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4 print:p-0">
        {tables.map(number => {
          const url = `${domain.replace(/\/$/, '')}/table/${number}?token=${qrToken}`;
          return (
            <div 
              key={number} 
              className="bg-white border-2 border-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md print:shadow-none print:border-4 print:border-dark print:break-inside-avoid h-[400px]"
            >
              <div className="mb-6 scale-90">
                <Logo />
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-cream-light mb-6 print:shadow-none print:border-4">
                <QRCodeSVG 
                  value={url} 
                  size={160}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#1A1A1A"
                />
              </div>

              <h3 className="font-heading font-black text-3xl text-primary uppercase tracking-tight mb-2">
                Table {number}
              </h3>
              
              <p className="text-dark/60 font-bold text-sm">
                Scan to view menu & order
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
