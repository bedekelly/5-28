"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by bede on 15/12/2016.
 */

var GameOption = function () {
    function GameOption(buttonText, onClick) {
        _classCallCheck(this, GameOption);

        this.buttonText = buttonText;
        this.onClick = onClick;

        for (var _len = arguments.length, requirements = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            requirements[_key - 2] = arguments[_key];
        }

        this.requirements = requirements;
    }

    /**
     * Is an option valid, given the current state of the game?
     * @param o The option to check.
     * @returns {boolean}
     */


    _createClass(GameOption, [{
        key: "isValid",
        value: function isValid() {
            // Todo: option characteristics like location/items required.
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.requirements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var requirement = _step.value;

                    if (!requirement(g)) return false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return true;
        }
    }]);

    return GameOption;
}();

var Quality = function Quality(name) {
    _classCallCheck(this, Quality);

    this.name = name;
};

var QualityContainer = function () {
    function QualityContainer(qualities) {
        _classCallCheck(this, QualityContainer);

        this.qualities = new Set(qualities || []);
    }

    _createClass(QualityContainer, [{
        key: "hasQualityWithName",
        value: function hasQualityWithName(name) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.qualities[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var quality = _step2.value;

                    if (quality.name == name) return true;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return false;
        }
    }, {
        key: "removeQualityWithName",
        value: function removeQualityWithName(name) {
            var idx = void 0,
                found = false;
            for (var i = 0; i < this.qualities.length; i++) {
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
    }, {
        key: "getQualityWithName",
        value: function getQualityWithName(name) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.qualities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var q = _step3.value;

                    if (q.name == name) return q;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            console.error("Couldn't find quality with name " + name);
        }
    }, {
        key: "addQuality",
        value: function addQuality(quality) {
            this.qualities.add(quality);
        }
    }]);

    return QualityContainer;
}();

var Location = function (_QualityContainer) {
    _inherits(Location, _QualityContainer);

    function Location(name, descA, descB, defaultOptions, defaultQualities, traders) {
        _classCallCheck(this, Location);

        var _this = _possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, defaultQualities));

        _this.name = name;
        _this.descA = descA;
        _this.descB = descB;
        _this.defaultOptions = defaultOptions;
        _this.traders = traders || [];
        return _this;
    }

    return Location;
}(QualityContainer);

var Item = function Item(name, options, onAcquire, onRelinquish) {
    _classCallCheck(this, Item);

    this.name = name;
    this.options = options || [];
    this.onAcquire = onAcquire || function () {};
    this.onRelinquish = onRelinquish || function () {};
};

var ItemStack = function () {
    function ItemStack(numberItems, item) {
        _classCallCheck(this, ItemStack);

        this.numberItems = numberItems;
        this.item = item;
    }

    _createClass(ItemStack, [{
        key: "toString",
        value: function toString() {
            return this.numberItems + " x " + this.item.name;
        }
    }]);

    return ItemStack;
}();

/**
 * A Scheduler is a thin wrapper around setInterval.
 * It allows for setting and cancelling jobs with arbitrary labels.
 */


var Scheduler = function () {
    function Scheduler() {
        _classCallCheck(this, Scheduler);

        this._scheduleMap = new Map();
    }

    _createClass(Scheduler, [{
        key: "every",
        value: function every(secs, label, fn) {
            var id = setInterval(fn, secs);
            this._scheduleMap.set(label, id);
        }
    }, {
        key: "after",
        value: function after(secs, label, fn) {
            var id = setTimeout(fn, secs);
            this._scheduleMap.set(label, id);
        }
    }, {
        key: "cancel",
        value: function cancel(label) {
            var id = this._scheduleMap.get(label);
            if (id) {
                clearInterval(id);
                clearTimeout(id);
            }
        }
    }]);

    return Scheduler;
}();

/**
 * A Player holds information about what the current player can do.
 */


