"use strict";

var DEFAULT_LEDGER_ITEMS = ["This is your ledger. Your story as you travel through the Tunnels will\nbe recorded here."];

var DEFAULT_ITEMS = [new Item("Rusted Blunderbuss"), new Item("Penny Farthing"), new Item("Mysterious Noise")];

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
var HONEST_PETE = new Trader("Honest Pete", "Pete's Perfectly Legal Goods", "Shh, don't speak so loud... don't want to attract any\n    <em>unwanted attention</em> now, do we? Let's see\n    if we can't fix you up with something special - for a bargain price.",

// Buy:
[{
    product: new Item("Chamois Leather Cloth"),
    price: 43200,
    quantityLeft: 3,
    multipack: 5
}, {
    product: new Item("Genuine Goat's Antler"),
    price: 690,
    quantityLeft: 1,
    multipack: 1
}, {
    "product": new Item("Whispered Hint", [new GameOption("Use Whispered Hint", function () {
        g.player.removeItemWithName("Whispered Hint");
        useHint();
        updateDisplayNoAnimate();
    })]),
    price: 1000,
    quantityLeft: 3,
    multipack: 1
}],

// Sell:
[{
    product: new Item("Rusted Blunderbuss"),
    multipack: 1,
    price: 330
}, {
    product: new Item("Mysterious Noise"),
    multipack: 1,
    price: 288
}],

// Trade:
[{
    product: new Item("Forged Season Rail Ticket"),
    productMultipack: 1,
    price: new Item("Scrap of Arcane Knowledge"),
    priceMultipack: 5
}]);

var MR_BAKER = new Trader("Mr. Baker", "Mr. Baker's Electric Supply Co.", "Is your Wireless on the fritz? Does your Mechanized Mustard-Cutter just not\n     cut the mustard any more? Hurry on down to Mr. Baker's Electric Supply Co.,\n    and we'll whip those newfangled automatons into shape.",

// Buy:
[{
    product: new Item("Pieces of Scrap Metal"),
    price: 400,
    quantityLeft: 10,
    multipack: 15
}],

// Sell:
[],

// Trade:
[{
    price: new Item("Genuine Goat's Antler"),
    priceMultipack: 1,
    product: new Item("Induction Coil"),
    productMultipack: 1
}]);

var ENGLEBERT = new Trader("Englebert Humperdink", "Englebert's Private Supply", "Hmm? Oh, it's you-- speak quietly, they have ears everywhere.", [{
    product: new Item("Smuggler's Map", [], [new Quality("Knows about the smuggler's routes")], []),
    price: 2000,
    quantityLeft: 1,
    multipack: 1
}], [], [], function (g) {
    "use strict";

    return g.player.hasQualityWithName("Knows about Englebert");
}, function (g) {
    "use strict";

    return !g.player.hasQualityWithName("Knows about ");
});

var OUTSIDE_APARTMENT = new Location("A Bustling Alleyway", "Framed by dirty, squat buildings, this alley is home to some of the worst\n    company in all of the East Tunnel.", "It's not all bad, though: the Solstice markets are opening, and there are\n    always bargains to be had. Potentially, bargains of questionable legality -\n    but what the Invigilators don't know can't hurt them.", [new GameOption("Return to your lodgings", function () {
    g.player.moveLocation(STUDY);
    g.ledger.add("You shimmy up the drainpipe, managing to avoid\n                scraping yourself on the rough brick surface it's stuck to. One\n                day, you really should invest in a set of spiral stairs -- although\n                the Invigilators may have some thoughts on the matter.");
}), new GameOption("Walk north up Eastside", function () {
    "use strict";

    g.player.moveLocation(OUTSIDE_FACTORY);
    g.ledger.add("You stroll along Eastside to the Factory. The \n                street is busy, but nothing abnormal for a warm Solstice day in\n                the Tunnels.");
}), new GameOption("Fire your Blunderbuss", function () {
    "use strict";

    if (g.player.hasQualityWithName("tried to fire blunderbuss")) {
        g.ledger.add("You take aim into the sky and pull the cold metal trigger.\n                         The rusted mechanism clicks and the gunpowder, somehow\n                         kept dry, explodes in a brief dirty flame out of the muzzle.\n                         As the deafening blast fades from your ears, you think it\n                         might be an idea to disappear into the crowd.\n                         ");
        g.player.addQuality(new Quality("fired blunderbuss"));
        updateDisplayNoAnimate();
        return;
    }
    g.ledger.add("A firm hand grips your shoulder as you reach for your\n                    weapon. \"I wouldn't do that if I were you, laddie.\", a gruff\n                    voice mutters in your ear. You look around, startled, but\n                    they've disappeared into the crowd. Just as well, really.");
    g.player.addQuality(new Quality("tried to fire blunderbuss"));
}, function (g) {
    "use strict";

    return !g.player.hasQualityWithName("fired blunderbuss");
}), new GameOption("Walk down The Strip", function () {
    "use strict";

    g.player.moveLocation(THE_STRIP);
    g.ledger.write("You push past the crowds and reach The Strip,\n                the East Tunnel's excuse for a town centre.");
})], // Options
[] // Qualities
);

