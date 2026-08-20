// Season 01 product catalogue — the single source the product detail page
// hydrates from, so idl-product.html?product=<key> can stand in for any card on
// the storefront rather than being one hand-built page per SKU.
//
// Seeded once from the product cards in idl-merch-redesign-v2.html, then kept
// by hand — there is no build step, so edit this file directly. Keys are the
// shop-products image stem (studio / lifestyle / plain all follow it), which is
// not always the Shopify handle — that is carried separately as `shop`.
//
// Adding a product means: three images at standout-assets/shop-products/<key>
// (-studio, -lifestyle, and the bare stem), an entry here, and a `kind` that
// already exists in `copy` — the detail page reads everything else from those.
//
// `out` and the size runs are prototype stock, not real inventory.
window.IDL_CATALOG = {
  "order": [
    "idl-brotherhood-short-sleeve-red-jersey",
    "idl-brotherhood-long-sleeve-red-jersey",
    "team-brotherhood-hat",
    "idl-grv-short-sleeve-green-jersey",
    "idl-grv-long-sleeve-green-jersey",
    "team-grv-hat",
    "idl-1million-short-sleeve-grey-jersey",
    "idl-1million-long-sleeve-grey-jersey",
    "team-1million-hat",
    "idl-royal-family-short-sleeve-black-jersey",
    "idl-royal-family-long-sleeve-black-jersey",
    "team-royal-family-hat",
    "idl-quick-style-short-sleeve-blue-jersey",
    "idl-quick-style-long-sleeve-blue-jersey",
    "team-quick-style-hat",
    "idl-jam-republic-short-sleeve-orange-jersey",
    "idl-vancouver-long-sleeve-jersey",
    "idl-vancouver-series-tee",
    "idl-vancouver-utility-vest",
    "idl-vancouver-convertible-pants",
    "idl-nyc-distressed-practice-jersey",
    "idl-nyc-metro-shirt",
    "idl-recovery-sweatpants",
    "idl-nyc-distressed-beanie",
    "idl-nyc-series-tee",
    "idl-seoul-jersey",
    "idl-seoul-bandana",
    "idl-seoul-pleated-nylon-shorts",
    "idl-seoul-series-tee"
  ],
  "groups": {
    "brotherhood": {
      "label": "Brotherhood",
      "crest": "standout-assets/team-logos/brotherhood.webp",
      "flag": "standout-assets/team-flags/canada.webp",
      "place": "Vancouver, CAN",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_BRO.webp",
        "Asset Photo/ACTION/ACT_BRO.webp"
      ]
    },
    "grv": {
      "label": "GRV",
      "crest": "standout-assets/team-logos/grv.webp",
      "flag": "standout-assets/team-flags/usa.webp",
      "place": "Los Angeles, USA",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_GRV.webp",
        "Asset Photo/ACTION/ACT_GRV.webp"
      ]
    },
    "1million": {
      "label": "1MILLION",
      "crest": "standout-assets/team-logos/1million.webp",
      "flag": "standout-assets/team-flags/korea.webp",
      "place": "Seoul, KOR",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_1M.webp",
        "Asset Photo/ACTION/ACT_1M.webp"
      ]
    },
    "royal-family": {
      "label": "Royal Family",
      "crest": "standout-assets/team-logos/royal-family.webp",
      "flag": "standout-assets/team-flags/new-zealand.webp",
      "place": "Auckland, NZL",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_RF.webp",
        "Asset Photo/ACTION/ACT_RF3.webp"
      ]
    },
    "jam-republic": {
      "label": "Jam Republic",
      "crest": "standout-assets/team-logos/jam-republic.webp",
      "flag": "standout-assets/team-flags/sea.webp",
      "place": "South East Asia, SEA",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_JR.webp",
        "Asset Photo/ACTION/ACT_JR.webp"
      ]
    },
    "quick-style": {
      "label": "Quick Style",
      "crest": "standout-assets/team-logos/quick-style.webp",
      "flag": "standout-assets/team-flags/norway.webp",
      "place": "Oslo, NOR",
      "photos": [
        "Asset Photo/MEDIUM/MEDIUM_QS.webp",
        "Asset Photo/ACTION/ACT_QS.webp"
      ]
    },
    "vancouver": {
      "label": "Vancouver capsule",
      "crest": null,
      "flag": null,
      "place": "Season 01 capsule",
      "photos": [
        "lookbook-assets/van-capsule-05.jpg",
        "lookbook-assets/van-capsule-09.jpg"
      ]
    },
    "nyc": {
      "label": "NYC series",
      "crest": null,
      "flag": null,
      "place": "Season 01 capsule",
      "photos": [
        "lookbook-assets/van-capsule-03.jpg",
        "lookbook-assets/van-capsule-11.jpg"
      ]
    },
    "seoul": {
      "label": "Seoul series",
      "crest": null,
      "flag": null,
      "place": "Season 01 capsule",
      "photos": [
        "standout-assets/shop-products/idl-seoul-bandana-lifestyle.webp",
        "standout-assets/shop-products/idl-seoul-pleated-nylon-shorts-lifestyle.webp"
      ]
    },
    "league": {
      "label": "League essentials",
      "crest": null,
      "flag": null,
      "place": "Season 01",
      "photos": [
        "lookbook-assets/van-capsule-07.jpg",
        "lookbook-assets/van-capsule-10.jpg"
      ]
    }
  },
  "products": {
    "idl-brotherhood-short-sleeve-red-jersey": {
      "name": "IDL Brotherhood Short Sleeve Red Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-brotherhood-short-sleeve-red-jersey?variant=48906242654451",
      "group": "brotherhood",
      "kind": "jersey",
      "soldOut": true,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "cut": "Short sleeve",
      "pair": "idl-brotherhood-long-sleeve-red-jersey"
    },
    "idl-brotherhood-long-sleeve-red-jersey": {
      "name": "IDL Brotherhood Long Sleeve Red Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-brotherhood-long-sleeve-red-jersey?variant=48906244161779",
      "group": "brotherhood",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Long sleeve",
      "pair": "idl-brotherhood-short-sleeve-red-jersey"
    },
    "team-brotherhood-hat": {
      "name": "Team Brotherhood Hat",
      "price": 826000,
      "shop": "https://shop.idl.pro/products/team-brotherhood-hat?variant=48909058932979",
      "group": "brotherhood",
      "kind": "hat",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": [],
      "stock": 1
    },
    "idl-grv-short-sleeve-green-jersey": {
      "name": "IDL GRV Short Sleeve Green Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-grv-short-sleeve-green-jersey?variant=48906236461299",
      "group": "grv",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Short sleeve",
      "pair": "idl-grv-long-sleeve-green-jersey"
    },
    "idl-grv-long-sleeve-green-jersey": {
      "name": "IDL GRV Long Sleeve Green Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-grv-long-sleeve-green-jersey?variant=48906242326771",
      "group": "grv",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Long sleeve",
      "pair": "idl-grv-short-sleeve-green-jersey",
      "stock": 2
    },
    "team-grv-hat": {
      "name": "Team GRV Hat",
      "price": 826000,
      "shop": "https://shop.idl.pro/products/team-grv-hat?variant=48909056999667",
      "group": "grv",
      "kind": "hat",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": []
    },
    "idl-1million-short-sleeve-grey-jersey": {
      "name": "IDL 1MILLION Short Sleeve Grey Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-1million-short-sleeve-grey-jersey?variant=48906243735795",
      "group": "1million",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Short sleeve",
      "pair": "idl-1million-long-sleeve-grey-jersey"
    },
    "idl-1million-long-sleeve-grey-jersey": {
      "name": "IDL 1MILLION Long Sleeve Grey Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-1million-long-sleeve-grey-jersey?variant=48906244980979",
      "group": "1million",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Long sleeve",
      "pair": "idl-1million-short-sleeve-grey-jersey"
    },
    "team-1million-hat": {
      "name": "Team 1MILLION Hat",
      "price": 826000,
      "shop": "https://shop.idl.pro/products/team-1million-hat?variant=48909059195123",
      "group": "1million",
      "kind": "hat",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": []
    },
    "idl-royal-family-short-sleeve-black-jersey": {
      "name": "IDL Royal Family Short Sleeve Black Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-royal-family-short-sleeve-black-jersey?variant=48906243342579",
      "group": "royal-family",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Short sleeve",
      "pair": "idl-royal-family-long-sleeve-black-jersey"
    },
    "idl-royal-family-long-sleeve-black-jersey": {
      "name": "IDL Royal Family Long Sleeve Black Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-royal-family-long-sleeve-black-jersey?variant=48906246422771",
      "group": "royal-family",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Long sleeve",
      "pair": "idl-royal-family-short-sleeve-black-jersey"
    },
    "team-royal-family-hat": {
      "name": "Team Royal Family Hat",
      "price": 826000,
      "shop": "https://shop.idl.pro/products/team-royal-family-hat?variant=48909058801907",
      "group": "royal-family",
      "kind": "hat",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": []
    },
    "idl-quick-style-short-sleeve-blue-jersey": {
      "name": "IDL Quick Style Short Sleeve Blue Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-quick-style-short-sleeve-blue-jersey?variant=48906241802483",
      "group": "quick-style",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Short sleeve",
      "pair": "idl-quick-style-long-sleeve-blue-jersey"
    },
    "idl-quick-style-long-sleeve-blue-jersey": {
      "name": "IDL Quick Style Long Sleeve Blue Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-quick-style-long-sleeve-blue-jersey?variant=48906237149427",
      "group": "quick-style",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Long sleeve",
      "pair": "idl-quick-style-short-sleeve-blue-jersey"
    },
    "team-quick-style-hat": {
      "name": "Team Quick Style Hat",
      "price": 826000,
      "shop": "https://shop.idl.pro/products/team-quick-style-hat?variant=48909058834675",
      "group": "quick-style",
      "kind": "hat",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": [],
      "stock": 3
    },
    "idl-jam-republic-short-sleeve-orange-jersey": {
      "name": "IDL Jam Republic Short Sleeve Orange Jersey",
      "price": 2109000,
      "shop": "https://shop.idl.pro/products/idl-jam-republic-short-sleeve-orange-jersey?variant=48906243014899",
      "group": "jam-republic",
      "kind": "jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "cut": "Short sleeve"
    },
    "idl-vancouver-long-sleeve-jersey": {
      "name": "IDL Vancouver Long Sleeve Jersey",
      "price": 2013000,
      "shop": "https://shop.idl.pro/products/idl-van-hockey-inspired-jersey?variant=49048118821107",
      "group": "vancouver",
      "kind": "jersey",
      "soldOut": true,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "cut": "Long sleeve"
    },
    "idl-vancouver-series-tee": {
      "name": "IDL Vancouver Series Tee",
      "price": 915000,
      "shop": "https://shop.idl.pro/products/idl-van-series-tee?variant=49048118657267",
      "group": "vancouver",
      "kind": "tee",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "stock": 1
    },
    "idl-vancouver-utility-vest": {
      "name": "IDL Utility Vest",
      "price": 1830000,
      "shop": "https://shop.idl.pro/products/idl-van-vest?variant=49048119050483",
      "group": "vancouver",
      "kind": "vest",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "stock": 2
    },
    "idl-vancouver-convertible-pants": {
      "name": "IDL Convertible Pants",
      "price": 2287000,
      "shop": "https://shop.idl.pro/products/idl-van-convertible-pants?variant=49048119705843",
      "group": "vancouver",
      "kind": "pants",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "stock": 3
    },
    "idl-nyc-distressed-practice-jersey": {
      "name": "IDL NYC Distressed Practice Jersey",
      "price": 1546000,
      "shop": "https://shop.idl.pro/products/distressed-idl-nyc-practice-jersey?variant=48875163844851",
      "group": "nyc",
      "kind": "practice-jersey",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ]
    },
    "idl-nyc-metro-shirt": {
      "name": "IDL NYC Metro Shirt",
      "price": 1818000,
      "shop": "https://shop.idl.pro/products/idl-nyc-metro-shirt?variant=48875164074227",
      "group": "nyc",
      "kind": "shirt",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ]
    },
    "idl-recovery-sweatpants": {
      "name": "IDL Recovery Sweatpants",
      "price": 1636000,
      "shop": "https://shop.idl.pro/products/recovery-sweatpants?variant=48875163975923",
      "group": "league",
      "kind": "sweatpants",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ]
    },
    "idl-nyc-distressed-beanie": {
      "name": "IDL NYC Distressed Beanie",
      "price": 728000,
      "shop": "https://shop.idl.pro/products/distressed-idl-nyc-beanie?variant=48875163877619",
      "group": "nyc",
      "kind": "beanie",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": []
    },
    "idl-nyc-series-tee": {
      "name": "IDL NYC Series Tee",
      "price": 909000,
      "shop": "https://shop.idl.pro/products/idl-nyc-series-tee?variant=48875163582707",
      "group": "nyc",
      "kind": "tee",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ]
    },
    "idl-seoul-jersey": {
      "name": "IDL Seoul Jersey",
      "price": 2013000,
      "shop": "https://shop.idl.pro/products/idl-seoul-jersey",
      "group": "seoul",
      "kind": "jersey",
      "soldOut": true,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ]
    },
    "idl-seoul-bandana": {
      "name": "IDL Seoul Bandana",
      "price": 915000,
      "shop": "https://shop.idl.pro/products/idl-seoul-bandana",
      "group": "seoul",
      "kind": "bandana",
      "soldOut": false,
      "sizes": [
        "One size"
      ],
      "out": [],
      "stock": 1
    },
    "idl-seoul-pleated-nylon-shorts": {
      "name": "IDL Pleated Nylon Shorts",
      "price": 1830000,
      "shop": "https://shop.idl.pro/products/idl-seoul-pleated-nylon-shorts",
      "group": "seoul",
      "kind": "shorts",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "stock": 2
    },
    "idl-seoul-series-tee": {
      "name": "IDL Seoul Series Tee",
      "price": 2287000,
      "shop": "https://shop.idl.pro/products/idl-seoul-series-tee",
      "group": "seoul",
      "kind": "tee",
      "soldOut": false,
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "out": [
        "XS",
        "XXL"
      ],
      "stock": 3
    }
  },
  "copy": {
    "jersey": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "Built for the floor, not the shelf",
      "description": [
        "The jersey the crew competed in through Season 01 — sublimated graphic, mesh-backed side panels, and a drop hem cut to stay put through a full routine.",
        "Made on the same pattern as the competition kit — no retail-only substitutions."
      ],
      "fabric": [
        "92% recycled polyester, 8% elastane double-knit",
        "Four-way stretch, moisture-wicking finish",
        "Athletic regular fit — size up for a relaxed cut",
        "Machine wash cold, hang dry, do not iron the print"
      ],
      "spec": [
        {
          "term": "Print",
          "detail": "Sublimated end-to-end, so the graphic cannot crack, peel, or fade off the panel."
        },
        {
          "term": "Panels",
          "detail": "Mesh under the arm and along the flank, where a crew loses heat fastest through a two-minute set."
        },
        {
          "term": "Hem",
          "detail": "Dropped back, bonded seam. Stays down through floorwork instead of riding into the ribs."
        },
        {
          "term": "Numbering",
          "detail": "Crew name and league mark heat-pressed at the Seoul facility on the day the order picks."
        }
      ]
    },
    "practice-jersey": {
      "sizeNote": "Model is 182cm, wearing M. Cut roomy — size down for a close fit.",
      "headline": "Worn in before it ships",
      "description": [
        "The practice jersey from the NYC series, washed and abraded so it arrives already broken in.",
        "Cut wider than the competition kit: this is the one crews train in, not the one they compete in."
      ],
      "fabric": [
        "100% cotton jersey, garment-washed",
        "Distressed by hand — no two pieces are identical",
        "Oversized fit through the body and sleeve",
        "Machine wash cold, tumble dry low"
      ],
      "spec": [
        {
          "term": "Wash",
          "detail": "Enzyme-washed then abraded at the seams and hem, so the wear reads as earned rather than printed on."
        },
        {
          "term": "Cut",
          "detail": "Wider through the chest and shoulder than the competition jersey — layering room for a full session."
        },
        {
          "term": "Graphic",
          "detail": "Cracked screen print, applied before the wash so it ages with the cloth."
        },
        {
          "term": "Trim",
          "detail": "Ribbed collar with a taped shoulder seam to stop it stretching out."
        }
      ]
    },
    "tee": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "The one that leaves the venue with you",
      "description": [
        "The series tee from the Season 01 capsule — heavyweight cotton, boxy through the body, printed in small runs.",
        "The everyday piece of the capsule: no team lock, wearable off the floor."
      ],
      "fabric": [
        "100% combed cotton, 240gsm",
        "Boxy fit with a dropped shoulder",
        "Pre-shrunk — take your usual size",
        "Machine wash cold, tumble dry low"
      ],
      "spec": [
        {
          "term": "Weight",
          "detail": "240gsm cotton, heavy enough to hold its shape through a season of wear."
        },
        {
          "term": "Shoulder",
          "detail": "Dropped seam, so the sleeve sits where a wider body needs it to."
        },
        {
          "term": "Print",
          "detail": "Water-based ink, pressed into the cloth rather than sitting on top of it."
        },
        {
          "term": "Neck",
          "detail": "Ribbed collar with a shoulder-to-shoulder tape."
        }
      ]
    },
    "shirt": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "Layered over the kit, not under it",
      "description": [
        "A woven shirt from the NYC series, cut long and worn open over the kit.",
        "Structured enough to hold a line on stage, light enough to move in."
      ],
      "fabric": [
        "Cotton-nylon woven shell",
        "Relaxed fit, extended back hem",
        "Camp collar, chest pocket",
        "Machine wash cold, hang dry"
      ],
      "spec": [
        {
          "term": "Shell",
          "detail": "Cotton-nylon, tight enough in the weave to hold a crease without pressing."
        },
        {
          "term": "Hem",
          "detail": "Extended at the back, so it stays covered through a deep bend."
        },
        {
          "term": "Collar",
          "detail": "Camp cut — it sits flat open, which is how it is meant to be worn."
        },
        {
          "term": "Pocket",
          "detail": "Single chest patch, bar-tacked at the corners."
        }
      ]
    },
    "vest": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "A carry layer, built for load-in",
      "description": [
        "The utility vest from the Vancouver capsule — a carry layer built for load-in, not for the stage.",
        "Six pockets, all of them reachable while wearing it."
      ],
      "fabric": [
        "Ripstop nylon shell, water-repellent finish",
        "Regular fit — layers over a jersey",
        "Six pockets, two zipped",
        "Machine wash cold, hang dry"
      ],
      "spec": [
        {
          "term": "Shell",
          "detail": "Ripstop nylon with a DWR finish, so a wet load-in does not soak through."
        },
        {
          "term": "Pockets",
          "detail": "Six, placed where a hand actually lands rather than where they look good flat."
        },
        {
          "term": "Closure",
          "detail": "Full-length zip with a storm placket over it."
        },
        {
          "term": "Fit",
          "detail": "Cut to layer over a jersey without pulling at the arm."
        }
      ]
    },
    "pants": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "Two garments, one zip",
      "description": [
        "Convertible pants from the Vancouver capsule — zip the leg off at the knee and they are shorts.",
        "Cut wide through the thigh so the leg can move before the cloth does."
      ],
      "fabric": [
        "Ripstop nylon, water-repellent finish",
        "Zip-off leg at the knee",
        "Elastic waist with a drawcord",
        "Machine wash cold, hang dry"
      ],
      "spec": [
        {
          "term": "Conversion",
          "detail": "Zip runs the full circumference at the knee, taped so the seam does not chafe."
        },
        {
          "term": "Thigh",
          "detail": "Cut wide, gusseted at the crotch — the leg moves before the cloth does."
        },
        {
          "term": "Waist",
          "detail": "Elastic with an internal drawcord, no belt needed."
        },
        {
          "term": "Cuff",
          "detail": "Adjustable toggle, so the hem can be pulled clear of the floor."
        }
      ]
    },
    "sweatpants": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "For the hours after the session",
      "description": [
        "The recovery sweatpant — brushed fleece, cut loose, made for the hours after a session rather than during one.",
        "Heavy enough to sit in on a cold floor."
      ],
      "fabric": [
        "Brushed cotton-blend fleece, 380gsm",
        "Relaxed fit, tapered to the ankle",
        "Elastic waist and cuff, side pockets",
        "Machine wash cold, tumble dry low"
      ],
      "spec": [
        {
          "term": "Weight",
          "detail": "380gsm brushed fleece — warm without needing a second layer."
        },
        {
          "term": "Fit",
          "detail": "Loose through the seat and thigh, tapered from the knee so the hem stays off the floor."
        },
        {
          "term": "Waist",
          "detail": "Wide elastic with a flat drawcord that will not roll."
        },
        {
          "term": "Pockets",
          "detail": "Two side seam, deep enough to hold a phone through a walk."
        }
      ]
    },
    "hat": {
      "sizeNote": "One size, adjustable strap at the back.",
      "headline": "Built around the crest",
      "description": [
        "The team hat — structured six-panel crown with the crew crest embroidered at the front.",
        "Adjustable at the back, so one size genuinely is one size."
      ],
      "fabric": [
        "Cotton twill crown, structured front panels",
        "Embroidered crest, satin-stitched",
        "Adjustable metal clasp strap",
        "Spot clean only"
      ],
      "spec": [
        {
          "term": "Crown",
          "detail": "Six panels, the front two fused so the crest sits flat rather than folding."
        },
        {
          "term": "Crest",
          "detail": "Satin-stitch embroidery, backed so it holds shape through a wash of sweat."
        },
        {
          "term": "Brim",
          "detail": "Pre-curved, stitched in six rows."
        },
        {
          "term": "Strap",
          "detail": "Metal clasp with a keeper — it holds a setting instead of creeping."
        }
      ]
    },
    "beanie": {
      "sizeNote": "One size, cuffed.",
      "headline": "Finished by hand, one at a time",
      "description": [
        "The distressed beanie from the NYC series — washed, pilled at the cuff, finished by hand.",
        "Ribbed through the body so it holds to the head without gripping."
      ],
      "fabric": [
        "Acrylic-wool rib knit",
        "Distressed and pilled by hand at the cuff",
        "Cuffed, one size",
        "Hand wash cold, dry flat"
      ],
      "spec": [
        {
          "term": "Knit",
          "detail": "2x1 rib through the body — it holds without gripping."
        },
        {
          "term": "Distressing",
          "detail": "Cuff is pilled and thinned by hand, so no two arrive the same."
        },
        {
          "term": "Cuff",
          "detail": "Double-folded, deep enough to sit over the ear."
        },
        {
          "term": "Mark",
          "detail": "Woven label at the fold rather than a print that would crack."
        }
      ]
    },
    "shorts": {
      "sizeNote": "Model is 182cm, wearing M. Fits true to size.",
      "headline": "Pleated for movement, not for show",
      "description": [
        "Nylon shorts from the Seoul series — box-pleated at the waist so the leg has room to open through a full split before the cloth catches up.",
        "Cut with a soft drape rather than a stiff shell, so it moves the way the rest of the kit does."
      ],
      "fabric": [
        "100% nylon, soft-hand finish",
        "Box-pleated front, relaxed through the thigh",
        "Side seam pockets, back welt pocket",
        "Machine wash cold, hang dry"
      ],
      "spec": [
        {
          "term": "Pleat",
          "detail": "Box-pleated at the waist, so the leg opens without pulling the seat tight."
        },
        {
          "term": "Drape",
          "detail": "Soft-hand nylon, weighted enough to fall clean instead of ballooning."
        },
        {
          "term": "Waist",
          "detail": "Button-and-zip fly with a fixed tab — no drawcord to catch mid-set."
        },
        {
          "term": "Pockets",
          "detail": "Two side seam, one welt at the back, all bar-tacked at the stress points."
        }
      ]
    },
    "bandana": {
      "sizeNote": "One size, 55cm square.",
      "headline": "Tied a dozen ways, styled in one",
      "description": [
        "The bandana from the Seoul series — full-bleed print, finished on all four edges so it holds a fold whether it is worn at the neck, the wrist, or the bag strap.",
        "The one piece of the capsule built to move between outfits, not just kits."
      ],
      "fabric": [
        "100% cotton twill, 55cm square",
        "All-over sublimated print",
        "Hand-rolled and stitched hem on all four edges",
        "Hand wash cold, iron on reverse"
      ],
      "spec": [
        {
          "term": "Print",
          "detail": "Sublimated edge to edge, so the graphic runs into the hem instead of stopping short of it."
        },
        {
          "term": "Hem",
          "detail": "Rolled and stitched on all four sides, the same finish a woven pocket square gets."
        },
        {
          "term": "Weight",
          "detail": "Mid-weight twill — holds a knot without bulking one out."
        },
        {
          "term": "Wear",
          "detail": "Ties at the neck, wrist, or bag strap without losing its shape any of the three ways."
        }
      ]
    }
  }
};
