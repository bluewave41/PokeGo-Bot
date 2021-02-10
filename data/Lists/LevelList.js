const items = require('~/data/Lists/ItemEnums');
/*Rewards are listed as itemId, amount*/

module.exports = {
	1: {
		requiredXP: 1000,
		totalXP: 1000,
		rewards: [{ itemId: items.POKE_BALL, amount: 10}],
        rewardString: '10 Poke Balls',
	},
	2: {
		requiredXP: 2000,
		totalXP: 3000,
		rewards: [{ itemId: items.POKE_BALL, amount: 15}],
        rewardString: '15 Poke Balls',
	},
	3: {
		requiredXP: 3000,
		totalXP: 6000,
		rewards: [{ itemId: items.POKE_BALL, amount: 15}],
        rewardString: '15 Poke Balls',
	},
	4: {
		requiredXP: 4000,
		totalXP: 10000,
        rewards: [{ itemId: items.POKE_BALL, amount: 20},
                  { itemId: items.POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 10},
                  //incense
                 ],
        rewardString: '20 Poke Balls,10 Potions,10 Revives'
    },
    5: {
        requiredXP: 5000,
        totalXP: 15000,
        rewards: [{ itemId: items.POKE_BALL, amount: 15},
                  { itemId: items.POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  //incubator
                 ],
        rewardString: '15 Poke Balls,10 Potions,5 Revives'
    },
    6: {
        requiredXP: 6000,
        totalXP: 21000,
        rewards: [{ itemId: items.POKE_BALL, amount: 15},
                  { itemId: items.POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  //incense
                ],
        rewardString: '15 Poke Balls,10 Potions,5 Revives',
    },
    7: {
        requiredXP: 7000,
        totalXP: 28000,
        rewards: [{ itemId: items.POKE_BALL, amount: 15},
                  { itemId: items.POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 10}
                  //lure module
                 ],
        rewardString: '15 Poke Balls,10 Potions,5 Revives,10 Razz Berries',
    },
    8: {
        requiredXP: 8000,
        totalXP: 36000,
        rewards: [{ itemId: items.POKE_BALL, amount: 15},
                  { itemId: items.POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 3}
                  //lucky egg
                ],
        rewardString: '15 Poke Balls,10 Potions,5 Revives,3 Razz Berries',
    },
    9: {
        requiredXP: 9000,
        totalXP: 45000,
        rewards: [{ itemId: items.POKE_BALL, amount: 20},
                  { itemId: items.SUPER_POTION, amount: 20},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 10}
                  //incense
                  //lucky egg
                  //incubator
                  //lure module
                ],
        rewardString: '20 Poke Balls,20 Super Potions,10 Revives,10 Razz Berries'
    },
    10: {
        requiredXP: 10000,
        totalXP: 55000,
        rewards: [{ itemId: items.POKE_BALL, amount: 15},
                  { itemId: items.SUPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 3},
                  { itemId: items.RAZZ_BERRY, amount: 3}],
        rewardString: '15 Poke Balls,10 Super Potions,3 Revives,3 Razz Berries'
    },
    11: {
        requiredXP: 10000,
        totalXP: 65000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 20},
                  { itemId: items.SUPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 3},
                  { itemId: items.RAZZ_BERRY, amount: 3}],
        rewardString: '20 Great Balls,10 Super Potions,3 Revives,3 Razz Berries'
    },
    12: {
        requiredXP: 10000,
        totalXP: 75000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 10},
                  { itemId: items.SUPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 3},
                  { itemId: items.RAZZ_BERRY, amount: 3}],
        rewardString: '10 Great Balls,10 Super Potions,3 Revives,3 Razz Berries'
    },
    13: {
        requiredXP: 10000,
        totalXP: 85000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 10},
                  { itemId: items.SUPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 3},
                  { itemId: items.RAZZ_BERRY, amount: 3}],
        rewardString: '10 Great Balls,10 Super Potions,3 Revives,3 Razz Berries'
    },
    14: {
        requiredXP: 15000,
        totalXP: 100000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 15},
                  { itemId: items.HYPER_POTION, amount: 20},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 10}
                  //incense
                  //lucky egg
                  //incubator
                  //lure module
                 ],
        rewardString: '15 Great Balls,20 Hyper Potions,10 Revives,10 Razz Berries'
    },
    15: {
        requiredXP: 20000,
        totalXP: 120000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 5}],
        rewardString: '10 Great Balls,10 Hyper Potions,5 Revives,5 Razz Berries'
    },
    16: {
        requiredXP: 20000,
        totalXP: 140000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 5}],
        rewardString: '10 Great Balls,10 Hyper Potions,5 Revives,5 Razz Berries'
    },
    17: {
        requiredXP: 20000,
        totalXP: 160000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 5}],
        rewardString: '10 Great Balls,10 Hyper Potions,5 Revives,5 Razz Berries'
    },
    18: {
        requiredXP: 25000,
        totalXP: 185000,
        rewards: [{ itemId: items.GREAT_BALL, amount: 15},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 5},
                  { itemId: items.RAZZ_BERRY, amount: 5}],
        rewardString: '15 Great Balls,10 Hyper Potions,5 Revives,5 Razz Berries'
    },
    19: {
        requiredXP: 25000,
        totalXP: 210000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 20},
                  { itemId: items.HYPER_POTION, amount: 20},
                  { itemId: items.REVIVE, amount: 20},
                  { itemId: items.RAZZ_BERRY, amount: 20},
                  //incese x2
                  //lucky egg x2
                  //incubator x2
                  //lure module x2
                 ],
        rewardString: '20 Ultra Balls,20 Hyper Potions,20 Revives,20 Razz Berries'
    },
    20: {
        requiredXP: 50000,
        totalXP: 260000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.PINAP_BERRY, amount: 10}],
        rewardString: '10 Ultra Balls,10 Hyper Potions,10 Revives,10 Pinap Berries'
    },
    21: {
        requiredXP: 75000,
        totalXP: 335000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 10}],
        rewardString: '10 Ultra Balls,10 Hypper Potions,10 Revives,10 Razz Berries'
    },
    22: {
        requiredXP: 100000,
        totalXP: 435000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.NANAB_BERRY, amount: 10}],
        rewardString: '10 Ultra Balls,10 Hyper Potions,10 Revives,10 Nanab Berries'
    },
    23: {
        requiredXP: 125000,
        totalXP: 560000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 15},
                  { itemId: items.HYPER_POTION, amount: 10},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 10}],
        rewardString: '15 Ultra Balls,10 Hyper Potions,10 Revives,10 Razz Berries'
    },
    24: {
        requiredXP: 150000,
        totalXP: 710000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 25},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.REVIVE, amount: 15},
                  { itemId: items.PINAP_BERRY, amount: 15}
                  //incense
                  //lucky egg
                  //incubator
                  //lure module
                 ],
        rewardString: '25 Ultra Balls\20 Max Potions,15 Revives,15 Pinap Berries'
    },
    25: {
        requiredXP: 190000,
        totalXP: 900000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Revives,15 Razz Berries'
    },
    26: {
        requiredXP: 200000,
        totalXP: 1100000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.NANAB_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Revives,15 Nanab Berries'
    },
    27: {
        requiredXP: 250000,
        totalXP: 1350000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Revives,15 Razz Berries'
    },
    28: {
        requiredXP: 300000,
        totalXP: 1650000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.REVIVE, amount: 10},
                  { itemId: items.PINAP_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Revives,15 Pinap Berries'
    },
    29: {
        requiredXP: 350000,
        totalXP: 2000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 30},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 20},
                  { itemId: items.RAZZ_BERRY, amount: 20},
                  //incense x3
                  //lucky egg x3
                  //incubator x3
                  //lure module x3
                ],
        rewardString: '30 Ultra Balls,20 Max Potions,20 Max Revives,20 Razz Berries'
    },
    30: {
        requiredXP: 500000,
        totalXP: 2500000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.NANAB_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Max Revives,15 Nanab Berries'
    },
    31: {
        requiredXP: 500000,
        totalXP: 3000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Max Revives,15 Razz Berries'
    },
    32: {
        requiredXP: 750000,
        totalXP: 3750000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.PINAP_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Max Revives,15 Pinap Berries'
    },
    33: {
        requiredXP: 1000000,
        totalXP: 4750000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 10},
                  { itemId: items.MAX_POTION, amount: 15},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 15}],
        rewardString: '10 Ultra Balls,15 Max Potions,10 Max Revives,15 Razz Berries'
    },
    34: {
        requiredXP: 1250000,
        totalXP: 6000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 30},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 20},
                  { itemId: items.NANAB_BERRY, amount: 20}
                  //incense x2
                  //lucky egg
                  //lure module  
                ],
        rewardString: '30 Ultra Balls,20 Max Potions,20 Max Revives,20 Nanab Berries'
    },
    35: {
        requiredXP: 1500000,
        totalXP: 7500000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 20},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 20}],
        rewardString: '20 Ultra Balls,20 Max Potions,10 Max Revives,20 Razz Berries'
    },
    36: {
        requiredXP: 2000000,
        totalXP: 9500000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 20},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.PINAP_BERRY, amount: 20}],
        rewardString: '20 Ultra Balls,20 Max Potions,10 Max Revives,20 Pinap Berries'
    },
    37: {
        requiredXP: 2500000,
        totalXP: 12000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 20},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.RAZZ_BERRY, amount: 20}],
        rewardString: '20 Ultra Balls,20 Max Potions,10 Max Revives,20 Razz Berries'
    },
    38: {
        requiredXP: 3000000,
        totalXP: 15000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 20},
                  { itemId: items.MAX_POTION, amount: 20},
                  { itemId: items.MAX_REVIVE, amount: 10},
                  { itemId: items.NANAB_BERRY, amount: 20}],
        rewardString: '20 Ultra Balls,20 Max Potions,10 Max Revives,20 Nanab Berries'
    },
    39: {
        requiredXP: 5000000,
        totalXP: 20000000,
        rewards: [{ itemId: items.ULTRA_BALL, amount: 40},
                  { itemId: items.MAX_POTION, amount: 40},
                  { itemId: items.MAX_REVIVE, amount: 40},
                  { itemId: items.RAZZ_BERRY, amount: 40}
                  //incense x4
                  //lucky egg x4
                  //incubator x4
                  //lure module x4
                ],
        rewardString: '40 Ultra Balls,40 Max Potions,40 Max Revives,40 Razz Berries'
    }
}