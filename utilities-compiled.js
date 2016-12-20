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
            m = Math.floor(n / 100);c += triplets(m) + ' hundred';n -= m * 100;
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
    var card = $('<button class="option-card">' + option.buttonText + '</button>');
    card.click(option.onClick);
    $("#options").append(card);
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

    var buySubheading = $('<h5>Buy</h5>');
    trader.append(buySubheading);

    var table = $('<table class="u-full-width trader-table buy"></table>');
    var tbody = $('<tbody></tbody>');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = traderInfo.willSell[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var productToSell = _step.value;

            var tr = $('<tr></tr>');
            var productName = $('<td class="product-name"></td>');
            productName.text(productToSell.multipack + ' x ' + productToSell.product);
            tr.append(productName);
            var productPrice = $('<td class="product-price"></td>');
            productPrice.text(priceFromPennies(productToSell.price));
            tr.append(productPrice);
            tbody.append(tr);
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

    tbody.html();
    table.html(tbody);
    trader.append(table);

    var sellSubheading = $('<h5>Sell</h5>');
    trader.append(sellSubheading);

    table = $('<table class="u-full-width trader-table sell"></table>');
    tbody = $('<tbody></tbody>');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = traderInfo.willBuy[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var productToBuy = _step2.value;

            var _tr = $('<tr></tr>');

            var _productPrice = $('<td class="product-price"></td>');
            _productPrice.text(priceFromPennies(productToBuy.price));
            _tr.append(_productPrice);

            var _productName = $('<td class="product-name"></td>');
            _productName.text(productToBuy.multipack + ' x ' + productToBuy.product);
            _tr.append(_productName);

            tbody.append(_tr);
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

    table.html(tbody);
    trader.append(table);

    var tradeSubheading = $('<h5>Trade</h5>');
    trader.append(tradeSubheading);

    table = $('<table class="u-full-width trader-table trades"></table>');
    tbody = $('<tbody></tbody>');
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = traderInfo.willTrade[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var tradeInfo = _step3.value;

            // product, productMultipack, price, priceMultipack
            var _tr2 = $('<tr></tr>');

            var product = $('<td class="product-price">\n            ' + tradeInfo.productMultipack + ' x ' + tradeInfo.product + '\n        </td>');
            _tr2.append(product);
            var price = $('<td class="product-name">\n            ' + tradeInfo.priceMultipack + ' x ' + tradeInfo.price + '\n        </td>');
            _tr2.append(price);

            tbody.append(_tr2);
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

    table.html(tbody);
    trader.append(table);

    traders.append(trader);
}

/**
 * Load data about each trader into the trading interface.
 */
function loadTraders() {
    "use strict";

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = g.player.location.traders[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var trader = _step4.value;

            addTrader(trader);
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
}

/**
 * Load the data about the current location into the trading interface.
 */
function loadTrading() {
    "use strict";

    var location = g.player.location.name;
    var html = '<span onclick="exitTrading();">[<]</span> Trade: ' + location;
    $(".trading-title").html(html);
    // Todo: Load in actual traders.
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
        $("#main-content").fadeIn(500);
    });
}

//# sourceMappingURL=utilities-compiled.js.map