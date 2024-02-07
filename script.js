class card {
    revealed = null;
    suit = null;
    value = null;

    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.revealed = false;
    }

    returnIntValue() {
        if (this.value === "A") {
            return 1;
        }
        if (this.value === "J") {
            return 11;
        }
        if (this.value === "Q") {
            return 12;
        }
        if (this.value === "K") {
            return 13;
        }
        else {
            return parseInt(this.value);
        }
    }
    canPlaceOn(card) {
        if (this.suit === "club" || this.suit === "spade") {
            if (card.suit === "heart" || card.suit === "diamond") {
                if (this.returnIntValue() === card.returnIntValue() - 1) {
                    return true;
                }
            }
        }
        if (this.suit === "heart" || this.suit === "diamond") {
            if (card.suit === "club" || card.suit === "spade") {
                if (this.returnIntValue() === card.returnIntValue() - 1) {
                    return true;
                }
            }
        }
        return false;
    }
}

//Initialise Game
const deck = initialiseDeck();
const columns = document.querySelectorAll(".column");
const foundationSpots = document.querySelectorAll(".foundationSpot");
const foundationBox = document.querySelector(".foundation");
const stock = document.querySelector(".stockpile");
const hiddenCardSymbol = document.querySelector(".hiddenCard");
const moveCounter = document.querySelector(".moveCounter");
let selectedCard = null;
let moves = 0;
let foundation = [0, 0, 0, 0];
let stockPile = [];
let drawnPile = [];
let currentColumns = initialiseColumns();
setColumns();

