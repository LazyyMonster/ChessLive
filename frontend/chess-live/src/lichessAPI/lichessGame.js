import React, { createContext, useState, useContext} from 'react';

const lichessHost = "https://lichess.org";

const LichessContext = createContext();

export const LichessProvider = ({ children }) => {

    const [gameId, setGameId] = useState(null);

    const getToken = () => {
      return localStorage.getItem('lichessToken');
    }

    const fetchGamePGN = async (gameId) => {
        if (!getToken() || !gameId) return null;

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

            const movesRegex = /\n\n([\d\s\w.\-\x]*)(?=\s*\*)/;
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
        if (!getToken()) return;

        try {
            const response = await fetch(`${lichessHost}/api/account/playing`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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

                return actualGames;
            } else {
                console.warn("No ongoing games found.");
                return [];
            }

        } catch (err) {
            console.error("Error fetching games:", err);
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
  
      return () => {
          controller.abort();
      };
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
      const url = `https://lichess.org${path}`;
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
        const url = `https://lichess.org/api/board/game/${gameId}/move/${move}`;
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getToken()}`,
      
            },
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to make move: ${response.status} ${response.statusText} - ${errorText}`);
          }
      
          return await response.json();
        } catch (error) {
          console.error(`Error making move: ${error.message}`);
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
            }}
        >
            {children}
        </LichessContext.Provider>
    );
};

export const useLichess = () => useContext(LichessContext);