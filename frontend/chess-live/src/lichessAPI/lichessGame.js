import React, { createContext, useState, useContext } from 'react';
import { LICHESS_BASE_ENDPOINT } from '../components/settings/constants';
import { showSnackbar } from "../components/alerts/customSnackbar";

const LichessContext = createContext();

export const LichessProvider = ({ children }) => {

    const [gameId, setGameId] = useState(null);
    const [playerColor, setPlayerColor] = useState(null);

    const getToken = () => {
        return sessionStorage.getItem('lichessToken');
    }

    const fetchGamePGN = async (gameId) => {
        if (!getToken() || !gameId) {
          showSnackbar("Invalid game or session. Please log in.", "error");
          return null;
        }
    
        try {
          const response = await fetch(`${LICHESS_BASE_ENDPOINT}/game/export/${gameId}`, {});
    
          if (!response.ok) throw new Error("Failed to fetch PGN.");
    
          const pgn = await response.text();
          const movesRegex = /\n\n([\d\s\w.\-\x]*)(?=\s*\*)/;
          const match = pgn.match(movesRegex);
    
          return match && match[1] ? match[1].trim() : null;
        } catch (err) {
          console.error("Error fetching PGN:", err);
          showSnackbar("Failed to fetch game data.", "error");
          return null;
        }
      };

    const fetchOngoingGames = async () => {
        if (!getToken()) {
          showSnackbar("Please log in to fetch ongoing games.", "error");
          return [];
        }
    
        try {
          const response = await fetch(`${LICHESS_BASE_ENDPOINT}/api/account/playing`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
    
          if (!response.ok) throw new Error("Failed to fetch ongoing games.");
    
          const data = await response.json();
          return data.nowPlaying?.map((game) => ({
            gameId: game.gameId,
            opponentUsername: game.opponent?.username || "Unknown",
            color: game.color,
          })) || [];
        } catch (err) {
          console.error("Error fetching games:", err);
          showSnackbar("Failed to load ongoing games.", "error");
          return [];
        }
      };

    const lichessStreamGame = (callback, gameId) => {
        const path = `/api/board/game/stream/${gameId}`;
        const controller = new AbortController();
        const { signal } = controller;

        fetchResponse(path, signal)
            .then(readStream(callback, signal))
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log(`Stream for game ${gameId} aborted.`);
                } else {
                    console.error(`Error starting game stream for game ${gameId}:`, error);
                }
            });

        return () => controller.abort();
    };

    const readStream = (processLine, signal) => (response) => {
        const stream = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const lineSeparator = /\r?\n/;

        const processStream = () =>
            stream.read().then(({ done, value }) => {
                if (done) {
                    if (buffer.length > 0) {
                        try {
                            processLine(JSON.parse(buffer));
                        } catch (error) {
                            console.error("Error processing leftover data:", buffer, error);
                        }
                    }
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split(lineSeparator);
                buffer = lines.pop();

                for (const line of lines) {
                    if (line) {
                        try {
                            processLine(JSON.parse(line));
                        } catch (error) {
                            console.error("Error processing line:", line, error);
                        }
                    }
                }

                if (!signal.aborted) {
                    return processStream();
                }
            }).catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Stream read operation was aborted.");
                } else {
                    console.error("Error reading stream:", error);
                }
            });

        processStream();
    };

    const fetchResponse = (path, signal) => {
        const url = `${LICHESS_BASE_ENDPOINT}${path}`;
        return fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            signal,
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
            }
            return response;
        });
    };

    const sendMove = async (move) => {
        if (!gameId) {
            showSnackbar("Game ID is missing. Please select a game.", "error");
            return null;
        }

        const url = `${LICHESS_BASE_ENDPOINT}/api/board/game/${gameId}/move/${move}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to make move: ${response.status} ${response.statusText} - ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error making move: ${error.message}`);
            showSnackbar("Failed to send move.", "error");
            throw error;
        }
    };

    return (
        <LichessContext.Provider
            value={{
                fetchGamePGN,
                fetchOngoingGames,
                lichessStreamGame,
                sendMove,
                setGameId,
                playerColor,
                setPlayerColor,
            }}
        >
            {children}
        </LichessContext.Provider>
    );
};

export const useLichess = () => useContext(LichessContext);