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
    `<html>
     Shh, don't speak so loud... don't want to attract any
     <em>unwanted attention</em> now, do we? Let's see if we can't fix you
     up with something special - for a bargain price, of course!
     </html>`,

    // Buy:
    [
        {
            product: new Item(`Chamois Leather Cloth`),
            price: 43200,
            quantityLeft: 3,
            multipack: 5
        },
        {
            product: new Item(`Genuine Goat's Antler`),
            price: 690,
            quantityLeft: 1,
            multipack: 1,
        },
        {
            "product": new Item(
                "Whispered Hint",
                [
                    new GameOption("Use Whispered Hint", useHint)
                ]
            ),
            price: 1000,
            quantityLeft: 3,
            multipack: 1
        }
    ],

    // Sell:
    [
        {
            product: new Item(`Rusted Blunderbuss`),
            multipack: 1,
            price: 330
        },
        {
            product: new Item(`Mysterious Noise`),
            multipack: 1,
            price: 288,
        }
    ],

    // Trade:
    [
        {
            product: new Item(`Forged Season Rail Ticket`),
            productMultipack: 1,
            price: new Item(`Scrap of Arcane Knowledge`),
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
            product: new Item(`Pieces of Scrap Metal`),
            price: 400,
            quantityLeft: 10,
            multipack: 15
        }
    ],

    // Sell:
    [],

    // Trade:
    [
        {
            price: new Item(`Genuine Goat's Antler`),
            priceMultipack: 1,
            product: new Item(`Induction Coil`),
            productMultipack: 1
        }
    ]
);


const ENGLEBERT = new Trader(
    "Englebert Humperdink",
    "Englebert's Private Supply",
    `We never met, alright? Just take the map and go. I've got no use for it
     any more.`,
    [
        {
            product: new Item(`Smuggler's Map`, [], () => {
                g.ledger.write(
                    "As you inspect the map, you see a scrawled circle in " +
                    "graphite around what you'd previously assumed to be " +
                    "a sheer tunnel wall. You make a point to investigate."
                );
                g.player.addQuality(
                    new Quality("Knows about the smugglers' routes")
                );
            }),
            price: 2000,
            quantityLeft: 1,
            multipack: 1
        }
    ],
    [],
    [],
    (g) => {
        "use strict";
        return g.player.hasQualityWithName("Knows about Englebert");
    },
    (g) => {
        "use strict";
        return !g.player.hasQualityWithName("Knows about the smugglers' routes")
    }
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
            "Walk up Eastside",
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
                    g.ledger.add(
                        `You take aim into the sky and pull the cold metal trigger.
                         The rusted mechanism clicks and the gunpowder, somehow
                         kept dry, explodes in a brief dirty flame out of the muzzle.
                         As the deafening blast fades from your ears, you think it
                         might be an idea to disappear into the crowd.
                         `);
                    g.player.addQuality(new Quality("fired blunderbuss"));
                    updateDisplayNoAnimate();
                    return;
                }
                g.ledger.add(
                    `A firm hand grips your shoulder as you reach for your
                    weapon. "I wouldn't do that if I were you, laddie.", a gruff
                    voice mutters in your ear. You look around, startled, but
                    they've disappeared into the crowd. Just as well, really.`
                );
                g.player.addQuality(new Quality("tried to fire blunderbuss"));
            }, (g) => {
                "use strict";
                return !g.player.hasQualityWithName("fired blunderbuss")
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
            () => {
                let location = g.player.location;
                g.ledger.add("It's rare that you get a chance to enjoy a good"
                    + " book.  You get through a few chapters of dense"
                    + " Ancient Greek text before you realise that"
                    + " it's largely because of the lack of good"
                    + " books down here.");
                let item = new Item("Scrap of Arcane Knowledge");
                let itemStack = new ItemStack(1, item);
                g.player.addItem(item);
                g.player.location.addQuality(
                    new Quality("Has read book")
                );
                g.inventory.add(itemStack);
                removeOptionCardWithName("Read a book");

            },
            (g) => {
                return !g.player.location.hasQualityWithName("Has read book")
            }
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
                if (!location.hasQualityWithName("Has stale bread")) {
                    ledger.add(`You scavenge for more food in your meagre
                    kitchen, but you can't come up with anything resembling a 
                    meal.`);
                    return;
                }
                let itemStack = new ItemStack(3, new Item("Stale Breadcrumbs"));
                g.player.addItemStack(
                    itemStack
                );
                g.inventory.add(itemStack, true);
                ledger.add(
                    `You find some bits of stale bread at the back of a kitchen
                     cupboard. Not particularly appetising, but it'll have to 
                     do for now.`
                );
                location.removeQualityWithName("Has stale bread");
            }
        )
    ],
    [
        new Quality("Has stale bread")
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
            "Walk down Eastside",
            () => {
                "use strict";
                g.player.moveLocation(OUTSIDE_APARTMENT);
                g.ledger.add(`Moving away from the factory, you can see your
                apartment through the clouds of smog. Street urchins brush past
                you, darting towards their next target.`)
            }
        ),
        new GameOption(
            "Walk across the tracks",
            () => {
                "use strict";
                g.ledger.write(
                    `Walking across the bridge, a train rattles underneath, 
                     filled with the unwashed faces of miners and scraping on
                     the tracks as it slows to enter the station.`
                );
                g.player.moveLocation(WEST_OF_TRACKS);
            }
        ),
        new GameOption(
            "Walk towards the station",
            () => {
                g.player.moveLocation(EASTSIDE_STATION);
                g.ledger.add(`You walk briskly west, and a squat, unassuming
                railway station appears to your right.`)
            }
        ),
    ], []
);


