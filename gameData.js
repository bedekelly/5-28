const DEFAULT_LEDGER_ITEMS = [
    `This is your ledger. Your story as you travel through the Tunnels will
be recorded here.`
];


const DEFAULT_ITEMS = [
    new Item("Rusted Blunderbuss"),
    new Item("Penny Farthing"),
    new Item("Mysterious Noise")
];


const BUSY_STREET = new Location(
    "A Bustling Alleyway",
    `Framed by dirty, squat buildings, this alley is home to some of the worst
    company in all of the East Tunnel.`,
    [
        new GameOption(
            "Return to your lodgings",
            () => {
                g.player.moveLocation(STUDY);
                g.ledger.add(`You shimmy up the drainpipe, managing to avoid
                scraping yourself on the rough brick surface it's stuck to. One
                day, you really should invest in a set of spiral stairs -- although
                the Invigilators may have some thoughts on the matter.`);
            }
        ),
        new GameOption(
            "Walk north up Eastside Street",
            () => {
                "use strict";
                g.player.moveLocation(OUTSIDE_FACTORY);
                g.ledger.add(`You stroll along Eastside to the Factory. The 
                street is busy, but nothing abnormal for a warm Solstice day in
                the Tunnels.`)
            }
        ),
        new GameOption(
            "Fire your Blunderbuss",
            () => {
                "use strict";
                if (g.player.hasQualityWithName("tried to fire blunderbuss")) {
                    g.ledger.add(`You think, perhaps, this might not be the 
                    best course of action. At least, not where the Invigilators
                    could see you.`);
                    return;
                }
                g.ledger.add(
                    `A firm hand grips your shoulder as you reach for your
                    weapon. "I wouldn't do that if I were you, laddie.", a gruff
                    voice mutters in your ear. You look around, startled, but
                    they've disappeared into the crowd. Just as well, really.`
                );
                g.player.addQuality(new Quality("tried to fire blunderbuss"));
            }
        )
    ],  // Options
    []  // Qualities
);

const STUDY = new Location(
    "A Dismal Study",
    `Property in the Tunnels is all about one thing: "Location, Location, 
     Location!" That's why these rooms were so cheap.
     Not that you're complaining, of course.`,
    [
        new GameOption(
            "Relax in your study",
            () => g.ledger.add("You spend a few hours wallowing in the study's"
                + " frankly disgraceful messiness. It's the done thing, around"
                + " these parts -- or so you tell yourself.")
        ),
        new GameOption(
            "Read a book",
            () => g.ledger.add("It's rare that you get a chance to enjoy a good"
                + " book.  You get through a few chapters of dense"
                + " Ancient Greek text before you realise that"
                + " it's largely because of the lack of good"
                + " books down here.")
        ),
        new GameOption(
            "Roam the streets", () => {
                g.player.moveLocation(BUSY_STREET);
                g.ledger.add(`You slip through your window and slide down the
drainpipe to the street outside. Never hurts to make an appearance, eh?`);
            }
        ),
        new GameOption(
            "Find something to eat", () => {
                let ledger = g.ledger;
                let location = g.player.location;
                if (!location.hasQualityWithName("stale bread")) {
                    ledger.add(`You scavenge for more food in your meagre
                    kitchen, but you can't come up with anything resembling a 
                    meal.`);
                    return;
                }
                g.player.addItemStack(
                    new ItemStack(3, new Item("Stale Breadcrumbs"))
                );
                ledger.add("You find some bits of stale bread at the back of a"
                    + " kitchen cupboard. Not particularly appetising, but"
                    + " it'll have to do for now.");
                location.removeQualityWithName("stale bread");
            }
        )
    ],
    [
        new Quality("stale bread")
    ]
);

const OUTSIDE_FACTORY = new Location(
    "An Imposing Factory",
    `The factory is responsible for the smog dirtying your window. And much of
    the production of low-end mining gear, or so you hear.`,
    [
        new GameOption(
            "Walk south down Eastside Street",
            () => {
                "use strict";
                g.player.moveLocation(BUSY_STREET);
                g.ledger.add(`Moving away from the factory, you can see your
                apartment through the clouds of smog. Street urchins brush past
                you, darting towards their next target.`)
            }
        )
    ], []
);


const DEFAULT_LOCATION = STUDY;