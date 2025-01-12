import React, { createContext, useState, useContext, useEffect } from 'react';
import { Chess } from 'chess.js';

const ChessContext = createContext();

export const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


export const ChessProvider = ({ children }) => {
  //Live game variables
  const [game, setGame] = useState(new Chess(STARTING_FEN));
  const [result, setResult] = useState("ongoing");

  //Shared variable livae and analysis
  const [lastMove, setLastMove] = useState(null);
  const [fen, setFen] = useState(game.fen());

  const [fenDetected, setFenDetected] = useState(STARTING_POSITION);

  //Analysis game variables
  const [analysisGame, setAnalysisGame] = useState(new Chess(STARTING_FEN));
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  //Playing mode variables
  const [isPlayingOnline, setIsPlayingOnline] = useState(true);

  const setFenAndLastMove = (chess) => {
    setFen(chess.fen());
    const lastMoveInLiveGame = chess.history({ verbose: true }).slice(-1)[0];
    setLastMove(
      lastMoveInLiveGame
        ? { from: lastMoveInLiveGame.from, to: lastMoveInLiveGame.to }
        : null
    );
  }

  const loadPreviewGame = () => {
    resetGame();
    game.loadPgn('1. e4 d5 2. e5 e6 3. d4 c5 4. Be3 Nc6 5. Bb5 Qa5+ 6. Nc3 cxd4 7. Bxd4 Bb4 8. Bxc6+ bxc6 9. Ne2 c5 10. Be3 d4 11. Bd2 dxc3 12. bxc3 Ba3 13. c4 Bb4 14. c3 Ba3 15. Qb3 Bd7 16. O-O Ne7 17. Rfe1 O-O 18. Ng3 Rab8 19. Qc2 Rb2 20. Qd3 Rd8 21. Bc1 Rb7 22. Bxa3 Qxa3 23. Reb1 Qa6 24. Rb3 Rdb8 25. Rxb7 Qxb7 26. h3 Ng6 27. Re1 Bc6 28. Qe3 Bxg2 29. Qxc5 Bf3 30. Qe3 Bc6 31. c5 Nh4 32. Qd4 Nf3+ 33. Kf1 Nxd4 34. cxd4 Qb5+ 35. Kg1 Qc4 36. Rd1 Qd5 37. Kf1 Rb2 38. Ke1 Qg2 39. Rd2 Qg1+ 40. Nf1 Rb1+ 41. Ke2 Qxf1+ 42. Ke3 Re1+ 43. Kf4 Qxh3 44. Rb2 Re4+ 45. Kg5 h6# 0-1')
    setFenAndLastMove(game);
  }

  const makeMove = (move) => {
    const madeMove = game.move(move);
    if (madeMove) {
      setLastMove({ from: madeMove.from, to: madeMove.to });
      setFen(game.fen());
    }
    if (isGameOver()) {
      setResult(gameOverReason);
    }
  };

  const returnAndMakeMove = (move) => {
    const madeMove = game.move(move);
    if (madeMove) {
      setLastMove({ from: madeMove.from, to: madeMove.to });
      setFen(game.fen());
    }
    const moveUCI = madeMove.from + madeMove.to + madeMove.promotion;
    return moveUCI;
  };

  const resetGame = () => {
    game.reset();
    analysisGame.reset();
    setFen(STARTING_FEN);
    setFenDetected(STARTING_POSITION)
    setLastMove(null);
    setCurrentMoveIndex(-1);
    setIsAnalysisMode(false);
    setResult("ongoing")
  };

  const getPgn = () => game.pgn();
  const getFen = () => game.fen();
  const getHistory = () => game.history();

  const toggleAnalysisMode = () => {
    setIsAnalysisMode((prev) => {
      if (prev) {
        setFenAndLastMove(game);
      } else {
        setFenAndLastMove(analysisGame);
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
      setFenAndLastMove(analysisGame);

      setCurrentMoveIndex((prev) => prev - 1);
    }
  };

  const goToMove = (index) => {
    if (isAnalysisMode) {
      const pgn = game.pgn();
      const moves = pgn
        .split(" ")
        .filter((token) => !/^\d+\.$/.test(token))
        .filter(Boolean);

      if (index >= 0 && index < moves.length) {
        analysisGame.loadPgn(moves.slice(0, index + 1).join(" "));
        setFenAndLastMove(analysisGame);
        setCurrentMoveIndex(index);
      }
    }
  };

  const findMove = (fenAfter) => {
    const boardBefore = new Chess(game.fen());
    const legalMoves = boardBefore.moves();

    for (const move of legalMoves) {
      boardBefore.move(move);
      const fenBefore = boardBefore.fen().split(' ')[0];
      if (fenBefore === fenAfter) {
        return move;
      }
      boardBefore.undo();
    }
    return null;
  }

  const goToFirstMove = () => {
    if (!isAnalysisMode) return;

    analysisGame.reset();
    setFenAndLastMove(analysisGame);
    setCurrentMoveIndex(-1);
  };

  const goToLastMove = () => {
    if (!isAnalysisMode) return;

    const pgn = game.pgn();
    const moves = pgn
      .split(" ")
      .filter((token) => !/^\d+\.$/.test(token))
      .filter(Boolean);

    analysisGame.loadPgn(moves.join(" "));
    setFenAndLastMove(analysisGame);
    setCurrentMoveIndex(moves.length - 1);
  };

  const validateStartingPosition = (detectedFen) => {
    const isValid = (detectedFen === STARTING_POSITION)
  };

  // Lichess game setting
  const setGameFromLichess = (moves) => {
    if (moves) {
      resetGame();
      const updatedGame = game;

      moves.forEach((move) => {
        updatedGame.move(move);
        analysisGame.move(move);
      });
      setFenAndLastMove(updatedGame);
      setCurrentMoveIndex(moves.length - 1);
    }
  };

  // check if the game has ended
  const isGameOver = () => {
    return game.isGameOver();
  };

  // check why the game has ended
  const gameOverReason = () => {
    if (game.isCheckmate()) {
      setResult("checkmate");
      return "checkmate";
    }
    // // It was added recently not in npm package
    // if (game.isDrawByFiftyMoves()) {
    //   setResult("draw by 50 moves");
    //   return "draw by 50 moves";
    // }
    if (game.isInsufficientMaterial()) {
      setResult("insufficient material");
      return "insufficient material";
    }
    if (game.isThreefoldRepetition()) {
      setResult("threefold repetition");
      return "threefold repetition";
    }
    if (game.isStalemate()) {
      setResult("stalemate");
      return "stalemate";
    }
    if (game.isDraw()) {
      setResult("draw");
      return "draw";
    }
    return;
  };


  useEffect(() => {

  }, [game]);

  return (
    <ChessContext.Provider
      value={{
        makeMove,
        resetGame,
        setGame,
        getPgn,
        getFen,
        getHistory,
        toggleAnalysisMode,
        goToNextMove,
        goToPreviousMove,
        goToFirstMove,
        goToLastMove,
        goToMove,
        isAnalysisMode,
        fen,
        currentMoveIndex,
        findMove,
        validateStartingPosition,
        isPlayingOnline,
        setIsPlayingOnline,
        lastMove,
        setLastMove,
        loadPreviewGame,
        setFenAndLastMove,
        setGameFromLichess,
        returnAndMakeMove,
        isGameOver,
        gameOverReason,
        result,
        setResult,
        fenDetected,
        setFenDetected,
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};

export const useChess = () => useContext(ChessContext);