const EASTSIDE_STATION = new Location(
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
                if (g.player.money < 500) {
                    g.ledger.write(`You spot an unassuming brass machine for 
                printing tickets. The only problem: you don't have the 
                cash for a single ticket, let alone some of the machine's more 
                extravagant offerings.`);
                    return;
                }
                g.ledger.write(`You spot an unassuming brass machine for
                printing tickets. With cash in hand you advance on the machine
                and, with a bit of a kerfuffle, you coerce it into spitting out
                a short Permit To Travel stub.`);

                g.player.money -= 500;
                g.player.addItemStack(
                    new ItemStack(1, new Item("Single Ticket"))
                );
                updateDisplayNoAnimate();
            }
        ),
        new GameOption(
            "Walk to the Factory", () => {
                "use strict";
                g.ledger.write(`As you walk away from the station, the factory's
                silhouette looms out of the smog and mist ahead of you.`);
                g.player.moveLocation(OUTSIDE_FACTORY);
            }
        ),
        new GameOption(
            "Take a train to Northside", () => {
                "use strict";
                g.player.removeItemWithName("Single Ticket");
                g.ledger.write(`A clanking, screeching train pulls into the 
                station. An mixture of sweat and coal dust hits your lungs as
                you board, and the train lurches to a start.`);
                g.scheduler.after(3, "setTrain", () => {
                    g.ledger.write(`After what seems like hours, stifled in the 
                    noisy metal compartment, the train jolts to a halt. You
                    step outside into Northside.`);
                    g.player.moveLocation(NORTHSIDE_STATION);
                });
            },
            (g) => {
                "use strict";
                return g.player.hasItemWithName("Single Ticket", 1);
            }
        )
    ], []
);


const NORTHSIDE_STATION = new Location(
    "Northside",
    `Northside's station puts Eastside's offering to shame: despite being
     itself rather shabby, it sports a brand-new ticket office. Clearly the
     Invigilators have decided to concern themselves with Good Customer
     Service.`,
    `Around you, workers push their way through to the trains, coughing loudly
    and brandishing grubby ticket stubs for the conductors to examine.`,
    [
        new GameOption(
            "Take the train to Eastside", () => {
                "use strict";
                g.player.removeItemWithName("Single Ticket");
                g.ledger.write(
                    `Pushing through the throngs of workers coming back from a
                     hard day's labour, you manage to squeeze onto the next
                     train towards Eastside.`
                );
                g.scheduler.after(3, "setTrain", () => {
                    g.ledger.write(
                        `It's a comparatively short trip to Eastside, although
                         the lack of seats in the hot metal carriage makes for
                         an uncomfortable ride. After some time, you reach the
                         station at Eastside.`
                    );
                    g.player.moveLocation(EASTSIDE_STATION);
                });
            },
            (g) => {
                "use strict";
                return g.player.hasItemWithName("Single Ticket", 1);
            }
        ),
        new GameOption(
            "Buy a Single Ticket", () => {
                if (g.player.money < 500) {
                    g.ledger.write(
                        `Looks like you don't have the money for a single 
                         ticket.`
                    );
                    return;
                }
                g.ledger.write(
                    `One brief, unmemorable but undeniably
                     pleasant exchange with the lady at the ticket office and
                     you have a single ticket stub: valid for any train journey
                     in the Tunnels.`
                );

                g.player.money -= 500;
                g.player.addItemStack(
                    new ItemStack(1, new Item("Single Ticket"))
                );
                updateDisplayNoAnimate();
            }
        ),
    ],
    [
        // Qualities
    ],
    [
        // Traders
    ]
);


const THE_STRIP = new Location(
    "The Strip",
    `The Strip is the gathering-place for all activities commercial and
     strictly above-board in the East Tunnel. The air is warm from body heat,
     and from a nearby stove.`,
    `Once a wide boulevard intended for automobiles, it's been usurped by a
     throng of market stalls in various states of disarray. State buildings
     block the view to the railway - although it's still audible over the noise
     of the crowd.`,
    [
        new GameOption(
            "Walk up towards Eastside",
            () => {
                "use strict";
                g.ledger.write(
                    `You move north, off the strip and into the grimy alleyway,
                     half-hidden by a coal-seller's stall.`
                );
                g.player.moveLocation(OUTSIDE_APARTMENT);
            }
        )
    ],
    [],
    [MR_BAKER, HONEST_PETE]
);


const WEST_OF_TRACKS = new Location(
    "West of Tracks",
    `Behind you, the trains clank and hiss noisily as they ferry workers,
     commuters and the occasional Invigilator around the Tunnels.`,
    `Here, the roof of the cave grows close above your head: close enough to
     touch, albeit for an unusually tall person. There's very little wind here,
     and the air smells of damp and moss.`,
    [
        new GameOption("Walk across the tracks", () => {
            "use strict";
            g.ledger.write(
                `You stroll across the tracks towards the crowds and the main 
                 bulk of Eastside.`
            );
            g.player.moveLocation(OUTSIDE_FACTORY);
        })
    ],
    [
        // Qualities
    ],
    [
        ENGLEBERT
    ]
);


const DEFAULT_LOCATION = STUDY;
const DEFAULT_MONEY = 3134;
const DEFAULT_HINTS = [
    (g) => {
        g.ledger.write(
            `They say that, west of the tracks, a smuggler named Englebert is
             selling his most prized possession. Look for the man with the
             smoky glasses and overcoat.`
        );
        g.player.addQuality(new Quality("Knows about Englebert"))
    }
];