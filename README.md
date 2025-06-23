# glicko2-lite

An implementation of the Glicko-2 rating algorithm using glicko2-lite and
adapted specifically for the 4-player card game of Hearts. The goal is to
provide less conveniences than [`glicko2js`][1] in favor of faster execution
time while supporting multi-player game scenarios.

## Example

``` javascript
const glicko2 = require('glicko2-lite');

// Hearts game with 4 players:
// Player A: 1500 rating, 350 rating deviation, and 0.06 volatility
// Player B: 2000 rating, 70 rating deviation - finished 1st (score: 1.0)
// Player C: 1800 rating, 100 rating deviation - finished 2nd (score: 0.66)  
// Player D: 1200 rating, 200 rating deviation - finished 3rd (score: 0.33)
// Player A finished 4th (score: 0.0)

// Calculate Player A's new rating after this Hearts game:
glicko2(1500, 350, 0.06, [
  [2000, 70, 1.0],   // vs Player B (who won)
  [1800, 100, 0.66], // vs Player C (who came 2nd)
  [1200, 200, 0.33]  // vs Player D (who came 3rd)
])
// => {
// =>   rating: 1467.5878493169462,
// =>   rd: 318.6617548537152,
// =>   vol: 0.059999457650202655
// => }
```

## Installation

``` bash
$ npm install glicko2-lite
```

## API

``` javascript
const glicko2 = require('glicko2-lite');
```

### `glicko2(rating, rd, vol, matches, [options])`

  - `rating` (_Number_)
  - `rd` (_Number_)
  - `vol` (_Number_)
  - `matches` (_Array_)
  - `options` (_Object_)
