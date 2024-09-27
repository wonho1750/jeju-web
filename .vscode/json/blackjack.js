// blackjack.js
let cardOne = 7;
let cardTwo = 5;
let cardThree = 7;
let sum = cardOne + cardTwo + cardThree;  // 플레이어 카드 총합

let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 4;
let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank;  // 딜러 카드 총합

// 2. 플레이어가 21점을 달성하면 블랙잭 (즉시 승리).
if (sum === 21) {
  console.log('Blackjack! You win!');
} else if (sum > 21) {
  // 1. 플레이어와 딜러의 카드 합계가 21을 넘으면 Bust (패배).
  console.log('You busted! You lose.');
} else {
  // 3. 딜러는 17점 이상일 때 멈추고, 그 이하일 때는 추가 카드를 뽑아야 함.
  while (bankSum < 17) {
    // 딜러가 추가 카드를 뽑는 로직 (예시로 1장의 추가 카드를 뽑음)
    let newCard = Math.floor(Math.random() * 11) + 1;  // 1부터 11까지 랜덤한 값
    bankSum += newCard;
    console.log(`Dealer draws a card: ${newCard}. Dealer now has ${bankSum} points.`);
  }

  // 5. 21점을 초과한 쪽이 무조건 패배.
  if (bankSum > 21) {
    console.log('Dealer busted! You win!');
  } else if (sum > bankSum) {
    console.log('You win!');
  } else if (sum < bankSum) {
    console.log('Dealer wins.');
  } else {
    // 4. 카드 합계가 같은 경우 무승부 (Draw).
    console.log('It\'s a draw.');
  }
}       