var STUDY = new Location("A Dismal Study", "Property in the Tunnels is all about one thing: \"Location, Location, \n     Location!\" That's why these rooms were so cheap.\n     Not that you're complaining, of course.", "A battered armchair sits in the\n     corner, crammed next to to a low dresser. Dimly lit by a gas lamp, the\n     shadows in the room flickers, forming haphazard shapes on the dirty walls.\n    ", [new GameOption("Relax in your study", function () {
    return g.ledger.add("You spend a few hours wallowing in the study's" + " frankly disgraceful messiness. It's the done thing, around" + " these parts -- or so you tell yourself.");
}), new GameOption("Read a book", function () {
    var location = g.player.location;
    g.ledger.add("It's rare that you get a chance to enjoy a good" + " book.  You get through a few chapters of dense" + " Ancient Greek text before you realise that" + " it's largely because of the lack of good" + " books down here.");
    var item = new Item("Scrap of Arcane Knowledge");
    var itemStack = new ItemStack(1, item);
    g.player.addItem(item);
    g.player.location.addQuality(new Quality("Has read book"));
    g.inventory.add(itemStack);
    removeOptionCardWithName("Read a book");
}, function (g) {
    return !g.player.location.hasQualityWithName("Has read book");
}), new GameOption("Roam the streets", function () {
    g.player.moveLocation(OUTSIDE_APARTMENT);
    g.ledger.add("You slip through your window and slide down the\ndrainpipe to the street outside. Never hurts to make an appearance, eh?");
}), new GameOption("Find something to eat", function () {
    var ledger = g.ledger;
    var location = g.player.location;
    if (!location.hasQualityWithName("Has Stale Bread")) {
        ledger.add("You scavenge for more food in your meagre\n                    kitchen, but you can't come up with anything resembling a \n                    meal.");
        return;
    }
    var itemStack = new ItemStack(3, new Item("Stale Breadcrumbs"));
    g.player.addItemStack(itemStack);
    g.inventory.add(itemStack, true);
    ledger.add("You find some bits of stale bread at the back of a" + " kitchen cupboard. Not particularly appetising, but" + " it'll have to do for now.");
    location.removeQualityWithName("Has Stale Bread");
})], [new Quality("Has Stale Bread")]);

var OUTSIDE_FACTORY = new Location("An Imposing Factory", "Ahead of you, a dark, rectangular silhouette of the Factory blocks out the \n    rough tunnel wall. The wrought-iron gates look resolutely locked.", "This particular Factory is responsible for two-thirds of the mining gear\n    used on official Expeditions, or so you hear. It's also responsible for the\n    thick clouds of smog that roll through the open window of your apartment \n    most mornings.", [new GameOption("Walk south down Eastside", function () {
    "use strict";

    g.player.moveLocation(OUTSIDE_APARTMENT);
    g.ledger.add("Moving away from the factory, you can see your\n                apartment through the clouds of smog. Street urchins brush past\n                you, darting towards their next target.");
}), new GameOption("Walk north-west towards the station", function () {
    g.player.moveLocation(EASTSIDE_STATION);
    g.ledger.add("You walk briskly west, and a squat, unassuming\n                railway station appears to your right.");
}), new GameOption("Walk west across the tracks", function () {
    "use strict";

    g.ledger.write("Walking across the bridge, a train rattles underneath," + " filled with the unwashed faces of miners and scraping on" + " the tracks as it slows to enter the station.");
    g.player.moveLocation(WEST_OF_TRACKS);
})], []);

