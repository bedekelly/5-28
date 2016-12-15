"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** Return a formatted number for inventory/shop use. */
function numberToString(n) {
    return n + " x ";
}

/** Load the save state from LocalStorage or similar. */
function getSaveState() {
    return new Player("Bede", DEFAULT_LOCATION);
}

/** Returns an array of all option-cards currently onscreen. */
function currentOptionCards() {
    return [].concat(_toConsumableArray($(".option-card")));
}

/** Returns an array of all inventory items currently onscreen. */
function currentInventoryItems() {
    return [].concat(_toConsumableArray($(".inventory-item")));
}

/** Add an option card to the screen. */
function addOptionCard(option) {
    var card = $("<button class=\"option-card\">" + option.buttonText + "</button>");
    card.click(option.onClick);
    $("#options").append(card);
}

function updateLocation() {
    "use strict";

    var location = g.player.location;
    $("title").text(location.name);
    $("#location-header").text(location.name);
    $("#location-description").text(location.description);
}

function updateDisplayNoAnimate() {
    "use strict";
    /* Update the options cards. */

    var player = g.player,
        inventory = g.inventory;
    currentOptionCards().forEach(function (c) {
        return c.remove();
    });
    player.getOptions().forEach(function (o) {
        return addOptionCard(o);
    });

    /* Update the inventory items. */
    inventory.updateAll();

    /* Update the location information, description and page title. */
    updateLocation(true);
}

/**
 * Clear the current screen of option cards, and add all the new ones.
 */
function updateDisplay(noAnimate) {
    if (!noAnimate) {
        $("#main-content").fadeOut(500, function () {
            updateDisplayNoAnimate();
            $("#main-content").fadeIn(500, function () {});
        });
    } else {
        updateDisplayNoAnimate();
    }
}

//# sourceMappingURL=utilities-compiled.js.map