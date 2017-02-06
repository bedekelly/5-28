/**
 * Return a formatted number for inventory/shop use.
 * This is the worst code I've ever seen and I didn't write it.
 * I have absolutely no idea how it works. I just sort of replaced some vars
 * with lets and prayed to the various gods until it worked.
 */
function numberToString(n) {

    function triplets(n){let c='',m=0;
        if (100<=n) {m=Math.floor(n/100);c+=triplets(m)+' Hundred';n-=m*100}
        n.toString().replace(/^[2-9](?=\d)/,function(a){
            c+=(m?'  and ':' ')+('Twenty,Thirty,Forty,Fifty,Sixty,Seventy,Eighty,Ninety'.split(',')[a-2]);n-=(+a)*10});
        if (n==0) return c;else if (c && n<10) c+='-';
        return c+' '+'One,Two,Three,Four,Five,Six,Seven,Eight,Nine,Ten,Eleven,Twelve,Thirteen,Fourteen,Fifteen,Sixteen,Seventeen,Eighteen,Nineteen'.split(',')[n-1];
    }

    function anyNumber(n){let lng,isS,chn='';
        let wds=',Thousand,Million,Thousand Million'.split(',');
        n.toString().replace(/(\d{1,3})(?=((\d\d\d)*)$)/g,function(a,b,c){
            lng=c.toString().length/3;
            let m = a.replace(/^0+/,'');
            isS=triplets(m);
            if (isS) chn+=((!lng) && m<100 && /Thousand$/.test(chn)?' and ':' ')+isS.replace(/- /g,'-')+' '+wds[lng];
        });
        return chn.replace(/\s+/g,' ');
    }

    return anyNumber(n);
}


