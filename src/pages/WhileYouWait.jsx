import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Timer, RotateCcw, Utensils, Hash, CheckCircle2, Bell, Clock, ArrowLeft, Sparkles, Gamepad2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useActiveOrder } from '../context/ActiveOrderContext';

export function WhileYouWait() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { activeOrder, timeLeft, isOrderOwner } = useActiveOrder();
  const tableId = activeOrder?.table_id || sessionStorage.getItem('ems_table') || localStorage.getItem('ems_table');

  // Tic-Tac-Toe State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isBurgerNext, setIsBurgerNext] = useState(true);
  const [winner, setWinner] = useState(null);

  // Check for winner
  useEffect(() => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null) && !winner) {
      setWinner('draw');
    }
  }, [board, winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isBurgerNext ? '🍔' : '🍟';
    setBoard(newBoard);
    setIsBurgerNext(!isBurgerNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsBurgerNext(true);
    setWinner(null);
  };

  const status = activeOrder?.status || 'preparing';
  const orderToken = activeOrder?.order_token || '#EM-LIVE';
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="pt-24 pb-12 px-4 max-w-lg mx-auto min-h-[85vh] flex flex-col items-center justify-center">
      
      {/* Header Section */}
      {isOrderOwner ? (
        /* 1. Live Order Tracker Header (Only shown to the person whose order is cooking) */
        <div className="text-center mb-8 w-full">
          <motion.div
            animate={{ 
              rotate: [-8, 8, -8],
              y: [0, -8, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`inline-block p-5 rounded-full mb-4 ${
              status === 'ready' 
                ? 'bg-emerald-100 text-emerald-600' 
                : status === 'preparing'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {status === 'ready' ? (
              <Bell className="w-14 h-14 animate-bounce" />
            ) : (
              <ChefHat className="w-14 h-14 animate-pulse" />
            )}
          </motion.div>
          
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-dark text-cream mb-2">
              {orderToken}
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
              {status === 'ready' ? 'Your Food is Ready! 🎉' : status === 'preparing' ? 'Cooking in Progress! 🔥' : 'Waiting for Kitchen Review'}
            </h1>
            <p className="text-xs sm:text-sm text-dark/70 max-w-xs mx-auto">
              {status === 'ready' 
                ? (tableId ? `Served right to Table ${tableId}. Enjoy!` : 'Please pick up at the reception counter.')
                : 'Our chefs are crafting your handcrafted gourmet burgers.'}
            </p>
          </div>
          
          {/* Live Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 bg-white border border-dark/10 shadow-sm px-3 py-1.5 rounded-full text-xs font-bold text-dark">
              <Timer className="w-3.5 h-3.5 text-primary" />
              {status === 'pending' ? `Awaiting Confirm (${minutes}:${seconds})` : 'Est. 12-15 Mins'}
            </span>
            
            {tableId ? (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold">
                <Utensils className="w-3.5 h-3.5" />
                Table {tableId}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 px-3 py-1.5 rounded-full text-xs font-bold">
                Reception Pick-up
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold capitalize">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: {status}
            </span>
          </div>
        </div>
      ) : (
        /* 2. Standalone Arcade Header (Shown when no active order belongs to this visitor) */
        <div className="text-center mb-8 w-full">
          <motion.div
            animate={{ 
              rotate: [-5, 5, -5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block p-4 rounded-full bg-accent/20 text-dark mb-3"
          >
            <Gamepad2 className="w-12 h-12 text-primary" />
          </motion.div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
            EM's Burger Arcade
          </h1>
          <p className="text-xs sm:text-sm text-dark/70 max-w-xs mx-auto mt-1">
            Play a quick match of Burger vs Fries while relaxing!
          </p>

          <div className="mt-3">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <ShoppingBag size={12} />
              <span>Order Food Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Minigame Section */}
      <div className="bg-white p-6 sm:p-8 rounded-4xl shadow-xl border border-primary/15 w-full max-w-sm">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1 text-primary text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Minigame</span>
          </div>
          <h2 className="font-heading font-black text-2xl text-dark">Burger vs Fries</h2>
          <p className="text-dark/60 text-xs">
            {isOrderOwner ? 'Play while your food is cooking!' : 'Tap any square to place your move!'}
          </p>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="h-20 sm:h-22 bg-cream rounded-2xl flex items-center justify-center text-3xl sm:text-4xl hover:bg-dark/5 transition-colors border border-dark/5"
            >
              <motion.div
                initial={cell ? { scale: 0 } : false}
                animate={cell ? { scale: 1 } : false}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                {cell}
              </motion.div>
            </button>
          ))}
        </div>

        {/* Game Status */}
        <div className="flex items-center justify-between pt-2 border-t border-dark/5">
          <div className="font-heading font-bold text-sm">
            {winner === 'draw' ? (
              <span className="text-dark/60">It's a draw!</span>
            ) : winner ? (
              <span className="text-primary">{winner} Wins! 🏆</span>
            ) : (
              <span className="text-dark">Next turn: {isBurgerNext ? '🍔' : '🍟'}</span>
            )}
          </div>
          
          <button
            onClick={resetGame}
            className="p-2 bg-dark/5 text-dark rounded-xl hover:bg-dark/10 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate('/menu')}
          className="flex-1 py-3 px-4 rounded-full bg-cream-light border-2 border-dark/10 hover:bg-dark/5 text-dark font-heading font-bold text-xs text-center transition-colors shadow-sm"
        >
          Browse Menu
        </button>
        <button
          onClick={() => navigate('/')}
          className="py-3 px-5 rounded-full bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-xs text-center shadow-md transition-colors"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}
