import React, { useState } from "react";
import { useLichess } from "../../lichessAPI/lichessGame";

const OngoingGames = () => {
  const { fetchOngoingGames } = useLichess();
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);

  const handleLoadGames = async () => {
    const ongoingGames = await fetchOngoingGames();
    if (ongoingGames) setGames(ongoingGames.nowPlaying);
  };

  const handleGameSelection = async (gameId) => {
    setSelectedGameId(gameId);
  };

  return (
    <div>
      <h3>Ongoing Games</h3>

      <button onClick={handleLoadGames}>
        Load Ongoing Games
      </button>

      {games.length > 0 && (
        <div>
          <select
            value={selectedGameId}
            onChange={(e) => handleGameSelection(e.target.value)}
          >
            <option value="" disabled>Select a Game</option>
            {games.map((game) => (
              <option key={game.gameId} value={game.gameId}>
                {`${game.opponent.username} (${game.color})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedGameId && (
        <p>Selected Game ID: {selectedGameId}</p>
      )}
    </div>
  );
};

export default OngoingGames;