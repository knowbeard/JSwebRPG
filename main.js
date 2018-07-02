/*  stats: strength, stamina, spirit
    strength boosts attacks a lot and defence a little
    stamina boosts defence a lot and magic a little
    spirit boosts magic a lot and attack a little
*/

//require('scripts/items.js')

let inBattle = false
let inShop = false
let inItemMenu = false
let maxXp = false
let turn = 0
let log = ''
let shopItems = ['','','']
let shopCooldown = 0

let Difficulty = {
    easy: {
        enemyLevel: {
            min: 0.6,
            max: 1.2
        },
        dropRates: {
            xp: 4,
            gold: 2,
            gear: 1
        }
    },
    medium: {
        enemyLevel: {
            min: 0.9,
            max: 1.5
        },
        dropRates: {
            xp: 3.2,
            gold: 1.6,
            gear: 5
        }
    },
    hard: {
        enemyLevel: {
            min: 1.2,
            max: 1.8
        },
        dropRates: {
            xp: 2.8,
            gold: 1.4,
            gear: 10
        }
    }
}

let currentDifficulty = Difficulty.easy

let Items = {

    // Consumables increase a stat, potions and books (hp and xp)

    consumables: {
        
        // Potions (recover hp) - 4 kinds
        
        smallPotion: {
            name: 'Small Potion', 
            type: 'Consumable', 
            cost: 10, 
            desc: 'Recovers a little hp',
            stats: [
                {
                    reference: 'hp',
                    modifier: 'maxHp',
                    val: .125
                }
            ]
        },
        mediumPotion: {
            name: 'Medium Potion', 
            type: 'Consumable', 
            cost: 20, 
            desc: 'Recovers some hp', 
            stats: [
                {
                    reference: 'hp',
                    modifier: 'maxHp',
                    val: .25
                }
            ]
        },
        largePotion: {
            name: 'Large Potion', 
            type: 'Consumable', 
            cost: 40, 
            desc: 'Recovers a lot of hp',
            stats: [
                {
                    reference: 'hp',
                    modifier: 'maxHp',
                    val: .5
                }
            ]
        },
        revivePotion: {
            name: 'Revive Potion', 
            type: 'Consumable', 
            cost: 80, 
            desc: 'Recovers all hp',
            stats: [
                {
                    reference: 'hp',
                    modifier: 'maxHp',
                    val: 1
                }
            ]
        },

        // Books (gain xp) - 4 kinds

        burntBook: {
            name: 'Burnt Book', 
            type: 'Consumable', 
            cost: 15, 
            desc: 'Few parts are readable',
            stats: [
                {
                    reference: 'xp',
                    modifier: 'level',
                    val: 1.25
                }
            ]
        },
        rippedBook: {
            name: 'Ripped Book', 
            type: 'Consumable', 
            cost: 30, 
            desc: 'Chapters have been torn out',
            stats: [
                {
                    reference: 'xp',
                    modifier: 'level',
                    val: 2.5
                }
            ]
        },
        dustyBook: {
            name: 'Dusty Book', 
            type: 'Consumable', 
            cost: 60, 
            desc: 'A wealth of knowledge',
            stats: [
                {
                    reference: 'xp',
                    modifier: 'level',
                    val: 5
                }
            ]
        },
        ancientBook: {
            name: 'Ancient Book', 
            type: 'Consumable', 
            cost: 120, 
            desc: 'You will learn new skills from reading',
            stats: [
                {
                    reference: 'xp',
                    modifier: 'level',
                    val: 10
                }
            ]
        },

    },
    weapons: {
        rustySword: {
            name: 'Rusty Sword',
            type: 'Gear',
            cost: 0,
            desc: 'Not very sharp',
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
            name: 'Iron Sword',
            type: 'Gear',
            cost: 50,
            desc: 'A good weight but not ideal',
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
            name: 'Rusty Armour',
            type: 'Gear',
            cost: 0,
            desc: 'Seems fairly brittle',
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
            name: 'Iron Armour',
            type: 'Gear',
            cost: 50,
            desc: 'Well worn',
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
            name: 'Homely Rock',
            type: 'Gear',
            cost: 0,
            desc: 'Brought from your homeland',
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
            name: 'Bronze Amulet',
            type: 'Gear',
            cost: 50,
            desc: 'You sense dull magics',
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
    consumable.stats.forEach(stat => {
        Player.stats[stat.reference]+= Player.stats[stat.modifier] * stat.val
    })

    
}

let useItem = function(item){
    if (item.type === 'Consumable') {
        takeConsumable(item)
        refresh()
    }
    else {
        alert('not implemented')
        return
    }
    let i = Player.items.indexOf(item)
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


let Player = {
    stats: {
        level:1,
        stamina:1,
        strength:1,
        spirit:1,

        maxHp:5,
        hp:5,
        xp:0
    },
    gold: 0,
    state: 'Defense',
    items:[],
    gear: {
        armour: Items.armour.rustyArmour,
        weapon: Items.weapons.rustySword,
        trinket: Items.trinkets.homelyRock,
        gem: false
    }
}

Enemy={
    stats: {
        level:1,
        stamina:1,
        strength:1,
        spirit:1,

        maxHp:5,
        hp:5,
        xp:0
    },
    state: 'Defense',
    gear: {
        armour: false,
        weapon: false,
        trinket: false,
        gem: false
    }
}

Player.gear.armour = Items.armour.rustyArmour
Player.gear.weapon = Items.weapons.rustySword
Player.gear.trinket = Items.trinkets.homelyRock

Player.items = [Items.consumables.smallPotion, Items.consumables.mediumPotion, Items.consumables.largePotion, Items.consumables.revivePotion]

Enemy.gear.armour = Items.armour.rustyArmour
Enemy.gear.weapon = Items.weapons.rustySword
Enemy.gear.trinket = Items.trinkets.homelyRock

// console.log(Player.gear.weapon.stat)
// console.log(Player.gear.armour.stat)
// console.log(Player.gear.trinket.stat)

function enemyLevelUp(stat) {
    if (stat == 1) {
        Enemy.stats.stamina++
    }
    else if (stat == 2) {
        Enemy.stats.strength++
    }
    else if (stat == 3) {
        Enemy.stats.spirit++
    }
    Enemy.stats.level++
    Enemy.stats.maxHp = Enemy.stats.level*5
    Enemy.stats.hp = Enemy.stats.maxHp

}


function newEnemy(level) {
    Enemy = {
        stats: {
            level:1,
            stamina:1,
            strength:1,
            spirit:1,
    
            maxHp:5,
            hp:5,
            xp:0
        },
        state: 'Defense',
        gear: {
            armour: Items.armour.rustyArmour,
            weapon: Items.weapons.rustySword,
            trinket: Items.trinkets.homelyRock,
            gem: false
        }
    }
    let r = 0
    
    for (l = 1, len = level, text = ''; l < len; l++) {
        r = Math.floor((Math.random()*3)+1)
        enemyLevelUp(r)
    }
    Enemy.stats.attack = Enemy.stats.strength+(Enemy.stats.spirit/2)
    Enemy.stats.defense = Enemy.stats.stamina+(Enemy.stats.strength/2)
    Enemy.stats.will = Enemy.stats.spirit+(Enemy.stats.stamina/2)
}

function enemyTurn() {
    let total = Enemy.stats.stamina+Enemy.stats.strength+Enemy.stats.spirit
    let blockChance = Enemy.stats.stamina / total
    let attackChance = Enemy.stats.strength / total
    let magicChance = Enemy.stats.spirit / total
    
    let r = Math.random()

    if (r <= blockChance) {
        defend(Enemy)
    }
    else if (r <= blockChance+attackChance) {
        attack(Enemy, Player)
    }
    else {
        heal(Enemy)
    }
}

function win(person) {
    shopCooldown = 0
    if (person == Player) {
        log = 'You won'
        Player.stats.xp+=Enemy.stats.level*currentDifficulty.dropRates.xp
        Player.gold+=Enemy.stats.level*currentDifficulty.dropRates.gold
    }
    else if (person == Enemy) {
        log = 'You lost'
    }
    inBattle = false
    Player.stats.hp = Player.stats.maxHp
}

function heal(target) {
    if (inBattle == false) {
        refresh()
        return
    }
    target.stats.hp += target.stats.will*4/3
    turn++
    target.state = 'Healing'
    refresh()
    if (turn % 2 == 0) {
        enemyTurn()
    }

}

function defend(target) {
    if (inBattle === false) {
        refresh()
        return
    }
    turn++
    target.state = 'Defense'
    refresh()
    if (turn % 2 == 0) {
        enemyTurn()
    }

}

function attack(self, target) {
    let d = 0
    if (inBattle === false) {
        refresh()
        return
    }
    let critChance = 50
    if (target.state === 'Defense') {
        d = target.stats.defense * (Math.floor((Math.random() * (100+critChance) + critChance)))/100
        critChance/=2
    }
    if (target.state === 'Attack') {
        critChance*=2
    }
    if (target.state === 'Healing') {
        critchance = 50
    }
    let a = self.stats.attack*(Math.floor((Math.random() * (100+critChance) + critChance)))/100
    a -= d 
    if (a < 0) {
        a = 0
    }
    target.stats.hp-=a
    if (target.stats.hp <= 0) {
        target.stats.hp = 0
        win(self)
        refresh()
        return
    }
    self.state = 'Attack'
    turn++
    log = a + ' damage'
    refresh()
    if (turn % 2 == 0) {
        enemyTurn()
    }
}

function heavy(self, target) {
    let d = 0
    if (inBattle === false) {
        refresh()
        return
    }
    let critChance = 50
    if (target.state === 'Defense') {
        d = target.stats.defense * (Math.floor((Math.random() * (100+50) + 50)))/100
        critChance*=2
    }
    if (target.state === 'Attack') {
        critChance/=2
    }
    if (target.state === 'Healing') {
        critchance = 50
    }
    let a = self.stats.might*(Math.floor((Math.random() * (100+critChance) + critChance)))/100
    a -= d 
    if (a < 0) {
        a = 0
    }
    target.stats.hp-=a
    if (target.stats.hp <= 0) {
        target.stats.hp = 0
        win(self)
        refresh()
        return
    }
    self.state = 'Attack'
    turn++
    log = a + ' damage'
    refresh()
    if (turn % 2 == 0) {
        enemyTurn()
    }
}

function battle() {
    updateStats()
        
    inBattle = true
    inShop = false
    turn = 1

    let min = currentDifficulty.enemyLevel.min
    let max = currentDifficulty.enemyLevel.max

    let enemyLevel = Math.floor(Math.random() * ((Player.stats.level*max) - (Player.stats.level*min))) + (Player.stats.level*min)
    
    newEnemy(enemyLevel)
    refresh()
}

function levelUp(stat) {
    if (Player.stats.xp >= Player.stats.level*10) {
        Player.stats.xp-=Player.stats.level*10
        Player.stats.level++
        Player.stats.maxHp=Player.stats.level*5
        Player.stats.hp=Player.stats.maxHp
        log = 'You reached level '+Player.stats.level
        if (stat == 1) {
            Player.stats.stamina++
        }
        else if (stat == 2) {
            Player.stats.strength++
        }
        else if (stat == 3) {
            Player.stats.spirit++
        }
    } 
    else {
        log = 'You don`t have enough XP'
    }
    refresh()
}

function randomItem(type) {
    var keys = Object.keys(Items[type])
    return Items[type][keys[ keys.length * Math.random() << 0]]

}

// var randomProperty = function (obj) {
//     var keys = Object.keys(obj)
//     return obj[keys[ keys.length * Math.random() << 0]];
// };



function shop() {
    if (shopCooldown >= Player.stats.level) {
        log = 'Win a battle to refresh the shop'
        refresh()
        return
    }   
    inShop=true
    for (i in shopItems) {
        shopItems[i] = randomItem('consumables')
    }
    refresh()
    shopCooldown++

}

function buy(item) {
    inShop = false
    if (Player.items.length >= 10) {
        log = 'Item storage full'
        refresh()
        return
    }
    else {
        if (Player.gold >= shopItems[item].cost) {
            Player.items[Player.items.length] = shopItems[item]
            Player.gold -= shopItems[item].cost
            refresh()
        }
        else {
            log = 'Not enough gold'
            refresh()
            return
        }
    }
}

function showItems() {
    inItemMenu = inItemMenu ? false : true
    inShop = false
    refresh()

}

function xpRequired(level) {
    m = 10 //multiplier
    r = .1 //increase per level (10%)
    l = level
    o = -1 //offset (so you need 10 xp at lv 1, not not 11)
    
    xprequired = Math.trunc(m*Math.pow(1*(1 + r), l))-1

    return xprequired

}

function updateStats() {

    if (Player.stats.level >= xpRequired(Player.stats.level)) {
        maxXp = true
    }
    else {maxXp = false}

    Player.stats.hp = Math.trunc(Player.stats.hp*10)/10
    Player.stats.xp = Math.trunc(Player.stats.xp*10)/10
    Enemy.stats.hp = Math.trunc(Enemy.stats.hp*10)/10

    if (Player.stats.hp > Player.stats.maxHp) {Player.stats.hp = Player.stats.maxHp}
    if (Enemy.stats.hp > Enemy.stats.maxHp) {Enemy.stats.hp = Enemy.stats.maxHp}
   
    Player.stats.attack = Player.stats.strength+(Player.stats.spirit/2)
    Player.stats.might = Player.stats.strength+(Player.stats.stamina/2)
    Player.stats.defense = Player.stats.stamina+(Player.stats.strength/2)
    Player.stats.evasion = Player.stats.stamina+(Player.stats.spirit/2)
    Player.stats.will = Player.stats.spirit+(Player.stats.stamina/2)
    Player.stats.power = Player.stats.spirit+(Player.stats.strength/2)

    Player.gear.weapon.stats.forEach(stat => {
        Player.stats[stat.name] *= stat.val
    })

    Player.gear.armour.stats.forEach(stat => {
        Player.stats[stat.name] *= stat.val
    })

    Player.gear.trinket.stats.forEach(stat => {
        Player.stats[stat.name] *= stat.val
    })

    Enemy.stats.attack = Enemy.stats.strength+(Enemy.stats.spirit/2)
    Enemy.stats.might = Enemy.stats.strength+(Enemy.stats.stamina/2)
    Enemy.stats.defense = Enemy.stats.stamina+(Enemy.stats.strength/2)
    Enemy.stats.evasion = Enemy.stats.stamina+(Enemy.stats.spirit/2)
    Enemy.stats.will = Enemy.stats.spirit+(Enemy.stats.stamina/2)
    Enemy.stats.power = Enemy.stats.spirit+(Enemy.stats.strength/2)

    Player.info = 
        'Level:     '+Player.stats.level+'\n'+
        'Gold:      '+Player.gold+'\n'+
        'XP:        '+Player.stats.xp+'/'+xpRequired(Player.stats.level)+'\n'+
        'HP:        '+Player.stats.hp+'/'+Player.stats.maxHp+'\n\n'+
        'Stamina:   '+Player.stats.stamina+'\n'+
        'Strength:  '+Player.stats.strength+'\n'+
        'Spirit:    '+Player.stats.spirit+'\n'+
        'A/D/W /s:  '+Player.stats.attack+'/'+Player.stats.defense+'/'+Player.stats.will+' /'+Player.state
    Enemy.info = 
        'Turn '      +turn+'\n'+
        'Level:     '+Enemy.stats.level+'\n'+
        '\n'+
        'HP:        '+Enemy.stats.hp+'/'+Enemy.stats.maxHp+'\n\n'+
        'Stamina:   '+Enemy.stats.stamina+'\n'+
        'Strength:  '+Enemy.stats.strength+'\n'+
        'Spirit:    '+Enemy.stats.spirit+'\n'+
        'A/D/W /s:  '+Enemy.stats.attack+'/'+Enemy.stats.defense+'/'+Enemy.stats.will+' /'+Enemy.state
}

function printToScreen() {
    document.getElementById('log-message').innerText = log
    document.getElementById('player-info').innerText = Player.info
    document.getElementById('enemy-info').innerText = Enemy.info

    document.getElementById('shop-item0').innerText = shopItems[0].name + ' (' + shopItems[0].cost + ')'
    document.getElementById('shop-item1').innerText = shopItems[1].name + ' (' + shopItems[1].cost + ')'
    document.getElementById('shop-item2').innerText = shopItems[2].name + ' (' + shopItems[2].cost + ')'

    if (Player.items.length >= 1) {
        document.getElementById('item-name0').innerText = Player.items[0].name
    } else {document.getElementById('item-name0').innerText = 'Empty'}
    if (Player.items.length >= 2) {
        document.getElementById('item-name1').innerText = Player.items[1].name
    } else {document.getElementById('item-name1').innerText = 'Empty'}
    if (Player.items.length >= 3) {
        document.getElementById('item-name2').innerText = Player.items[2].name
    } else {document.getElementById('item-name2').innerText = 'Empty'}
    if (Player.items.length >= 4) {
        document.getElementById('item-name3').innerText = Player.items[3].name
    } else {document.getElementById('item-name3').innerText = 'Empty'}
    if (Player.items.length >= 5) {
        document.getElementById('item-name4').innerText = Player.items[4].name
    } else {document.getElementById('item-name4').innerText = 'Empty'}
    if (Player.items.length >= 6) {
        document.getElementById('item-name5').innerText = Player.items[5].name
    } else {document.getElementById('item-name5').innerText = 'Empty'}
    if (Player.items.length >= 7) {
        document.getElementById('item-name6').innerText = Player.items[6].name
    } else {document.getElementById('item-name6').innerText = 'Empty'}
    if (Player.items.length >= 8) {
        document.getElementById('item-name7').innerText = Player.items[7].name
    } else {document.getElementById('item-name7').innerText = 'Empty'}
    if (Player.items.length >= 9) {
        document.getElementById('item-name8').innerText = Player.items[8].name
    } else {document.getElementById('item-name8').innerText = 'Empty'}
    if (Player.items.length >= 10) {
        document.getElementById('item-name9').innerText = Player.items[9].name
    } else {document.getElementById('item-name9').innerText = 'Empty'}

    var x = document.getElementById('enemy-info')
    if (inBattle == false) {
        x.style.display = 'none'
    } 
    else {
        x.style.display = 'block'
    }
    var x = document.getElementById('levelup-button')
    if (maxXp = true && inBattle == false) {
        x.style.display = 'block'
    } 
    else {
        x.style.display = 'none'
    }
    var x = document.getElementById('non-battle')
    if (inBattle == true) {
        x.style.display = 'none'
    } 
    else {
        x.style.display = 'block'
    }
    var x = document.getElementById('battle-buttons')
    if (inBattle == false || turn % 2 == 0 ) {
        x.style.display = 'none'
    } 
    else {
        x.style.display = 'block'
    }
    var x = document.getElementById('item-shop')
    if (inShop == false) {
        x.style.display = 'none'
    } 
    else {
        x.style.display = 'block'
    }
    var x = document.getElementById('item-menu')
    if (inItemMenu == false) {
        x.style.display = 'none'
    } 
    else {
        x.style.display = 'block'
    }
}

function refresh() {
    updateStats()
    printToScreen()
}


updateStats()