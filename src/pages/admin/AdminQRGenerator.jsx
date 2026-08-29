import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Settings2, RefreshCw } from 'lucide-react';
import { db, isFirebaseConfigured } from '../../config/firebase';
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
        if (isFirebaseConfigured) {
          const tokenRef = doc(db, 'metadata', 'qr_token');
          const tokenSnap = await getDoc(tokenRef);
          if (tokenSnap.exists() && tokenSnap.data().token) {
            setQrToken(tokenSnap.data().token);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch QR token from Firestore:", err);
      }

      // Default or local storage token
      const stored = localStorage.getItem('ems_admin_qr_token');
      if (stored) {
        setQrToken(stored);
      } else {
        const newToken = Math.random().toString(36).substring(2, 8);
        localStorage.setItem('ems_admin_qr_token', newToken);
        setQrToken(newToken);
        if (isFirebaseConfigured) {
          try {
            await setDoc(doc(db, 'metadata', 'qr_token'), { token: newToken, updatedAt: new Date().toISOString() });
          } catch (e) {}
        }
      }
      setLoading(false);
    };

    fetchOrGenerateToken();
  }, []);

  const handleResetToken = async () => {
    if (window.confirm("WARNING: This will reset the QR security token. Any existing printed QR codes will be refreshed. Are you sure?")) {
      const newToken = Math.random().toString(36).substring(2, 8);
      localStorage.setItem('ems_admin_qr_token', newToken);
      setQrToken(newToken);

      if (isFirebaseConfigured) {
        try {
          const tokenRef = doc(db, 'metadata', 'qr_token');
          await setDoc(tokenRef, { token: newToken, updatedAt: new Date().toISOString() });
        } catch (err) {
          console.warn("Error updating token in Firestore:", err);
        }
      }
      alert("Success! Security token has been reset.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  if (loading) {
    return <div className="p-8 text-center text-dark/60 font-bold">Loading QR Generator...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Configuration Header - Hidden during print */}
      <div className="print:hidden bg-white p-6 rounded-3xl shadow-sm border border-dark/10 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-dark">
            <Settings2 className="w-6 h-6 text-primary" />
            <h2 className="font-heading font-black text-2xl">QR Code Generator</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-heading uppercase text-dark/70 tracking-wider">Number of Tables</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={tableCount}
                onChange={(e) => setTableCount(parseInt(e.target.value) || 1)}
                className="w-full sm:w-32 px-4 py-2.5 bg-gray-50 rounded-2xl border-2 border-dark/10 focus:border-primary focus:bg-white outline-none font-bold text-dark text-sm transition-colors"
              />
            </div>
            <div className="space-y-1.5 flex-1 max-w-md">
              <label className="text-xs font-bold font-heading uppercase text-dark/70 tracking-wider">Domain URL (Optional override)</label>
              <input 
                type="text" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="http://192.168.1.3:3001"
                className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl border-2 border-dark/10 focus:border-primary focus:bg-white outline-none font-medium text-dark text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleResetToken}
            className="bg-red-50 hover:bg-red-100 text-red-700 px-5 py-3 rounded-2xl font-heading font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap border border-red-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Token
          </button>
          <button 
            onClick={handlePrint}
            className="bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-2xl font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            <Printer className="w-4 h-4" />
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
              className="bg-white border-2 border-dark/10 rounded-3xl p-6 flex flex-col items-center justify-between text-center shadow-md print:shadow-none print:border-4 print:border-dark print:break-inside-avoid min-h-[410px] hover:border-primary/40 transition-colors"
            >
              {/* Header: Red Logo and Brand Name */}
              <div className="scale-95 flex items-center justify-center pt-1">
                <Logo variant="red" size="small" showChembur={false} />
              </div>
              
              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-dark/10 my-4 print:shadow-none print:border-2">
                <QRCodeSVG 
                  value={url} 
                  size={160}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#1A1A1A"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 pb-1">
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-primary uppercase tracking-tight">
                  Menu Table {number}
                </h3>
                
                <p className="text-dark/70 font-bold text-xs">
                  Scan to view menu & order
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
