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
    $("#location-description").text(location.description);
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
