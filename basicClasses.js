/**
 * Created by bede on 15/12/2016.
 */


class GameOption{
    constructor(buttonText, onClick, ...requirements) {
        this.buttonText = buttonText;
        this.onClick = onClick;
        this.requirements = requirements;
    }

    /**
     * Is an option valid, given the current state of the game?
     * @param o The option to check.
     * @returns {boolean}
     */
    isValid() {
        // Todo: option characteristics like location/items required.
        for (let requirement of this.requirements) {
            if (!requirement(g)) return false;
        }
        return true;
    }
}


class Quality {
    constructor(name) {
        this.name = name;
    }
}


class QualityContainer {
    constructor(qualities) {
        this.qualities = new Set(qualities || []);
    }

    hasQualityWithName(name) {
        for (let quality of this.qualities) {
            if (quality.name == name) return true
        }
        return false;
    }

    removeQualityWithName(name) {
        let idx, found = false;
        for (let i=0; i<this.qualities.length; i++) {
            let quality = this.qualities[i];
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
    constructor(name, descA, descB, defaultOptions, defaultQualities, traders) {
        super(defaultQualities);
        this.name = name;
        this.descA = descA;
        this.descB = descB;
        this.defaultOptions = defaultOptions;
        this.traders = traders || [];
    }
}


class Item {
    constructor(name, options, onAcquire, onRelinquish) {
        this.name = name;
        this.options = options || [];
        this.onAcquire = onAcquire || (() => {});
        this.onRelinquish = onRelinquish || (() => {});
    }
}


class ItemStack {
    constructor(numberItems, item) {
        this.numberItems = numberItems;
        this.item = item;
    }

    toString() {
        return `${this.numberItems} x ${this.item.name}`
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

    every(secs, label, fn) {
        let id = setInterval(fn, secs);
        this._scheduleMap.set(label, id);
    };

    after(secs, label, fn) {
        let id = setTimeout(fn, secs);
        this._scheduleMap.set(label, id);
    }

    cancel(label) {
        let id = this._scheduleMap.get(label);
        if (id) {
            clearInterval(id);
            clearTimeout(id);
        }
    }
}


/**
 * A Player holds information about what the current player can do.
 */
class Player extends QualityContainer {
    constructor(name, location, money, hints) {
        super();
        this.name = name;
        this.itemStacks = new Set();
        this.location = location;
        this.money = money;
        this.hints = new Set(hints);
    }

    /**
     * Work out (and return!) all the possible options our
     * human player can take at this point.
     * @returns {Set} The set of all possible actions.
     */
    getOptions(){
        let location = this.location, options = new Set();
        location.defaultOptions.forEach(o => {
            if (o.isValid())
                options.add(o);
        });
        this.itemStacks.forEach(stack => {
            if (stack.numberItems == 0) return 0;
            stack.item.options.forEach(option => {
                if (option.isValid())
                    options.add(option);
            })
        });
        let tradersVisible = false;
        for (let trader of this.location.traders) {
            if (trader.isVisible()) {
                tradersVisible = true;
                break;
            }
        }
        if (tradersVisible) {
            options.add(
                new GameOption("Enter Trading", enterTrading)
            )
        }
        return options;
    }

    /**
     * Add a single item to our inventory.
     * @param i The Item we're adding.
     * @param muteOnAcquire Should we avoid firing the item's onAcquire callback?
     */
    addItem(i, muteOnAcquire) {
        if (!muteOnAcquire) i.onAcquire(new ItemStack(1, i));
        let stackFound = false;
        for (let stack of this.itemStacks) {
            if (stack.item.name === i.name) {
                stack.numberItems++;
                stackFound = true;
                break;
            }
        }
        if (!stackFound) {
            let stack = new ItemStack(1, i);
            this.itemStacks.add(stack);
        } else {
            // Todo: pulse the right one.
        }
    }

    hasItemWithName(productName, productAmount) {
        for (let elem of this.itemStacks) {
            if (elem.item.name === productName) {
                return elem.numberItems >= productAmount;
            }
        }
        return false;
    }

    hasItemStack(stack) {
        return this.hasItemWithName(stack.item.name, stack.numberItems);
    }

    hasMoney(amount) {
        return this.money >= amount;
    }

    removeMoney(amount) {
        $(".money").fadeOut(500, () => {
            this.money -= amount;
            g.inventory.updateAllNoAnimate();
            $(".money").fadeIn(500);
        });
    }

    addMoney(amount) {
        this.removeMoney(-amount);
    }

    /**
     * Add an ItemStack to our inventory, making sure that at all
     * times there is only one stack for any given item.
     * @param stack
     */
    addItemStack(stack) {
        let num = stack.numberItems;
        let item = stack.item;

        item.onAcquire(stack);
        for (let i=0; i<num; i++) {
            this.addItem(item, false);
        }
    }

    /**
     * Remove an ItemStack from our inventory.
     * @param stack The item and number to remove.
     */
    removeItemStack(stack) {
        let name = stack.item.name;
        let number = stack.numberItems;
        let found = false;
        for (let s of this.itemStacks) {
            if (s.item.name === name) {
                s.numberItems -= number;
                found = true;
                break;
            }
        }
        if (!found) console.error("error: couldn't find itemstack to remove");
    }

    removeItemWithName(itemName) {
        this.removeItemStack(
            new ItemStack(1, new Item(itemName))
        )
    }

    removeItem(item) {
        this.removeItemStack(
            new ItemStack(1, item)
        );
    }

    /**
     * Wrapper method to move location and update the screen.
     * @param location The new location we're moving to.
     */
    moveLocation(location) {
        this.location = location;
        updateDisplay();
    }
}


class LedgerInterface {
    constructor() {
        this.ledger = LedgerInterface._findLedger();
    }

    static _findLedger() {
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
        this.inventory = InventoryInterface._findInventory();
    }

    static _findInventory() {
        return $("#inventory-items");
    }

    updateAllNoAnimate() {
        $(".money").text(g.player.money/100);
        currentInventoryItems().forEach(i => i.remove());
        g.player.itemStacks.forEach(i => {
            if (i.numberItems > 0) this.add(i)
        });
    }

    updateAll(animate) {
        if (animate) {
            $("#inventory-items").fadeOut(500, () => {
                this.updateAllNoAnimate();
                $("#inventory-items").fadeIn(500);
            });
        } else {
            this.updateAllNoAnimate();
        }
    }

    add(itemStack, animate) {
        if (animate) {
            let elem = $(`<li style="display:none;" class="inventory-item">${itemStack.toString()}</li>`);
            this.inventory.append(elem);
            elem.fadeIn(500);
        } else {
            this.inventory.append(
                $(`<li class="inventory-item">${itemStack.toString()}</li>`)
            );
        }
    }


}


class Trader extends QualityContainer {
    constructor(name, title, description, willSell, willBuy, willTrade, ...requirements) {
        super();
        this.name = name;
        this.title = title;
        this.description = description;
        this.willSell = willSell;
        this.willBuy = willBuy;
        this.willTrade = willTrade;
        this.requirements = requirements;
    }

    isVisible() {
        for (let require of this.requirements) {
            if (!require(g)) return false;
        }
        return true;
    }
}
