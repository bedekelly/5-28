/**
 * Created by bede on 15/12/2016.
 */


class GameOption{
    constructor(buttonText, onClick) {
        this.buttonText = buttonText;
        this.onClick = onClick;
    }
}


class Quality {
    constructor(name) {
        this.name = name;
    }
}

class QualityContainer {
    constructor(qualities) {
        this.qualities = qualities;
    }

    hasQualityWithName(name) {
        for (var q of this.qualities) {
            if (q.name == name) return true
        }
        return false;
    }

    removeQualityWithName(name) {
        var idx, found = false;
        for (var i=0; i<this.qualities.length; i++) {
            var quality = this.qualities[i];
            if (quality.name == name) {
                idx = i;
                found = true;
                break;
            }
        }
        if (found) {
            this.qualities.splice(idx, 1);
        }
    }

    addQuality(quality) {
        this.qualities.add(quality);
    }
}


class Location extends QualityContainer{
    constructor(name, initialDescription, defaultOptions, defaultQualities) {
        super(defaultQualities);
        this.name = name;
        this.description = initialDescription;
        this.defaultOptions = defaultOptions;
    }
}


class Item {
    constructor(name, options) {
        this.name = name;
        this.options = options || [];
    }
}


class ItemStack {
    constructor(numberItems, item) {
        this.numberItems = numberItems;
        this.item = item;
    }

    toString() {
        return `${numberToString(this.numberItems)} ${this.item.name}`
    }
}


/**
 * A Scheduler is a thin wrapper around setInterval.
 * It allows for setting and cancelling jobs with arbitrary labels.
 */
class Scheduler {
    constructor() {
        this._scheduleMap = new Map();
    }

    every(secs, fn, label) {
        let id = setInterval(fn, secs);
        this._scheduleMap.set(label, id);
    };

    cancel(label) {
        clearInterval(this._scheduleMap.get(label));
    }
}


/**
 * A Player holds information about what the current player can do.
 */
class Player extends QualityContainer {
    constructor(name, location) {
        super(new Set());
        this.name = name;
        this.itemStacks = new Set();
        this.location = location;
    }

    /**
     * Work out (and return!) all the possible options our
     * human player can take at this point.
     * @returns {Set} The set of all possible actions.
     */
    getOptions(){
        let location = this.location, options = new Set();
        location.defaultOptions.forEach(o => {
            if (this.optionIsValid(o))
                options.add(o);
        });
        this.itemStacks.forEach(stack => {
            stack.item.options.forEach(option => {
                if (this.optionIsValid(option))
                    options.add(option);
            })
        });
        return options;
    }

    /**
     * Add a single item to our inventory.
     * @param i The Item we're adding.
     * @param noAnimate Stop the item being animated.
     */
    addItem(i, noAnimate) {
        let stackFound = false;
        for (let stack of this.itemStacks) {
            if (stack.item.name == i.name) {
                stack.numberItems++;
                stackFound = true;
                break;
            }
        }
        if (!stackFound) {
            this.itemStacks.add(
                new ItemStack(1, i)
            )
        }

        if (!stackFound) {
            for (let stack of this.itemStacks) {
                if (stack.item.name == i.name) {
                    g.inventory.add(stack, !noAnimate);
                }
            }
        } else {
            // Todo: pulse the right one.
            g.inventory.updateAll();
        }
    }

    /**
     * Add an ItemStack to our inventory, making sure that at all
     * times there is only one stack for any given item.
     * @param stack
     */
    addItemStack(stack) {
        let num = stack.numberItems;
        let item = stack.item;
        for (var i=0; i<num; i++) {
            this.addItem(item);
        }
    }

    /**
     * Wrapper method to move location and update the screen.
     * @param location The new location we're moving to.
     */
    moveLocation(location) {
        this.location = location;
        updateDisplay();
    }

    /**
     * Is an option valid, given the current state of the game?
     * @param o The option to check.
     * @returns {boolean}
     */
    optionIsValid(o) {
        // Todo: option characteristics like location/items required.
        return !!(!!(o) | !!(this));
    }
}


class LedgerInterface {
    constructor() {
        this.ledger = this._findLedger();
    }

    _findLedger() {
        return $("#ledger-items")
    }

    add(actionTaken, noAnimate) {
        if (!noAnimate) {
            let element = $(`<li style="display: none;">${actionTaken}</li>`);
            this.ledger.append(element);
            element.fadeIn(1000);
        } else {
            let element = $(`<li>${actionTaken}</li>`);
            this.ledger.append(element);
        }
    }

    write(action) {
        this.add(action);
    }
}


class InventoryInterface {
    constructor() {
        this.inventory = this._findInventory();
    }

    _findInventory() {
        return $("#inventory-items");
    }

    updateAllNoAnimate() {
        currentInventoryItems().forEach(i => i.remove());
        g.player.itemStacks.forEach(i => this.add(i));
    }

    updateAll(animate) {
        if (animate) {
            $("#inventory-items").fadeOut(500, () => {
                this.updateAllNoAnimate();
                $("#inventory-items").fadeIn(500);
            });
        }
    }

    add(itemStack, animate) {
        if (animate) {
            let elem = $(`<li style="display: none;" class="inventory-item">${itemStack.toString()}</li>`);
            this.inventory.append(elem);
            elem.fadeIn(500);
        } else {
            this.inventory.append(
                $(`<li class="inventory-item">${itemStack.toString()}</li>`)
            );
        }
    }
}
