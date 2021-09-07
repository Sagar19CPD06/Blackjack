let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-score", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-score",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  totalwins: 0,
  totallosses: 0,
  totaldraws: 0,
  isStand: false,
  turnsOver: false,
};
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const hitSound = new Audio("static/sounds/swih.mp3");
const winSound = new Audio("static/sounds/cash.mp3");
const lossSound = new Audio("static/sounds/aww.mp3");

//event listener for: Hit, Deal, Stand
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);
document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);
document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCards();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    console.log(YOU["score"]);
  }
}

function randomCards() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = "static/images/" + card + ".png";
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

console.log(blackjackGame["turnOver"]);

function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    console.log(yourImages);
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    console.log(dealerImages);
    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector("#your-blackjack-score").textContent = 0;
    document.querySelector("#your-blackjack-score").style.color = "white";

    document.querySelector("#dealer-blackjack-score").textContent = 0;
    document.querySelector("#dealer-blackjack-score").style.color = "white";

    document.querySelector("#blackjack-result").textContent = `Let's Play`;
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame["turnsOver"] = false;
  }
}

function updateScore(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    if (card == "A") {
      //if adding 11 keep me below 21 then add 11 otherwise add 1.
      if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
        activePlayer["score"] += blackjackGame["cardsMap"][card][1];
      } else {
        activePlayer["score"] += blackjackGame["cardsMap"][card][0];
      }
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card];
    }
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "Busted!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCards();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame["turnsOver"] = true;
  let winner = cumputeWinner();
  showResult(winner);
}

function cumputeWinner() {
  let winner;
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["totalwins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["totallosses"]++;
      winner = DEALER;
    } else if (YOU["score"] == DEALER["score"]) {
      blackjackGame["totaldraws"]++;
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["totallosses"]++;
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["totaldraws"]++;
  }

  console.log(blackjackGame);
  return winner;
}

const showResult = (winner) => {
  let msg, msgColor;
  if (YOU["score"] <= 21) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["totalwins"];
      msg = "You won!";
      msgColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent =
        blackjackGame["totallosses"];
      msg = "You lost!";
      msgColor = "Red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent =
        blackjackGame["totaldraws"];
      msg = "You drew!";
      msgColor = "Black";
    }
  } else if (YOU["score"] > 21) {
    if (winner === DEALER) {
      document.querySelector("#losses").textContent =
        blackjackGame["totallosses"];
      msg = "You lost!";
      msgColor = "Red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent =
        blackjackGame["totaldraws"];
      msg = "You drew!";
      msgColor = "Black";
    }
  }
  document.querySelector("#blackjack-result").textContent = msg;
  document.querySelector("#blackjack-result").style.color = msgColor;
};
