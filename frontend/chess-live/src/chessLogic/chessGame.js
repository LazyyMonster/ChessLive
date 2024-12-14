import React, { createContext, useState, useContext } from 'react';
import { Chess } from 'chess.js';

const ChessContext = createContext();

export const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


export const ChessProvider = ({ children }) => {
  //Live game variables
  const [game, setGame] = useState(new Chess(STARTING_FEN));
  

  //Shared variable livae and analysis
  const [lastMove, setLastMove] = useState(null);
  const [fen, setFen] = useState(game.fen());

  //Analysis game variables
  const [analysisGame, setAnalysisGame] = useState(new Chess(STARTING_FEN));
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  //Playing mode variables
  const [isPlayingOnline, setIsPlayingOnline] = useState(false);

  // game.loadPgn('1. e4 d5 2. e5 e6 3. d4 c5 4. Be3 Nc6 5. Bb5 Qa5+ 6. Nc3 cxd4 7. Bxd4 Bb4 8. Bxc6+ bxc6 9. Ne2 c5 10. Be3 d4 11. Bd2 dxc3 12. bxc3 Ba3 13. c4 Bb4 14. c3 Ba3 15. Qb3 Bd7 16. O-O Ne7 17. Rfe1 O-O 18. Ng3 Rab8 19. Qc2 Rb2 20. Qd3 Rd8 21. Bc1 Rb7 22. Bxa3 Qxa3 23. Reb1 Qa6 24. Rb3 Rdb8 25. Rxb7 Qxb7 26. h3 Ng6 27. Re1 Bc6 28. Qe3 Bxg2 29. Qxc5 Bf3 30. Qe3 Bc6 31. c5 Nh4 32. Qd4 Nf3+ 33. Kf1 Nxd4 34. cxd4 Qb5+ 35. Kg1 Qc4 36. Rd1 Qd5 37. Kf1 Rb2 38. Ke1 Qg2 39. Rd2 Qg1+ 40. Nf1 Rb1+ 41. Ke2 Qxf1+ 42. Ke3 Re1+ 43. Kf4 Qxh3 44. Rb2 Re4+ 45. Kg5 h6# 0-1')

  // console.log(game.pgn());

  const makeMove = (move) => {
    const madeMove = game.move(move);
    if (madeMove) {
      setLastMove({ from: madeMove.from, to: madeMove.to });
      setFen(game.fen());
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
  };

  const getPgn = () => game.pgn();
  const getFen = () => game.fen();

  const toggleAnalysisMode = () => {
    setIsAnalysisMode((prev) => {
      if (prev) {
        setFen(game.fen());
        const lastMoveInLiveGame = game.history({ verbose: true }).slice(-1)[0];
        setLastMove(
          lastMoveInLiveGame
            ? { from: lastMoveInLiveGame.from, to: lastMoveInLiveGame.to }
            : null
        );
      } else {

        const move = analysisGame.history({ verbose: true }).slice(-1)[0];
        setLastMove(move ? { from: move.from, to: move.to } : null);
        setFen(analysisGame.fen());
      }
      return !prev;
    });
  };

  const goToNextMove = () => {
    if (!isAnalysisMode || currentMoveIndex === null) return;

    const pgn = game.pgn();
    const moves = pgn
      .split(" ")
      .filter((token) => !/^\d+\.$/.test(token))
      .filter(Boolean);

    if (currentMoveIndex < moves.length - 1) {
      analysisGame.loadPgn(moves.slice(0, currentMoveIndex + 2).join(" "));
      setFen(analysisGame.fen());

      const move = analysisGame.history({ verbose: true }).slice(-1)[0];
      setLastMove({ from: move.from, to: move.to });

      setCurrentMoveIndex((prev) => prev + 1);
    }
  };

  const goToPreviousMove = () => {
    if (!isAnalysisMode || currentMoveIndex === null) return;

    if (currentMoveIndex > -1) {
      const pgn = game.pgn();
      const moves = pgn
        .split(" ")
        .filter((token) => !/^\d+\.$/.test(token))
        .filter(Boolean);

      analysisGame.loadPgn(moves.slice(0, currentMoveIndex).join(" "));
      setFen(analysisGame.fen());

      const move =
        currentMoveIndex > 1
          ? analysisGame.history({ verbose: true }).slice(-1)[0]
          : null;
      setLastMove(move ? { from: move.from, to: move.to } : null);

      setCurrentMoveIndex((prev) => prev - 1);
    }
  };

  const updatePosition = (newFen) => {
    const tempGame = new Chess();
    tempGame.load(newFen);
    setFen(newFen);
    setGame(tempGame);
  };

  const findMove = (fenAfter) => {
    const boardBefore = new Chess(game.fen());
    const legalMoves = boardBefore.moves();

    for (const move of legalMoves) {
      boardBefore.move(move);
      const fenBefore = boardBefore.fen().split(' ')[0];
      if (fenBefore === fenAfter) {
        console.log(move);
        return move;
      }
      boardBefore.undo();
    }
    return null;
  }

  const validateStartingPosition = (detectedFen) => {
    const isValid = (detectedFen === STARTING_POSITION)
    console.log(isValid);
  };

  return (
    <ChessContext.Provider
      value={{
        makeMove,
        resetGame,
        getPgn,
        getFen,
        toggleAnalysisMode,
        goToNextMove,
        goToPreviousMove,
        isAnalysisMode,
        fen,
        currentMoveIndex,
        findMove,
        updatePosition,
        validateStartingPosition,
        isPlayingOnline,
        setIsPlayingOnline,
        lastMove,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};

export const useChess = () => useContext(ChessContext);