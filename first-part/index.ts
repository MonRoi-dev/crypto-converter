type Coin = 'ETH' | 'TRON' | 'MATIC' | 'BTC';
type AvailableCoins = { [key in Coin]: number };

function distributedCoins(
  availableCoins: AvailableCoins,
  requests: string[],
): Coin[] | null {
  const combinations: Coin[][] = [];

  function generateCombinations(index: number, currentCombination: Coin[]) {
    if (index === requests.length) {
      combinations.push(currentCombination.slice());
      return;
    }

    const requestedCoins: Coin[] = requests[index].split('/') as Coin[];
    for (const coin of requestedCoins) {
      if (availableCoins[coin] > 0) {
        currentCombination.push(coin);
        availableCoins[coin]--;
        generateCombinations(index + 1, currentCombination);
        currentCombination.pop();
        availableCoins[coin]++;
      }
    }
  }

  generateCombinations(0, []);

  for (const combination of combinations) {
    let isValid = true;
    const result: Coin[] = [];

    for (const coin of combination) {
      if (availableCoins[coin] > 0) {
        result.push(coin);
        availableCoins[coin]--;
      } else {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      return result;
    } else {
      for (const coin of combination) {
        availableCoins[coin]++;
      }
    }
  }
  return null;
}

const availableCoins: AvailableCoins = { ETH: 4, TRON: 5, MATIC: 1, BTC: 1 };
const requestedCoins: string[] = [
  'ETH',
  'ETH/MATIC',
  'ETH/TRON/MATIC',
  'TRON/ETH',
  'TRON/MATIC',
  'TRON',
  'MATIC',
  'BTC',
];

console.log(distributedCoins(availableCoins, requestedCoins));
