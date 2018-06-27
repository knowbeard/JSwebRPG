/*  stats: strength, stamina, spirit
    strength boosts attacks a lot and defence a little
    stamina boosts defence a lot and magic a little
    spirit boosts magic a lot and attack a little
*/

let inBattle = false
let inShop = false
let inItemMenu = false
let maxXp = false
let turn = 0
let log = ""
let shopItems = ["","",""]
let shopCooldown = 0

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
    state: 2,
    items:[],
    gear: {
        armour: false,
        weapon: false,
        trinket: false,
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
    state:2,
    gear: {
        armour: false,
        weapon: false,
        trinket: false,
        gem: false
    }
}

function Item(name, type, cost, desc, stat, slot) {
    this.name = name
    this.type = type
    this.cost = cost
    this.desc = desc
    this.stat = stat
    this.slot = slot
}

let smallPotion = new Item("Small Potion", "Consumable", 5, "Recovers a little hp", .125, "h")
let mediumPotion = new Item("Medium Potion", "Consumable", 10, "Recovers some hp", .25, "h")
let largePotion = new Item("Large Potion", "Consumable", 20, "Recovers a lot of hp", .5, "h")
let revivePotion = new Item("Revive Potion", "Consumable", 160, "Recovers all hp", 1, "h")

let burntBook = new Item("Burnt Book", "Consumable", 10, "Could still be helpful", .125, "x")
let rippedBook = new Item("Ripped Book", "Consumable", 20, "Some readable parts", .25, "x")
let dustyBook = new Item("Dusty Book", "Consumable", 40, "Great source of knowledge", .5, "x")
let ancientBook = new Item("Ancient Book", "Consumable", 160, "An ancient tome", 1, "x")

let rustySword = new Item("Rusty Sword", "Gear", 0, "Not very sharp", 1, "w")
let ironSword = new Item("Iron Sword", "Gear", 50, "A good weight but fairly blunt", 1.1, "w")

let rustyArmour = new Item("Rusty Armour", "Gear", 0, "Seems a bit brittle", 1, "a")
let ironArmour = new Item("Iron Armour", "Gear", 50, "Heavy but sturdy", 1.1, "a")

let homelyRock = new Item("Homely Rock", "Gear", 0, "You brought it from your homeland", 1, "t")
let bronzeAmulet = new Item("Bronze Amulet", "Gear", 50, "You sense dull magic", 1.1, "t")

let dullJade = new Item("Dull Jade", "Gear", 200, "Slightly increases vitality", 1.1, "g")

Player.gear.armour = rustyArmour
Player.gear.weapon = rustySword
Player.gear.trinket = homelyRock

Player.items = [smallPotion, mediumPotion, largePotion]

Enemy.gear.armour = rustyArmour
Enemy.gear.weapon = rustySword
Enemy.gear.trinket = homelyRock

console.log(Player.gear.weapon.stat)
console.log(Player.gear.armour.stat)
console.log(Player.gear.trinket.stat)

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


function newEnemy() {
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
        state: 2,
        gear: {
            armour: rustyArmour,
            weapon: rustySword,
            trinket: homelyRock,
            gem: false
        }
    }
    let r = 0
    
    for (l = 1, len = Player.stats.level, text = ""; l < len; l++) {
        r = Math.floor((Math.random()*3)+1)
        enemyLevelUp(r)
    }
    Enemy.stats.ap = Enemy.stats.strength+(Enemy.stats.spirit/2)
    Enemy.stats.dp = Enemy.stats.stamina+(Enemy.stats.strength/2)
    Enemy.stats.mp = Enemy.stats.spirit+(Enemy.stats.stamina/2)
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
        log = "You won and gained xp"
        Player.stats.xp+=Enemy.stats.level*5
    }
    else if (person == Enemy) {
        log = "You lost"
    }
    inBattle = false
    Player.stats.hp = Player.stats.maxHp
}

