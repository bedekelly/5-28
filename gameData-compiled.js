"use strict";

var DEFAULT_LEDGER_ITEMS = ["This is your ledger. Your story as you travel through the Tunnels will\nbe recorded here."];

var DEFAULT_ITEMS = [new Item("Rusted Blunderbuss"), new Item("Penny Farthing"), new Item("Mysterious Noise")];

var BUSY_STREET = new Location("A Bustling Alleyway", "Framed by dirty, squat buildings, this alley is home to some of the worst\n    company in all of the East Tunnel.", [new GameOption("Return to your lodgings", function () {
    g.player.moveLocation(STUDY);
    g.ledger.add("You shimmy up the drainpipe, managing to avoid\n                scraping yourself on the rough brick surface it's stuck to. One\n                day, you really should invest in a set of spiral stairs -- although\n                the Invigilators may have some thoughts on the matter.");
}), new GameOption("Walk north up Eastside Street", function () {
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
})], // Options
[] // Qualities
);

var STUDY = new Location("A Dismal Study", "Property in the Tunnels is all about one thing: \"Location, Location, \n     Location!\" That's why these rooms were so cheap.\n     Not that you're complaining, of course.", [new GameOption("Relax in your study", function () {
    return g.ledger.add("You spend a few hours wallowing in the study's" + " frankly disgraceful messiness. It's the done thing, around" + " these parts -- or so you tell yourself.");
}), new GameOption("Read a book", function () {
    return g.ledger.add("It's rare that you get a chance to enjoy a good" + " book.  You get through a few chapters of dense" + " Ancient Greek text before you realise that" + " it's largely because of the lack of good" + " books down here.");
}), new GameOption("Roam the streets", function () {
    g.player.moveLocation(BUSY_STREET);
    g.ledger.add("You slip through your window and slide down the\ndrainpipe to the street outside. Never hurts to make an appearance, eh?");
}), new GameOption("Find something to eat", function () {
    var ledger = g.ledger;
    var location = g.player.location;
    if (!location.hasQualityWithName("stale bread")) {
        ledger.add("You scavenge for more food in your meagre\n                    kitchen, but you can't come up with anything resembling a \n                    meal.");
        return;
    }
    g.player.addItemStack(new ItemStack(3, new Item("Stale Breadcrumbs")));
    ledger.add("You find some bits of stale bread at the back of a" + " kitchen cupboard. Not particularly appetising, but" + " it'll have to do for now.");
    location.removeQualityWithName("stale bread");
})], [new Quality("stale bread")]);

var OUTSIDE_FACTORY = new Location("An Imposing Factory", "The factory is responsible for the smog dirtying your window. And much of\n    the production of low-end mining gear, or so you hear.", [new GameOption("Walk south down Eastside Street", function () {
    "use strict";

    g.player.moveLocation(BUSY_STREET);
    g.ledger.add("Moving away from the factory, you can see your\n                apartment through the clouds of smog. Street urchins brush past\n                you, darting towards their next target.");
})], []);

var DEFAULT_LOCATION = STUDY;

//# sourceMappingURL=gameData-compiled.js.map