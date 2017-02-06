'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Return a formatted number for inventory/shop use.
 * This is the worst code I've ever seen and I didn't write it.
 * I have absolutely no idea how it works. I just sort of replaced some vars
 * with lets and prayed to the various gods until it worked.
 */
function numberToString(n) {

    function triplets(n) {
        var c = '',
            m = 0;
        if (100 <= n) {
            m = Math.floor(n / 100);c += triplets(m) + ' Hundred';n -= m * 100;
        }
        n.toString().replace(/^[2-9](?=\d)/, function (a) {
            c += (m ? '  and ' : ' ') + 'Twenty,Thirty,Forty,Fifty,Sixty,Seventy,Eighty,Ninety'.split(',')[a - 2];n -= +a * 10;
        });
        if (n == 0) return c;else if (c && n < 10) c += '-';
        return c + ' ' + 'One,Two,Three,Four,Five,Six,Seven,Eight,Nine,Ten,Eleven,Twelve,Thirteen,Fourteen,Fifteen,Sixteen,Seventeen,Eighteen,Nineteen'.split(',')[n - 1];
    }

    function anyNumber(n) {
        var lng = void 0,
            isS = void 0,
            chn = '';
        var wds = ',Thousand,Million,Thousand Million'.split(',');
        n.toString().replace(/(\d{1,3})(?=((\d\d\d)*)$)/g, function (a, b, c) {
            lng = c.toString().length / 3;
            var m = a.replace(/^0+/, '');
            isS = triplets(m);
            if (isS) chn += (!lng && m < 100 && /Thousand$/.test(chn) ? ' and ' : ' ') + isS.replace(/- /g, '-') + ' ' + wds[lng];
        });
        return chn.replace(/\s+/g, ' ');
    }

    return anyNumber(n);
}

/** Load the save state from LocalStorage or similar. */
function getSaveState() {
    return new Player("Bede", DEFAULT_LOCATION, DEFAULT_MONEY, DEFAULT_HINTS);
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
    var card = $('<button class="option-card">' + option.buttonText + '</button>');
    card.click(option.onClick);
    $("#options").append(card);
}

function removeOptionCardWithName(name, noAnimate) {
    "use strict";

    var optionCards = currentOptionCards();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var x = _step.value;

            if (x.innerHTML == name) {
                if (!noAnimate) {
                    $(x).fadeOut(500, function () {
                        return x.remove();
                    });
                } else x.remove();
                return 'break';
            }
        };

        for (var _iterator = optionCards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ret = _loop();

            if (_ret === 'break') break;
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
}

/**
 * Updates the location information on-screen.
 */
function updateLocation() {
    "use strict";

    var location = g.player.location;
    $("title").text(location.name);
    $("#location-header").text(location.name);
    $("#location-description1").text(location.descA);
    $("#location-description2").text(location.descB);
}

/**
 * Update the options cards, inventory items and text on-screen.
 */
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
    updateLocation();
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

function divmod(x, y) {
    var div = Math.trunc(x / y);
    var rem = x % y;
    return [div, rem];
}

function priceFromPennies(n) {
    "use strict";

    var _divmod = divmod(n, 100),
        _divmod2 = _slicedToArray(_divmod, 2),
        pounds = _divmod2[0],
        pence = _divmod2[1];

    if (pounds && pence) {
        return numberToString(pounds) + " Pounds, " + numberToString(pence) + " Pence";
    } else if (pounds) {
        return numberToString(pounds) + " Pounds";
    } else if (pence) {
        return numberToString(pence) + " Pence";
    } else {
        return "Free of Charge or Obligation";
    }
}

/**
                    HTML Structure for traders
                        li.trader
                            h3.trader-name
                            p.trader-description
                            h5.trader-subheading & buy
                            table.trader-table & buy
                                tbody
                                    tr
                                        td.product-name
                                        td.product-price
                            h5.trader-subheading & sell
                            table.trader-table & sell
                                tbody
                                    tr
                                        td.product-price
                                        td.product-name
                            h5.trader-subheading & trade
                            table.trader-table & trade
                                tbody
                                    tr
                                        td.product-name
                                        td.product-price
*/

function failToBuy(product) {
    "use strict";

    g.ledger.write('Looks like you don\'t have enough to buy the ' + product.product.name + '.');
}

function failToSell(product) {
    "use strict";

    g.ledger.write('Looks like you don\'t have the ' + product.product.name + ' to sell.');
}

function tryToBuy(saleInfo) {
    "use strict";

    if (g.player.hasMoney(saleInfo.price)) {
        g.player.removeMoney(saleInfo.price);
        var product = new ItemStack(saleInfo.multipack, saleInfo.product);
        g.ledger.write('You buy ' + product.toString() + ' for \n             ' + priceFromPennies(saleInfo.price));
        g.player.addItemStack(product);
    } else {
        failToBuy(saleInfo);
    }
}

function tryToSell(saleInfo) {
    "use strict";

    if (g.player.hasItemWithName(saleInfo.product.name, saleInfo.multipack)) {
        var product = new ItemStack(saleInfo.multipack, saleInfo.product);
        g.player.removeItemStack(product);
        g.player.addMoney(saleInfo.price);
        g.ledger.write('You sell ' + product.toString() + ' for\n                        ' + priceFromPennies(saleInfo.price));
        g.inventory.updateAllNoAnimate();
    } else {
        failToSell(saleInfo);
    }
}

function failToTrade(tradeInfo) {
    "use strict";

    g.ledger.write('Looks like you don\'t have the ' + tradeInfo.price.name + ' to trade.');
}

