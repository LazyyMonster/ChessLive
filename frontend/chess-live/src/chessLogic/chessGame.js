import React, { createContext, useState, useContext } from 'react';
import { Chess } from 'chess.js';

const ChessContext = createContext();

export const ChessProvider = ({ children }) => {
  const [game, setGame] = useState(new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));

  // game.loadPgn('1. e4 d5 2. e5 e6 3. d4 c5 4. Be3 Nc6 5. Bb5 Qa5+ 6. Nc3 cxd4 7. Bxd4 Bb4 8. Bxc6+ bxc6 9. Ne2 c5 10. Be3 d4 11. Bd2 dxc3 12. bxc3 Ba3 13. c4 Bb4 14. c3 Ba3 15. Qb3 Bd7 16. O-O Ne7 17. Rfe1 O-O 18. Ng3 Rab8 19. Qc2 Rb2 20. Qd3 Rd8 21. Bc1 Rb7 22. Bxa3 Qxa3 23. Reb1 Qa6 24. Rb3 Rdb8 25. Rxb7 Qxb7 26. h3 Ng6 27. Re1 Bc6 28. Qe3 Bxg2 29. Qxc5 Bf3 30. Qe3 Bc6 31. c5 Nh4 32. Qd4 Nf3+ 33. Kf1 Nxd4 34. cxd4 Qb5+ 35. Kg1 Qc4 36. Rd1 Qd5 37. Kf1 Rb2 38. Ke1 Qg2 39. Rd2 Qg1+ 40. Nf1 Rb1+ 41. Ke2 Qxf1+ 42. Ke3 Re1+ 43. Kf4 Qxh3 44. Rb2 Re4+ 45. Kg5 h6# 0-1')

  // console.log(game.pgn());

  const makeMove = (move) => game.move(move);
  const resetGame = () => setGame(new Chess());
  const getPgn = () => game.pgn();
  const getFen = () => game.fen();

  const findMove = (fenAfter) => {
    const boardBefore = new Chess(game.fen());

    const legalMoves = boardBefore.moves();
    for (const move of legalMoves) {
        boardBefore.move(move);
        
        if (boardBefore.fen() === fenAfter) {
            return move;
        }

        boardBefore.undo();
    }

    return null;
  }

  return (
    <ChessContext.Provider value={{ makeMove, resetGame, getPgn, getFen, findMove }}>
      {children}
    </ChessContext.Provider>
  );
};

export const useChess = () => useContext(ChessContext);