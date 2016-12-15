/** Return a formatted number for inventory/shop use. */
function numberToString(n) {
    return `${n} x `
}


/** Load the save state from LocalStorage or similar. */
function getSaveState() {
    return new Player("Bede", DEFAULT_LOCATION);
}


/** Returns an array of all option-cards currently onscreen. */
function currentOptionCards() {
    return [...$(".option-card")];
}


/** Returns an array of all inventory items currently onscreen. */
function currentInventoryItems() {
    return [...$(".inventory-item")]
}


/** Add an option card to the screen. */
function addOptionCard(option) {
    let card = $(`<button class="option-card">${option.buttonText}</button>`);
    card.click(option.onClick);
    $("#options").append(card);
}


function updateLocation() {
    "use strict";
    let location = g.player.location;
    $("title").text(location.name);
    $("#location-header").text(location.name);
    $("#location-description1").text(location.descA);
    $("#location-description2").text(location.descB);
}


function updateDisplayNoAnimate() {
    "use strict";
    /* Update the options cards. */
    let player = g.player, inventory = g.inventory;
    currentOptionCards().forEach(c => c.remove());
    player.getOptions().forEach(o => addOptionCard(o));

    /* Update the inventory items. */
    inventory.updateAll();

    /* Update the location information, description and page title. */
    updateLocation();
}


/**
 * Clear the current screen of option cards, and add all the new ones.
 */
function updateDisplay(noAnimate) {
    if (!noAnimate) {
        $("#main-content").fadeOut(500, ()=>{
            updateDisplayNoAnimate();
            $("#main-content").fadeIn(500, ()=>{});
        });
    } else {
        updateDisplayNoAnimate();
    }
}


function loadTrading() {
    "use strict";
    let location = g.player.location;
    $("#trading h1").html(`<span onclick="exitTrading();"><</span> 
                           Trade: ${location.name}`);
    // Todo: Load in actual traders.
}

function enterTrading() {
    $("#main-content").fadeOut(500, () => {
        loadTrading();
        $("#trading").fadeIn(500);
    });
}


function exitTrading() {
    "use strict";
    $("#trading").fadeOut(500, () => {
        $("#main-content").fadeIn(500);
    });
}