function tryToTrade(tradeInfo) {
    "use strict";

    var price = new ItemStack(tradeInfo.priceMultipack, tradeInfo.price);
    if (g.player.hasItemStack(price)) {
        var product = new ItemStack(tradeInfo.productMultipack, tradeInfo.product);
        g.player.removeItemStack(price);
        g.player.addItemStack(product);

        g.ledger.write('You trade ' + price.toString() + ' in exchange for ' + product.toString());

        g.inventory.updateAllNoAnimate();
    } else {
        failToTrade(tradeInfo);
    }
}

/**
 * Add a trader's information to the list of traders.
 */
function addTrader(traderInfo) {
    "use strict";

    var traders = $(".traders");
    var trader = $('<li class="trader"></li>');
    var name = $('<h3 class="trader-name">' + traderInfo.title + '</h3>');
    trader.append(name);

    var description = $('<p class="trader-description"></p>');
    description.html('"' + traderInfo.description + '"');
    trader.append(description);
    console.log(traderInfo);
    if (traderInfo.willSell.length !== 0) {
        var buySubheading = $('<h5>Buy</h5>');
        trader.append(buySubheading);

        var table = $('<table class="u-full-width trader-table buy"></table>');
        var tbody = $('<tbody></tbody>');
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop2 = function _loop2() {
                var productToSell = _step2.value;

                var tr = $('<tr></tr>');
                var productName = $('<td class="product-name"></td>');
                productName.text(productToSell.multipack + ' x ' + productToSell.product.name);
                tr.append(productName);

                var button = $('<td><a class="buy-button" href="#">-></a></td>');
                button.click(function () {
                    tryToBuy(productToSell);
                });
                tr.append(button);

                var productPrice = $('<td class="product-price"></td>');
                productPrice.text(priceFromPennies(productToSell.price));
                tr.append(productPrice);
                tbody.append(tr);
            };

            for (var _iterator2 = traderInfo.willSell[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _loop2();
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

        tbody.html();
        table.html(tbody);
        trader.append(table);
    }

    if (traderInfo.willBuy.length !== 0) {
        var sellSubheading = $('<h5>Sell</h5>');
        trader.append(sellSubheading);

        var _table = $('<table class="u-full-width trader-table sell"></table>');
        var _tbody = $('<tbody></tbody>');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            var _loop3 = function _loop3() {
                var productToBuy = _step3.value;

                var tr = $('<tr></tr>');

                var productPrice = $('<td class="product-price"></td>');
                productPrice.text(priceFromPennies(productToBuy.price));
                tr.append(productPrice);

                var button = $('<td><a class="sell-button" href="#"><-</a></td>');
                button.click(function () {
                    tryToSell(productToBuy);
                });
                tr.append(button);

                var productName = $('<td class="product-name"></td>');
                productName.text(productToBuy.multipack + ' x ' + productToBuy.product.name);
                tr.append(productName);

                _tbody.append(tr);
            };

            for (var _iterator3 = traderInfo.willBuy[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                _loop3();
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

        _table.html(_tbody);
        trader.append(_table);
    }

    if (traderInfo.willTrade.length !== 0) {
        var tradeSubheading = $('<h5>Trade</h5>');
        trader.append(tradeSubheading);

        var _table2 = $('<table class="u-full-width trader-table trades"></table>');
        var _tbody2 = $('<tbody></tbody>');
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            var _loop4 = function _loop4() {
                var tradeInfo = _step4.value;

                var tr = $('<tr></tr>');

                var product = $('<td class="product-price"></td>');
                product.html(tradeInfo.productMultipack + ' x ' + tradeInfo.product.name);
                tr.append(product);

                var button = $('<td><a class="trade-button" href="#"><-></a></td>');
                button.click(function () {
                    tryToTrade(tradeInfo);
                });
                tr.append(button);

                var price = $('<td class="product-name"></td>');
                price.html(tradeInfo.priceMultipack + ' x ' + tradeInfo.price.name);
                tr.append(price);

                _tbody2.append(tr);
            };

            for (var _iterator4 = traderInfo.willTrade[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                _loop4();
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

        _table2.html(_tbody2);
        trader.append(_table2);
    }

    traders.append(trader);
}

/**
 * Load data about each trader into the trading interface.
 */
function loadTraders() {
    "use strict";

    var traders = $(".traders");
    traders.html("");
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = g.player.location.traders[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var trader = _step5.value;

            if (trader.isVisible()) addTrader(trader);
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
}

/**
 * Load the data about the current location into the trading interface.
 */
function loadTrading() {
    "use strict";

    var location = g.player.location.name;
    var backButton = '<span onclick="exitTrading();">Exit</span>';
    var html = location + ' | ' + backButton;
    $(".trading-title").html(html);
    loadTraders();
}

/**
 * Replace the main interface with the trading interface.
 */
function enterTrading() {
    $("#main-content").fadeOut(500, function () {
        loadTrading();
        $("#trading").fadeIn(500);
    });
}

/**
 * Replace the trading interface with the main interface.
 */
function exitTrading() {
    "use strict";

    $("#trading").fadeOut(500, function () {
        updateDisplayNoAnimate();
        $("#main-content").fadeIn(500);
    });
}

function randomPop(set) {
    "use strict";

    var array = Array.from(set);
    var randNo = Math.floor(Math.random() * array.length);
    var elem = array[randNo];
    set.delete(elem);
    return elem;
}

function useHint() {
    "use strict";

    var hint = randomPop(g.player.hints);
    if (hint) hint(g);
}

//# sourceMappingURL=utilities-compiled.js.map