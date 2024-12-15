class RideTheBusGame {
  constructor() {
    this.deck = this.generateDeck();
    this.currentCard = null;
    this.remainingCards = [];
    this.messageElement = document.querySelector("#message");
    this.cardsContainerElement = document.querySelector("#cards");
    this.restartButton = document.querySelector("#btn-restart");
    this.buttons = document.querySelectorAll("#btn-higher, #btn-same, #btn-lower"); // All game buttons
    this.currentCardIndex = 0;

    this.setupControls();
    this.startGame();
  }

  generateDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = Array.from({ length: 13 }, (_, i) => i + 1); // 1 to 13 (Ace to King)
    const deck = [];

    for (const suit of suits) {
      for (const value of values) {
        deck.push({ value, suit });
      }
    }

    return this.shuffle(deck);
  }

  shuffle(deck) {
    return deck.sort(() => Math.random() - 0.5);
  }

  setupControls() {
    document.querySelector("#btn-higher").addEventListener("click", () => this.makeGuess("higher"));
    document.querySelector("#btn-same").addEventListener("click", () => this.makeGuess("same"));
    document.querySelector("#btn-lower").addEventListener("click", () => this.makeGuess("lower"));
    this.restartButton.addEventListener("click", () => this.startGame());
  }

  startGame() {
    this.deck = this.generateDeck();
    this.currentCard = this.deck.pop(); // First card (face-up)
    this.remainingCards = this.deck.slice(0, 5); // Next five cards (face-down)
    this.currentCardIndex = 0;
    this.enableButtons();
    this.updateUI();
    this.messageElement.innerText = "Make your guess!";
    this.restartButton.style.display = "none";
  }

  updateUI() {
    this.cardsContainerElement.innerHTML = "";

    // Add the first card as face-up
    const currentCardContainer = document.createElement("div");
    currentCardContainer.classList.add("card-container");
    const currentCardElement = this.createCardElement(this.currentCard, true); // Face-up
    currentCardContainer.appendChild(currentCardElement);
    this.cardsContainerElement.appendChild(currentCardContainer);

    // Add the remaining cards as face-down
    this.remainingCards.forEach(() => {
      const cardContainer = document.createElement("div");
      cardContainer.classList.add("card-container");
      const cardElement = this.createCardElement(null, false); // Face-down
      cardContainer.appendChild(cardElement);
      this.cardsContainerElement.appendChild(cardContainer);
    });
  }

  createCardElement(card, isFaceUp) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.style.transform = isFaceUp ? "rotateY(0deg)" : "rotateY(180deg)";

    // Card front (visible when face-up)
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerText = card ? this.formatCardValue(card.value) + " " + card.suit : ""; // Show formatted card value

    // Card back (hidden initially)
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    return cardElement;
  }

  formatCardValue(value) {
    if (value === 1) return "A"; // Ace
    if (value === 11) return "J"; // Jack
    if (value === 12) return "Q"; // Queen
    if (value === 13) return "K"; // King
    return value.toString(); // Other numbers
  }

  makeGuess(guess) {
    if (this.currentCardIndex >= this.remainingCards.length) {
      this.messageElement.innerText = "No cards left! You've won!";
      this.disableButtons();
      this.restartButton.style.display = "block";
      return;
    }

    const nextCard = this.remainingCards[this.currentCardIndex];
    const result = this.checkGuess(guess, this.currentCard, nextCard);

    if (result) {
      this.messageElement.innerText = "Correct! Keep going!";
      this.currentCard = nextCard;
      this.flipNextCard();
      this.currentCardIndex++;

      // Check if the user just guessed the last card correctly
      if (this.currentCardIndex >= this.remainingCards.length) {
        this.messageElement.innerText = "You won the game!";
        this.disableButtons(); // Disable buttons when the game is won
        this.restartButton.style.display = "block";
      }
    } else {
      this.messageElement.innerText = "Wrong guess! Game over!";
      this.flipNextCard(); // Flip the next card even if the guess is wrong
      this.disableButtons(); // Disable buttons on game over
      this.restartButton.style.display = "block";
    }
  }

  flipNextCard() {
    const nextCardContainer = this.cardsContainerElement.children[this.currentCardIndex + 1];
    const nextCardElement = nextCardContainer.querySelector(".card");
    const nextCard = this.remainingCards[this.currentCardIndex];
    nextCardElement.style.transform = "rotateY(0deg)"; // Flip to face-up
    const cardFront = nextCardElement.querySelector(".card-front");
    cardFront.innerText = this.formatCardValue(nextCard.value) + " " + nextCard.suit; // Reveal formatted card value
  }

  checkGuess(guess, currentCard, nextCard) {
    if (guess === "higher") return nextCard.value > currentCard.value;
    if (guess === "same") return nextCard.value === currentCard.value;
    if (guess === "lower") return nextCard.value < currentCard.value;
  }

  disableButtons() {
    this.buttons.forEach((button) => (button.disabled = true));
  }

  enableButtons() {
    this.buttons.forEach((button) => (button.disabled = false));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new RideTheBusGame();
});
