class card {
    revealed = null;
    suit = null;
    value = null;

    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.revealed = false;
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
        for (let j = 0; j < currentColumns[i].length; j++) {
            column.childNodes.forEach(function(card, j) {
                if (currentColumns[i][j].revealed) {
                    card.addEventListener("click", (e) => {
                        resetColors();
                        selectedCard = card;
                        card.style.backgroundColor = "aqua";
                    })
                }
            })
        }
    })
    console.log(stock.firstChild);
    if (stock.firstChild !== null) {
        stock.firstChild.addEventListener("click", (e) => {
            resetColors();
            selectedCard = stock.firstChild;
            selectedCard.style.backgroundColor = "aqua";
        })
    }
}

function attemptFoundation() {
    console.log("attempting to move to foundation");
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
        console.log("no card selected")
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
    console.log(value);
    console.log(value1);
    console.log(suit);

    if (suit === "spade") {
        console.log("chose spade");
        if (foundation[0] === value1 - 1) {
            removeCard(selectedCard);
            console.log("successful move");
            foundation[0] = value1;
            drawFoundation(new card(suit, value), selectedCard);
        }
        else {
            selectedCard = null;
            resetColors();
        }
    }
    if (suit === "heart") {
        console.log("chose heart");

        if (foundation[1] === value1 - 1) {
            console.log("successful move");
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
        console.log("chose diamond");

        if (foundation[2] === value1 - 1) {
            console.log("successful move");
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
        console.log("chose club");

        if (foundation[3] === value1 - 1) {
            console.log("successful move");
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
                currentColumns[i].pop();
            }
        }
    }

}
function getSuitFromImagePath(imagePath) {
    // Extract the filename from the image path
    const filename = imagePath.split("/").pop();
    console.log(filename);
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
function drawFromStock() {
    removeAllChildNodes(stock);
    if (stockPile.length === 0) {
        stockPile = drawnPile;
        console.log(stockPile);
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