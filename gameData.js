const DEFAULT_LEDGER_ITEMS = [
    `This is your ledger. Your story as you travel through the Tunnels will
be recorded here.`
];


const DEFAULT_ITEMS = [
    new Item("Rusted Blunderbuss"),
    new Item("Penny Farthing"),
    new Item("Mysterious Noise")
];


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
const HONEST_PETE = new Trader(
    "Honest Pete",
    "Pete's Perfectly Legal Goods",
    `Shh, don't speak so loud... don't want to attract any
    <em>unwanted attention</em> now, do we? Let's see
    if we can't fix you up with something special - for a bargain price.`,

    // Buy:
    [
        {
            product: `Chamois Leather Cloth`,
            price: 43200,
            quantityLeft: 3,
            multipack: 5
        },
        {
            product: `Genuine Goat's Antler`,
            price: 690,
            quantityLeft: 1,
            multipack: 1,
        }
    ],

    // Sell:
    [
        {
            product: `Rusted Blunderbuss`,
            multipack: 1,
            price: 330
        },
        {
            product: `Mysterious Noise`,
            multipack: 1,
            price: 288,
        }
    ],

    // Trade:
    [
        {
            product: `Forged Season Rail Ticket`,
            productMultipack: 1,
            price: `Scrap of Arcane Knowledge`,
            priceMultipack: 5,
        }
    ]
);

const MR_BAKER = new Trader(
    "Mr. Baker",
    "Mr. Baker's Electric Supply Co.",
    `Is your Wireless on the fritz? Does your Mechanized Mustard-Cutter just not
     cut the mustard any more? Hurry on down to Mr. Baker's Electric Supply Co.,
    and we'll whip those newfangled automatons into shape.`,

    // Buy:
    [
        {
            product: `Pieces of Scrap Metal`,
            price: 400,
            quantityLeft: 10,
            multipack: 15
        }
    ],

    // Sell:
    [],

    // Trade:
    []
);


const OUTSIDE_APARTMENT = new Location(
    "A Bustling Alleyway",
    `Framed by dirty, squat buildings, this alley is home to some of the worst
    company in all of the East Tunnel.`,
    `It's not all bad, though: the Solstice markets are opening, and there are
    always bargains to be had. Potentially, bargains of questionable legality -
    but what the Invigilators don't know can't hurt them.`,
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
            "Walk north up Eastside",
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
        ),
        new GameOption(
            "Walk down The Strip",
            () => {
                "use strict";
                g.player.moveLocation(THE_STRIP);
                g.ledger.write(`You push past the crowds and reach The Strip,
                the East Tunnel's excuse for a town centre.`)
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

    `A battered armchair sits in the
     corner, crammed next to to a low dresser. Dimly lit by a gas lamp, the
     shadows in the room flickers, forming haphazard shapes on the dirty walls.
    `,
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
                g.player.moveLocation(OUTSIDE_APARTMENT);
                g.ledger.add(`You slip through your window and slide down the
drainpipe to the street outside. Never hurts to make an appearance, eh?`);
            }
        ),
        new GameOption(
            "Find something to eat", () => {
                let ledger = g.ledger;
                let location = g.player.location;
                if (!location.hasQualityWithName("Has Stale Bread")) {
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
                location.removeQualityWithName("Has Stale Bread");
            }
        )
    ],
    [
        new Quality("Has Stale Bread")
    ]
);

const OUTSIDE_FACTORY = new Location(
    "An Imposing Factory",
    `Ahead of you, a dark, rectangular silhouette of the Factory blocks out the 
    rough tunnel wall. The wrought-iron gates look resolutely locked.`,

    `This particular Factory is responsible for two-thirds of the mining gear
    used on official Expeditions, or so you hear. It's also responsible for the
    thick clouds of smog that roll through the open window of your apartment 
    most mornings.`,

    [
        new GameOption(
            "Walk south down Eastside",
            () => {
                "use strict";
                g.player.moveLocation(OUTSIDE_APARTMENT);
                g.ledger.add(`Moving away from the factory, you can see your
                apartment through the clouds of smog. Street urchins brush past
                you, darting towards their next target.`)
            }
        ),
        new GameOption(
            "Walk west towards the station",
            () => {
                g.player.moveLocation(STATION);
                g.ledger.add(`You walk briskly west, and a squat, unassuming
                railway station appears to your right.`)
            }
        )
    ], []
);

const STATION = new Location(
    "An Unassuming Station",
    `The underground Railway is serviced by dozens of stations just like this
     one, signposted Eastside. All in the same, grimy condition.`,
    `Most workers use the Railway for their daily commute, to reach the Outer 
     Tunnels. It's rumoured that some tunnel-dwellers have their own, hidden 
     ways of traveling between tunnels - but rumours being what they are, who
     can tell?`,
    [
        new GameOption(
            "Buy a Single Ticket", () => {
                g.ledger.write(`You spot an unassuming brass machine for 
                printing tickets. The only problem: you don't have the 
                cash for a single ticket, let alone some of the machine's more 
                extravagant offerings.`)
            }
        ),
        new GameOption(
            "Walk east to the Factory", () => {
                "use strict";
                g.ledger.write(`As you walk away from the station, the factory's
                silhouette looms out of the smog and mist ahead of you.`);
                g.player.moveLocation(OUTSIDE_FACTORY);
            }
        )
    ], []
);

const THE_STRIP = new Location(
    "The Strip",
    `The Strip is the gathering-place for all activities commercial and strictly
    above-board in the East Tunnel. The air is warm from body heat, and from a 
    nearby stove.`,
    `Once a wide boulevard intended for automobiles, it's been usurped by a
    throng of market stalls in various states of disarray. State buildings block
    the view to the railway - although it's still audible over the noise of the
    crowd.`,
    [
        new GameOption(
            "Walk up to Eastside",
            () => {
                "use strict";
                g.ledger.write(`You move north, off the strip and into the grimy
alleyway, half-hidden by a coal-seller's stall.`);
                g.player.moveLocation(OUTSIDE_APARTMENT);
            }
        ),
        new GameOption(
            "Trade in the market",
            () => {
                g.ledger.write(`You start peeling your eyes for a bargain.
                The markets can yield some rather curious and rare items...
                for a price, of course.`);
                enterTrading();
            }
        )
    ],
    [],
    [MR_BAKER, HONEST_PETE]
);



const DEFAULT_LOCATION = THE_STRIP;
const DEFAULT_MONEY = 80377;