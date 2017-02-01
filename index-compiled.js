"use strict";

/**
 * Main game initializer code goes here.
 */

$(document).ready(function () {

    /* Set up a global object called `g`. */
    window.g = {};
    g.player = getSaveState();
    g.ledger = new LedgerInterface();
    g.inventory = new InventoryInterface();
    g.scheduler = new Scheduler();

    /* Load our ledger with tips and our inventory with items. */
    DEFAULT_LEDGER_ITEMS.forEach(function (i) {
        return g.ledger.add(i, true);
    });
    DEFAULT_ITEMS.forEach(function (i) {
        return g.player.addItem(i, true);
    });

    /* If it hasn't already updated, update the display now. */
    updateDisplay(g.player);
});

//# sourceMappingURL=index-compiled.js.map