/** Load the save state from LocalStorage or similar. */
function getSaveState() {
    return new Player("Bede", DEFAULT_LOCATION, DEFAULT_MONEY, DEFAULT_HINTS);
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


function removeOptionCardWithName(name, noAnimate) {
    "use strict";
    let optionCards = currentOptionCards();
    for (let x of optionCards) {
        if (x.innerHTML == name) {
            if (!noAnimate) {
                $(x).fadeOut(500, () => x.remove());
            } else x.remove();
            break;
        }
    }
}


/**
 * Updates the location information on-screen.
 */
function updateLocation() {
    "use strict";
    let location = g.player.location;
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


function divmod(x, y) {
    let div = Math.trunc(x/y);
    let rem = x % y;
    return [div, rem];
}


function priceFromPennies(n) {
    "use strict";
    let [pounds, pence] = divmod(n, 100);
    if (pounds && pence) {
        return numberToString(pounds) + " Pounds, " + numberToString(pence) + " Pence";
    } else if(pounds) {
        return numberToString(pounds) + " Pounds";
    } else if (pence) {
        return numberToString(pence) + " Pence";
    } else {
        return "Free of Charge or Obligation"
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
    g.ledger.write(
        `Looks like you don't have enough to buy the ${product.product.name}.`
    );
}


function failToSell(product) {
    "use strict";
    g.ledger.write(
        `Looks like you don't have the ${product.product.name} to sell.`
    )
}


function tryToBuy(saleInfo) {
    "use strict";
    if (g.player.hasMoney(saleInfo.price)) {
        g.player.removeMoney(saleInfo.price);
        let product = new ItemStack(
            saleInfo.multipack,
            saleInfo.product
        );
        g.ledger.write(
            `You buy ${product.toString()} for 
             ${priceFromPennies(saleInfo.price)}`
        );
        g.player.addItemStack(product);

    } else {
        failToBuy(saleInfo);
    }
}


function tryToSell(saleInfo) {
    "use strict";
    if (g.player.hasItemWithName(saleInfo.product.name, saleInfo.multipack)) {
        let product = new ItemStack(
            saleInfo.multipack, saleInfo.product
        );
        g.player.removeItemStack(product);
        g.player.addMoney(saleInfo.price);
        g.ledger.write(`You sell ${product.toString()} for
                        ${priceFromPennies(saleInfo.price)}`);
        g.inventory.updateAllNoAnimate();
    } else {
        failToSell(saleInfo);
    }
}


function failToTrade(tradeInfo) {
    "use strict";
    g.ledger.write(
        `Looks like you don't have the ${tradeInfo.price.name} to trade.`
    )
}


function tryToTrade(tradeInfo) {
    "use strict";
    let price = new ItemStack(
        tradeInfo.priceMultipack,
        tradeInfo.price
    );
    if (g.player.hasItemStack(price)) {
        let product = new ItemStack(
            tradeInfo.productMultipack,
            tradeInfo.product
        );
        g.player.removeItemStack(price);
        g.player.addItemStack(product);

        g.ledger.write(`You trade ${price.toString()} in exchange for ${product.toString()}`);

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
    let traders = $(".traders");
    let trader = $(`<li class="trader"></li>`);
    let name = $(`<h3 class="trader-name">${traderInfo.title}</h3>`);
    trader.append(name);

    let description = $(`<p class="trader-description"></p>`);
    description.html(`"${traderInfo.description}"`);
    trader.append(description);
    console.log(traderInfo);
    if (traderInfo.willSell.length !== 0) {
        let buySubheading = $(`<h5>Buy</h5>`);
        trader.append(buySubheading);

        let table = $(`<table class="u-full-width trader-table buy"></table>`);
        let tbody = $(`<tbody></tbody>`);
        for (let productToSell of traderInfo.willSell) {
            let tr = $(`<tr></tr>`);
            let productName = $(`<td class="product-name"></td>`);
            productName.text(`${productToSell.multipack} x ${productToSell.product.name}`);
            tr.append(productName);

            let button = $(`<td><a class="buy-button" href="#">-></a></td>`);
            button.click(() => {
                tryToBuy(productToSell);
            });
            tr.append(button);

            let productPrice = $(`<td class="product-price"></td>`);
            productPrice.text(priceFromPennies(productToSell.price));
            tr.append(productPrice);
            tbody.append(tr);
        }

        tbody.html();
        table.html(tbody);
        trader.append(table);
    }

    if (traderInfo.willBuy.length !== 0) {
        let sellSubheading = $(`<h5>Sell</h5>`);
        trader.append(sellSubheading);

        let table = $(`<table class="u-full-width trader-table sell"></table>`);
        let tbody = $(`<tbody></tbody>`);
        for (let productToBuy of traderInfo.willBuy) {
            let tr = $(`<tr></tr>`);

            let productPrice = $(`<td class="product-price"></td>`);
            productPrice.text(priceFromPennies(productToBuy.price));
            tr.append(productPrice);

            let button = $(`<td><a class="sell-button" href="#"><-</a></td>`);
            button.click(() => {
                tryToSell(productToBuy)
            });
            tr.append(button);

            let productName = $(`<td class="product-name"></td>`);
            productName.text(`${productToBuy.multipack} x ${productToBuy.product.name}`);
            tr.append(productName);

            tbody.append(tr);
        }

        table.html(tbody);
        trader.append(table);
    }

    if (traderInfo.willTrade.length !== 0) {
        let tradeSubheading = $(`<h5>Trade</h5>`);
        trader.append(tradeSubheading);

        let table = $(`<table class="u-full-width trader-table trades"></table>`);
        let tbody = $(`<tbody></tbody>`);
        for (let tradeInfo of traderInfo.willTrade) {
            let tr = $(`<tr></tr>`);

            let product = $(`<td class="product-price"></td>`);
            product.html(`${tradeInfo.productMultipack} x ${tradeInfo.product.name}`);
            tr.append(product);

            let button = $(`<td><a class="trade-button" href="#"><-></a></td>`);
            button.click(() => {
                tryToTrade(tradeInfo);
            });
            tr.append(button);

            let price = $(`<td class="product-name"></td>`);
            price.html(`${tradeInfo.priceMultipack} x ${tradeInfo.price.name}`);
            tr.append(price);

            tbody.append(tr);
        }

        table.html(tbody);
        trader.append(table);
    }

    traders.append(trader);
 }


/**
 * Load data about each trader into the trading interface.
 */
function loadTraders() {
    "use strict";
    let traders = $(".traders");
    traders.html("");
    for (let trader of g.player.location.traders) {
        if (trader.isVisible()) addTrader(trader);
    }
}


/**
 * Load the data about the current location into the trading interface.
 */
function loadTrading() {
    "use strict";
    let location = g.player.location.name;
    let backButton = `<span onclick="exitTrading();">Exit</span>`;
    let html = `${location} | ${backButton}`;
    $(".trading-title").html(html);
    loadTraders();
}


/**
 * Replace the main interface with the trading interface.
 */
function enterTrading() {
    $("#main-content").fadeOut(500, () => {
        loadTrading();
        $("#trading").fadeIn(500);
    });
}


/**
 * Replace the trading interface with the main interface.
 */
function exitTrading() {
    "use strict";
    $("#trading").fadeOut(500, () => {
        updateDisplayNoAnimate();
        $("#main-content").fadeIn(500);
    });
}


function randomPop(set) {
    "use strict";
    let array = Array.from(set);
    let randNo = Math.floor(Math.random() * array.length);
    let elem = array[randNo];
    set.delete(elem);
    return elem;
}


function useHint() {
    "use strict";
    let hint = randomPop(g.player.hints);
    if (hint) hint(g);
}