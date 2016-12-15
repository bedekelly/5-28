"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by bede on 15/12/2016.
 */

var GameOption = function GameOption(buttonText, onClick) {
    _classCallCheck(this, GameOption);

    this.buttonText = buttonText;
    this.onClick = onClick;
};

var Quality = function Quality(name) {
    _classCallCheck(this, Quality);

    this.name = name;
};

var QualityContainer = function () {
    function QualityContainer(qualities) {
        _classCallCheck(this, QualityContainer);

        this.qualities = qualities;
    }

    _createClass(QualityContainer, [{
        key: "hasQualityWithName",
        value: function hasQualityWithName(name) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.qualities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var quality = _step.value;

                    if (quality.name == name) return true;
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
        key: "addQuality",
        value: function addQuality(quality) {
            this.qualities.add(quality);
        }
    }]);

    return QualityContainer;
}();

var Location = function (_QualityContainer) {
    _inherits(Location, _QualityContainer);

    function Location(name, initialDescription, defaultOptions, defaultQualities) {
        _classCallCheck(this, Location);

        var _this = _possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, defaultQualities));

        _this.name = name;
        _this.description = initialDescription;
        _this.defaultOptions = defaultOptions;
        return _this;
    }

    return Location;
}(QualityContainer);

var Item = function Item(name, options) {
    _classCallCheck(this, Item);

    this.name = name;
    this.options = options || [];
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
            return numberToString(this.numberItems) + " " + this.item.name;
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
        value: function every(secs, fn, label) {
            var id = setInterval(fn, secs);
            this._scheduleMap.set(label, id);
        }
    }, {
        key: "cancel",
        value: function cancel(label) {
            clearInterval(this._scheduleMap.get(label));
        }
    }]);

    return Scheduler;
}();

/**
 * A Player holds information about what the current player can do.
 */


var Player = function (_QualityContainer2) {
    _inherits(Player, _QualityContainer2);

    function Player(name, location) {
        _classCallCheck(this, Player);

        var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, new Set()));

        _this2.name = name;
        _this2.itemStacks = new Set();
        _this2.location = location;
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
            var _this3 = this;

            var location = this.location,
                options = new Set();
            location.defaultOptions.forEach(function (o) {
                if (_this3.optionIsValid(o)) options.add(o);
            });
            this.itemStacks.forEach(function (stack) {
                stack.item.options.forEach(function (option) {
                    if (_this3.optionIsValid(option)) options.add(option);
                });
            });
            return options;
        }

        /**
         * Add a single item to our inventory.
         * @param i The Item we're adding.
         * @param noAnimate Stop the item being animated.
         */

    }, {
        key: "addItem",
        value: function addItem(i, noAnimate) {
            var stackFound = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.itemStacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _stack = _step2.value;

                    if (_stack.item.name == i.name) {
                        _stack.numberItems++;
                        stackFound = true;
                        break;
                    }
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

            if (!stackFound) {
                this.itemStacks.add(new ItemStack(1, i));
            }

            if (!stackFound) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.itemStacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var stack = _step3.value;

                        if (stack.item.name == i.name) {
                            g.inventory.add(stack, !noAnimate);
                        }
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

    }, {
        key: "addItemStack",
        value: function addItemStack(stack) {
            var num = stack.numberItems;
            var item = stack.item;
            for (var i = 0; i < num; i++) {
                this.addItem(item);
            }
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

        /**
         * Is an option valid, given the current state of the game?
         * @param o The option to check.
         * @returns {boolean}
         */

    }, {
        key: "optionIsValid",
        value: function optionIsValid(o) {
            // Todo: option characteristics like location/items required.
            return !!(!!o | !!this);
        }
    }]);

    return Player;
}(QualityContainer);

var LedgerInterface = function () {
    function LedgerInterface() {
        _classCallCheck(this, LedgerInterface);

        this.ledger = this._findLedger();
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

            currentInventoryItems().forEach(function (i) {
                return i.remove();
            });
            g.player.itemStacks.forEach(function (i) {
                return _this4.add(i);
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
            }
        }
    }, {
        key: "add",
        value: function add(itemStack, animate) {
            if (animate) {
                var elem = $("<li style=\"display: none;\" class=\"inventory-item\">" + itemStack.toString() + "</li>");
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

//# sourceMappingURL=basicClasses-compiled.js.map