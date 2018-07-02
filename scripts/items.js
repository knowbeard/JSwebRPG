let Items = {

    // Consumables increase a stat, potions and books (hp and xp)

    consumables: {
        
        // Potions (recover hp) - 4 kinds
        
        smallPotion: {
            name: "Small Potion", 
            type: "Consumable", 
            cost: 10, 
            desc: "Recovers a little hp",
            stats: [
                {
                    reference: 'hp',
                    modifier: "maxHp",
                    val: .125
                }
            ]
        },
        mediumPotion: {
            name: "Medium Potion", 
            type: "Consumable", 
            cost: 20, 
            desc: "Recovers some hp", 
            stats: [
                {
                    reference: 'hp',
                    modifier: "maxHp",
                    val: .25
                }
            ]
        },
        largePotion: {
            name: "Large Potion", 
            type: "Consumable", 
            cost: 40, 
            desc: "Recovers a lot of hp",
            stats: [
                {
                    reference: 'hp',
                    modifier: "maxHp",
                    val: .5
                }
            ]
        },
        revivePotion: {
            name: "Revive Potion", 
            type: "Consumable", 
            cost: 80, 
            desc: "Recovers all hp",
            stats: [
                {
                    reference: 'hp',
                    modifier: "maxHp",
                    val: 1
                }
            ]
        },

        // Books (gain xp) - 4 kinds

        burntBook: {
            name: "Burnt Book", 
            type: "Consumable", 
            cost: 15, 
            desc: "Few parts are readable",
            stats: [
                {
                    reference: 'xp',
                    modifier: "level",
                    val: 1.25
                }
            ]
        },
        rippedBook: {
            name: "Ripped Book", 
            type: "Consumable", 
            cost: 30, 
            desc: "Chapters have been torn out",
            stats: [
                {
                    reference: 'xp',
                    modifier: "level",
                    val: 2.5
                }
            ]
        },
        dustyBook: {
            name: "Dusty Book", 
            type: "Consumable", 
            cost: 60, 
            desc: "A wealth of knowledge",
            stats: [
                {
                    reference: 'xp',
                    modifier: "level",
                    val: 5
                }
            ]
        },
        ancientBook: {
            name: "Ancient Book", 
            type: "Consumable", 
            cost: 120, 
            desc: "You will learn new skills from reading",
            stats: [
                {
                    reference: 'xp',
                    modifier: "level",
                    val: 10
                }
            ]
        },

    },
    weapons: {
        rustySword: {
            name: "Rusty Sword",
            type: "Gear",
            cost: 0,
            desc: "Not very sharp",
            stats: [
                {
                    name: 'attack',
                    val: 1
                },
                {
                    name: 'might',
                    val: 1
                }
            ]
        },
        ironSword: {
            name: "Iron Sword",
            type: "Gear",
            cost: 50,
            desc: "A good weight but not ideal",
            stats: [
                {
                    name: 'attack',
                    val: 1.1
                },
                {
                    name: 'might',
                    val: 1.1
                }
            ]
        }
    },
    armour: {
        rustyArmour: {
            name: "Rusty Armour",
            type: "Gear",
            cost: 0,
            desc: "Seems fairly brittle",
            stats: [
                {
                    name: 'defense',
                    val: 1
                },
                {
                    name: 'evasion',
                    val: 1
                }
            ]   
        },
        ironArmour: {
            name: "Iron Armour",
            type: "Gear",
            cost: 50,
            desc: "Well worn",
            stats: [
                {
                    name: 'defense',
                    val: 1.1
                },
                {
                    name: 'evasion',
                    val: 1.1
                }
            ]   
        }
    },
    trinkets: {
        homelyRock: {
            name: "Homely Rock",
            type: "Gear",
            cost: 0,
            desc: "Brought from your homeland",
            stats: [
                {
                    name: 'will',
                    val: 1
                },
                {
                    name: 'power',
                    val: 1
                }
            ]   
        },
        bronzeAmulet: {
            name: "Bronze Amulet",
            type: "Gear",
            cost: 50,
            desc: "You sense dull magics",
            stats: [
                {
                    name: 'will',
                    val: 1.1
                },
                {
                    name: 'power',
                    val: 1.1
                }
            ]   
        }
    }

}

let takeConsumable = function(consumable){
    Player.stats[consumable.reference]+= Player.stats[consumable.modifier] * consumable.incr
    Player.items.splice(i, 1)
}

let equipWeapon = function(weapon){

    Player.gear.weapon = weapon


    console.log('WEAPON EQUIPPED: ' + weapon.name)
    console.log('Player Object: ')
    console.log(Player.stats)
}

/*
takePotion(Items.potions.rustySword)
equipWeapon(items.weapons.broadSword)
*/