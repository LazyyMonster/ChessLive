import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useChess } from '../chessLogic/chessGame';
import LichessOAuth from "./lichessOAuth";

const lichessHost = "https://lichess.org";

const LichessContext = createContext();

export const LichessProvider = ({ children }) => {

    const { token } = LichessOAuth();
    const {setGameFromLichess } = useChess();

    const fetchGamePGN = async (gameId) => {
        if (!token || !gameId) return null;

        try {
            const response = await fetch(`${lichessHost}/game/export/${gameId}`, {

            });

            if (!response.ok) {
                throw new Error("Failed to fetch PGN.");
            }

            const pgn = await response.text();

            if (!pgn) {
                console.error("No PGN data in response.");
                return null;
            }

            const movesRegex = /\n\n([\d\s\w\.\-\+x]*)(?=\s*\*)/;
            const match = pgn.match(movesRegex);

            if (match && match[1]) {
                return match[1].trim();
            } else {
                console.error("Failed to extract moves from PGN.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching PGN:", err);
            return null;
        }
    };

    const fetchOngoingGames = async () => {
        if (!token) { console.log('nima'); return; }

        try {
            const response = await fetch(`${lichessHost}/api/account/playing`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch ongoing games.");
            }

            const data = await response.json();

            if (data.nowPlaying) {
                const actualGames = data.nowPlaying.map((game) => ({
                    gameId: game.gameId,
                    opponentUsername: game.opponent?.username || "Unknown",
                    color: game.color,
                }));

                // setOngoingGames(actualGames);
                console.log("Simplified ongoing games:", actualGames);
                return actualGames;
            } else {
                console.warn("No ongoing games found.");
                return [];
            }

        } catch (err) {
            console.error("Error fetching games:", err);
        }
    };

    useEffect(() => {
        if (token) {
            console.log('lama')
        }
    }, [token]);

    const [gameUpdates, setGameUpdates] = useState([]);
    // const activeStreams = useRef(new Set());

    const lichessStreamGame = (callback, gameId) => {
        const path = `/api/board/game/stream/${gameId}`;
      
        fetchResponse(token, path)
          .then(readStream(callback))
          .catch((error) => {
            console.error(`Error starting game stream for game ${gameId}:`, error);
          });
      };
      
      const readStream = (processLine) => (response) => {
        const stream = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
      
        const lineSeparator = /\r?\n/;
      
        const processStream = () =>
          stream.read().then(({ done, value }) => {
            if (done) {
              // Process any leftover buffered data
              if (buffer.length > 0) {
                try {
                  processLine(JSON.parse(buffer));
                } catch (error) {
                  console.error("Error processing leftover data:", buffer, error);
                }
              }
              return; // Stream has ended
            }
      
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
      
            // Split buffer into complete lines and process each line
            const lines = buffer.split(lineSeparator);
            buffer = lines.pop(); // Keep the last incomplete line in the buffer
      
            for (const line of lines) {
              if (line) {
                try {
                  processLine(JSON.parse(line));
                } catch (error) {
                  console.error("Error processing line:", line, error);
                }
              }
            }
      
            // Continue reading the stream
            return processStream();
          });
      
        processStream();
      };
      
      const fetchResponse = (token, path) => {
        const url = `https://lichess.org${path}`;
        return fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
          }
          return response;
        });
      };
      

    return (
        <LichessContext.Provider
            value={{
                fetchGamePGN,
                fetchOngoingGames,
                lichessStreamGame,
            }}
        >
            {children}
        </LichessContext.Provider>
    );
};

export const useLichess = () => useContext(LichessContext);