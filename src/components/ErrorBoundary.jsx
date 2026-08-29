import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[EM\'S Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('ems_table');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center text-dark select-none">
          <div className="max-w-md w-full bg-white p-8 rounded-4xl border-4 border-primary shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-dark">
                Fresh Batch Baking...
              </h2>
              <p className="text-dark/70 text-sm font-medium">
                We encountered a quick glitch with your browser session. Let's get you right back to the burger menu!
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3.5 px-6 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload EM'S</span>
              </button>
              
              <a
                href="/"
                className="flex-1 py-3.5 px-6 rounded-full bg-cream-light hover:bg-cream border-2 border-dark/10 text-dark font-heading font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home className="w-4 h-4 text-primary" />
                <span>Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