var EASTSIDE_STATION = new Location("An Unassuming Station", "The underground Railway is serviced by dozens of stations just like this\n     one, signposted Eastside. All in the same, grimy condition.", "Most workers use the Railway for their daily commute, to reach the Outer \n     Tunnels. It's rumoured that some tunnel-dwellers have their own, hidden \n     ways of traveling between tunnels - but rumours being what they are, who\n     can tell?", [new GameOption("Buy a Single Ticket", function () {
    if (g.player.money < 500) {
        g.ledger.write("You spot an unassuming brass machine for \n                printing tickets. The only problem: you don't have the \n                cash for a single ticket, let alone some of the machine's more \n                extravagant offerings.");
        return;
    }
    g.ledger.write("You spot an unassuming brass machine for\n                printing tickets. With cash in hand you advance on the machine\n                and, with a bit of a kerfuffle, you coerce it into spitting out\n                a short Permit To Travel stub.");

    g.player.money -= 500;
    g.player.addItemStack(new ItemStack(1, new Item("Single Ticket")));
    updateDisplayNoAnimate();
}), new GameOption("Walk east to the Factory", function () {
    "use strict";

    g.ledger.write("As you walk away from the station, the factory's\n                silhouette looms out of the smog and mist ahead of you.");
    g.player.moveLocation(OUTSIDE_FACTORY);
}), new GameOption("Take a train to Northside", function () {
    "use strict";

    g.ledger.write("You hop on the train.");
    g.player.moveLocation(NORTHSIDE_STATION);
    g.player.removeItem("Single Ticket");
}, function (g) {
    "use strict";

    return g.player.hasItemWithName("Single Ticket", 1);
})], []);

var NORTHSIDE_STATION = new Location("Northside", "Northside is another place", "It's pretty rad", [new GameOption("Enter Trading", function () {
    "use strict";

    enterTrading();
    g.player.location.removeQualityWithName("Never traded");
}, function (g) {
    "use strict";

    return g.player.location.hasQualityWithName("Never traded");
}), new GameOption("Back to Eastside", function () {
    "use strict";

    g.player.moveLocation(EASTSIDE_STATION);
    g.player.removeItemWithName("Single Ticket");
}, function (g) {
    "use strict";

    return g.player.hasItemWithName("Single Ticket", 1);
})], [new Quality("Never traded")], [HONEST_PETE]);

var THE_STRIP = new Location("The Strip", "The Strip is the gathering-place for all activities commercial and strictly\n    above-board in the East Tunnel. The air is warm from body heat, and from a \n    nearby stove.", "Once a wide boulevard intended for automobiles, it's been usurped by a\n    throng of market stalls in various states of disarray. State buildings block\n    the view to the railway - although it's still audible over the noise of the\n    crowd.", [new GameOption("Walk up to Eastside", function () {
    "use strict";

    g.ledger.write("You move north, off the strip and into the grimy\nalleyway, half-hidden by a coal-seller's stall.");
    g.player.moveLocation(OUTSIDE_APARTMENT);
})], [], [MR_BAKER, HONEST_PETE]);

var WEST_OF_TRACKS = new Location("West of Tracks", "Here, the tunnel roof draws uncomfortably close overhead. The sheer wall, \n    stained dark, feels moist to the touch.", "Ahead, the Invigilators have set up a barrier ", [new GameOption("Walk across the bridge", function () {
    "use strict";

    g.ledger.write("You stroll across to the east side of the tracks, " + "hoping beyond hope that you don't cross with any Invigilators.");
    g.player.moveLocation(OUTSIDE_FACTORY);
})], [
    // Qualities
], [ENGLEBERT]);

var DEFAULT_LOCATION = STUDY;
var DEFAULT_MONEY = 1034;
var DEFAULT_HINTS = [function (g) {
    g.ledger.write("They say that, west of the tracks, a smuggler named Englebert is selling\n    his most prized possession. Look for the man with the smoky glasses and\n    overcoat.");
    g.player.addQuality(new Quality("Knows about Englebert"));
}];

//# sourceMappingURL=gameData-compiled.js.map