function heal(target) {
    if (inBattle == false) {
        refresh()
        return
    }
    target.stats.hp += target.stats.mp*4/3
    if (target.stats.hp > target.stats.maxHp) {
        target.stats.hp = target.stats.maxHp
    }
    turn++
    target.state = 3
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
    target.state = 1
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
    if (target.state === 1) {
        d = target.stats.dp * (Math.floor((Math.random() * (100+critChance) + critChance)))/100
        critChance/=2
    }
    if (target.state === 2) {
        critChance*=2
    }
    if (target.state === 3) {
        critchance = 50
    }
    let a = self.stats.ap*(Math.floor((Math.random() * (100+critChance) + critChance)))/100
    a -= d 
    if (a < 0) {
        a = 0
    }
    a = Math.trunc(a*10)/10
    target.stats.hp-=a
    target.stats.hp = Math.trunc(target.stats.hp*10)/10
    if (target.stats.hp <= 0) {
        target.stats.hp = 0
        win(self)
        refresh()
        return
    }
    self.state = 2
    turn++
    log = a + " damage"
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
    if (target.state === 1) {
        d = target.stats.dp * (Math.floor((Math.random() * (100+50) + 50)))/100
        critChance*=2
    }
    if (target.state === 2) {
        critChance/=2
    }
    if (target.state === 3) {
        critchance = 50
    }
    let a = self.stats.ap*(Math.floor((Math.random() * (100+critChance) + critChance)))/100
    a -= d 
    if (a < 0) {
        a = 0
    }
    a = Math.trunc(a*10)/10
    target.stats.hp-=a
    target.stats.hp = Math.trunc(target.stats.hp*10)/10
    if (target.stats.hp <= 0) {
        target.stats.hp = 0
        win(self)
        refresh()
        return
    }
    self.state = 2
    turn++
    log = a + " damage"
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
    newEnemy()
    refresh()
}

function levelUp(stat) {
    if (Player.stats.xp >= Player.stats.level*10) {
        Player.stats.xp-=Player.stats.level*10
        Player.stats.level++
        Player.stats.maxHp=Player.stats.level*5
        Player.stats.hp=Player.stats.maxHp
        log = "You reached level "+Player.stats.level
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
        log = "You don't have enough XP"
    }
    refresh()
}

function shop() {
    if (shopCooldown >= Player.stats.level) {
        log = "Win a battle to refresh the shop"
        refresh()
        return
    }   
    inShop=true
    for (i in shopItems) {
        let r = Math.random()
        if (r < .7) {
            shopItems[i] = smallPotion
        }
        else if (r <.9) {
            shopItems[i] = burntBook
        }
        else {
            shopItems[i] = "Gear"
        }

    }
    refresh()
    shopCooldown++

}

function buy(item) {
    inShop = false
    if (Player.items.length >= 10) {
        log = "Item storage full"
        refresh()
        return
    }
    Player.items[Player.items.length] = shopItems[item]
    refresh()
}

function showItems() {
    inItemMenu = inItemMenu ? false : true
    inShop = false
    refresh()

}

function useItem(item) {
    alert("use item ", item)
}

