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
    product: "Chamois Leather Cloth",
    price: 43200,
    quantityLeft: 3,
    multipack: 5
}, {
    product: "Genuine Goat's Antler",
    price: 690,
    quantityLeft: 1,
    multipack: 1
}],

// Sell:
[{
    product: "Rusted Blunderbuss",
    multipack: 1,
    price: 330
}, {
    product: "Mysterious Noise",
    multipack: 1,
    price: 288
}],

// Trade:
[{
    product: "Forged Season Rail Ticket",
    productMultipack: 1,
    price: "Scrap of Arcane Knowledge",
    priceMultipack: 5
}]);

var MR_BAKER = new Trader("Mr. Baker", "Mr. Baker's Electric Supply Co.", "Is your Wireless on the fritz? Does your Mechanized Mustard-Cutter just not\n     cut the mustard any more? Hurry on down to Mr. Baker's Electric Supply Co.,\n    and we'll whip those newfangled automatons into shape.",

// Buy:
[{
    product: "Pieces of Scrap Metal",
    price: 400,
    quantityLeft: 10,
    multipack: 15
}],

// Sell:
[],

// Trade:
[]);

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
        g.ledger.add("You think, perhaps, this might not be the \n                    best course of action. At least, not where the Invigilators\n                    could see you.");
        return;
    }
    g.ledger.add("A firm hand grips your shoulder as you reach for your\n                    weapon. \"I wouldn't do that if I were you, laddie.\", a gruff\n                    voice mutters in your ear. You look around, startled, but\n                    they've disappeared into the crowd. Just as well, really.");
    g.player.addQuality(new Quality("tried to fire blunderbuss"));
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
    return g.ledger.add("It's rare that you get a chance to enjoy a good" + " book.  You get through a few chapters of dense" + " Ancient Greek text before you realise that" + " it's largely because of the lack of good" + " books down here.");
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
    g.player.addItemStack(new ItemStack(3, new Item("Stale Breadcrumbs")));
    ledger.add("You find some bits of stale bread at the back of a" + " kitchen cupboard. Not particularly appetising, but" + " it'll have to do for now.");
    location.removeQualityWithName("Has Stale Bread");
})], [new Quality("Has Stale Bread")]);

var OUTSIDE_FACTORY = new Location("An Imposing Factory", "Ahead of you, a dark, rectangular silhouette of the Factory blocks out the \n    rough tunnel wall. The wrought-iron gates look resolutely locked.", "This particular Factory is responsible for two-thirds of the mining gear\n    used on official Expeditions, or so you hear. It's also responsible for the\n    thick clouds of smog that roll through the open window of your apartment \n    most mornings.", [new GameOption("Walk south down Eastside", function () {
    "use strict";

    g.player.moveLocation(OUTSIDE_APARTMENT);
    g.ledger.add("Moving away from the factory, you can see your\n                apartment through the clouds of smog. Street urchins brush past\n                you, darting towards their next target.");
}), new GameOption("Walk west towards the station", function () {
    g.player.moveLocation(STATION);
    g.ledger.add("You walk briskly west, and a squat, unassuming\n                railway station appears to your right.");
})], []);

var STATION = new Location("An Unassuming Station", "The underground Railway is serviced by dozens of stations just like this\n     one, signposted Eastside. All in the same, grimy condition.", "Most workers use the Railway for their daily commute, to reach the Outer \n     Tunnels. It's rumoured that some tunnel-dwellers have their own, hidden \n     ways of traveling between tunnels - but rumours being what they are, who\n     can tell?", [new GameOption("Buy a Single Ticket", function () {
    g.ledger.write("You spot an unassuming brass machine for \n                printing tickets. The only problem: you don't have the \n                cash for a single ticket, let alone some of the machine's more \n                extravagant offerings.");
}), new GameOption("Walk east to the Factory", function () {
    "use strict";

    g.ledger.write("As you walk away from the station, the factory's\n                silhouette looms out of the smog and mist ahead of you.");
    g.player.moveLocation(OUTSIDE_FACTORY);
})], []);

var THE_STRIP = new Location("The Strip", "The Strip is the gathering-place for all activities commercial and strictly\n    above-board in the East Tunnel. The air is warm from body heat, and from a \n    nearby stove.", "Once a wide boulevard intended for automobiles, it's been usurped by a\n    throng of market stalls in various states of disarray. State buildings block\n    the view to the railway - although it's still audible over the noise of the\n    crowd.", [new GameOption("Walk up to Eastside", function () {
    "use strict";

    g.ledger.write("You move north, off the strip and into the grimy\nalleyway, half-hidden by a coal-seller's stall.");
    g.player.moveLocation(OUTSIDE_APARTMENT);
}), new GameOption("Trade in the market", function () {
    g.ledger.write("You start peeling your eyes for a bargain.\n                The markets can yield some rather curious and rare items...\n                for a price, of course.");
    enterTrading();
})], [], [MR_BAKER, HONEST_PETE]);

var DEFAULT_LOCATION = THE_STRIP;
var DEFAULT_MONEY = 80377;

//# sourceMappingURL=gameData-compiled.js.map