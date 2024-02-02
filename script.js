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
        console.log(card.suit);
        if (this.suit === "club" || this.suit === "spade") {
            console.log("checking black card");
            if (card.suit === "heart" || card.suit === "diamond") {
                console.log("destination red card");
                console.log(this.returnIntValue());
                console.log(card.returnIntValue()-1);
                if (this.returnIntValue() === card.returnIntValue() - 1) {
                    return true;
                }
            }
        }
        if (this.suit === "heart" || this.suit === "diamond") {
            console.log("checking red card");
            if (card.suit === "club" || card.suit === "spade") {
                console.log("destination black card");
                console.log(this.returnIntValue());
                console.log(card.returnIntValue()-1);
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
const stock = document.querySelector(".stockpile");
const hiddenCardSymbol = document.querySelector(".hiddenCard");
let selectedCard = null;
let foundation = [0, 0, 0, 0];
let stockPile = [];
let drawnPile = [];
let currentColumns = initialiseColumns();
setColumns();


function refreshEventHandlers() {
    columns.forEach(function (column, i) {
        if (column.childNodes.length === 0) {
            column.addEventListener("click", function moveKing(e) {
                if (selectedCard !== null) {
                    let newCard = toCard(selectedCard);
                    if (newCard.value === "K") {
                        removeCard(selectedCard);
                        addCard(i, newCard);
                        //resetColors();
                        setColumns();
                        if (selectedStockPile()) {
                            drawnPile.pop();
                            updateStock();
                        }
                    }
                }
                column.removeEventListener("click", moveKing);
            })
        }
        for (let j = 0; j < currentColumns[i].length; j++) {
            column.childNodes.forEach(function(card, j) {
                if (currentColumns[i][j].revealed) {
                    card.addEventListener("click", function handleClick(e) {
                        if (selectedCard === null) {
                            console.log("selecting first card");
                            resetColors();
                            selectedCard = card;
                            card.style.backgroundColor = "aqua";
                        } else if (toCard(selectedCard).canPlaceOn(toCard(card))) {
                            let newCard = toCard(selectedCard);
                            if (selectedStockPile()) {
                                drawnPile.pop();
                                updateStock();
                            }
                            removeCard(selectedCard);
                            addCard(i, newCard);
                            selectedCard = null;
                            revealCards();
                            setColumns();
                            resetColors();
                        } else {
                            resetColors();
                            selectedCard = card;
                            card.style.backgroundColor = "aqua";
                        }
                        // Remove the event listener after it's been executed once
                    })
                }
            })
        }
    })

    if (stock.firstChild !== null) {
        stock.firstChild.addEventListener("click", (e) => {
            resetColors();
            selectedCard = stock.firstChild;
            selectedCard.style.backgroundColor = "aqua";
        })
    }
    foundationSpots.forEach(function(spot, index) {
        spot.addEventListener("click", (e) => {
            if (selectedCard !== null) {
                if (selectedStockPile()) {
                    drawnPile.pop();
                    updateStock();
                }
                attemptFoundation();
            }
            if (spot.firstChild !== null && selectedCard === null) {
                selectedCard = spot.firstChild;
                selectedCard.style.backgroundColor = "aqua";
            }
        })


    })
}

function selectedStockPile() {
    return selectedCard === stock.firstChild;
}
function addCard(column, card) {
    card.revealed = true;
    currentColumns[column].push(card);
    console.log(card);
    console.log(currentColumns);
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
            removeCard(selectedCard);
            foundation[0] = value1;
            drawFoundation(new card(suit, value), selectedCard);
        }
        else {
            selectedCard = null;
            resetColors();
        }
    }
    if (suit === "heart") {

        if (foundation[1] === value1 - 1) {
            removeCard(selectedCard);

            foundation[1] = value1;
            drawFoundation(new card(suit, value), selectedCard);
        }
        else {
            selectedCard = null;
            resetColors();
        }
    }
    if (suit === "diamond") {

        if (foundation[2] === value1 - 1) {
            removeCard(selectedCard);

            foundation[2] = value1;
            drawFoundation(new card(suit, value), selectedCard);
        }
        else {
            selectedCard = null;
            resetColors();
        }
    }
    if (suit === "club") {

        if (foundation[3] === value1 - 1) {
            removeCard(selectedCard);

            foundation[3] = value1;
            drawFoundation(new card(suit, value), selectedCard);
        }
        else {
            selectedCard = null;
            resetColors();
        }
    }
    resetColors();
    selectedCard = null;
    revealCards();
    setColumns();
    refreshEventHandlers();
}
function removeCard(card) {
    console.log(currentColumns);
    let value = card.firstChild.firstChild.textContent;
    let suit = "";
    card.firstChild.childNodes.forEach(function(child, index) {
        if (index === 1) {
            suit = getSuitFromImagePath(child.src);
        }
    })
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            if (suit === currentColumns[i][j].suit && value === currentColumns[i][j].value) {
                console.log("removing card");
                currentColumns[i].splice(j, 1);
                break;
            }
        }
    }
    console.log(currentColumns);

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
function revealCards() {
    for (let i = 0; i < currentColumns.length; i++) {
        for (let j = 0; j < currentColumns[i].length; j++) {
            console.log(currentColumns[i][j], i, j);
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
    console.log(drawnPile);
    let card = drawnPile[drawnPile.length-1];
    console.log(card);
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
    refreshEventHandlers();
}
function startGame() {
    foundation = [0, 0, 0, 0];
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
    refreshEventHandlers()

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
            console.log("column " + index + " has length " + currentColumns[index].length);
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
    refreshEventHandlers();
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