var Player = function (_QualityContainer2) {
    _inherits(Player, _QualityContainer2);

    function Player(name, location, money, hints) {
        _classCallCheck(this, Player);

        var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

        _this2.name = name;
        _this2.itemStacks = new Set();
        _this2.location = location;
        _this2.money = money;
        _this2.hints = new Set(hints);
        return _this2;
    }

    /**
     * Work out (and return!) all the possible options our
     * human player can take at this point.
     * @returns {Set} The set of all possible actions.
     */


    _createClass(Player, [{
        key: "getOptions",
        value: function getOptions() {
            var location = this.location,
                options = new Set();
            location.defaultOptions.forEach(function (o) {
                if (o.isValid()) options.add(o);
            });
            this.itemStacks.forEach(function (stack) {
                if (stack.numberItems == 0) return 0;
                stack.item.options.forEach(function (option) {
                    if (option.isValid()) options.add(option);
                });
            });
            var tradersVisible = false;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.location.traders[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var trader = _step4.value;

                    if (trader.isVisible()) {
                        tradersVisible = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (tradersVisible) {
                options.add(new GameOption("Enter Trading", enterTrading));
            }
            return options;
        }

        /**
         * Add a single item to our inventory.
         * @param i The Item we're adding.
         * @param muteOnAcquire Should we avoid firing the item's onAcquire callback?
         */

    }, {
        key: "addItem",
        value: function addItem(i, muteOnAcquire) {
            if (!muteOnAcquire) i.onAcquire(new ItemStack(1, i));
            var stackFound = false;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.itemStacks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _stack = _step5.value;

                    if (_stack.item.name === i.name) {
                        _stack.numberItems++;
                        stackFound = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            if (!stackFound) {
                var stack = new ItemStack(1, i);
                this.itemStacks.add(stack);
            } else {
                // Todo: pulse the right one.
            }
        }
    }, {
        key: "hasItemWithName",
        value: function hasItemWithName(productName, productAmount) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.itemStacks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var elem = _step6.value;

                    if (elem.item.name === productName) {
                        return elem.numberItems >= productAmount;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return false;
        }
    }, {
        key: "hasItemStack",
        value: function hasItemStack(stack) {
            return this.hasItemWithName(stack.item.name, stack.numberItems);
        }
    }, {
        key: "hasMoney",
        value: function hasMoney(amount) {
            return this.money >= amount;
        }
    }, {
        key: "removeMoney",
        value: function removeMoney(amount) {
            var _this3 = this;

            $(".money").fadeOut(500, function () {
                _this3.money -= amount;
                g.inventory.updateAllNoAnimate();
                $(".money").fadeIn(500);
            });
        }
    }, {
        key: "addMoney",
        value: function addMoney(amount) {
            this.removeMoney(-amount);
        }

        /**
         * Add an ItemStack to our inventory, making sure that at all
         * times there is only one stack for any given item.
         * @param stack
         */

    }, {
        key: "addItemStack",
        value: function addItemStack(stack) {
            var num = stack.numberItems;
            var item = stack.item;

            item.onAcquire(stack);
            for (var i = 0; i < num; i++) {
                this.addItem(item, false);
            }
        }

        /**
         * Remove an ItemStack from our inventory.
         * @param stack The item and number to remove.
         */

    }, {
        key: "removeItemStack",
        value: function removeItemStack(stack) {
            var name = stack.item.name;
            var number = stack.numberItems;
            var found = false;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.itemStacks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var s = _step7.value;

                    if (s.item.name === name) {
                        s.numberItems -= number;
                        found = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            if (!found) console.error("error: couldn't find itemstack to remove");
        }
    }, {
        key: "removeItemWithName",
        value: function removeItemWithName(itemName) {
            this.removeItemStack(new ItemStack(1, new Item(itemName)));
        }
    }, {
        key: "removeItem",
        value: function removeItem(item) {
            this.removeItemStack(new ItemStack(1, item));
        }

        /**
         * Wrapper method to move location and update the screen.
         * @param location The new location we're moving to.
         */

    }, {
        key: "moveLocation",
        value: function moveLocation(location) {
            this.location = location;
            updateDisplay();
        }
    }]);

    return Player;
}(QualityContainer);

var LedgerInterface = function () {
    function LedgerInterface() {
        _classCallCheck(this, LedgerInterface);

        this.ledger = LedgerInterface._findLedger();
    }

    _createClass(LedgerInterface, [{
        key: "add",
        value: function add(actionTaken, noAnimate) {
            if (!noAnimate) {
                var element = $("<li style=\"display: none;\">" + actionTaken + "</li>");
                this.ledger.append(element);
                element.fadeIn(1000);
            } else {
                var _element = $("<li>" + actionTaken + "</li>");
                this.ledger.append(_element);
            }
        }
    }, {
        key: "write",
        value: function write(action) {
            this.add(action);
        }
    }], [{
        key: "_findLedger",
        value: function _findLedger() {
            return $("#ledger-items");
        }
    }]);

    return LedgerInterface;
}();

var InventoryInterface = function () {
    function InventoryInterface() {
        _classCallCheck(this, InventoryInterface);

        this.inventory = InventoryInterface._findInventory();
    }

    _createClass(InventoryInterface, [{
        key: "updateAllNoAnimate",
        value: function updateAllNoAnimate() {
            var _this4 = this;

            $(".money").text(g.player.money / 100);
            currentInventoryItems().forEach(function (i) {
                return i.remove();
            });
            g.player.itemStacks.forEach(function (i) {
                if (i.numberItems > 0) _this4.add(i);
            });
        }
    }, {
        key: "updateAll",
        value: function updateAll(animate) {
            var _this5 = this;

            if (animate) {
                $("#inventory-items").fadeOut(500, function () {
                    _this5.updateAllNoAnimate();
                    $("#inventory-items").fadeIn(500);
                });
            } else {
                this.updateAllNoAnimate();
            }
        }
    }, {
        key: "add",
        value: function add(itemStack, animate) {
            if (animate) {
                var elem = $("<li style=\"display:none;\" class=\"inventory-item\">" + itemStack.toString() + "</li>");
                this.inventory.append(elem);
                elem.fadeIn(500);
            } else {
                this.inventory.append($("<li class=\"inventory-item\">" + itemStack.toString() + "</li>"));
            }
        }
    }], [{
        key: "_findInventory",
        value: function _findInventory() {
            return $("#inventory-items");
        }
    }]);

    return InventoryInterface;
}();

var Trader = function (_QualityContainer3) {
    _inherits(Trader, _QualityContainer3);

    function Trader(name, title, description, willSell, willBuy, willTrade) {
        _classCallCheck(this, Trader);

        var _this6 = _possibleConstructorReturn(this, (Trader.__proto__ || Object.getPrototypeOf(Trader)).call(this));

        _this6.name = name;
        _this6.title = title;
        _this6.description = description;
        _this6.willSell = willSell;
        _this6.willBuy = willBuy;
        _this6.willTrade = willTrade;

        for (var _len2 = arguments.length, requirements = Array(_len2 > 6 ? _len2 - 6 : 0), _key2 = 6; _key2 < _len2; _key2++) {
            requirements[_key2 - 6] = arguments[_key2];
        }

        _this6.requirements = requirements;
        return _this6;
    }

    _createClass(Trader, [{
        key: "isVisible",
        value: function isVisible() {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.requirements[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var require = _step8.value;

                    if (!require(g)) return false;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return true;
        }
    }]);

    return Trader;
}(QualityContainer);

//# sourceMappingURL=basicClasses-compiled.js.map