function updateStats() {

    Player.stats.ap = (Player.stats.strength+(Player.stats.spirit/2))*Player.gear.weapon.stat
    Player.stats.dp = (Player.stats.stamina+(Player.stats.strength/2))*Player.gear.armour.stat
    Player.stats.mp = (Player.stats.spirit+(Player.stats.stamina/2))*Player.gear.trinket.stat

    Enemy.stats.ap = (Enemy.stats.strength+(Enemy.stats.spirit/2))*Enemy.gear.weapon.stat
    Enemy.stats.dp = (Enemy.stats.stamina+(Enemy.stats.strength/2))*Enemy.gear.armour.stat
    Enemy.stats.mp = (Enemy.stats.spirit+(Enemy.stats.stamina/2))*Enemy.gear.trinket.stat

    Player.info = 
        "Level:     "+Player.stats.level+"\n"+
        "XP:        "+Player.stats.xp+"/"+Player.stats.level*10+"\n"+
        "HP:        "+Player.stats.hp+"/"+Player.stats.maxHp+"\n\n"+
        "Stamina:   "+Player.stats.stamina+"\n"+
        "Strength:  "+Player.stats.strength+"\n"+
        "Spirit:    "+Player.stats.spirit+"\n"+
        "A/D/M /s:  "+Player.stats.ap+"/"+Player.stats.dp+"/"+Player.stats.mp+" /"+Player.state
    Enemy.info = 
        "Turn "      +turn+"\n"+
        "Level:     "+Enemy.stats.level+"\n"+
        "HP:        "+Enemy.stats.hp+"/"+Enemy.stats.maxHp+"\n\n"+
        "Stamina:   "+Enemy.stats.stamina+"\n"+
        "Strength:  "+Enemy.stats.strength+"\n"+
        "Spirit:    "+Enemy.stats.spirit+"\n"+
        "AP/DP/MP:  "+Enemy.stats.ap+"/"+Enemy.stats.dp+"/"+Enemy.stats.mp+" /"+Enemy.state
}

function printToScreen() {
    document.getElementById("log-message").innerText = log
    document.getElementById("player-info").innerText = Player.info
    document.getElementById("enemy-info").innerText = Enemy.info

    document.getElementById("shop-item0").innerText = shopItems[0].name
    document.getElementById("shop-item1").innerText = shopItems[1].name
    document.getElementById("shop-item2").innerText = shopItems[2].name

    if (Player.items.length >= 1) {
        document.getElementById("item-name0").innerText = Player.items[0].name
    } else {document.getElementById("item-name0").innerText = "Empty"}
    if (Player.items.length >= 2) {
        document.getElementById("item-name1").innerText = Player.items[1].nam
    } else {document.getElementById("item-name1").innerText = "Empty"}
    if (Player.items.length >= 3) {
        document.getElementById("item-name2").innerText = Player.items[2].name
    } else {document.getElementById("item-name2").innerText = "Empty"}
    if (Player.items.length >= 4) {
        document.getElementById("item-name3").innerText = Player.items[3].name
    } else {document.getElementById("item-name3").innerText = "Empty"}
    if (Player.items.length >= 5) {
        document.getElementById("item-name4").innerText = Player.items[4].name
    } else {document.getElementById("item-name4").innerText = "Empty"}
    if (Player.items.length >= 6) {
        document.getElementById("item-name5").innerText = Player.items[5].name
    } else {document.getElementById("item-name5").innerText = "Empty"}
    if (Player.items.length >= 7) {
        document.getElementById("item-name6").innerText = Player.items[6].name
    } else {document.getElementById("item-name6").innerText = "Empty"}
    if (Player.items.length >= 8) {
        document.getElementById("item-name7").innerText = Player.items[7].name
    } else {document.getElementById("item-name7").innerText = "Empty"}
    if (Player.items.length >= 9) {
        document.getElementById("item-name8").innerText = Player.items[8].name
    } else {document.getElementById("item-name8").innerText = "Empty"}
    if (Player.items.length >= 10) {
        document.getElementById("item-name9").innerText = Player.items[9].name
    } else {document.getElementById("item-name9").innerText = "Empty"}

    var x = document.getElementById("enemy-info")
    if (inBattle == false) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
    var x = document.getElementById("levelup-button")
    if (Player.stats.xp < Player.stats.level*10 || inBattle == true) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
    var x = document.getElementById("non-battle")
    if (inBattle == true) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
    var x = document.getElementById("battle-buttons")
    if (inBattle == false || turn % 2 == 0 ) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
    var x = document.getElementById("item-shop")
    if (inShop == false) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
    var x = document.getElementById("item-menu")
    if (inItemMenu == false) {
        x.style.display = "none"
    } 
    else {
        x.style.display = "block"
    }
}

function refresh() {
    updateStats()
    printToScreen()
}


updateStats()