document.addEventListener("click", (e) => {
    if (e.target.className !== "card" && e.target.className !== "hiddenCard" && e.target.className !== "foundationCard" && e.target.className !== "stockpile" && e.target.className !== "largeIcon" && e.target.className !== "smallIcon" && e.target.className !== "cardDetails" && e.target.tagName !== "P" && e.target.className !== "stockCard") {
        selectedCard = null;
        resetColors();
    }
})
stock.addEventListener("click", (e) => {
    if (stock.firstChild !== null) {
        resetColors();
        selectedCard = stock.firstChild;
        selectedCard.style.backgroundColor = "aqua";
    }
})
foundationSpots.forEach(function(spot, index) {
    spot.addEventListener("click", (e) => {
        if (selectedCard !== null) {
            if (!selectedFoundation()) {
                const foundationBefore = [...foundation];
                if (selectedBottomCard() || selectedStockPile()) {
                    attemptFoundation();
                }
                if (foundationBefore.every((value, idx) => value === foundation[idx])) {
                    // If the foundation has not been updated, the card was not moved
                    selectedCard = spot.firstChild;
                    resetColors();
                    selectedCard.style.backgroundColor = "aqua";
                } else {
                    // If the foundation has been updated, the card was successfully moved
                    moves += 1;
                    selectedCard = null;
                    setColumns();
                }
            }
            else {
                selectedCard = spot.firstChild;
                resetColors();
                selectedCard.style.backgroundColor = "aqua";
            }
            if (selectedStockPile()) {
                drawnPile.pop();
                updateStock();
            }
        }
        else if (spot.firstChild !== null) {
            selectedCard = spot.firstChild;
            resetColors();
            selectedCard.style.backgroundColor = "aqua";
        }
    })
})
function initialiseEventHandlers() {
    columns.forEach(function (column, i) {
        column.addEventListener("click", (e) => {
            if (column.childNodes.length === 0) {
                if (selectedCard !== null) {
                    let newCard = toCard(selectedCard);
                    if (newCard.value === "K") {
                        moves += 1;
                        if (selectedBottomCard()) {
                            removeCard(toCard(selectedCard));
                            addCard(i, newCard);
                        }
                        else if (selectedStockPile()) {
                            drawnPile.pop();
                            updateStock();
                            removeCard(toCard(selectedCard));
                            addCard(i, newCard);
                        }
                        else {
                            moveAllFrom(i, selectedCard)
                        }

                        //resetColors();
                        revealCards();
                        setColumns();
                    }

                }
            }
            else {
                if (e.target !== column) {
                    if (e.target.className  !== "hiddenCard") {
                        let card = "";
                        if (e.target.className === "card") {
                            card = e.target;
                        }
                        if (e.target.className === "largeIcon" || e.target.className === "cardDetails") {
                            card = e.target.parentNode;
                        }
                        if (e.target.className === "smallIcon" || e.target.nodeName === "P") {
                            card = e.target.parentNode.parentNode;
                        }
                        if (selectedCard === null) {
                            resetColors();
                            selectedCard = card;
                            highlightAllFrom(selectedCard)
                            selectedCard.style.backgroundColor = "aqua";
                        } else if (toCard(selectedCard).canPlaceOn(toCard(card))) {
                            let newCard = toCard(selectedCard);
                            moves += 1;
                            if (selectedBottomCard()) {
                                removeCard(toCard(selectedCard));
                                addCard(i, newCard);
                            }
                            else if (selectedStockPile()) {
                                drawnPile.pop();
                                updateStock();
                                removeCard(toCard(selectedCard));
                                addCard(i, newCard);
                            }
                            else if (selectedFoundation()) {

                                reduceFoundation(newCard.suit);

                                drawWholeFoundation();

                                removeCard(toCard(selectedCard));

                                addCard(i, newCard);

                            }
                            else {
                                moveAllFrom(i, selectedCard);
                            }
                            selectedCard = null;
                            revealCards();
                            setColumns();
                            resetColors();
                        } else {
                            resetColors();
                            selectedCard = card;
                            card.style.backgroundColor = "aqua";
                            if (!selectedBottomCard()) {
                                highlightAllFrom(selectedCard);
                            }

                        }

                    }
                }
            }
        })

    })

}
function inFoundation(card) {
    if (card.suit === "spade") {
        return foundation[0] >= convertToIntValue(card.value);
    }
    if (card.suit === "heart") {
        return foundation[1] >= convertToIntValue(card.value);
    }
    if (card.suit === "diamond") {
        return foundation[2] >= convertToIntValue(card.value);
    }
    if (card.suit === "club") {
        return foundation[3] >= convertToIntValue(card.value);
    }
}
function convertToIntValue(value) {
    if (value === "A") {
        return 1;
    }
    if (value === "K") {
        return 13;
    }
    if (value === "Q") {
        return 12;
    }
    if (value === "J") {
        return 11;
    }
    else {
        return parseInt(value);
    }

}
function moveAllFrom(columnToAdd, card2) {
    columns.forEach(function(column, index) {
        let correctColumn = false;
        column.childNodes.forEach(function(card, j) {

            if (card.className !== "hiddenCard") {
                if (card === card2) {
                    correctColumn = true;
                }
            }

            if (correctColumn) {
                removeCard(toCard(card));
                addCard(columnToAdd, toCard(card));

            }
        })
    })
}
function highlightAllFrom(card) {
    columns.forEach(function(column, index) {
        let highlight = false;
        column.childNodes.forEach(function (card, j) {
            if (selectedCard === card) {
                highlight = true;
            }
            if (highlight) {
                card.style.backgroundColor = "aqua";
            }
        })
    })
}
function selectedBottomCard() {
    let isSelected = false;
    columns.forEach(function (column, index) {
        column.childNodes.forEach(function (card, j) {
            if (j === column.childNodes.length-1) {
                if (selectedCard === card) {
                    isSelected = true;
                }
            }
        });
    });
    return isSelected;
}
function selectedStockPile() {
    return selectedCard === stock.firstChild;
}
function selectedFoundation() {
    let isSelected = false;
    foundationSpots.forEach(function (spot) {
        if (spot.firstChild === selectedCard)  {
            isSelected = true;
        }
    })
    return isSelected;
}
function addCard(column, card) {
    card.revealed = true;
    currentColumns[column].push(card);
}
function toCard(vcard) {
    let value = "";
    let suit = "";
    vcard.firstChild.childNodes.forEach(function(node, index) {
        if (index === 0) {
            value = node.textContent;
        }
        else {
            suit = getSuitFromImagePath(node.src);
        }
    })
    let card1 = new card(suit, value);
    card1.revealed = true;
    return card1;
}
function attemptFoundation() {




    if (selectedCard === null) {
        return;
    }
    let value = "";
    let suit = "";
    selectedCard.firstChild.childNodes.forEach(function(info, index) {
        if (index === 0) {
            value = info.textContent;
        }
        else {
            suit = getSuitFromImagePath(info.src);
        }
    })
    if (selectedCard === null) {
        return;
    }
    let value1 = 0;
    if (value === "A") {
        value1 = 1;
    }
    else if (value === "J") {
        value1 = 11;
    }
    else if (value === "Q") {
        value1 = 12;
    }
    else if (value === "K") {
        value1 = 13;
    }
    else {
        value1 = parseInt(value);
    }


    if (suit === "spade") {
        if (foundation[0] === value1 - 1) {
            removeCard(toCard(selectedCard));
            if (selectedStockPile()) {
                drawnPile.pop();
                updateStock();
            }
            foundation[0] = value1;
            drawFoundation(new card(suit, value), selectedCard);
            resetColors();

        }
        else if (foundation[0] > 0) {
            selectedCard = foundationSpots.item(0).firstChild;
            resetColors();
            selectedCard.style.backgroundColor = "aqua";
        }
    }
    if (suit === "heart") {

        if (foundation[1] === value1 - 1) {
            removeCard(toCard(selectedCard));
            if (selectedStockPile()) {
                drawnPile.pop();
                updateStock();
            }
            foundation[1] = value1;
            drawFoundation(new card(suit, value), selectedCard);
            resetColors();

        }
        else if (foundation[1] > 0) {
            selectedCard = foundationSpots.item(1).firstChild;
            resetColors();
            selectedCard.style.backgroundColor = "aqua";
        }
    }
    if (suit === "diamond") {

        if (foundation[2] === value1 - 1) {
            removeCard(toCard(selectedCard));
            if (selectedStockPile()) {
                drawnPile.pop();
                updateStock();
            }
            foundation[2] = value1;
            drawFoundation(new card(suit, value), selectedCard);
            resetColors();

        }
        else if (foundation[2] > 0) {
            selectedCard = foundationSpots.item(2).firstChild;
            resetColors();
            selectedCard.style.backgroundColor = "aqua";
        }
    }
    if (suit === "club") {

        if (foundation[3] === value1 - 1) {
            removeCard(toCard(selectedCard));
            if (selectedStockPile()) {
                drawnPile.pop();
                updateStock();
            }
            foundation[3] = value1;
            drawFoundation(new card(suit, value), selectedCard);
            resetColors();
        }
        else if (foundation[3] > 0) {
            selectedCard = foundationSpots.item(3).firstChild;
            resetColors();
            selectedCard.style.backgroundColor = "aqua";
        }
    }
    revealCards();
    setColumns();

}
function removeCard(card) {

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            if (card.suit === currentColumns[i][j].suit && card.value === currentColumns[i][j].value) {
                currentColumns[i].splice(j, 1);
                break;
            }
        }
    }

}
function getSuitFromImagePath(imagePath) {
    // Extract the filename from the image path
    const filename = imagePath.split("/").pop();
    // Determine the suit based on the filename
    if (filename.includes("spade")) {
        return "spade";
    } else if (filename.includes("heart")) {
        return "heart";
    } else if (filename.includes("diamond")) {
        return "diamond";
    } else if (filename.includes("club")) {
        return "club";
    } else {
        return "unknown";
    }
}
function drawFoundation(card, vcard) {
    vcard.className = "foundationCard";
    if (card.suit === "spade") {
        removeAllChildNodes(foundationSpots[0]);
        foundationSpots[0].appendChild(vcard);
    }
    if (card.suit === "heart") {
        removeAllChildNodes(foundationSpots[1]);
        foundationSpots[1].appendChild(vcard);
    }
    if (card.suit === "diamond") {
        removeAllChildNodes(foundationSpots[2]);
        foundationSpots[2].appendChild(vcard);
    }
    if (card.suit === "club") {
        removeAllChildNodes(foundationSpots[3]);
        foundationSpots[3].appendChild(vcard);
    }

}
function drawWholeFoundation() {
    foundationSpots.forEach(function(spot, index) {
        removeAllChildNodes(spot);
        let suit = ""
        if (index === 0) {
            suit = "spade"
        }
        if (index === 1) {
            suit = "heart"
        }
        if (index === 2) {
            suit = "diamond"
        }
        if (index === 3) {
            suit = "club"
        }
        if (foundation[index] > 0)  {
            let newCard = returnVisualCard(suit, foundation[index]);
            newCard.className = "foundationCard"

            spot.appendChild(newCard);
        }
    })
}
function returnVisualCard(suit, value) {
    let cardDetails = document.createElement("div");
    cardDetails.className = "cardDetails";
    let cardText = document.createElement("p");
    let smallIcon = document.createElement("img");
    smallIcon.className = "smallIcon";
    let largeIcon = document.createElement("img");
    largeIcon.className = "largeIcon";
    if (value === 1) {
        cardText.textContent = "A";
    }
    else if (value === 11) {
        cardText.textContent = "J";
    }
    else if (value === 12) {
        cardText.textContent = "Q";
    }
    else if (value === 13) {
        cardText.textContent = "K";
    }
    else {
        cardText.textContent = value.toString();
    }
    if (suit === "spade") {
        cardText.style.color = "black";
        smallIcon.src = "icons/spade.png";
        largeIcon.src = "icons/spade.png";
    }
    if (suit === "heart") {
        cardText.style.color = "#c71515";
        smallIcon.src = "icons/heart.png";
        largeIcon.src = "icons/heart.png";
    }
    if (suit === "diamond") {
        cardText.style.color = "#c71515";
        smallIcon.src = "icons/diamond.png";
        largeIcon.src = "icons/diamond.png";
    }
    if (suit === "club") {
        cardText.style.color = "black";
        smallIcon.src = "icons/club.png";
        largeIcon.src = "icons/club.png";
    }
    cardDetails.appendChild(cardText);
    cardDetails.appendChild(smallIcon);
    let card = document.createElement("div");
    card.className = "card";
    card.appendChild(cardDetails);
    card.appendChild(largeIcon);
    return card;
}
function reduceFoundation(suit) {
    if (suit === "spade") {
        if (foundation[0] !== 0) {
            foundation[0] -= 1;
        }
    }
    if (suit === "heart") {
        if (foundation[1] !== 0) {
            foundation[1] -= 1;
        }
    }
    if (suit === "diamond") {
        if (foundation[2] !== 0) {
            foundation[2] -= 1;
        }
    }
    if (suit === "club") {
        if (foundation[3] !== 0) {
            foundation[3] -= 1;
        }
    }
}
function revealCards() {
    for (let i = 0; i < currentColumns.length; i++) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            if (j === currentColumns[i].length - 1) {

                currentColumns[i][j].revealed = true;

            }
        }
    }

}
function resetColors() {
    columns.forEach(function (column, i) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            column.childNodes.forEach(function(card, j) {
                if (currentColumns[i][j].revealed) {
                    card.style.backgroundColor = "white";
                }
            })
        }
    })
    foundationSpots.forEach(function(spot, i) {
        if (spot.childNodes.length > 0) {
            spot.firstChild.style.backgroundColor = "white";
        }
    })
    if (stock.firstChild !== null) {
        stock.firstChild.style.backgroundColor = "white";
    }
}
function updateStock() {
    removeAllChildNodes(stock);
    if (drawnPile.length === 0) {
        return;
    }
    let card = drawnPile[drawnPile.length-1];
    let cardDetails = document.createElement("div");
    cardDetails.className = "cardDetails";
    let cardText = document.createElement("p");
    let smallIcon = document.createElement("img");
    smallIcon.className = "smallIcon";
    let largeIcon = document.createElement("img");
    largeIcon.className = "largeIcon";
    const suit = card.suit;
    cardText.textContent = card.value;
    if (suit === "spade") {
        cardText.style.color = "black";
        smallIcon.src = "icons/spade.png";
        largeIcon.src = "icons/spade.png";
    }
    if (suit === "heart") {
        cardText.style.color = "#c71515";
        smallIcon.src = "icons/heart.png";
        largeIcon.src = "icons/heart.png";
    }
    if (suit === "diamond") {
        cardText.style.color = "#c71515";
        smallIcon.src = "icons/diamond.png";
        largeIcon.src = "icons/diamond.png";
    }
    if (suit === "club") {
        cardText.style.color = "black";
        smallIcon.src = "icons/club.png";
        largeIcon.src = "icons/club.png";
    }
    cardDetails.appendChild(cardText);
    cardDetails.appendChild(smallIcon);
    let vcard = document.createElement("div");
    vcard.className = "stockCard";
    vcard.appendChild(cardDetails);
    vcard.appendChild(largeIcon);
    stock.appendChild(vcard);
}
function drawFromStock() {
    removeAllChildNodes(stock);
    if (stockPile.length === 0) {
        stockPile = drawnPile;
        drawnPile = [];
        hiddenCardSymbol.style.opacity = 1;
    }
    else {
        moves += 1;
        setColumns();
        const card = stockPile.splice(0,1);
        drawnPile.push(card[0]);
        let cardDetails = document.createElement("div");
        cardDetails.className = "cardDetails";
        let cardText = document.createElement("p");
        let smallIcon = document.createElement("img");
        smallIcon.className = "smallIcon";
        let largeIcon = document.createElement("img");
        largeIcon.className = "largeIcon";
        const suit = card[0].suit;
        cardText.textContent = card[0].value;
        if (suit === "spade") {
            cardText.style.color = "black";
            smallIcon.src = "icons/spade.png";
            largeIcon.src = "icons/spade.png";
        }
        if (suit === "heart") {
            cardText.style.color = "#c71515";
            smallIcon.src = "icons/heart.png";
            largeIcon.src = "icons/heart.png";
        }
        if (suit === "diamond") {
            cardText.style.color = "#c71515";
            smallIcon.src = "icons/diamond.png";
            largeIcon.src = "icons/diamond.png";
        }
        if (suit === "club") {
            cardText.style.color = "black";
            smallIcon.src = "icons/club.png";
            largeIcon.src = "icons/club.png";
        }
        cardDetails.appendChild(cardText);
        cardDetails.appendChild(smallIcon);
        let vcard = document.createElement("div");
        vcard.className = "stockCard";
        vcard.appendChild(cardDetails);
        vcard.appendChild(largeIcon);
        stock.appendChild(vcard);
    }
    if (stockPile.length === 0) {
        hiddenCardSymbol.style.opacity = 0;
    }
}
function startGame() {
    foundation = [0, 0, 0, 0];
    moves = 0;
    hiddenCardSymbol.style.opacity = 1;
    clearFoundation();
    clearColumns();
    removeAllChildNodes(stock);
    stockPile = [];
    let gameDeck = shuffleDeck();
    let counter = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            if (i !== j) {
                currentColumns[i].push(gameDeck[counter]);
                counter += 1;
            }
            else {
                gameDeck[counter].revealed = true;
                currentColumns[i].push(gameDeck[counter]);
                counter += 1;
            }
        }
    }
    setColumns();
    setStockPile(gameDeck, counter);
    initialiseEventHandlers()

}
function setStockPile(deck, cutoff) {
    for (let i = cutoff; i < 52; i++) {
        stockPile.push(deck[i]);
    }
}
function clearColumns() {
    for (let i = 0; i < deck.length; i++) {
        deck[i].revealed = false;
    }
    for (let i = 0; i < currentColumns.length; i++) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            currentColumns[i][j].revealed = false;
        }
    }
    currentColumns = initialiseColumns();

}
function setColumns() {
    columns.forEach(function(column, index) {
        removeAllChildNodes(column);
        for (let i = 0; i < currentColumns[index].length; i++) {
            if (currentColumns[index][i].revealed === true) {
                let cardDetails = document.createElement("div");
                cardDetails.className = "cardDetails";
                let cardText = document.createElement("p");
                let smallIcon = document.createElement("img");
                smallIcon.className = "smallIcon";
                let largeIcon = document.createElement("img");
                largeIcon.className = "largeIcon";
                const suit = currentColumns[index][i].suit;
                cardText.textContent = currentColumns[index][i].value;
                if (suit === "spade") {
                    cardText.style.color = "black";
                    smallIcon.src = "icons/spade.png";
                    largeIcon.src = "icons/spade.png";
                }
                if (suit === "heart") {
                    cardText.style.color = "#c71515";
                    smallIcon.src = "icons/heart.png";
                    largeIcon.src = "icons/heart.png";
                }
                if (suit === "diamond") {
                    cardText.style.color = "#c71515";
                    smallIcon.src = "icons/diamond.png";
                    largeIcon.src = "icons/diamond.png";
                }
                if (suit === "club") {
                    cardText.style.color = "black";
                    smallIcon.src = "icons/club.png";
                    largeIcon.src = "icons/club.png";
                }
                cardDetails.appendChild(cardText);
                cardDetails.appendChild(smallIcon);
                let card = document.createElement("div");
                card.className = "card";
                card.appendChild(cardDetails);
                card.appendChild(largeIcon);
                column.appendChild(card);
            }
            else {
                let hiddenCard = document.createElement("img");
                hiddenCard.src = "cardback.jpeg";
                hiddenCard.className = "hiddenCard";
                column.appendChild(hiddenCard);
            }
        }
    })
    moveCounter.textContent = "Moves: " + moves;
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function initialiseColumns() {
    let columns = [];
    for (let i = 0; i < 7; i++) {
        columns.push([]);
    }
    return columns;
}
function initialiseDeck() {
    let newDeck = [];
    //Initialise Spades
    for (let i = 1; i < 14; i++) {
        if (i <= 9) {
            newDeck.push(new card("spade", (i+1).toString()));
        }
        if (i === 10) {
            newDeck.push(new card("spade", "J"));
        }
        if (i === 11) {
            newDeck.push(new card("spade", "Q"));
        }
        if (i === 12) {
            newDeck.push(new card("spade", "K"));
        }
        if (i === 13) {
            newDeck.push(new card("spade", "A"));
        }
    }
    //Initialise Hearts
    for (let i = 1; i < 14; i++) {
        if (i <= 9) {
            newDeck.push(new card("heart", (i+1).toString()));
        }
        if (i === 10) {
            newDeck.push(new card("heart", "J"));
        }
        if (i === 11) {
            newDeck.push(new card("heart", "Q"));
        }
        if (i === 12) {
            newDeck.push(new card("heart", "K"));
        }
        if (i === 13) {
            newDeck.push(new card("heart", "A"));
        }
    }
    //Initialise Diamonds
    for (let i = 1; i < 14; i++) {
        if (i <= 9) {
            newDeck.push(new card("diamond", (i+1).toString()));
        }
        if (i === 10) {
            newDeck.push(new card("diamond", "J"));
        }
        if (i === 11) {
            newDeck.push(new card("diamond", "Q"));
        }
        if (i === 12) {
            newDeck.push(new card("diamond", "K"));
        }
        if (i === 13) {
            newDeck.push(new card("diamond", "A"));
        }
    }
    //Initialise Clubs
    for (let i = 1; i < 14; i++) {
        if (i <= 9) {
            newDeck.push(new card("club", (i+1).toString()));
        }
        if (i === 10) {
            newDeck.push(new card("club", "J"));
        }
        if (i === 11) {
            newDeck.push(new card("club", "Q"));
        }
        if (i === 12) {
            newDeck.push(new card("club", "K"));
        }
        if (i === 13) {
            newDeck.push(new card("club", "A"));
        }
    }
    return newDeck;
}
function shuffleDeck() {
    let newDeck = [];
    for (let i = 0; i < deck.length; i++) {
        let random = Math.floor(52 * Math.random());
        while (newDeck.includes(deck[random])) {
            random = Math.floor(52 * Math.random());
        }
        newDeck.push(deck[random]);
    }
    return newDeck;
}
function clearFoundation() {
    foundationSpots.forEach(function(spot) {
        if (spot.firstChild !== null) {
            spot.firstChild.remove();
        }
    })
}