import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Timer, RotateCcw, Utensils, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WhileYouWait() {
  const { currentUser } = useAuth();
  const tableId = sessionStorage.getItem('ems_table');

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

  return (
    <div className="pt-24 pb-12 px-4 max-w-lg mx-auto min-h-[80vh] flex flex-col items-center justify-center">
      
      {/* Order Status Header */}
      <div className="text-center mb-12">
        <motion.div
          animate={{ 
            rotate: [-10, 10, -10],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block p-4 bg-primary/10 rounded-full mb-6"
        >
          <ChefHat className="w-16 h-16 text-primary" />
        </motion.div>
        
        <h1 className="font-heading font-black text-4xl text-dark mb-4">
          Order in Progress!
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-dark/5 px-4 py-2 rounded-full text-sm font-bold text-dark/70">
            <Timer className="w-4 h-4" />
            Est. 15-20 Mins
          </span>
          <span className="inline-flex items-center gap-1.5 bg-dark/5 px-4 py-2 rounded-full text-sm font-bold text-dark/70">
            <Hash className="w-4 h-4" />
            {currentUser?.id ? `ID: ${currentUser.id.slice(0,4)}` : 'Guest'}
          </span>
          {tableId && (
            <span className="inline-flex items-center gap-1.5 bg-dark/5 px-4 py-2 rounded-full text-sm font-bold text-dark/70">
              <Utensils className="w-4 h-4" />
              Table {tableId}
            </span>
          )}
        </div>
      </div>

      {/* Minigame Section */}
      <div className="bg-white p-8 rounded-4xl shadow-xl border border-primary/10 w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="font-heading font-black text-2xl text-dark">Burger vs Fries</h2>
          <p className="text-dark/60 text-sm">Play a quick game while you wait!</p>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="h-24 bg-cream rounded-2xl flex items-center justify-center text-4xl hover:bg-dark/5 transition-colors border border-dark/5"
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
        <div className="flex items-center justify-between">
          <div className="font-heading font-bold text-lg">
            {winner === 'draw' ? (
              <span className="text-dark/60">It's a draw!</span>
            ) : winner ? (
              <span className="text-primary">{winner} Wins!</span>
            ) : (
              <span className="text-dark">Next turn: {isBurgerNext ? '🍔' : '🍟'}</span>
            )}
          </div>
          
          <button
            onClick={resetGame}
            className="p-2 bg-dark/5 text-dark rounded-xl hover:bg-dark/10 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
