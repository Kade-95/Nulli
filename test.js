const Nulli = require('./index');

let op = new Nulli({ name: 'Sdample', address: "C:/TQL" });

const data = [
    {
        name: "Mama'S Pride Premium Parboiled Rice 50 Kg",
        price: 50000,
        quantity: 50,
        category: [
            "Rice",
            "Grains",
            "Mama's Pride"
        ],
        tags: [
            "Rice",
            "Grains",
            "Mama's Pride"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/79/615484/1.jpg?6211",
        description: [
            " SKU: MA083FF1BEFP8NAFAMZ",
            "Color: White",
            "Main Material: Parboiled Rice",
            "Model: Rice",
            "Production Country: Nigeria",
            "Product Line: Blekn Stores",
            "Weight (kg): 50"
        ]
    },
    {
        name: "Big Parboiled Rice 10kg",
        price: 20000,
        quantity: 50,
        category: [
            "Rice",
            "Grains",
        ],
        tags: [
            "Rice",
            "Grains",
            "Parboiled"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/17/885315/1.jpg?7949",
        description: [
            "SKU: BI444FF0ANCEBNAFAMZ",
            "Color: Brown",
            "Production Country: Nigeria",
            "Weight (kg): 10"
        ]
    },
    {
        name: "50 50 Soya Custard Powder 2kg",
        price: 10000,
        quantity: 50,
        category: [
            "Custard",
            "Powder",
        ],
        tags: [
            "Soya",
            "Custard",
            "Powder"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/38/375124/1.jpg?3023",
        description: [
            "SKU: 50760GR0MUIFONAFAMZ",
            "NAFDAC No.: 08-5987L",
            "Color: Brown",
            "Main Material: Soya Milk",
            "Model: Custard",
            "Production Country: Nigeria",
            "Product Line: Dabamat",
            "Weight (kg): 2",
        ]
    },
    {
        name: "Indomie Chicken Flavour Instant Noodles -40 Packs X 70g",
        price: 2300,
        quantity: 50,
        category: [
            "Indomie",
            "Noddles",
        ],
        tags: [
            "Indomie",
            "Noddles",
            "Chicken Flavour"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/19/124854/1.jpg?3506",
        description: [
            "SKU: IN147GR0BDWTYNAFAMZ",
            "NAFDAC No.: N/A",
            "Production Country: Nigeria",
            "Product Line: techlum",
            "Weight (kg): 0.5",
        ]
    },
    {
        name: "Lahda Golden Soya Oil 3 Litre",
        price: 2300,
        quantity: 50,
        category: [
            "Soya Oil",
        ],
        tags: [
            "Oil",
            "Soya",
            "Lahda",
            "Golden"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/69/448444/1.jpg?8019",
        description: [
            "SKU: KA945GR15CIRGNAFAMZ",
            "NAFDAC No.: nill",
            "Production Country: Nigeria",
            "Weight (kg): 3"
        ]
    },
    {
        name: "Nosak Famili Quality Palm Oil",
        price: 2300,
        quantity: 50,
        category: [
            "Oil",
            "Palm Oil"
        ],
        tags: [
            "Oil",
            "Palm",
            "Nosak",
            "Famili"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/17/355026/1.jpg?6845",
        description: [
            "SKU: NO522GR0ABZ82NAFAMZ",
            "NAFDAC No.: N/A",
            "Main Material: PALM KERNEL",
            "Production Country: Nigeria",
            "Weight (kg): 2"
        ]
    },
    {
        name: "Golden Penny Spagetti X20 (1 Carton)",
        price: 2300,
        quantity: 50,
        category: [
            "Spagetti",
            "Golden Penny"
        ],
        tags: [
            "Spagetti",
            "Golden Penny",
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/91/118065/1.jpg?5783",
        description: [
            "SKU: GO106GR1I8Z5DNAFAMZ",
            "NAFDAC No.: A1-0291",
            "Production Country: Nigeria",
            "Product Line: Azi6farm",
            "Weight (kg): 2.5"
        ]
    },
    {
        name: "Bama Mayonnaise -473ml",
        price: 2300,
        quantity: 50,
        category: [
            "Bama",
            "Mayonnaise"
        ],
        tags: [
            "Bama",
            "Mayonnaise"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/88/046735/1.jpg?0393",
        description: [
            "SKU: BA099GR1GF5ANNAFAMZ",
            "NAFDAC No.: 01 - 0476",
            "Product Line: CHYCLASIC MALL",
            "Weight (kg): 946",
        ]
    },
    {
        name: "Peak Instand Full Cream Milk Powder Tin- 400g X 6",
        price: 2300,
        quantity: 50,
        category: [
            "Peak",
            "Milk"
        ],
        tags: [
            "Powder",
            "Milk",
            "Peak"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/51/507593/1.jpg?4854",
        description: [
            "SKU: PE294GR0UNZIHNAFAMZ",
            "NAFDAC No.: 01-6215",
            "Product Line: Noble's angel Mart",
            "Weight (kg): 0.4"
        ]
    },
    {
        name: "Ovaltine Chocolate Tea Tin 400G X6",
        price: 2300,
        quantity: 50,
        category: [
            "Ovaltine",
            "Chocolate",
            "Tea"
        ],
        tags: [
            "Tin",
            "Tea",
            "Chocolate",
            "Ovaltine"
        ],
        image: "https://ng.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/17/207593/1.jpg?5701",
        description: [
            "SKU: OV361GR0A8TGPNAFAMZ",
            "NAFDAC No.: 01-1434",
            "Product Line: Noble's angel Mart",
            "Weight (kg): 0.5"
        ]
    }
];

op.relate({ collection: 'market', relations: { comments: { collection: 'market', match: [{ local: 'name', foriegn: 'name' }], many: true } }, options: { many: true } }).then(console.log).catch(console.log)