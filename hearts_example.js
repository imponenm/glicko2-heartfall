const rate = require('./index.js');

// Hearts game example with 4 players - multiple rd scenarios
const playerSets = [
  {
    name: 'Low Uncertainty (rd=25)',
    players: [
      { name: 'Alice', rating: 1500, rd: 25, sigma: 0.04 },
      { name: 'Bob', rating: 1400, rd: 25, sigma: 0.04 },
      { name: 'Charlie', rating: 1600, rd: 25, sigma: 0.04 },
      { name: 'Diana', rating: 1550, rd: 25, sigma: 0.04 }
    ]
  },
  {
    name: 'Medium-Low Uncertainty (rd=50)',
    players: [
      { name: 'Alice', rating: 1500, rd: 50, sigma: 0.04 },
      { name: 'Bob', rating: 1400, rd: 50, sigma: 0.04 },
      { name: 'Charlie', rating: 1600, rd: 50, sigma: 0.04 },
      { name: 'Diana', rating: 1550, rd: 50, sigma: 0.04 }
    ]
  },
  {
    name: 'Medium Uncertainty (rd=100)',
    players: [
      { name: 'Alice', rating: 1500, rd: 100, sigma: 0.04 },
      { name: 'Bob', rating: 1400, rd: 100, sigma: 0.04 },
      { name: 'Charlie', rating: 1600, rd: 100, sigma: 0.04 },
      { name: 'Diana', rating: 1550, rd: 100, sigma: 0.04 }
    ]
  },
  {
    name: 'High Uncertainty (rd=175)',
    players: [
      { name: 'Alice', rating: 1500, rd: 175, sigma: 0.04 },
      { name: 'Bob', rating: 1400, rd: 175, sigma: 0.04 },
      { name: 'Charlie', rating: 1600, rd: 175, sigma: 0.04 },
      { name: 'Diana', rating: 1550, rd: 175, sigma: 0.04 }
    ]
  },
  {
    name: 'Very High Uncertainty (rd=300)',
    players: [
      { name: 'Alice', rating: 1500, rd: 300, sigma: 0.04 },
      { name: 'Bob', rating: 1400, rd: 300, sigma: 0.04 },
      { name: 'Charlie', rating: 1600, rd: 300, sigma: 0.04 },
      { name: 'Diana', rating: 1550, rd: 300, sigma: 0.04 }
    ]
  }
];

// Game result: [Alice: 2nd, Bob: 1st, Charlie: 4th, Diana: 3rd]
const gameResult = [
  { player: 0, place: 2 }, // Alice: 2nd
  { player: 1, place: 1 }, // Bob: 1st  
  { player: 2, place: 4 }, // Charlie: 4th
  { player: 3, place: 3 }  // Diana: 3rd
];

// Convert placement to pairwise score
function getScore(myPlace, opponentPlace) {
  if (myPlace < opponentPlace) return 1;    // I placed better (lower number = better place)
  if (myPlace > opponentPlace) return 0;    // I placed worse
  return 0.5;                               // Tie (rare in Hearts)
}

// Process each player set
playerSets.forEach((playerSet, setIndex) => {
  console.log('\n' + Array(51).join('='));
  console.log(playerSet.name.toUpperCase());
  console.log(Array(51).join('=') + '\n');
  
  console.log('Game Result:', gameResult.map(r => `${playerSet.players[r.player].name}: ${r.place}${r.place === 1 ? 'st' : r.place === 2 ? 'nd' : r.place === 3 ? 'rd' : 'th'}`).join(', '));
  console.log('\n--- RATING UPDATES ---\n');

  const updatedPlayers = playerSet.players.map((player, playerIndex) => {
    const myPlace = gameResult.filter(r => r.player === playerIndex)[0].place;
    
    // Create opponents array for this player
    const opponents = [];
    gameResult.forEach((result, i) => {
      if (result.player !== playerIndex) {
        const opponent = playerSet.players[result.player];
        const score = getScore(myPlace, result.place);
        opponents.push([opponent.rating, opponent.rd, score]);
      }
    });
    
    // Calculate new rating
    const newRating = rate(player.rating, player.rd, player.sigma, opponents);
    
    // Display results
    console.log(`${player.name}:`);
    console.log(`  Place: ${myPlace}${myPlace === 1 ? 'st' : myPlace === 2 ? 'nd' : myPlace === 3 ? 'rd' : 'th'}`);
    console.log(`  Old Rating: ${player.rating.toFixed(1)} (±${player.rd.toFixed(1)})`);
    console.log(`  New Rating: ${newRating.rating.toFixed(1)} (±${newRating.rd.toFixed(1)})`);
    console.log(`  Change: ${(newRating.rating - player.rating) >= 0 ? '+' : ''}${(newRating.rating - player.rating).toFixed(1)}`);
    console.log(`  Volatility: ${player.sigma.toFixed(3)} → ${newRating.vol.toFixed(3)}`);
    console.log('');
    
    return {
      ...player,
      rating: newRating.rating,
      rd: newRating.rd,
      sigma: newRating.vol,
      change: newRating.rating - player.rating
    };
  });

  // Show final rankings for this set
  console.log('--- UPDATED RANKINGS ---');
  const sortedPlayers = [...updatedPlayers].sort((a, b) => b.rating - a.rating);
  sortedPlayers.forEach((player, index) => {
    console.log(`${index + 1}. ${player.name}: ${player.rating.toFixed(1)} (±${player.rd.toFixed(1)}) [${player.change >= 0 ? '+' : ''}${player.change.toFixed(1)}]`);
  });
});

// Summary comparison
console.log('\n' + Array(51).join('='));
console.log('SUMMARY: RATING CHANGES BY RD LEVEL');
console.log(Array(51).join('=') + '\n');

playerSets.forEach((playerSet, setIndex) => {
  console.log(`${playerSet.name}:`);
  
  const tempUpdatedPlayers = playerSet.players.map((player, playerIndex) => {
    const myPlace = gameResult.filter(r => r.player === playerIndex)[0].place;
    
    const opponents = [];
    gameResult.forEach((result, i) => {
      if (result.player !== playerIndex) {
        const opponent = playerSet.players[result.player];
        const score = getScore(myPlace, result.place);
        opponents.push([opponent.rating, opponent.rd, score]);
      }
    });
    
    const newRating = rate(player.rating, player.rd, player.sigma, opponents);
    return {
      name: player.name,
      change: newRating.rating - player.rating
    };
  });
  
  tempUpdatedPlayers.forEach(player => {
    console.log(`  ${player.name}: ${player.change >= 0 ? '+' : ''}${player.change.toFixed(1)}`);
  });
  console.log('');
});