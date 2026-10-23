import { publicLocales, type PublicLocale } from "./public-locale";
import {
  getProcessingToolDefinition,
  type ProcessingToolId,
} from "../tools-pages/processing/processing-tool-definition";

export type ProcessingToolGuideCopy = Readonly<{
  toolName: string;
  overview: Readonly<{
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    aside: string;
  }>;
  features: Readonly<{
    items: readonly Readonly<{
      number: string;
      eyebrow: string;
      title: string;
      body: string;
      caseHint: string;
      caption: string;
    }>[];
  }>;
  featureIntro: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ title: string; body: string }>[];
  }>;
  howToUse: Readonly<{
    eyebrow: string;
    title: string;
    steps: readonly Readonly<{ number: string; title: string; body: string }>[];
    actionLabel: string;
  }>;
  whyChoose: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ number: string; title: string; body: string }>[];
  }>;
  comparison: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    cornerLabel: string;
    products: readonly Readonly<{ name: string; href: string }>[];
    rows: readonly Readonly<{ label: string; values: readonly string[] }>[];
  }>;
  faq: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ question: string; answer: string }>[];
  }>;
  cta: Readonly<{
    title: string;
    description: string;
    label: string;
  }>;
}>;

const processingToolGuideCopyByLocale = {
  "en": {
    "basic-processing-profit": {
      "toolName": "Stardew Valley Profit Calculator",
      "overview": {
        "eyebrow": "Check processing value against selling raw",
        "title": "Does processing add value to this stack?",
        "paragraphs": [
          "The Stardew Valley Profit Calculator starts with the raw-sale value of one selected ingredient stack, then compares it with each supported Keg, Preserves Jar, and Dehydrator route. Choose the ingredient, quantity, quality, and profession you actually have.",
          "The Stardew Valley Profit Calculator shows finished batches, raw units left, final value, and added value over selling the full stack for each route. Its raw-sale baseline follows the selected settings and ingredient-specific conditions shown in the form.",
          "Full-stock value in the Stardew Valley Profit Calculator assumes every complete supported batch can be processed without machine-count or time limits. Capacity mode applies your machine counts and elapsed window. Each route tests the same stack independently; choose one route and do not add route values together."
        ],
        "aside": "An unsupported recipe or units outside a complete batch retain their raw-sale value."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "Set the baseline",
            "title": "Compare with the sale you give up",
            "body": "The Stardew Valley Profit Calculator sets the raw-sale total from selected quantity, supported quality, and applicable profession settings. Added value compares each route with selling the full stack, not with an unconfigured recipe price.",
            "caseHint": "Choose Blueberry, keep Normal quality and No profession bonus, and review Raw sale value beside the route results.",
            "caption": "The Stardew Valley Profit Calculator uses one selected stack as the baseline for every route."
          },
          {
            "number": "02",
            "eyebrow": "Use ingredient-specific conditions",
            "title": "Apply only the bonuses this ingredient can use",
            "body": "The Stardew Valley Profit Calculator applies quality, Tiller eligibility, Artisan pricing, Bear's Knowledge, and Coconut source only where the model supports them. A visible condition changes its defined price basis, not every ingredient bonus.",
            "caseHint": "Choose Blackberry (Bush Picked), select Tiller, and enable Bear's Knowledge.",
            "caption": "Bear's Knowledge changes the raw-sale comparison for eligible berries, not the finished product price."
          },
          {
            "number": "03",
            "eyebrow": "Respect recipe support",
            "title": "See when a machine has no recipe",
            "body": "Stardew Valley Profit Calculator keeps machine routes separate. If an ingredient lacks a recipe for a route, that route is marked unavailable and keeps the stack at raw value instead of implying a finished product.",
            "caseHint": "Choose Red Mushroom and inspect its unavailable route results.",
            "caption": "The Stardew Valley Profit Calculator keeps a missing recipe at raw value; it does not invent a product."
          },
          {
            "number": "04",
            "eyebrow": "Choose how to estimate",
            "title": "Separate full-stock value from capacity",
            "body": "Full-stock value in Stardew Valley Profit Calculator ignores machine counts and window limits, but unsupported stock or partial batches stay at raw value. Capacity mode uses machine counts and the processing window to count batches that can finish in time.",
            "caseHint": "Switch from Full-stock value to By machines and days, then set every machine count to zero.",
            "caption": "With no available capacity, the stack keeps its raw-sale value."
          },
          {
            "number": "05",
            "eyebrow": "Keep the assumptions",
            "title": "Copy the inputs with the results",
            "body": "The Stardew Valley Profit Calculator copies the selected ingredient, quantity, quality, profession, estimate mode, visible routes, and applicable condition or capacity inputs.",
            "caseHint": "Choose a stack and activate Copy results and assumptions.",
            "caption": "The copied summary identifies the settings behind each route result."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "What the calculator shows",
        "title": "One stack, a clear raw-versus-processed decision",
        "description": "In the Stardew Valley Profit Calculator, compare selected ingredients across recipes without treating alternative routes as additive.",
        "items": [
          {
            "title": "Raw-sale benchmark",
            "body": "Stardew Valley Profit Calculator shows the direct-sale value of the selected stack before any processing route."
          },
          {
            "title": "Route-level outcomes",
            "body": "The Stardew Valley Profit Calculator reports completed batches, finished value, raw remainder, and added value for each supported machine."
          },
          {
            "title": "Applicable price conditions",
            "body": "In Stardew Valley Profit Calculator, quality, profession, Bear's Knowledge, and Coconut source affect only price rules applicable to the selected ingredient."
          },
          {
            "title": "Assumption-aware copy",
            "body": "Copy selected inputs, estimate mode, visible routes, and applicable conditions with results in Stardew Valley Profit Calculator."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "How to use",
        "title": "Compare processing in three steps",
        "steps": [
          {
            "number": "01",
            "title": "Choose an ingredient and stack",
            "body": "In Stardew Valley Profit Calculator, select a listed raw ingredient and enter its quantity, supported quality, and profession. Add an extra condition only when the form shows one for that ingredient."
          },
          {
            "number": "02",
            "title": "Choose the estimate that fits your question",
            "body": "Stardew Valley Profit Calculator uses Full-stock value to compare complete supported batches without machine-count or time limits. Choose By machines and days when your machine counts and elapsed processing window matter."
          },
          {
            "number": "03",
            "title": "Compare one route with raw sale",
            "body": "Stardew Valley Profit Calculator reports added value, cycle, finished units, and raw remainder. Routes reuse the same stack independently, so choose one instead of summing; copy assumptions for a record."
          }
        ],
        "actionLabel": "Open the profit calculator"
      },
      "whyChoose": {
        "eyebrow": "Why use this calculator",
        "title": "Make the choice from your stack, not a headline price",
        "description": "Stardew Valley Profit Calculator keeps the raw-sale baseline and each recipe route visible, so you can see what changes the result.",
        "items": [
          {
            "number": "01",
            "title": "Start from direct sale",
            "body": "In Stardew Valley Profit Calculator, compare processing against the calculated raw-sale total for the selected quantity, quality, profession, and applicable conditions."
          },
          {
            "number": "02",
            "title": "Keep machine recipes separate",
            "body": "Keg, Preserves Jar, and Dehydrator are evaluated in Stardew Valley Profit Calculator as alternative routes over the same stack, not as one combined production chain."
          },
          {
            "number": "03",
            "title": "Show incomplete processing honestly",
            "body": "Stardew Valley Profit Calculator keeps unsupported recipes and units outside a complete batch at raw-sale value in route totals."
          },
          {
            "number": "04",
            "title": "Use only supported conditions",
            "body": "Ingredient-specific quality, profession, and special-condition rules are reflected without applying every bonus universally."
          },
          {
            "number": "05",
            "title": "Keep the estimate's limits clear",
            "body": "Full-stock value and capacity mode answer different questions in Stardew Valley Profit Calculator; neither mode creates a day-by-day production schedule."
          }
        ]
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Questions about processing value",
        "description": "Understand what the Stardew Valley Profit Calculator estimate compares and what remains outside it.",
        "items": [
          {
            "question": "Does Full-stock value mean every item is processed?",
            "answer": "No. In Stardew Valley Profit Calculator, removing machine-count and processing-window limits still processes only complete batches with a supported recipe. Unsupported ingredients and remainders that cannot fill another batch keep their raw-sale value."
          },
          {
            "question": "Can I add the Keg, Jar, and Dehydrator values together?",
            "answer": "No. Each route independently evaluates the same selected stack as if you chose that machine route. The values are alternatives for deciding what to do with the stack, not separate portions of allocated inventory."
          },
          {
            "question": "When should I use Full-stock value or By machines and days?",
            "answer": "Use Full-stock value to compare recipe value without capacity or time limits. Choose By machines and days when you want the estimate constrained by your available machines and the selected elapsed processing window."
          },
          {
            "question": "Do quality and profession settings affect every ingredient the same way?",
            "answer": "No. The form offers only quality tiers supported by the selected ingredient. Tiller, Artisan, Bear's Knowledge, and Coconut source follow their applicable rules; for example, Bear's Knowledge changes raw-sale value for eligible berries rather than the processed product price."
          },
          {
            "question": "Why does a route say that no recipe is available?",
            "answer": "Not every listed ingredient has a recipe for every machine. The unavailable route keeps the stack at raw-sale value and does not assign a product, batch size, or processing cycle."
          },
          {
            "question": "What does the capacity estimate assume about machine timing?",
            "answer": "In capacity mode, Stardew Valley Profit Calculator assumes finished goods are collected and machines are refilled once each morning. It reports game-minute cycle information and completed batches, not exact within-morning times or a daily schedule."
          },
          {
            "question": "What is included when I copy the results?",
            "answer": "The copied text includes the selected ingredient and settings, the estimate mode, applicable condition notes, visible routes, and each route's finished units, raw remainder, final value, and added value. Capacity assumptions and inputs are included when that mode is selected."
          }
        ]
      },
      "cta": {
        "title": "Ready to compare this stack?",
        "description": "Enter the ingredient and quantity you have to check processing against direct sale.",
        "label": "Open the profit calculator"
      },
      "comparison": {
        "eyebrow": "Choose by the decision at hand",
        "title": "Stardew Valley Profit Calculator vs. ValleyMath Profit Calculator vs. Stardew Valley Wiki: Artisan Goods",
        "description": "Start with stock you already hold. Stardew Valley Profit Calculator compares full-stock value or a machine-and-deadline estimate against selling that same stack raw.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Profit Calculator",
            "href": "/tools/basic-processing-profit"
          },
          {
            "name": "ValleyMath Profit Calculator",
            "href": "https://valleymath.com/stardew/profit-calculator"
          },
          {
            "name": "Stardew Valley Wiki: Artisan Goods",
            "href": "https://stardewvalleywiki.com/Artisan_Goods"
          }
        ],
        "rows": [
          {
            "label": "Start with",
            "values": [
              "Enter an ingredient and the quantity already in your inventory.",
              "Enter one item and quantity to compare supported artisan routes.",
              "Look up machine recipes, products and processing times."
            ]
          },
          {
            "label": "Value baseline",
            "values": [
              "Stardew Valley Profit Calculator shows raw-sale value, processed batches, raw leftovers, and added value versus selling the full stack raw.",
              "Compare each route with selling the same stack raw.",
              "Read product-price rules; apply them to your own quantity separately."
            ]
          },
          {
            "label": "Routes",
            "values": [
              "Compare Keg, Preserves Jar, and Dehydrator as separate uses of the same stack in Stardew Valley Profit Calculator.",
              "Show Keg, Jar and Dehydrator routes for the selected stack.",
              "Browse equipment and product tables by machine."
            ]
          },
          {
            "label": "Time and capacity",
            "values": [
              "Switch on this page between full-stock value and machine counts with a 7, 14 or 28-day window.",
              "The profit page shows full-stock routes; capacity is handled in its separate machine-comparison calculator.",
              "Find reference processing times; there is no per-inventory deadline estimate."
            ]
          },
          {
            "label": "Conditions",
            "values": [
              "Set quality and profession; eligible berries and coconuts expose their applicable special conditions.",
              "Set quality and profession for the item calculation.",
              "Read the general Artisan and ingredient-quality rules."
            ]
          },
          {
            "label": "Use the result",
            "values": [
              "Copy results and assumptions in English or Chinese.",
              "Copy the result and assumptions, or continue to the mixed-inventory planner.",
              "Follow the linked machine and item references; calculations are yours to assemble."
            ]
          }
        ]
      }
    },
    "machine-comparison": {
      "toolName": "Stardew Valley Keg vs Jar vs Dehydrator Calculator",
      "overview": {
        "eyebrow": "Choose where this stack can finish",
        "title": "Which machine route fits your stock and window?",
        "paragraphs": [
          "The Stardew Valley Keg vs Jar vs Dehydrator Calculator compares Keg, Preserves Jar, and Dehydrator processing for one selected ingredient stack. Set how many machines you have and choose the elapsed processing window.",
          "The Stardew Valley Keg vs Jar vs Dehydrator Calculator separates capacity results into completed batches and units still raw, alongside cycle, final value, and added value versus selling the original stack. Selected machine counts and the window apply independently to each route.",
          "In the Stardew Valley Keg vs Jar vs Dehydrator Calculator, filter results to one machine or all three. It does not divide one stock among machine types, add alternative routes together, or build a day-by-day work schedule."
        ],
        "aside": "An unsupported recipe or incomplete batch remains at raw-sale value."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "Compare three routes",
            "title": "Start with the same ingredient stack",
            "body": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator compares Keg, Preserves Jar, and Dehydrator using the selected ingredient, quantity, quality, and profession, so you can choose where to load the stack.",
            "caseHint": "Choose Blueberry, set Show routes to All machines, and compare all three machine routes.",
            "caption": "Each route in the Stardew Valley Keg vs Jar vs Dehydrator Calculator is an independent use of the same stock."
          },
          {
            "number": "02",
            "eyebrow": "Use your available capacity",
            "title": "Set machine counts and elapsed days",
            "body": "With the Stardew Valley Keg vs Jar vs Dehydrator Calculator, By machines and days mode uses your count for each machine and selected window. Only complete batches that fit capacity and cycle length count as finished.",
            "caseHint": "Choose By machines and days, keep the displayed processing window, and change one machine count.",
            "caption": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator applies the selected machine counts and elapsed window to capacity results."
          },
          {
            "number": "03",
            "eyebrow": "Read finished stock separately",
            "title": "See processed units and raw leftovers",
            "body": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator reports complete-batch units separately from raw units. Unsupported recipes, zero machines, or a window too short to finish a batch do not become finished goods.",
            "caseHint": "Choose Blueberry, set Quantity to 4, and inspect the Dehydrator route; its recipe needs a 5-item batch.",
            "caption": "The leftover column distinguishes finished output from raw inventory."
          },
          {
            "number": "04",
            "eyebrow": "Focus the comparison",
            "title": "Filter to one route or return to all",
            "body": "In the Stardew Valley Keg vs Jar vs Dehydrator Calculator, Show routes filters the view to one machine or All machines without changing stock allocation; it does not split the selected quantity.",
            "caseHint": "Change Show routes to Keg, then return it to All machines.",
            "caption": "Filtering changes the view, not the stock assigned to each alternative route."
          },
          {
            "number": "05",
            "eyebrow": "Check value and assumptions",
            "title": "Inspect cycle details before choosing",
            "body": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator shows cycle length, finished and raw units, final value, and added value over direct sale. Copy includes selected counts, window, and applicable conditions.",
            "caseHint": "Open Calculation details for a supported route, then activate Copy results and assumptions.",
            "caption": "The route details explain the displayed estimate without turning it into a schedule."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "Features",
        "title": "See what your machine setup can finish",
        "description": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator compares capacity-limited results for one stack across the three processing routes.",
        "items": [
          {
            "title": "Capacity for each machine",
            "body": "Enter Keg, Preserves Jar, and Dehydrator counts in the Stardew Valley Keg vs Jar vs Dehydrator Calculator to compare finished batches by route."
          },
          {
            "title": "Elapsed processing window",
            "body": "Choose the processing window in the Stardew Valley Keg vs Jar vs Dehydrator Calculator to see which complete batches finish within it."
          },
          {
            "title": "Finished goods and raw remainder",
            "body": "In the Stardew Valley Keg vs Jar vs Dehydrator Calculator, distinguish processed units from stock still raw because of batch size or capacity."
          },
          {
            "title": "Route details and copied assumptions",
            "body": "Inspect cycle details and copy route results with selected inputs in the Stardew Valley Keg vs Jar vs Dehydrator Calculator."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "How to use",
        "title": "Compare machine capacity in three steps",
        "steps": [
          {
            "number": "01",
            "title": "Choose the stock to compare",
            "body": "Select one raw ingredient, enter its quantity, and set supported quality and profession in the Stardew Valley Keg vs Jar vs Dehydrator Calculator. The same stack is evaluated independently in each route."
          },
          {
            "number": "02",
            "title": "Enter counts and a processing window",
            "body": "Choose By machines and days in the Stardew Valley Keg vs Jar vs Dehydrator Calculator, then select the elapsed window and machine counts. Full-stock value remains available to inspect complete recipe batches without those limits."
          },
          {
            "number": "03",
            "title": "Compare completed and raw units",
            "body": "Review cycle, final and added value against direct sale in the Stardew Valley Keg vs Jar vs Dehydrator Calculator. Filter to a machine or All machines, then copy assumptions if you need a record."
          }
        ],
        "actionLabel": "Compare machine routes"
      },
      "whyChoose": {
        "eyebrow": "Why compare routes",
        "title": "Check machine capacity against your actual stock",
        "description": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator makes capacity constraints visible before you choose which supported recipe to use.",
        "items": [
          {
            "number": "01",
            "title": "Use your own machine counts",
            "body": "Capacity estimates in the Stardew Valley Keg vs Jar vs Dehydrator Calculator use the count entered for each route instead of assuming unlimited machines."
          },
          {
            "number": "02",
            "title": "Compare the same elapsed window",
            "body": "Apply a selected processing-window length to each route in the Stardew Valley Keg vs Jar vs Dehydrator Calculator to see which complete batches fit."
          },
          {
            "number": "03",
            "title": "Spot stock that stays raw",
            "body": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator reports finished units and raw leftovers separately, including when a recipe batch cannot be completed."
          },
          {
            "number": "04",
            "title": "Inspect one route without losing context",
            "body": "Filter results to Keg, Preserves Jar, or Dehydrator in the Stardew Valley Keg vs Jar vs Dehydrator Calculator, then restore all routes using the same stack."
          },
          {
            "number": "05",
            "title": "Keep capacity assumptions explicit",
            "body": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator states its timing basis and morning handling assumption; it does not promise precise-time or day-by-day loading."
          }
        ]
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Questions about machine capacity",
        "description": "See how counts, processing windows, and route results fit together.",
        "items": [
          {
            "question": "What does the three-machine comparison use as its input?",
            "answer": "It uses one selected ingredient stack with its quantity, supported quality, profession, and any applicable special condition in the Stardew Valley Keg vs Jar vs Dehydrator Calculator. Keg, Preserves Jar, and Dehydrator routes each evaluate that same stack independently."
          },
          {
            "question": "How do machine counts and the processing window affect results?",
            "answer": "In By machines and days mode, each route uses its own entered machine count and the selected elapsed window. Only complete batches that fit that route's batch size and cycle are counted as finished."
          },
          {
            "question": "Does the tool split my stack between several machine types?",
            "answer": "No. Each route is an alternative calculation over the full selected stack. The tool does not allocate mixed inventory among machines or combine the route totals, so use the comparison to choose a route rather than add its results together."
          },
          {
            "question": "Can a batch count if it finishes on the last day of the window?",
            "answer": "Yes. The Stardew Valley Keg vs Jar vs Dehydrator Calculator counts a complete batch finishing on the selected window's final day. The window is elapsed processing time after stock is available, not a crop-season date or a day-by-day calendar."
          },
          {
            "question": "What does the once-each-morning assumption mean?",
            "answer": "Capacity mode assumes finished goods are collected and machines are refilled once each morning. It does not simulate the exact time within a morning when a product becomes ready or when a machine is refilled."
          },
          {
            "question": "Why can a route show raw leftovers or no recipe?",
            "answer": "A machine may not have a recipe for the selected ingredient, the stock may not fill another complete batch, or the chosen count and window may not allow a batch to finish. In those cases, the remaining units keep their raw-sale value."
          },
          {
            "question": "Does the comparison create a production schedule?",
            "answer": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator estimates completed batches, cycle information, and raw leftovers for your selected counts and window. It does not sequence daily loading, model exact within-morning times, or divide mixed stock among routes."
          }
        ]
      },
      "cta": {
        "title": "See which route fits your setup",
        "description": "Enter your stock, machine counts, and processing window to compare capacity-limited results.",
        "label": "Open machine comparison"
      },
      "comparison": {
        "eyebrow": "Compare the same stack three ways",
        "title": "Stardew Valley Keg vs Jar vs Dehydrator Calculator vs. ValleyMath and Stardew Valley Wiki",
        "description": "The Stardew Valley Keg vs Jar vs Dehydrator Calculator puts one stack through three independent routes, comparing added value, processing windows, and raw leftovers without combining alternatives.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Keg vs Jar vs Dehydrator Calculator",
            "href": "/tools/machine-comparison"
          },
          {
            "name": "ValleyMath Keg vs Jar vs Dehydrator Calculator",
            "href": "https://valleymath.com/stardew/keg-vs-jar"
          },
          {
            "name": "Stardew Valley Wiki: Artisan Goods",
            "href": "https://stardewvalleywiki.com/Artisan_Goods"
          }
        ],
        "rows": [
          {
            "label": "Shared input",
            "values": [
              "Use the Stardew Valley Keg vs Jar vs Dehydrator Calculator to apply the same ingredient, quantity, quality, and profession across all three alternatives.",
              "Compare all three machines with the same item, quality, deadline and machine counts.",
              "Look up each machine's recipe and output rules separately."
            ]
          },
          {
            "label": "What value means",
            "values": [
              "The Stardew Valley Keg vs Jar vs Dehydrator Calculator shows final and added value against the full stack's raw-sale baseline.",
              "See extra gold against raw sale, plus average added gold over the selected window.",
              "Read product prices and formulas; no personalized raw-stack comparison."
            ]
          },
          {
            "label": "Capacity window",
            "values": [
              "Set Keg, Jar and Dehydrator counts and a 7, 14 or 28-day window in the Stardew Valley Keg vs Jar vs Dehydrator Calculator; collection is modeled once each morning.",
              "Set each machine count and deadline; the page also shows average added gold per day in that window.",
              "Reference processing times do not include your machine counts or deadline."
            ]
          },
          {
            "label": "Raw leftovers",
            "values": [
              "The Stardew Valley Keg vs Jar vs Dehydrator Calculator shows processed units and raw units left; unsupported or incomplete routes keep raw value.",
              "Show processed and backlogged quantities for each route.",
              "Find batch recipes and their output; track your own remaining stock separately."
            ]
          },
          {
            "label": "Special conditions",
            "values": [
              "Eligible berries and coconuts use applicable raw-sale conditions in the Stardew Valley Keg vs Jar vs Dehydrator Calculator.",
              "Set quality and profession for the selected item.",
              "Consult the general quality and profession rules."
            ]
          },
          {
            "label": "Language and follow-up",
            "values": [
              "Use the same calculator in English or Chinese and copy results with assumptions.",
              "Copy a result and continue to a mixed-inventory planner.",
              "Use linked equipment and product references."
            ]
          }
        ]
      }
    },
    "keg-processing": {
      "toolName": "Keg processing",
      "overview": {
        "eyebrow": "Keg calculator",
        "title": "See what one Keg load is worth",
        "paragraphs": [
          "The Stardew Valley Keg Calculator answers a practical stock question: how much value can this Keg route add, and how much of the input is better left for raw sale?",
          "Choose an ingredient and quantity. The Stardew Valley Keg Calculator compares recipe output with selling that same stock raw, using your selected quality and eligible profession bonuses. Coffee and Rice Vinegar do not receive the Artisan product bonus.",
          "In the Stardew Valley Keg Calculator, Full-stock value counts complete recipe batches regardless of equipment or days. By machines and days uses your Keg count and a 7-, 14-, or 28-day window; capacity assumes one collection and reload each morning."
        ],
        "aside": "With the Stardew Valley Keg Calculator, each route uses the full stock independently. Compare route values rather than adding them together; incomplete batches and unprocessed items retain raw-sale value."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "Supported recipes",
            "title": "More than crop wine",
            "body": "Check supported fruit Wine, crop Juice, Pale Ale, Beer, Coffee, Green Tea, Mead, Vinegar and forage recipes with the Stardew Valley Keg Calculator. An item without a Keg recipe keeps its raw value.",
            "caseHint": "5 Coffee Beans · Normal · Artisan · Full-stock value",
            "caption": "For Coffee, the Stardew Valley Keg Calculator uses five beans per batch and no Artisan product bonus."
          },
          {
            "number": "02",
            "eyebrow": "Raw-sale baseline",
            "title": "Compare the same stock",
            "body": "Added value in the Stardew Valley Keg Calculator compares processing with selling the same stock as-is. Input quality and eligible Tiller or Artisan effects can change the raw-sale value.",
            "caseHint": "5 Cranberries · Normal · No profession · Full-stock value",
            "caption": "Finished batches and route value appear beside the raw-sale baseline in the Stardew Valley Keg Calculator."
          },
          {
            "number": "03",
            "eyebrow": "Batch details",
            "title": "Read one recipe at a time",
            "body": "Review input units, product price per batch, game-minute duration and modeled morning cycles in the Stardew Valley Keg Calculator before deciding what to load.",
            "caseHint": "1 Rice · Normal · Artisan · Full-stock value",
            "caption": "One Rice makes two Vinegar in the Stardew Valley Keg Calculator; Rice Vinegar has no Artisan product bonus."
          },
          {
            "number": "04",
            "eyebrow": "Keg capacity",
            "title": "Check the deadline first",
            "body": "Use By machines and days in the Stardew Valley Keg Calculator to include your Keg count and processing window. Batches that do not finish stay in the raw-sale remainder.",
            "caseHint": "5 Cranberries · Normal · 1 Keg · 7 days",
            "caption": "A Cranberry Wine cycle takes seven modeled mornings in the Stardew Valley Keg Calculator, so one Keg can finish one batch in this window."
          },
          {
            "number": "05",
            "eyebrow": "Keep the result",
            "title": "Save or copy your setup",
            "body": "Settings stay in this browser. Copy results with their assumptions when you want a compact record outside the calculator.",
            "caseHint": "5 Blueberries · 1 Keg · 7 days · Copy results",
            "caption": "The copied summary includes the selected settings and route values."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "Features",
        "title": "A clearer answer before you load a Keg",
        "description": "This Stardew Valley Keg Calculator turns one ingredient stack into a loading decision: see batch output, added value over raw sale, and what the deadline leaves unprocessed.",
        "items": [
          {
            "title": "Compare Keg profit with raw sale",
            "body": "Compare Keg profit with raw sale in the Stardew Valley Keg Calculator; the baseline prices the same stock at its selected quality and eligible profession settings."
          },
          {
            "title": "See recipe and time together",
            "body": "The Stardew Valley Keg Calculator puts output per batch, processing time and completed batches in one result."
          },
          {
            "title": "Estimate your Keg capacity",
            "body": "Use your Keg count and a 7-, 14- or 28-day window in the Stardew Valley Keg Calculator to include raw leftovers."
          },
          {
            "title": "Keep the assumptions nearby",
            "body": "Settings are saved in this browser by the Stardew Valley Keg Calculator, and results can be copied with their assumptions."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "How to use it",
        "title": "From stock to a Keg decision",
        "steps": [
          {
            "number": "01",
            "title": "Choose your ingredient stock",
            "body": "Select one listed ingredient in the Stardew Valley Keg Calculator, then enter its quantity and quality. The calculator evaluates that stack as one route input."
          },
          {
            "number": "02",
            "title": "Set profession and capacity",
            "body": "Choose a profession and estimate mode. In the Stardew Valley Keg Calculator, capacity uses your Keg count and a 7-, 14- or 28-day window."
          },
          {
            "number": "03",
            "title": "Review the batch and remainder",
            "body": "Review finished Keg batches and added value against the raw-sale baseline in the Stardew Valley Keg Calculator; copy assumptions if useful."
          }
        ],
        "actionLabel": "Calculate Keg profit"
      },
      "whyChoose": {
        "eyebrow": "Why use this calculator",
        "title": "Know what the Keg changes",
        "description": "Before loading stock, the Stardew Valley Keg Calculator shows what the recipe adds, how much can finish, and what remains worth raw sale.",
        "items": [
          {
            "number": "01",
            "title": "Start from your real stock",
            "body": "Estimate an inventory quantity in the Stardew Valley Keg Calculator without adding seed or purchase costs."
          },
          {
            "number": "02",
            "title": "Keep the raw alternative visible",
            "body": "In the Stardew Valley Keg Calculator, quality and eligible raw-sale bonuses affect the same-stock baseline."
          },
          {
            "number": "03",
            "title": "See the recipe cycle",
            "body": "Check game minutes and modeled mornings alongside finished value."
          },
          {
            "number": "04",
            "title": "Spot what stays unprocessed",
            "body": "Units beyond completed batches remain visible at their raw-sale value."
          },
          {
            "number": "05",
            "title": "Reuse a saved setup",
            "body": "Settings remain in this browser, and results include a copyable assumptions summary."
          }
        ]
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Keg calculator details",
        "description": "Understand the recipe, time and value assumptions before you use the estimate.",
        "items": [
          {
            "question": "How does the Stardew Valley Keg Calculator calculate added value?",
            "answer": "Added value is processed value plus raw-remainder value, minus the value of selling the full stock raw. It is an inventory comparison, so it does not deduct seed, purchase or machine-building costs."
          },
          {
            "question": "Which ingredients can I put in a Keg?",
            "answer": "The current ingredient list includes fruit for Wine, crops for Juice, Hops for Pale Ale, Wheat for Beer, Coffee Beans, Tea Leaves, Honey, Rice and supported forage items. If an item has no listed Keg recipe, the result keeps it at raw value."
          },
          {
            "question": "What is the difference between Full-stock and By machines and days?",
            "answer": "Full-stock values every complete recipe batch regardless of machine count or deadline. Capacity uses your assigned Kegs and selected processing window; incomplete batches stay in the raw-sale remainder."
          },
          {
            "question": "Are processing times an exact schedule in the Stardew Valley Keg Calculator?",
            "answer": "The recipe time is shown in game minutes. Capacity converts Keg time into ceil(minutes ÷ 1,600) modeled mornings and assumes you collect and reload once each morning; exact within-day timing is not simulated."
          },
          {
            "question": "How do quality and professions affect the estimate?",
            "answer": "Selected quality and eligible bonuses affect the raw-sale comparison. Artisan increases eligible Keg products, but Coffee and Rice Vinegar do not receive its product bonus. Bear's Knowledge changes raw value for eligible berries; Coconut source matters only for Coconut."
          },
          {
            "question": "Why can some ingredients or units remain raw?",
            "answer": "A recipe may not support the selected ingredient, the stock may be too small for one complete batch, or the window may not fit every cycle. Those units keep their raw-sale value in the result."
          },
          {
            "question": "Where are settings saved?",
            "answer": "Settings are saved in this browser. Copy results and assumptions for a portable text snapshot."
          }
        ]
      },
      "cta": {
        "title": "Ready to check your Keg stock?",
        "description": "Choose an ingredient, then compare its Keg output with the value of selling the stock raw.",
        "label": "Calculate Keg profit"
      },
      "comparison": {
        "eyebrow": "Check the Keg load you have",
        "title": "Stardew Valley Keg Calculator vs. ValleyMath Keg Calculator vs. Stardew Valley Wiki: Keg",
        "description": "The Stardew Valley Keg Calculator estimates what current stock can finish, what stays raw, and how much value processing adds before the selected deadline.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Keg Calculator",
            "href": "/tools/keg-processing"
          },
          {
            "name": "ValleyMath Keg Calculator",
            "href": "https://valleymath.com/stardew/keg-calculator"
          },
          {
            "name": "Stardew Valley Wiki: Keg",
            "href": "https://stardewvalleywiki.com/Keg"
          }
        ],
        "rows": [
          {
            "label": "Start with",
            "values": [
              "Enter the Keg input and amount you actually have.",
              "Choose an item, stock quantity, free Kegs and deadline.",
              "Browse Keg recipes, products, processing times and prices."
            ]
          },
          {
            "label": "Raw-sale comparison",
            "values": [
              "Compare the Keg result with selling the same stack raw; leftover units retain raw value.",
              "See added value versus raw sale and processed versus backlogged units.",
              "Read product prices and recipe rules; calculate your stock value separately."
            ]
          },
          {
            "label": "Deadline result",
            "values": [
              "Set Keg count and a 7, 14 or 28-day window; see completed batches and raw remainder.",
              "Set Keg count and deadline; see the batch count that fits.",
              "Look up the product's approximate game-minute cycle."
            ]
          },
          {
            "label": "Input conditions",
            "values": [
              "Set quality and profession; eligible berries or coconut show their source-specific raw-value condition.",
              "Set item quality and profession for the selected Keg route.",
              "Use the Keg recipe and profession reference tables."
            ]
          },
          {
            "label": "Time view",
            "values": [
              "See in-game processing minutes and the planning mornings used for the estimate.",
              "See input-specific game minutes and planned morning checks.",
              "See item processing time; times are labeled approximate on the reference page."
            ]
          },
          {
            "label": "Takeaway",
            "values": [
              "Copy the selected Keg estimate together with its assumptions in English or Chinese.",
              "Copy the result or continue to its mixed-inventory planner.",
              "Use the recipe, price and time tables as a reference."
            ]
          }
        ]
      }
    },
    "preserves-jar-processing": {
      "toolName": "Preserves Jar processing",
      "overview": {
        "eyebrow": "Preserves Jar guide",
        "title": "Decide what belongs in a Jar",
        "paragraphs": [
          "The Stardew Valley Preserves Jar Calculator answers what to put in jars by estimating Jelly or Pickles from one selected stock, then comparing the result with selling that same stock raw.",
          "In the Stardew Valley Preserves Jar Calculator, fruit uses Jelly. Supported vegetables, positive-energy forage, most mushrooms, Hops and Wheat use Pickles; Tea Leaves make Pickled Tea Leaves. Red Mushrooms and other unsupported items keep their raw value.",
          "A Jar recipe in the Stardew Valley Preserves Jar Calculator takes 4,000 in-game minutes, modeled as three mornings. Full-stock ignores machine counts and time; capacity uses your Jar count and chosen window, with one morning collection and reload assumed."
        ],
        "aside": "In the Stardew Valley Preserves Jar Calculator, selected ingredient quality changes the raw-sale baseline, not the Jar product price. Eligible Artisan bonuses change finished product prices."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "Fruit",
            "title": "See Jelly value",
            "body": "Check the Jar price for a complete fruit batch and its added value over raw sale in the Stardew Valley Preserves Jar Calculator. Items without a Jelly recipe remain at raw value.",
            "caseHint": "5 Cranberries · Normal · No profession · Full-stock value",
            "caption": "Five Cranberries produce five Jelly batches at 200g each in the Stardew Valley Preserves Jar Calculator before Artisan."
          },
          {
            "number": "02",
            "eyebrow": "Vegetables and forage",
            "title": "Check Pickles value",
            "body": "Supported vegetables, edible forage and most mushrooms use the Pickles route in the Stardew Valley Preserves Jar Calculator. Red Mushrooms are not supported in this model.",
            "caseHint": "1 Leek · Normal · No profession · Full-stock value",
            "caption": "One Leek produces Pickles priced at 170g before profession bonuses in the Stardew Valley Preserves Jar Calculator."
          },
          {
            "number": "03",
            "eyebrow": "Special Jar recipes",
            "title": "Include tea, Hops and Wheat",
            "body": "The Stardew Valley Preserves Jar Calculator lists Pickled Tea Leaves from Tea Leaves, plus Pickles from Hops and Wheat, so these stocks do not get a generic no-recipe result.",
            "caseHint": "1 Tea Leaves · Normal · Artisan · Full-stock value",
            "caption": "One batch of Tea Leaves yields Pickled Tea Leaves at 210g with Artisan in the Stardew Valley Preserves Jar Calculator."
          },
          {
            "number": "04",
            "eyebrow": "Jar capacity",
            "title": "Estimate by days",
            "body": "Switch to By machines and days in the Stardew Valley Preserves Jar Calculator to account for assigned Jars and the selected processing window. Raw leftovers stay visible in the result.",
            "caseHint": "5 Cranberries · 1 Jar · 7 days · By machines and days",
            "caption": "A Jar cycle takes three modeled mornings in the Stardew Valley Preserves Jar Calculator; one Jar can finish two batches in seven days."
          },
          {
            "number": "05",
            "eyebrow": "Raw remainder",
            "title": "Keep unsupported stock clear",
            "body": "A missing recipe, an incomplete batch or a deadline can leave ingredients unprocessed; the calculator keeps their direct-sale value in view.",
            "caseHint": "1 Red Mushroom · Normal · 1 Jar · 7 days",
            "caption": "Red Mushroom has no Jar recipe here, so its full raw value remains."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "Features",
        "title": "Make a Jar decision with the full stock in view",
        "description": "The Stardew Valley Preserves Jar Calculator compares Jelly and Pickles with direct sale, while keeping Jar batch times and remaining ingredients visible.",
        "items": [
          {
            "title": "Check Jelly and Pickles",
            "body": "See the listed Jar recipe and output value for a selected ingredient in the Stardew Valley Preserves Jar Calculator."
          },
          {
            "title": "Compare the same stock raw",
            "body": "Added value in the Stardew Valley Preserves Jar Calculator uses the full input stack's direct-sale value as its baseline."
          },
          {
            "title": "Estimate completed batches",
            "body": "Set the Jar count and a 7-, 14- or 28-day window in the Stardew Valley Preserves Jar Calculator when using capacity mode."
          },
          {
            "title": "Keep the remainder visible",
            "body": "Unsupported items and unprocessed units keep their raw-sale value in the Stardew Valley Preserves Jar Calculator result."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "How to use it",
        "title": "Check what to put in jars",
        "steps": [
          {
            "number": "01",
            "title": "Choose one ingredient",
            "body": "Select the raw item in the Stardew Valley Preserves Jar Calculator, then enter quantity and quality. The estimate treats the selected stock as one ingredient, not a mixed batch."
          },
          {
            "number": "02",
            "title": "Set the Jar conditions",
            "body": "Choose profession and estimate mode. In the Stardew Valley Preserves Jar Calculator, capacity uses your Jar count and a 7-, 14- or 28-day window."
          },
          {
            "number": "03",
            "title": "Review output and remainder",
            "body": "Compare Jelly or Pickles value with raw sale in the Stardew Valley Preserves Jar Calculator, then check completed batches and unprocessed stock."
          }
        ],
        "actionLabel": "Calculate Jar profit"
      },
      "whyChoose": {
        "eyebrow": "Why use this calculator",
        "title": "Know what a Jar can finish",
        "description": "Use the Stardew Valley Preserves Jar Calculator to understand recipe value, time and unprocessed ingredients before deciding what to preserve.",
        "items": [
          {
            "number": "01",
            "title": "Choose by recipe",
            "body": "See whether the Stardew Valley Preserves Jar Calculator assigns Jelly, Pickles or no Jar route to the selected item."
          },
          {
            "number": "02",
            "title": "Keep raw sale in the comparison",
            "body": "In the Stardew Valley Preserves Jar Calculator, selected quality affects raw opportunity value, not the Jar base recipe."
          },
          {
            "number": "03",
            "title": "Account for Jar count",
            "body": "Capacity mode estimates finished batches within your selected day window."
          },
          {
            "number": "04",
            "title": "See what will stay raw",
            "body": "A missing recipe or incomplete batch is shown at its raw-sale value."
          },
          {
            "number": "05",
            "title": "Save or copy your estimate",
            "body": "Settings stay in this browser, and the result can be copied with its assumptions."
          }
        ]
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Preserves Jar calculator details",
        "description": "Answers about Jelly, Pickles, timing and how the stock value is compared.",
        "items": [
          {
            "question": "Which ingredients have a Jar recipe?",
            "answer": "The current list includes fruit for Jelly, supported vegetables and positive-energy forage for Pickles, most listed mushrooms, plus Tea Leaves, Hops and Wheat. Red Mushroom has no Jar recipe in this calculator."
          },
          {
            "question": "How does the Stardew Valley Preserves Jar Calculator price Jelly and Pickles?",
            "answer": "The standard recipe uses twice the ingredient's base price plus 50g. The selected quality changes the raw-sale value used for comparison, not the Jar output price; Artisan applies to eligible finished goods."
          },
          {
            "question": "How long does a Jar batch take in the Stardew Valley Preserves Jar Calculator?",
            "answer": "The model uses 4,000 in-game minutes for a Jar recipe and rounds this to three mornings using 1,600 minutes per day. Capacity assumes collection and reload once each morning, not exact within-day timing."
          },
          {
            "question": "What does Full-stock value include?",
            "answer": "It values all complete batches regardless of Jar count or deadline. Any quantity that does not fill a batch or has no recipe remains valued at its direct-sale price."
          },
          {
            "question": "What does By machines and days include?",
            "answer": "Capacity mode uses the number of Jars assigned to this route and a 7-, 14- or 28-day window. It shows completed batches and raw leftovers; it does not schedule a mixed set of ingredients."
          },
          {
            "question": "Does ingredient quality change Jelly or Pickles value?",
            "answer": "No. Jar output uses the recipe's base price formula. Quality and eligible profession settings affect the alternative value of selling the ingredient raw, and Artisan can raise eligible Jar products."
          },
          {
            "question": "Are crop costs included in added value?",
            "answer": "No. Added value compares the final Jar route with selling the current stock raw; it does not subtract seed, purchase or machine costs. Settings are saved in this browser and can be copied with the assumptions."
          }
        ]
      },
      "cta": {
        "title": "Ready to choose what goes in your Jars?",
        "description": "Select one ingredient stock and compare its Jar output with the raw-sale value.",
        "label": "Calculate Jar profit"
      },
      "comparison": {
        "eyebrow": "Price the Jar queue in your chest",
        "title": "Stardew Valley Preserves Jar Calculator vs. ValleyMath Preserves Jar Calculator vs. Stardew Valley Wiki: Preserves Jar",
        "description": "Use actual ingredient quantity and Jar count in the Stardew Valley Preserves Jar Calculator to estimate finished Jelly, Pickles or other supported Jar goods, with raw leftovers kept in the result.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Preserves Jar Calculator",
            "href": "/tools/preserves-jar-processing"
          },
          {
            "name": "ValleyMath Preserves Jar Calculator",
            "href": "https://valleymath.com/stardew/preserves-jar-calculator"
          },
          {
            "name": "Stardew Valley Wiki: Preserves Jar",
            "href": "https://stardewvalleywiki.com/Preserves_Jar"
          }
        ],
        "rows": [
          {
            "label": "Supported inputs",
            "values": [
              "Choose a supported crop, mushroom or forage input and its quantity.",
              "Choose an item; the page describes Jelly, Pickles, Aged Roe and Caviar routes.",
              "Check which item categories make Jelly, Pickles, Aged Roe or Caviar."
            ]
          },
          {
            "label": "Raw baseline",
            "values": [
              "Compare the finished product and raw remainder with selling the whole input stack raw.",
              "Price Jelly, Pickles, Roe or Caviar against the selected raw stack.",
              "Read base-price formulas and ingredient-quality rules."
            ]
          },
          {
            "label": "Jar capacity",
            "values": [
              "Set available Jars and a 7, 14 or 28-day window to see completed work.",
              "Set actual Jar capacity and a deadline for the selected queue.",
              "Look up product processing times; no inventory-specific queue is calculated."
            ]
          },
          {
            "label": "Batch remainder",
            "values": [
              "Show completed units and unused raw ingredients separately.",
              "Show processed and backlogged quantity for the deadline.",
              "Review one-item recipes and output prices; track your remainder separately."
            ]
          },
          {
            "label": "Quality and profession",
            "values": [
              "Apply quality and profession to the raw-sale baseline and eligible output prices.",
              "Set quality and profession for the selected input.",
              "The finished product uses the ingredient's base value; input star quality does not change its product price."
            ]
          },
          {
            "label": "Use the result",
            "values": [
              "Copy the Jar estimate and assumptions in English or Chinese.",
              "Copy the result and continue to a mixed-inventory planner.",
              "Use product and timing tables as a reference while planning the queue yourself."
            ]
          }
        ]
      }
    },
    "dehydrator-processing": {
      "toolName": "Dehydrator processing",
      "overview": {
        "eyebrow": "Dehydrator guide",
        "title": "Know what a five-item batch is worth",
        "paragraphs": [
          "The Stardew Valley Dehydrator Calculator estimates dried fruit, dried mushrooms and Raisins from one selected stock, then compares the batch result with selling the same ingredients raw.",
          "Each batch in the Stardew Valley Dehydrator Calculator uses five matching ingredients at the selected quality. Output uses the listed recipe value; input quality affects the raw-sale baseline, while eligible Artisan bonuses affect the finished batch.",
          "Full-stock in the Stardew Valley Dehydrator Calculator counts complete batches without a machine limit. By machines and days includes Dehydrator count and a 7-, 14- or 28-day window; the model treats each batch as ready the next morning."
        ],
        "aside": "Any remainder below five stays raw in the Stardew Valley Dehydrator Calculator. A quantity under five, or a selected item without a Dehydrator recipe, keeps its full raw-sale value."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "Dried fruit",
            "title": "Compare a five-fruit batch",
            "body": "See the listed Dried Fruit output price, added value over raw sale and stock outside a complete batch in the Stardew Valley Dehydrator Calculator.",
            "caseHint": "5 Cranberries · Normal · No profession · Full-stock value",
            "caption": "Five Cranberries make one Dried Fruit batch in the Stardew Valley Dehydrator Calculator; extra items remain raw."
          },
          {
            "number": "02",
            "eyebrow": "Dried mushrooms",
            "title": "Check mushroom batches",
            "body": "The Stardew Valley Dehydrator Calculator includes listed mushroom recipes other than Red Mushroom. Unsupported items stay at raw value.",
            "caseHint": "5 Common Mushrooms · Normal · No profession · Full-stock value",
            "caption": "Five Common Mushrooms fill one Dried Mushrooms batch in the Stardew Valley Dehydrator Calculator."
          },
          {
            "number": "03",
            "eyebrow": "Raisins",
            "title": "Use the fixed Grape recipe",
            "body": "Five Grapes produce Raisins at the fixed batch price in the Stardew Valley Dehydrator Calculator; Artisan raises the eligible finished product price.",
            "caseHint": "5 Grapes (Foraged / Summer Seeds) · Artisan · Full-stock value",
            "caption": "The Stardew Valley Dehydrator Calculator shows Raisins at 600g per five-Grape batch, or 840g with Artisan."
          },
          {
            "number": "04",
            "eyebrow": "Capacity",
            "title": "Include machines and days",
            "body": "Capacity mode in the Stardew Valley Dehydrator Calculator estimates five-item batches within the selected Dehydrator count and processing window.",
            "caseHint": "6 Cranberries · Artisan · 1 Dehydrator · 7 days",
            "caption": "One batch can finish by the next morning; the sixth Cranberry stays raw."
          },
          {
            "number": "05",
            "eyebrow": "Raw remainder",
            "title": "See what cannot fill a batch",
            "body": "The result separates complete dried batches from any remaining ingredients and keeps the remainder's raw-sale value.",
            "caseHint": "4 Cranberries · Normal · No profession · Full-stock value",
            "caption": "Four items do not fill a five-item recipe batch, so all four remain raw."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "Features",
        "title": "Make every five-item decision visible",
        "description": "Use the Stardew Valley Dehydrator Calculator to compare dried-goods batches with raw sale and see how quantity, machine count and time leave stock unprocessed.",
        "items": [
          {
            "title": "Review dried-goods recipes",
            "body": "Check Dried Fruit, Dried Mushrooms and Raisins for the selected ingredient in the Stardew Valley Dehydrator Calculator."
          },
          {
            "title": "Understand the five-item batch",
            "body": "A complete batch in the Stardew Valley Dehydrator Calculator needs five matching units of one ingredient."
          },
          {
            "title": "Keep leftover stock visible",
            "body": "Remainders below five keep their raw-sale value in the Stardew Valley Dehydrator Calculator."
          },
          {
            "title": "Estimate next-morning capacity",
            "body": "Use your Dehydrator count and processing window in the Stardew Valley Dehydrator Calculator to estimate finished batches."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "How to use it",
        "title": "Check a Dehydrator batch",
        "steps": [
          {
            "number": "01",
            "title": "Select one ingredient and quality",
            "body": "Select one ingredient and quality in the Stardew Valley Dehydrator Calculator, then enter stock quantity. The estimate treats all selected units as one ingredient at the chosen quality."
          },
          {
            "number": "02",
            "title": "Choose mode and machine count",
            "body": "Full-stock ignores machine limits. For capacity in the Stardew Valley Dehydrator Calculator, set your Dehydrator count and a 7-, 14- or 28-day window."
          },
          {
            "number": "03",
            "title": "Review batches and leftovers",
            "body": "Check processed units, raw remainder, final value and added value over raw sale in the Stardew Valley Dehydrator Calculator."
          }
        ],
        "actionLabel": "Calculate Dehydrator batch profit"
      },
      "whyChoose": {
        "eyebrow": "Why use this calculator",
        "title": "See the batch and the remainder",
        "description": "The Stardew Valley Dehydrator Calculator applies the five-item rule to inventory without treating partial batches as completed output.",
        "items": [
          {
            "number": "01",
            "title": "Know the full-batch value",
            "body": "Compare listed dried-goods output with the direct-sale value of its inputs in the Stardew Valley Dehydrator Calculator."
          },
          {
            "number": "02",
            "title": "Keep input quality in context",
            "body": "In the Stardew Valley Dehydrator Calculator, input quality affects raw opportunity value while dried output follows its recipe price."
          },
          {
            "number": "03",
            "title": "See five-item remainders",
            "body": "Any units outside complete groups of five remain priced as raw ingredients."
          },
          {
            "number": "04",
            "title": "Estimate the next morning",
            "body": "Review the one-morning Dehydrator cycle with machine counts and deadline."
          },
          {
            "number": "05",
            "title": "Reuse or copy your setup",
            "body": "Settings stay in this browser, and results can be copied with assumptions."
          }
        ]
      },
      "faq": {
        "eyebrow": "Frequently asked questions",
        "title": "Dehydrator calculator details",
        "description": "Learn how five-item batches, output prices, capacity and raw leftovers are estimated.",
        "items": [
          {
            "question": "Why does the Stardew Valley Dehydrator Calculator require five matching items?",
            "answer": "The supported recipe takes five matching units of one ingredient and quality for each batch. The calculator does not combine different items into a mixed five-item batch."
          },
          {
            "question": "What can I dry in the Stardew Valley Dehydrator Calculator?",
            "answer": "The list includes supported fruit and most listed mushrooms, with Grape shown as Raisins. Red Mushroom has no Dehydrator route here; items without a listed recipe retain raw-sale value."
          },
          {
            "question": "How are Dried Fruit and Raisins valued?",
            "answer": "The model uses the listed batch recipe price and applies Artisan where eligible. Raisins have a fixed 600g price for five Grapes, or 840g with Artisan; the generic Dried Fruit formula is not used for Raisins."
          },
          {
            "question": "Does input quality affect dried output?",
            "answer": "No. The selected quality affects the alternative raw-sale value, while the dried product follows its recipe price. The same selected quality is used for all five batch inputs."
          },
          {
            "question": "When is a Dehydrator batch ready?",
            "answer": "The model treats a batch as ready the next morning. Capacity mode counts one-morning cycles and assumes a morning collection and reload; exact within-day timing is not modeled."
          },
          {
            "question": "What happens to one to four extra items?",
            "answer": "Any remainder below five is not counted as processed. Its units and raw-sale value stay in the result, so added value compares the finished batches plus raw remainder with selling the full stock raw."
          },
          {
            "question": "Does batch profit subtract crop or machine costs?",
            "answer": "No. It compares the finished batch value and raw remainder with selling the full inventory raw; seed, purchase and machine-building costs are not deducted. Settings are saved in this browser and can be copied with the assumptions."
          }
        ]
      },
      "cta": {
        "title": "Ready to check your five-item stock?",
        "description": "Select one ingredient and see the dried batch value alongside any raw remainder.",
        "label": "Calculate Dehydrator batch profit"
      },
      "comparison": {
        "eyebrow": "Keep every five-item batch visible",
        "title": "Stardew Valley Dehydrator Calculator vs. ValleyMath Dehydrator Calculator vs. Stardew Valley Wiki: Dehydrator",
        "description": "See how many complete five-item batches fit your Dehydrator count and deadline in the Stardew Valley Dehydrator Calculator, with unmatched stock valued as raw.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Dehydrator Calculator",
            "href": "/tools/dehydrator-processing"
          },
          {
            "name": "ValleyMath Dehydrator Calculator",
            "href": "https://valleymath.com/stardew/dehydrator-calculator"
          },
          {
            "name": "Stardew Valley Wiki: Dehydrator",
            "href": "https://stardewvalleywiki.com/Dehydrator"
          }
        ],
        "rows": [
          {
            "label": "Batch size",
            "values": [
              "Count complete five-item recipes for dried fruit, mushrooms and raisins.",
              "Price Dried Fruit, Dried Mushrooms and Raisins as five-item batches.",
              "Check the five matching input requirement and listed product recipes."
            ]
          },
          {
            "label": "Raw baseline",
            "values": [
              "Compare processed value with the same inputs sold raw.",
              "Compare the batch against the raw value of those inputs.",
              "Look up output formulas; calculate stock opportunity cost separately."
            ]
          },
          {
            "label": "Capacity window",
            "values": [
              "Set Dehydrator count and a 7, 14 or 28-day deadline.",
              "Set available Dehydrators and deadline for the selected input.",
              "See the next-morning cycle; no machine-count forecast is shown."
            ]
          },
          {
            "label": "Remainders",
            "values": [
              "Show unmatched units as raw leftovers rather than partial output.",
              "Keep incomplete five-item remainders visible in backlog.",
              "Read the five-item recipe rule; track the unmatched stock yourself."
            ]
          },
          {
            "label": "Input settings",
            "values": [
              "Set quality and profession; raw opportunity cost remains tied to the input stack.",
              "Set quality and profession for the selected item.",
              "Check that five mushrooms or fruit match by type and quality."
            ]
          },
          {
            "label": "Use the result",
            "values": [
              "Copy the estimate and assumptions in English or Chinese.",
              "Copy the result and continue to its mixed-inventory planner.",
              "Use the machine recipe and output table as a reference."
            ]
          }
        ]
      }
    },
    "keg-ingredient-ranking": {
      "toolName": "Keg ingredient ranking",
      "overview": {
        "eyebrow": "Choose your next Keg batch",
        "title": "Which ingredient is worth loading next?",
        "paragraphs": [
          "The Stardew Valley Keg Price List compares the extra value each complete recipe adds over selling its ingredients raw. The biggest product price does not always mean the best use of a Keg.",
          "The Stardew Valley Keg Price List compares added value per ingredient, per machine cycle, and per in-game processing minute. Each view answers a different question; the minute rate excludes collection waits.",
          "Use the Stardew Valley Keg Price List to select an ingredient and check your stock against free Kegs over a 7-, 14-, or 28-day window. The result separates finished batches from raw ingredients still on hand."
        ],
        "aside": "In the Stardew Valley Keg Price List, per-minute added value compares one recipe batch rather than forecasting daily throughput. Bear's Knowledge and Coconut source affect only raw-price cases where they apply."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "VALUE PER INPUT",
            "title": "Compare the gain per ingredient",
            "body": "The Stardew Valley Keg Price List shows how much added value one processed ingredient contributes after its raw-sale value and recipe batch are counted.",
            "caseHint": "Normal quality · No profession · Rank by: Per ingredient unit",
            "caption": "In the Stardew Valley Keg Price List, a per-ingredient view compares recipes with different batch sizes."
          },
          {
            "number": "02",
            "eyebrow": "VALUE PER CYCLE",
            "title": "See what a full Keg batch adds",
            "body": "Use the Stardew Valley Keg Price List to compare the added value of one complete recipe batch, including how many ingredients the Keg recipe consumes.",
            "caseHint": "Normal quality · No profession · Rank by: Per machine cycle",
            "caption": "The cycle measure in the Stardew Valley Keg Price List shows the return from one completed recipe batch."
          },
          {
            "number": "03",
            "eyebrow": "TIME EFFICIENCY",
            "title": "Put processing minutes in context",
            "body": "The Stardew Valley Keg Price List sorts one-batch added value by in-game Keg minutes. This rate excludes collection waits, so it is not a daily-throughput estimate.",
            "caseHint": "Normal quality · No profession · Rank by: Per processing minute; compare Hops with Ancient Fruit",
            "caption": "In the Stardew Valley Keg Price List, Hops ranks above Ancient Fruit per minute, while Ancient Fruit remains higher per cycle."
          },
          {
            "number": "04",
            "eyebrow": "RELEVANT PRICE RULES",
            "title": "Use the conditions that fit",
            "body": "The Stardew Valley Keg Price List filters by available quality and applies profession to eligible prices and rankings. Bear's Knowledge changes eligible berries' raw-sale value, while Coconut source determines whether Tiller applies to Coconut.",
            "caseHint": "Select Blackberry and enable Bear's Knowledge; then select Coconut and choose Purchased or gifted.",
            "caption": "The Stardew Valley Keg Price List uses only price assumptions that apply to the selected ingredient."
          },
          {
            "number": "05",
            "eyebrow": "YOUR STOCK",
            "title": "Carry the ranking into an inventory check",
            "body": "In the Stardew Valley Keg Price List, select a row and enter raw stock, free Kegs, and days. The inventory estimate counts finished batches and keeps leftovers at raw-sale value. Settings are saved in this browser, and the result can be copied.",
            "caseHint": "Select Coffee Bean · 23 raw units · 2 free Kegs · 14 days · Copy ranking and inventory result",
            "caption": "The Stardew Valley Keg Price List shows processed units separately from raw leftovers in the inventory result."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "What the ranking helps you decide",
        "title": "Three useful ways to compare a Keg batch",
        "description": "Use the Stardew Valley Keg Price List to match the measure to your question—per input, cycle, or minute—then test an ingredient against your stock and available machine time.",
        "items": [
          {
            "title": "Return per ingredient",
            "body": "The Stardew Valley Keg Price List compares added value per input unit when recipes use different batch sizes."
          },
          {
            "title": "Return per Keg cycle",
            "body": "Use the cycle measure in the Stardew Valley Keg Price List to see added value from one complete machine batch."
          },
          {
            "title": "Return per game minute",
            "body": "The Stardew Valley Keg Price List compares one-batch value with in-game processing time, excluding collection waits."
          },
          {
            "title": "Check a real stockpile",
            "body": "With the Stardew Valley Keg Price List, estimate finished batches, raw leftovers, and value added before the selected deadline."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "Use the ranking",
        "title": "From an ingredient choice to a stock estimate",
        "steps": [
          {
            "number": "01",
            "title": "Set the comparison",
            "body": "Choose the quality filter and ranking basis in the Stardew Valley Keg Price List; set profession and any visible price conditions that apply."
          },
          {
            "number": "02",
            "title": "Choose a row",
            "body": "Select an ingredient in the Stardew Valley Keg Price List to carry it into the inventory check. Use optional conditions only when Bear's Knowledge or Coconut source applies."
          },
          {
            "number": "03",
            "title": "Check the deadline",
            "body": "Enter raw stock, free Kegs, and 7, 14, or 28 days in the Stardew Valley Keg Price List. Review finished batches and leftovers, then copy the result if useful."
          }
        ],
        "actionLabel": "Compare Keg ingredients"
      },
      "whyChoose": {
        "eyebrow": "Why use this tool",
        "title": "Make the choice with your own constraints",
        "description": "The Stardew Valley Keg Price List connects recipe value to processing time and the stock you can actually load.",
        "items": [
          {
            "number": "01",
            "title": "Choose the right value measure",
            "body": "The Stardew Valley Keg Price List separates per-ingredient, per-cycle, and per-minute comparisons because each answers a different question."
          },
          {
            "number": "02",
            "title": "Compare finished recipe batches",
            "body": "Review each recipe's input count, product value, cycle, and added value together in the Stardew Valley Keg Price List."
          },
          {
            "number": "03",
            "title": "Keep price assumptions visible",
            "body": "Quality, profession, Bear's Knowledge, and Coconut source are reflected in the Stardew Valley Keg Price List where they apply."
          },
          {
            "number": "04",
            "title": "Plan around a real deadline",
            "body": "Use the Stardew Valley Keg Price List to check what can finish with your free Kegs and what remains raw."
          },
          {
            "number": "05",
            "title": "Keep a usable record",
            "body": "Keep your settings in this browser and copy the ranking with an inventory check from the Stardew Valley Keg Price List."
          }
        ]
      },
      "faq": {
        "eyebrow": "Common questions",
        "title": "Keg ranking questions",
        "description": "A quick guide to the ranking measures and the stock estimate.",
        "items": [
          {
            "question": "What do the three ranking measures mean?",
            "answer": "Per ingredient divides a batch's added value by its processed inputs. Per cycle shows the added value of one complete recipe batch. Per processing minute divides that batch value by its in-game Keg minutes."
          },
          {
            "question": "Does the per-minute rate predict daily output?",
            "answer": "No. It excludes collection waits and compares one recipe batch's added value with its processing minutes. The inventory estimate separately models your Keg count and deadline."
          },
          {
            "question": "Why can the ingredient order change by measure?",
            "answer": "Recipes consume different numbers of inputs and take different amounts of time. A large gain per batch can still be a smaller gain per ingredient or per processing minute."
          },
          {
            "question": "Why are some ingredients missing at a selected quality?",
            "answer": "The ranking filters out ingredients that lack the selected quality tier. Ingredients without quality tiers remain in the ranking at Normal quality regardless of this filter."
          },
          {
            "question": "What do Bear's Knowledge and Coconut source change?",
            "answer": "Bear's Knowledge changes raw-sale value for eligible berries. Coconut source affects whether Tiller applies to Coconut's raw price; neither setting changes unrelated ingredients."
          },
          {
            "question": "What does the inventory estimate count?",
            "answer": "It counts complete Keg batches that can finish within 7, 14, or 28 days using your free Kegs. Unprocessed ingredients stay in the estimate at raw-sale value."
          },
          {
            "question": "Are my settings or results shared automatically?",
            "answer": "Settings are saved in this browser. Use the copy action to export the ranking and selected inventory check; transfer to the production plan is not available here."
          }
        ]
      },
      "cta": {
        "title": "Ready to choose the next Keg batch?",
        "description": "Compare the value measures, then check a candidate against your own stock and free Kegs.",
        "label": "Compare Keg ingredients"
      },
      "comparison": {
        "eyebrow": "Rank first, then check your stock",
        "title": "Stardew Valley Keg Price List vs. ValleyMath Keg Price List vs. Stardew Valley Wiki: Keg Productivity",
        "description": "Browse Keg-compatible inputs before choosing one, then carry a ranked item into a stock estimate with free Kegs and a deadline.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Keg Price List",
            "href": "/tools/keg-ingredient-ranking"
          },
          {
            "name": "ValleyMath Keg Price List and Input Calculator",
            "href": "https://valleymath.com/stardew/what-to-put-in-kegs"
          },
          {
            "name": "Stardew Valley Wiki: Keg Productivity",
            "href": "https://stardewvalleywiki.com/Keg_Productivity"
          }
        ],
        "rows": [
          {
            "label": "Start with",
            "values": [
              "Rank Keg-compatible ingredients before you select one; then check a real stock amount.",
              "Browse a ranked Keg price list and test a selected stack.",
              "Browse a sortable productivity table of Keg inputs and outputs."
            ]
          },
          {
            "label": "Ranking basis",
            "values": [
              "Sort by added value per ingredient, machine cycle or processing minute.",
              "Sort by extra gold per input or per morning.",
              "Review input value, output value, productivity per minute and approximate gold per day."
            ]
          },
          {
            "label": "Current conditions",
            "values": [
              "Set quality and profession; eligible berries and coconut can use their source conditions.",
              "Set item quality and profession, then set free Kegs and deadline.",
              "Use reference quality rows and profession-specific table views."
            ]
          },
          {
            "label": "Stock estimate",
            "values": [
              "Select a ranked row and enter stock, free Kegs and days to see processed and raw-left units.",
              "Enter the item in your chest, quantity, free Kegs and deadline.",
              "The article table does not take a personal inventory amount."
            ]
          },
          {
            "label": "Read the rate",
            "values": [
              "Per processing minute excludes collection waiting and is not a daily throughput estimate.",
              "The page ranks by per-morning and per-input gain, with a separate deadline stock check.",
              "The article reports approximate gold per day and notes its continuous-refill assumption for sub-day cycles."
            ]
          },
          {
            "label": "Take it forward",
            "values": [
              "Copy the ranking and selected-stock result with its conditions.",
              "Copy the result or carry the stack into a mixed-inventory planner.",
              "Use the sortable reference values and linked Keg details."
            ]
          }
        ]
      }
    },
    "cask-aging": {
      "toolName": "Cellar aging",
      "overview": {
        "eyebrow": "Plan your cellar",
        "title": "When will this wine reach your target quality?",
        "paragraphs": [
          "The Stardew Valley Wine Aging Time Calculator estimates when your bottled Wine will reach its target quality. Set the fruit used to make it, its current quality, and the grade you want before loading Casks.",
          "The Stardew Valley Wine Aging Time Calculator counts only the stages still ahead: 14 days from Normal to Silver, 14 more to Gold, then 28 more to Iridium.",
          "Use the Stardew Valley Wine Aging Time Calculator to see the collection date on your farm calendar, added value per bottle, and how much of this batch fits in empty Casks. Artisan changes sale value, not aging speed."
        ],
        "aside": "The Stardew Valley Wine Aging Time Calculator models fruit Wine aging in Casks; Keg brewing is separate. Its 112-day reference starts with Normal Wine and assumes steady supply and immediate reloads."
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "NEXT QUALITY",
            "title": "Count only the time still needed",
            "body": "The Stardew Valley Wine Aging Time Calculator lets you choose current and target quality, then counts only remaining Cask time: 14 days to Silver, 14 more to Gold, and 28 more to Iridium.",
            "caseHint": "Starfruit Wine · Normal → Iridium · No Artisan",
            "caption": "In the Stardew Valley Wine Aging Time Calculator, the estimate begins from the selected quality; the sale profession does not shorten aging time."
          },
          {
            "number": "02",
            "eyebrow": "FARM CALENDAR",
            "title": "See the collection date across seasons",
            "body": "Enter the load season, day, and farm year in the Stardew Valley Wine Aging Time Calculator; the projected date carries remaining days into the correct season and year.",
            "caseHint": "Apple Wine · Silver → Gold · Winter 20, Year 1",
            "caption": "This verified Stardew Valley Wine Aging Time Calculator case collects in Spring 6, Year 2."
          },
          {
            "number": "03",
            "eyebrow": "VALUE PER BOTTLE",
            "title": "Compare value gained with time",
            "body": "The Stardew Valley Wine Aging Time Calculator shows target Wine value, gold added per bottle, and added value per Cask-day. Artisan changes sale value, not aging duration.",
            "caseHint": "Starfruit Wine · Normal → Silver · Artisan",
            "caption": "The Stardew Valley Wine Aging Time Calculator prices the wine from selected fruit, current and target quality, and sale profession."
          },
          {
            "number": "04",
            "eyebrow": "CASKS ON HAND",
            "title": "Plan the bottles that fit now",
            "body": "The Stardew Valley Wine Aging Time Calculator compares bottles ready with empty Casks, showing what fits, what waits, additional Casks needed, and Wood and Hardwood to craft them.",
            "caseHint": "Apple Wine · Silver → Gold · 5 bottles ready · 2 empty Casks",
            "caption": "In this Stardew Valley Wine Aging Time Calculator case, two bottles fit now; three wait while extra-Cask materials are shown."
          },
          {
            "number": "05",
            "eyebrow": "112-DAY REFERENCE",
            "title": "Estimate repeated Cask turns",
            "body": "The Stardew Valley Wine Aging Time Calculator shows full Normal-to-target cycles per Cask and bottle count across empty Casks in a 112-day window. It assumes steady Wine supply and immediate reloads.",
            "caseHint": "Apple Wine · Normal → Iridium · 2 empty Casks",
            "caption": "The 112-day reference in the Stardew Valley Wine Aging Time Calculator starts with Normal Wine and assumes each finished Cask is reloaded at once."
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "What this calculator covers",
        "title": "From a bottle's current grade to a cellar plan",
        "description": "The Stardew Valley Wine Aging Time Calculator brings the remaining aging stages, estimated sale value, and Cask capacity into one view.",
        "items": [
          {
            "title": "Remaining aging time",
            "body": "The Stardew Valley Wine Aging Time Calculator counts only the stages between the Wine's current quality and your target."
          },
          {
            "title": "Collection date",
            "body": "Use the Stardew Valley Wine Aging Time Calculator to carry remaining days across 28-day seasons and farm years."
          },
          {
            "title": "Added value",
            "body": "Review target bottle value and value added per Cask-day with the Stardew Valley Wine Aging Time Calculator."
          },
          {
            "title": "Loading capacity",
            "body": "The Stardew Valley Wine Aging Time Calculator shows bottles that fit, bottles waiting, and materials for extra Casks."
          }
        ]
      },
      "howToUse": {
        "eyebrow": "Build an aging plan",
        "title": "Set the bottle, target, and cellar date",
        "steps": [
          {
            "number": "01",
            "title": "Describe the Wine",
            "body": "Choose the fruit, current and target quality, and whether the sale uses Artisan in the Stardew Valley Wine Aging Time Calculator."
          },
          {
            "number": "02",
            "title": "Set the loading date",
            "body": "Enter the planned Cask loading season, day, and farm year in the Stardew Valley Wine Aging Time Calculator."
          },
          {
            "number": "03",
            "title": "Check the load and finish date",
            "body": "Enter ready bottles and empty Casks in the Stardew Valley Wine Aging Time Calculator. Compare the collection date, value, waiting bottles, and extra-Cask materials; copy the plan when useful."
          }
        ],
        "actionLabel": "Compare aging targets"
      },
      "whyChoose": {
        "eyebrow": "Why use this calculator",
        "title": "Decide before you load the cellar",
        "description": "The Stardew Valley Wine Aging Time Calculator lets you judge a target by remaining wait, sale value, and available Cask capacity together.",
        "items": [
          {
            "number": "01",
            "title": "Know the remaining wait",
            "body": "The Stardew Valley Wine Aging Time Calculator starts from your Wine's current quality, so earlier stages are not counted again."
          },
          {
            "number": "02",
            "title": "Put the date on your farm calendar",
            "body": "Read the projected season, day, and year in the Stardew Valley Wine Aging Time Calculator, including season and year rollover."
          },
          {
            "number": "03",
            "title": "Compare targets by value and time",
            "body": "The Stardew Valley Wine Aging Time Calculator shows gold added per bottle and per Cask-day; Artisan changes price, not the wait."
          },
          {
            "number": "04",
            "title": "Use the empty Casks you have",
            "body": "Use the Stardew Valley Wine Aging Time Calculator to separate bottles that fit this round from those waiting for more Casks."
          },
          {
            "number": "05",
            "title": "Keep the long-horizon assumption clear",
            "body": "The 112-day figure in the Stardew Valley Wine Aging Time Calculator describes Normal-to-target turns with continued Wine supply and immediate reloads."
          }
        ]
      },
      "faq": {
        "eyebrow": "Common questions",
        "title": "Wine Cask aging questions",
        "description": "Understand the quality timeline, value estimate, and cellar reference.",
        "items": [
          {
            "question": "What can I calculate here?",
            "answer": "This tool estimates Cask aging for fruit Wine that can be made from the selected fruit. Keg brewing time is separate; it does not calculate other Cask products or a mixed-cellar schedule."
          },
          {
            "question": "How long does each Wine quality stage take?",
            "answer": "Normal to Silver takes 14 days, Silver to Gold takes another 14 days, and Gold to Iridium takes another 28 days. A full Normal-to-Iridium path is 56 days."
          },
          {
            "question": "If my Wine is already Silver, does the estimate start over?",
            "answer": "No. Choose its current quality and the calculator counts only the stages remaining to the selected target. A target below the current quality is marked as already surpassed."
          },
          {
            "question": "Can the collection date cross into another season or year?",
            "answer": "Yes. Enter the Cask loading season, day, and farm year; the projected date rolls through the 28-day seasons and into later years as needed."
          },
          {
            "question": "Does Artisan make the Cask finish sooner?",
            "answer": "No. Artisan affects the estimated Wine sale value. The remaining days depend on the current and target qualities."
          },
          {
            "question": "What happens when I have fewer Casks than bottles?",
            "answer": "The load plan shows how many bottles fit now, how many wait, and how many additional Casks would match the remaining bottles, with their Wood and Hardwood cost."
          },
          {
            "question": "What does the 112-day figure assume?",
            "answer": "It counts full Normal-to-target cycles per Cask and bottles across your empty Casks, assuming a steady Wine supply and immediate reloads. It is a capacity reference, not a delivery schedule."
          }
        ]
      },
      "cta": {
        "title": "Choose the quality worth waiting for",
        "description": "Compare the collection date and added value before loading your Casks.",
        "label": "Compare aging targets"
      },
      "comparison": {
        "eyebrow": "Plan the cellar run for wine you have",
        "title": "Stardew Valley Wine Aging Time Calculator vs. ValleyMath Wine Aging Calculator vs. Stardew Valley Wiki: Cask",
        "description": "Set the Wine quality, target, start date, bottle count and empty Casks to estimate the collection date, added value and bottles waiting for space.",
        "cornerLabel": "Comparison",
        "products": [
          {
            "name": "Stardew Valley Wine Aging Time Calculator",
            "href": "/tools/cask-aging"
          },
          {
            "name": "ValleyMath Wine Aging Time Calculator",
            "href": "https://valleymath.com/stardew/wine-aging-calculator"
          },
          {
            "name": "Stardew Valley Wiki: Cask",
            "href": "https://stardewvalleywiki.com/Cask"
          }
        ],
        "rows": [
          {
            "label": "Start with",
            "values": [
              "Choose the Wine's current quality, target, season, day, year and available cellar stock.",
              "Set current and target quality, date, Wine amount, Casks and profession.",
              "Look up which artisan goods age in a Cask and the quality rules."
            ]
          },
          {
            "label": "Collection date",
            "values": [
              "Calculate remaining aging days and a date that rolls across seasons and years.",
              "Show the ready-to-collect date for the selected target.",
              "Reference the relative aging milestones; calculate your calendar date separately."
            ]
          },
          {
            "label": "Value added",
            "values": [
              "Separate current Wine value from added value per bottle and per Cask-day.",
              "Show input and target Wine values and added value for the modeled run.",
              "Read aged-product value formulas and quality multipliers."
            ]
          },
          {
            "label": "Cellar capacity",
            "values": [
              "Compare bottles with empty Casks; show waiting bottles, extra Cask materials and capacity references.",
              "Enter Wine and Cask counts and review cellar capacity for the run.",
              "Use static capacity and access notes for the Cellar layout."
            ]
          },
          {
            "label": "Scope",
            "values": [
              "This calculator models fruit Wine in the cellar; Keg brewing time is separate.",
              "The aging page focuses on Wine and links to Keg processing separately.",
              "Casks also accept Beer, Cheese, Goat Cheese, Mead and Pale Ale."
            ]
          },
          {
            "label": "Use the plan",
            "values": [
              "Copy a date, value and loading plan in English or Chinese.",
              "Copy the cellar plan and review the Wine aging formula.",
              "Use the broader Cask rules and layout facts as a reference."
            ]
          }
        ]
      }
    }
  },
  "zh-CN": {
    "basic-processing-profit": {
      "toolName": "星露谷物语加工收益计算器",
      "overview": {
        "eyebrow": "对比加工与直接出售",
        "title": "这批原料加工后能多赚吗？",
        "paragraphs": [
          "星露谷物语加工收益计算器先计算这批原料直接出售的价值，再与有配方支持的 Keg、罐头瓶和烘干机路线分别比较。选择你手头的原料、数量、品质和职业。",
          "每条路线都会显示完成批次、未加工余量、最终价值，以及相对整批直接出售的增值。直接出售基准会依据所选设置和该原料适用的特殊条件计算。",
          "全部加工收益不受机器数量和加工期限限制，但仍只加工有配方支持的完整批次。按机器与天数则会应用机器数量和经过天数。每条路线都独立计算同一批原料，应从中选择一条，不要把路线价值相加。"
        ],
        "aside": "机器没有对应配方或不足以装满下一批的原料，均保留直接出售价值。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "先看直接出售基准",
            "title": "对比加工前放弃的售价",
            "body": "直接出售总值会根据所选数量、支持的品质档位和适用职业设置计算。路线增值以整批直接出售价值为基准，而不是拿未经配置的配方价格作比较。",
            "caseHint": "选择蓝莓，保留普通品质和无职业加成，再查看直接出售基准与各路线结果。",
            "caption": "基准售价与每条加工路线都对应同一批原料。"
          },
          {
            "number": "02",
            "eyebrow": "选择适用的原料条件",
            "title": "只计算该原料能享受的加成",
            "body": "品质、耕种者资格、工匠售价、熊的知识和椰子来源，都只会在模型支持时生效。界面显示的条件只改变其对应的价格基准，不会让所有原料同时获得所有加成。",
            "caseHint": "选择黑莓（灌木丛采摘），选择耕种者，再开启熊的知识。",
            "caption": "熊的知识会改变适用浆果的直接出售基准，不改变加工成品售价。"
          },
          {
            "number": "03",
            "eyebrow": "明确配方支持情况",
            "title": "查看哪些机器没有对应配方",
            "body": "三条机器路线分别呈现。原料没有对应机器配方时，该路线会标为不可用，整批按直接出售价值计算，不会显示虚构的成品。",
            "caseHint": "选择红蘑菇并查看其不可用路线。",
            "caption": "没有配方时保留原料价值，不会编造加工产物。"
          },
          {
            "number": "04",
            "eyebrow": "按问题选择估算方式",
            "title": "区分整批潜在价值与机器产能",
            "body": "全部加工收益不受机器数量和期限限制，但无配方原料或不足完整批次的余量仍按原价计算。按机器与天数会根据所选机器数量和加工期限统计能完成的批次。",
            "caseHint": "从全部加工收益切换到按机器与天数，再将每种机器数量都设为零。",
            "caption": "没有可用产能时，原料仍保留直接出售价值。"
          },
          {
            "number": "05",
            "eyebrow": "保留估算依据",
            "title": "复制输入设置和路线结果",
            "body": "复制结果与假设会包含原料、数量、品质、职业、估算方式、当前可见路线，以及该估算适用的特殊条件或产能输入。",
            "caseHint": "选择一批原料，然后点击复制结果与假设。",
            "caption": "复制文本会说明路线结果所依据的设置。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "计算器能展示什么",
        "title": "围绕同一批原料作出加工选择",
        "description": "比较所选原料的直接售价与不同配方路线，不把备选路线误当作可叠加收益。",
        "items": [
          {
            "title": "直接出售基准",
            "body": "先查看整批原料直接出售的价值，再比较各条加工路线。"
          },
          {
            "title": "逐路线查看结果",
            "body": "检查完成批次、成品价值、原料余量和每台受支持机器带来的增值。"
          },
          {
            "title": "只计算适用条件",
            "body": "品质、职业、熊的知识与椰子来源只会影响该原料适用的价格规则。"
          },
          {
            "title": "复制完整估算依据",
            "body": "复制所选输入、估算方式、可见路线和适用条件，方便保留结果。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用方法",
        "title": "三步比较加工收益",
        "steps": [
          {
            "number": "01",
            "title": "选择原料和数量",
            "body": "选择列表中的原料并输入持有数量，再选该原料支持的品质和你的职业。只有表单针对该原料显示额外条件时才需要设置。"
          },
          {
            "number": "02",
            "title": "选择符合问题的估算方式",
            "body": "选择全部加工收益，可在不受机器数量和期限限制的前提下比较完整配方批次。若要考虑手头机器和经过天数，则选择按机器与天数。"
          },
          {
            "number": "03",
            "title": "将单条路线与直接出售比较",
            "body": "查看增值、加工周期、完成数量和原料余量。同一批原料会被每条路线独立估算，因此应选择一条路线，不要相加；需要留档时可复制假设。"
          }
        ],
        "actionLabel": "打开加工收益计算器"
      },
      "whyChoose": {
        "eyebrow": "为什么使用此计算器",
        "title": "根据手头原料决定，不只看成品标价",
        "description": "直接出售基准与各条配方路线并列展示，便于看清估算差异来自哪里。",
        "items": [
          {
            "number": "01",
            "title": "从直接出售开始比较",
            "body": "以所选数量、品质、职业和适用条件计算这批原料的直接出售总值。"
          },
          {
            "number": "02",
            "title": "机器配方分别核算",
            "body": "Keg、罐头瓶和烘干机作为同一批原料的备选路线分别计算，不会合成一条生产流程。"
          },
          {
            "number": "03",
            "title": "不夸大未完成加工",
            "body": "没有对应配方或不足以组成完整批次的原料，仍按直接出售价值计入路线总值。"
          },
          {
            "number": "04",
            "title": "条件只在适用时生效",
            "body": "按原料支持情况处理品质、职业和特殊条件，不会普遍套用所有加成。"
          },
          {
            "number": "05",
            "title": "清楚说明估算边界",
            "body": "全部加工收益与产能模式回答的是不同问题，两者都不会生成逐日生产排程。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "关于加工收益估算",
        "description": "了解计算器比较的内容和仍按原价处理的部分。",
        "items": [
          {
            "question": "全部加工收益是不是表示每件原料都会加工？",
            "answer": "不是。该模式不受机器数量和期限限制，但只加工有配方支持的完整批次。没有配方的原料，以及不足以装满下一批的余量，仍按直接出售价值计算。"
          },
          {
            "question": "可以把 Keg、罐头瓶和烘干机的结果相加吗？",
            "answer": "不可以。每条路线都假设将同一批原料用于该机器，结果代表彼此替代的选择，不是已分配到多种机器的不同库存份额。"
          },
          {
            "question": "什么时候选全部加工收益，什么时候选按机器与天数？",
            "answer": "想比较配方价值且暂不考虑产能和期限时，选全部加工收益。若需要根据现有机器数量和经过的加工天数估算可完成批次，则选按机器与天数。"
          },
          {
            "question": "品质和职业会对所有原料产生相同影响吗？",
            "answer": "不会。表单只提供该原料支持的品质档位；耕种者、工匠、熊的知识和椰子来源也按各自适用规则处理。例如熊的知识会提高适用浆果的直接出售价值，而不是加工成品售价。"
          },
          {
            "question": "为什么某条路线显示没有配方？",
            "answer": "并不是每种原料都能由每台机器加工。没有配方时，该路线会保留直接出售价值，不会提供成品名称、批次大小或加工周期。"
          },
          {
            "question": "产能估算如何处理机器收取和补料时间？",
            "answer": "产能模式假设每天早晨收取成品并为机器补料一次。结果会显示游戏内分钟和完成批次，但不会模拟某个早晨内的具体时刻，也不会生成逐日排程。"
          },
          {
            "question": "复制结果时会包含哪些内容？",
            "answer": "复制文本包含所选原料、设置、估算方式、适用条件、当前可见路线，以及每条路线的加工数量、原料余量、最终价值和增值。选择产能模式时，也会附上机器数量、加工期限和相关假设。"
          }
        ]
      },
      "cta": {
        "title": "准备比较这批原料了吗？",
        "description": "输入手头的原料和数量，看看加工与直接出售的差异。",
        "label": "打开加工收益计算器"
      },
      "comparison": {
        "eyebrow": "按当前要做的决定来比较",
        "title": "星露谷物语加工收益计算器与 ValleyMath 加工收益计算器、星露谷物语 Wiki 工匠商品资料对比",
        "description": "从手头库存开始，同页查看全库存价值或按机器数量与期限估算；每条加工路线都与整批原料直接出售比较。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语加工收益计算器",
            "href": "/zh/tools/basic-processing-profit"
          },
          {
            "name": "ValleyMath 加工收益计算器",
            "href": "https://valleymath.com/stardew/profit-calculator"
          },
          {
            "name": "星露谷物语 Wiki：工匠商品资料",
            "href": "https://stardewvalleywiki.com/Artisan_Goods"
          }
        ],
        "rows": [
          {
            "label": "从哪里开始",
            "values": [
              "输入手头已有的原料和数量。",
              "输入一种物品和数量，比较支持的加工路线。",
              "按机器查配方、产品和加工时间。"
            ]
          },
          {
            "label": "价值基准",
            "values": [
              "显示原售价值、加工批次和原料余量；增值相对整批原售计算。",
              "各路线与同一批原料直接出售比较。",
              "查产品售价规则，再自行代入库存数量。"
            ]
          },
          {
            "label": "加工路线",
            "values": [
              "同一批原料分别比较 Keg、罐头瓶和烘干机。",
              "为所选库存显示 Keg、罐头瓶和烘干机路线。",
              "按机器浏览设备和产品资料表。"
            ]
          },
          {
            "label": "时间与产能",
            "values": [
              "同页切换全库存价值，或输入机器数并估算 7、14、28 天期限。",
              "收益页按完整库存比较；产能期限估算在另一台机器比较计算器中。",
              "可查参考加工时间；不按个人库存估算期限产能。"
            ]
          },
          {
            "label": "计算条件",
            "values": [
              "设置品质和职业；适用浆果、椰子会显示对应的特殊条件。",
              "为物品计算设置品质和职业。",
              "查阅通用工匠职业和原料品质规则。"
            ]
          },
          {
            "label": "使用结果",
            "values": [
              "可复制中文或英文结果与计算假设。",
              "可复制结果与假设，或继续使用多库存生产计划。",
              "查看机器和物品参考资料；需自行组合计算。"
            ]
          }
        ]
      }
    },
    "machine-comparison": {
      "toolName": "星露谷物语三机加工对比计算器",
      "overview": {
        "eyebrow": "查看这批库存能在哪条路线完成",
        "title": "哪种机器适合你的原料和加工期限？",
        "paragraphs": [
          "星露谷物语三机加工对比计算器会对同一批原料分别估算 Keg、罐头瓶和烘干机路线。输入你拥有的机器数量，并选择经过的加工天数。",
          "产能结果会分别列出完成批次、仍为原料的余量、加工周期、最终价值和相对直接出售的增值。所选机器数量和加工期限会逐路线应用。",
          "使用路线筛选可单独查看一种机器，也可恢复显示三种路线。计算器不会把库存拆分到多种机器、把备选路线结果相加，或生成逐日工作排程。"
        ],
        "aside": "没有对应配方或不足完整批次的原料，仍按直接出售价值计算。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "比较三条加工路线",
            "title": "从同一批原料开始",
            "body": "Keg、罐头瓶和烘干机会使用同一原料、数量、品质和职业分别计算。你可以先比较各路线的结果，再决定把这批库存交给哪种机器。",
            "caseHint": "选择蓝莓，将显示路线设为全部机器，再比较三条机器路线。",
            "caption": "每条路线都独立使用同一批库存进行估算。"
          },
          {
            "number": "02",
            "eyebrow": "使用手头的产能",
            "title": "设置机器数量和经过天数",
            "body": "在按机器与天数模式中，填写每种机器数量并选择加工期限。只有能在该路线机器产能和周期内完成的完整批次才会计为成品。",
            "caseHint": "选择按机器与天数，保留当前显示期限，再修改一种机器的数量。",
            "caption": "产能结果会随机器数量和所选期限变化。"
          },
          {
            "number": "03",
            "eyebrow": "分开查看成品和原料",
            "title": "了解已加工数量与原料余量",
            "body": "每条路线都会分别报告加工成批的数量和仍为原料的余量。无配方、机器数量为零或期限不足以完成批次时，不会假设已经产出成品。",
            "caseHint": "选择蓝莓，将数量设为4，再查看烘干机路线；该配方需要5个原料组成一批。",
            "caption": "余量栏将成品数量与未加工库存分开显示。"
          },
          {
            "number": "04",
            "eyebrow": "聚焦一条路线",
            "title": "筛选单机结果或恢复全部路线",
            "body": "显示路线可以单独查看一种机器，也可以切回全部机器；原料和数量设置保持不变。筛选只改变可见路线，不会把库存分配到某种机器。",
            "caseHint": "将显示路线切换为 Keg，然后再切回全部机器。",
            "caption": "筛选改变查看方式，不改变备选路线各自使用同一批库存的设定。"
          },
          {
            "number": "05",
            "eyebrow": "核对价值与假设",
            "title": "查看周期明细后再选择",
            "body": "比较加工周期、完成数量、原料余量、最终价值和直接出售增值。复制结果与假设可保留本次选择的机器数量、期限和适用条件。",
            "caseHint": "打开一条受支持路线的计算明细，再点击复制结果与假设。",
            "caption": "路线明细解释当前估算，不会把它变成逐日排程。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "功能介绍",
        "title": "看看当前机器配置能完成多少",
        "description": "根据同一批原料和你的机器数量，比较三种加工路线在期限内的结果。",
        "items": [
          {
            "title": "逐机器估算产能",
            "body": "填写 Keg、罐头瓶和烘干机数量，比较每条路线能完成的批次。"
          },
          {
            "title": "选择经过的加工期限",
            "body": "选择窗口长度，查看哪些完整配方批次能在期限内完成。"
          },
          {
            "title": "区分成品与原料余量",
            "body": "分别查看加工数量，以及因批次或产能限制而仍为原料的库存。"
          },
          {
            "title": "核对周期并复制假设",
            "body": "查看加工周期说明，并将路线结果与所选输入一起复制。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用方法",
        "title": "三步比较机器产能",
        "steps": [
          {
            "number": "01",
            "title": "选择要比较的库存",
            "body": "选择一种原料并输入数量，再设置支持的品质和职业。同一批库存会被每条路线独立估算。"
          },
          {
            "number": "02",
            "title": "填写机器数量与加工期限",
            "body": "选择按机器与天数模式，设置经过天数和现有机器数量。若想暂时不考虑产能和期限，也可以查看全部加工收益。"
          },
          {
            "number": "03",
            "title": "比较完成批次和原料余量",
            "body": "查看周期、最终价值和相对直接出售的增值。可筛选单种机器或恢复全部路线，需要留档时复制估算假设。"
          }
        ],
        "actionLabel": "比较机器路线"
      },
      "whyChoose": {
        "eyebrow": "为什么比较加工路线",
        "title": "用实际库存和机器数量作判断",
        "description": "在选择加工配方前，先看清机器产能和期限如何影响结果。",
        "items": [
          {
            "number": "01",
            "title": "按现有机器数量估算",
            "body": "产能模式会使用你为每种路线填写的机器数，不会假设机器无限。"
          },
          {
            "number": "02",
            "title": "在同一经过时长下比较",
            "body": "为每条路线应用所选的加工期限，查看哪些完整批次可以完成。"
          },
          {
            "number": "03",
            "title": "看清仍为原料的部分",
            "body": "将已加工数量与原料余量分开显示，包括不能完成下一批的库存。"
          },
          {
            "number": "04",
            "title": "单独查看路线而不丢设置",
            "body": "筛选 Keg、罐头瓶或烘干机，再切回全部路线继续比较同一批原料。"
          },
          {
            "number": "05",
            "title": "明确说明产能假设",
            "body": "估算会说明时间口径和早晨收取、补料假设，不承诺精确到时刻或逐日装料计划。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "关于机器产能比较",
        "description": "了解机器数量、加工期限与路线结果之间的关系。",
        "items": [
          {
            "question": "三机比较使用哪些输入？",
            "answer": "它会使用一种原料及其数量、支持的品质、职业和适用的特殊条件。Keg、罐头瓶和烘干机路线都会独立估算这同一批库存。"
          },
          {
            "question": "机器数量和加工期限如何影响结果？",
            "answer": "在按机器与天数模式中，每条路线使用自己的机器数量和所选经过天数。只有符合该路线批次大小和加工周期的完整批次才会计为已完成。"
          },
          {
            "question": "计算器会把库存分配到几种机器吗？",
            "answer": "不会。每条路线都是用整批所选原料进行的备选估算。计算器不会把混合库存分配给多种机器，也不会合并路线总值；应根据结果选择路线，而不是相加。"
          },
          {
            "question": "批次在期限最后一天完成时会计入吗？",
            "answer": "会。若完整批次恰好在所选加工窗口的最后一天完成，也会计入结果。窗口表示原料可用后的经过加工时间，不是作物季节日期，也不代表逐日日历。"
          },
          {
            "question": "每天早晨一次的假设是什么意思？",
            "answer": "产能模式假设每天早晨收取成品并为机器补料一次。它不会模拟成品在某个早晨内的具体完成时刻，也不会模拟补料发生在早晨的哪个时间。"
          },
          {
            "question": "为什么路线会有原料余量或显示无配方？",
            "answer": "所选原料可能没有对应机器配方；库存可能不足以组成下一完整批次；机器数量或期限也可能不足以完成加工。此时剩余部分仍按原料直接售价保留价值。"
          },
          {
            "question": "三机比较会生成生产排程吗？",
            "answer": "不会。它根据机器数量和加工期限估算完成批次、周期信息和原料余量，但不安排每天的装料顺序、不模拟早晨内的具体时刻，也不会把混合库存分配给不同路线。"
          }
        ]
      },
      "cta": {
        "title": "查看哪条路线符合你的配置",
        "description": "输入库存、机器数量和加工期限，比较受产能限制的结果。",
        "label": "打开三机比较"
      },
      "comparison": {
        "eyebrow": "同一批原料，比较三种去向",
        "title": "星露谷物语加工机器比较计算器与 ValleyMath 三机比较计算器、星露谷物语 Wiki 工匠商品资料对比",
        "description": "将同一批原料分别放入三种机器路线，比较加工增值、期限内产量和原料余量；三行结果是备选方案，不能相加。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语加工机器比较计算器",
            "href": "/zh/tools/machine-comparison"
          },
          {
            "name": "ValleyMath 三机比较计算器",
            "href": "https://valleymath.com/stardew/keg-vs-jar"
          },
          {
            "name": "星露谷物语 Wiki：工匠商品资料",
            "href": "https://stardewvalleywiki.com/Artisan_Goods"
          }
        ],
        "rows": [
          {
            "label": "统一输入",
            "values": [
              "三条备选路线使用同一种原料、数量、品质和职业。",
              "三种机器使用同一物品、品质、期限和机器数量比较。",
              "分别查询各机器的配方和产物规则。"
            ]
          },
          {
            "label": "价值含义",
            "values": [
              "显示最终价值，以及相对整批原售的加工增值。",
              "显示相对原售的额外金币，也显示期限内平均每日增值。",
              "查询产品售价与公式；不代入个人库存比较原售基准。"
            ]
          },
          {
            "label": "期限产能",
            "values": [
              "分别设置三种机器数量与 7、14、28 天期限；按每天早晨收取和补料估算。",
              "设置各机器数量和期限，并显示期限内平均每日增值。",
              "提供参考加工时间，不代入机器数量或截止期限。"
            ]
          },
          {
            "label": "原料余量",
            "values": [
              "显示已加工和剩余原料；不支持或未完成的批次仍按原价计算。",
              "显示各路线完成数量和未完成库存。",
              "可查配方与产出；余料由玩家自行记录。"
            ]
          },
          {
            "label": "特殊条件",
            "values": [
              "适用的浆果和椰子可设置对应的原售条件。",
              "可设置所选物品的品质和职业。",
              "查阅通用品质与职业规则。"
            ]
          },
          {
            "label": "语言与后续使用",
            "values": [
              "可切换中文或英文，并复制结果与假设。",
              "可复制单次结果并继续进入多库存生产计划。",
              "通过链接继续查阅设备和产物资料。"
            ]
          }
        ]
      }
    },
    "keg-processing": {
      "toolName": "Keg 加工",
      "overview": {
        "eyebrow": "Keg 加工指南",
        "title": "先算清一批 Keg 原料的价值",
        "paragraphs": [
          "星露谷物语 Keg 加工计算器会显示这批原料加工后的价值、相对直接出售的增值，以及还按原价保留的原料余量。",
          "选择一项原料和数量，工具按配方计算成品，并把同一批库存直接出售的价值作为基准。所选品质和适用职业加成会影响原售价值；咖啡与米醋成品不享受工匠加成。",
          "“全部加工收益”按完整批次估算，不受机器数和期限影响；“按机器与天数”会使用 Keg 数量与 7、14 或 28 天窗口，并假设每天早晨收取成品、补料一次。"
        ],
        "aside": "每条路线都独立使用整批原料，结果不能相加；不足一批或期限内未完成的原料仍按直接出售价值计入。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "支持的配方",
            "title": "不止果酒",
            "body": "查看水果葡萄酒、作物果汁、啤酒花淡啤酒、小麦啤酒、咖啡、绿茶、蜂蜜酒、米醋及支持的采集物配方。没有 Keg 配方的原料保留原售价值。",
            "caseHint": "5 个咖啡豆 · 普通 · 工匠 · 全部加工收益",
            "caption": "咖啡每批需要五颗咖啡豆，成品不享受工匠加成。"
          },
          {
            "number": "02",
            "eyebrow": "原售基准",
            "title": "比较同一批库存",
            "body": "增值是加工结果相对整批原料直接出售的差额。品质以及适用的耕种者或工匠加成会改变原售基准。",
            "caseHint": "5 个蔓越莓 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "结果会同时显示直接出售基准和 Keg 成品价值。"
          },
          {
            "number": "03",
            "eyebrow": "批次明细",
            "title": "逐批查看配方",
            "body": "查看每批消耗数量、成品售价、游戏分钟数与模型折算的早晨周期，再决定是否投料。",
            "caseHint": "1 份大米 · 普通 · 工匠 · 全部加工收益",
            "caption": "一份大米产出两瓶米醋；米醋不享受工匠成品加成。"
          },
          {
            "number": "04",
            "eyebrow": "Keg 产能",
            "title": "先看期限内能完成多少",
            "body": "切换到“按机器与天数”，填入 Keg 数量和加工期限。未能在期限内完成的批次会保留在原售余量中。",
            "caseHint": "5 个蔓越莓 · 普通 · 1 个 Keg · 7 天",
            "caption": "蔓越莓葡萄酒周期按七个早晨估算，单个 Keg 可在此窗口完成一批。"
          },
          {
            "number": "05",
            "eyebrow": "保存结果",
            "title": "保留当前计算",
            "body": "设置保存在当前浏览器中。需要在计算器外记录时，可以复制结果及其计算假设。",
            "caseHint": "5 个蓝莓 · 1 个 Keg · 7 天 · 复制结果",
            "caption": "复制文本包含当前设置、路线价值和计算假设。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "功能介绍",
        "title": "装入 Keg 前先看清结果",
        "description": "把一项原料库存变成明确的 Keg 决策：查看每批产出、相对原售的增值，以及期限内未加工的余量。",
        "items": [
          {
            "title": "比较 Keg 与直接出售",
            "body": "用所选品质和适用职业设置，计算同一批库存的原售基准。"
          },
          {
            "title": "把配方与时间放在一起看",
            "body": "同时查看每批产出、加工周期和预计完成批次。"
          },
          {
            "title": "估算 Keg 产能",
            "body": "按 Keg 数量与 7、14 或 28 天窗口计入原料余量。"
          },
          {
            "title": "保存计算假设",
            "body": "设置保存在本机浏览器，结果可连同假设一起复制。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用步骤",
        "title": "从库存到 Keg 决策",
        "steps": [
          {
            "number": "01",
            "title": "选择原料库存",
            "body": "从列表选择一项原料，输入数量和品质。计算器会把这批库存作为一条路线的输入。"
          },
          {
            "number": "02",
            "title": "设置职业和产能",
            "body": "选择职业与估算方式。按产能估算时，填写 Keg 数量并选择 7、14 或 28 天期限。"
          },
          {
            "number": "03",
            "title": "查看批次与余量",
            "body": "比较完成批次、加工增值和直接出售基准；需要时复制结果与假设。"
          }
        ],
        "actionLabel": "计算 Keg 加工收益"
      },
      "whyChoose": {
        "eyebrow": "为什么使用此工具",
        "title": "看清 Keg 实际改变了什么",
        "description": "投料前先核对配方增值、期限内可完成的数量，以及仍适合直接出售的余量。",
        "items": [
          {
            "number": "01",
            "title": "从现有库存开始",
            "body": "按手头原料数量估算，不额外加入种子或购买成本。"
          },
          {
            "number": "02",
            "title": "保留原售对照",
            "body": "品质与适用加成会反映在同一批库存的原售基准中。"
          },
          {
            "number": "03",
            "title": "看见配方周期",
            "body": "成品价值旁同时列出游戏分钟和模型周期早晨数。"
          },
          {
            "number": "04",
            "title": "发现未加工余量",
            "body": "未完成批次会按直接出售价值保留在结果里。"
          },
          {
            "number": "05",
            "title": "重复使用当前设置",
            "body": "本机浏览器保存设置，结果可以连同假设一起复制。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "Keg 计算说明",
        "description": "使用估算前，先了解配方、时间与价值口径。",
        "items": [
          {
            "question": "Keg 加工收益怎么算？",
            "answer": "增值 = 加工成品价值 + 原料余量价值 − 整批原料直接出售价值。这是库存价值比较，不扣种子、购买原料或建造机器的成本。"
          },
          {
            "question": "Keg 可以加工哪些原料？",
            "answer": "当前列表包含水果葡萄酒、作物果汁、啤酒花淡啤酒、小麦啤酒、咖啡、茶叶、蜂蜜、大米和支持的采集物。若所选原料没有 Keg 配方，结果会保留其直接出售价值。"
          },
          {
            "question": "“全部加工收益”和“按机器与天数”有什么区别？",
            "answer": "“全部加工收益”按所有完整配方批次估值，不受机器数量和期限影响。“按机器与天数”使用已分配的 Keg 数量和所选期限；不足一批的原料仍按原价计入。"
          },
          {
            "question": "Keg 周期是精确排程吗？",
            "answer": "配方时间以游戏分钟显示；产能估算按 ceil(分钟 ÷ 1,600) 折算早晨数，并假设每天早晨收取成品、补料一次。模型不计算早晨内具体时刻。"
          },
          {
            "question": "品质和职业如何影响结果？",
            "answer": "所选品质和适用加成会影响原售对照；工匠会提高适用的 Keg 成品售价，但咖啡与米醋成品不享受该加成。熊的知识只改变适用浆果原售，椰子来源只在选择椰子时相关。"
          },
          {
            "question": "为什么有些原料仍按原价计入？",
            "answer": "所选原料可能没有配方、数量可能不足一批，或期限内无法完成所有周期。这些原料仍按直接出售价值计算，不会被当作已加工成品。"
          },
          {
            "question": "设置保存在哪里？",
            "answer": "设置保存在当前浏览器中；可复制结果与假设，留存文本记录。"
          }
        ]
      },
      "cta": {
        "title": "准备检查这批 Keg 原料了吗？",
        "description": "选择一项库存，比较 Keg 成品与整批原料直接出售的价值。",
        "label": "计算 Keg 加工收益"
      },
      "comparison": {
        "eyebrow": "先核对手头这批 Keg 原料",
        "title": "星露谷物语 Keg 加工计算器与 ValleyMath Keg 计算器、星露谷物语 Wiki Keg 资料对比",
        "description": "按手头库存估算期限内能完成多少 Keg 批次、剩下多少原料，以及加工相对直接出售增加的价值。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语 Keg 加工计算器",
            "href": "/zh/tools/keg-processing"
          },
          {
            "name": "ValleyMath Keg 计算器",
            "href": "https://valleymath.com/stardew/keg-calculator"
          },
          {
            "name": "星露谷物语 Wiki：Keg 资料",
            "href": "https://stardewvalleywiki.com/Keg"
          }
        ],
        "rows": [
          {
            "label": "从哪里开始",
            "values": [
              "输入手头准备放进 Keg 的原料和数量。",
              "选择物品、库存数量、空闲 Keg 数和截止期限。",
              "查询 Keg 配方、产品、加工时间和售价。"
            ]
          },
          {
            "label": "与原售比较",
            "values": [
              "将 Keg 结果与整批原料直接出售比较；剩余数量仍按原售价计入。",
              "显示相对原售的增值，以及已加工和未完成数量。",
              "查产品售价与配方；个人库存价值需另行计算。"
            ]
          },
          {
            "label": "期限结果",
            "values": [
              "设置 Keg 数量和 7、14、28 天窗口，查看完成批次与原料余量。",
              "设置 Keg 数量和期限，查看可完成的批次。",
              "查询产品对应的游戏内加工分钟。"
            ]
          },
          {
            "label": "输入条件",
            "values": [
              "设置品质和职业；适用浆果或椰子会显示来源相关的原售条件。",
              "为所选 Keg 路线设置物品品质和职业。",
              "查 Keg 配方与职业参考表。"
            ]
          },
          {
            "label": "时间视图",
            "values": [
              "同时显示游戏内加工分钟和估算所用的加工早晨数。",
              "显示所选物品的游戏内分钟和计划早晨数。",
              "查询物品加工时间；页面注明时间为近似值。"
            ]
          },
          {
            "label": "使用结果",
            "values": [
              "可复制中文或英文的 Keg 估算结果与假设。",
              "可复制结果，或继续使用其多库存生产计划。",
              "将配方、售价和时间表作为查阅资料。"
            ]
          }
        ]
      }
    },
    "preserves-jar-processing": {
      "toolName": "罐头瓶加工",
      "overview": {
        "eyebrow": "罐头瓶指南",
        "title": "先判断哪些原料值得腌制",
        "paragraphs": [
          "星露谷物语罐头瓶计算器回答“什么适合放进罐头瓶”：估算一项库存做成果酱或腌菜后的价值，再与同一批原料直接出售作比较。",
          "水果使用果酱配方；当前列表中的蔬菜、正体力采集物、大多数蘑菇，以及茶叶、啤酒花和小麦会显示相应腌制配方。红蘑菇等无配方原料保留原售价值。",
          "罐头瓶配方耗时 4,000 游戏分钟，模型按三个早晨周期估算。全部加工收益不受机器数和期限影响；按机器与天数则使用罐头瓶数量和所选窗口，并假设每天早晨收取、补料一次。"
        ],
        "aside": "所选原料品质只影响直接出售基准，不改变罐头瓶成品价；符合条件的成品售价会受工匠加成影响。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "水果",
            "title": "查看果酱价值",
            "body": "查看完整水果批次制作成果酱后的售价，以及相对直接出售的增值。没有果酱配方的原料仍保留原售价值。",
            "caseHint": "5 个蔓越莓 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "五个蔓越莓分别制作成果酱，每份基础售价为 200 金。"
          },
          {
            "number": "02",
            "eyebrow": "蔬菜与采集物",
            "title": "查看腌菜价值",
            "body": "支持的蔬菜、可食用采集物和大多数蘑菇会使用腌菜路线；本模型不支持红蘑菇。",
            "caseHint": "1 个韭葱 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "一个韭葱可制作成售价 170 金的腌菜，未计职业加成。"
          },
          {
            "number": "03",
            "eyebrow": "特殊配方",
            "title": "补上茶叶、啤酒花和小麦",
            "body": "原料列表还包含腌茶叶，以及啤酒花和小麦的腌菜配方，不会把这些原料一律标成无配方。",
            "caseHint": "1 份茶叶 · 普通 · 工匠 · 全部加工收益",
            "caption": "一份茶叶制成腌茶叶，工匠售价为 210 金。"
          },
          {
            "number": "04",
            "eyebrow": "罐头瓶产能",
            "title": "按期限估算批次",
            "body": "切换到“按机器与天数”，填入罐头瓶数量和期限。未完成的批次会作为原料余量显示。",
            "caseHint": "5 个蔓越莓 · 1 个罐头瓶 · 7 天 · 按机器与天数",
            "caption": "一个罐头瓶周期按三个早晨估算，七天内可完成两批。"
          },
          {
            "number": "05",
            "eyebrow": "原料余量",
            "title": "看清没有加工的原料",
            "body": "没有配方、数量不足一批或期限不够时，未加工原料仍按直接出售价值计入结果。",
            "caseHint": "1 个红蘑菇 · 普通 · 1 个罐头瓶 · 7 天",
            "caption": "红蘑菇在此计算器中没有罐头瓶配方，仍保留全部原售价值。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "功能介绍",
        "title": "用整批库存判断是否装罐",
        "description": "比较果酱和腌菜收益与直接出售价值，同时查看罐头瓶批次时间和剩余原料。",
        "items": [
          {
            "title": "查看果酱与腌菜配方",
            "body": "根据所选原料查看对应配方、批次售价和加工增值。"
          },
          {
            "title": "对照同一批原料直接出售",
            "body": "增值基准是整批输入库存的直接出售价值。"
          },
          {
            "title": "估算完成批次",
            "body": "按产能估算时，加入罐头瓶数量与 7、14 或 28 天期限。"
          },
          {
            "title": "保留原料余量",
            "body": "无配方或未加工的原料按直接出售价值保留在结果中。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用步骤",
        "title": "判断什么适合放进罐头瓶",
        "steps": [
          {
            "number": "01",
            "title": "选择一项原料",
            "body": "选择原料并输入数量和品质。一次估算针对一种原料，不会把不同物品混成一批。"
          },
          {
            "number": "02",
            "title": "设置罐头瓶条件",
            "body": "选择职业和估算方式。按产能估算时，输入罐头瓶数量并选择 7、14 或 28 天窗口。"
          },
          {
            "number": "03",
            "title": "查看成品与余量",
            "body": "比较果酱或腌菜价值和直接出售价值，再核对完成批次及未加工原料。"
          }
        ],
        "actionLabel": "计算罐头瓶加工收益"
      },
      "whyChoose": {
        "eyebrow": "为什么使用此工具",
        "title": "先看罐头瓶能完成多少",
        "description": "用一项库存估算了解配方价值、加工时间与剩余原料，再决定是否开始腌制。",
        "items": [
          {
            "number": "01",
            "title": "按配方选择原料",
            "body": "查看所选物品可制作果酱、腌菜，还是没有罐头瓶路线。"
          },
          {
            "number": "02",
            "title": "保留直接出售对照",
            "body": "品质影响原售机会成本，不改变罐头瓶基础配方售价。"
          },
          {
            "number": "03",
            "title": "计入罐头瓶数量",
            "body": "按机器与天数估算期限内可完成的批次。"
          },
          {
            "number": "04",
            "title": "确认哪些原料会留下",
            "body": "没有配方或不足一批的原料按原价显示。"
          },
          {
            "number": "05",
            "title": "保存或复制估算",
            "body": "设置保存在本机浏览器，结果可连同假设一起复制。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "罐头瓶计算说明",
        "description": "了解果酱、腌菜、加工时间和原料价值的计算口径。",
        "items": [
          {
            "question": "哪些原料有罐头瓶配方？",
            "answer": "当前列表包含水果果酱、支持的蔬菜和正体力采集物腌菜、大多数已收录蘑菇，以及茶叶、啤酒花和小麦。红蘑菇在本计算器中没有罐头瓶配方。"
          },
          {
            "question": "果酱和腌菜售价怎么算？",
            "answer": "标准配方按原料基础售价 × 2 + 50 金计算。所选品质会改变直接出售的对照价值，不改变罐头瓶成品基础售价；符合条件的成品会获得工匠加成。"
          },
          {
            "question": "一批罐头瓶需要多久？",
            "answer": "模型使用 4,000 游戏分钟，并按每天 1,600 分钟折算为三个早晨。产能估算假设每天早晨收取并补料一次，不模拟早晨内的具体时刻。"
          },
          {
            "question": "“全部加工收益”包含什么？",
            "answer": "它按全部完整配方批次估值，不受罐头瓶数量或期限限制。数量不足一批或没有配方的原料仍按直接出售价值计入。"
          },
          {
            "question": "“按机器与天数”会计算什么？",
            "answer": "产能模式使用分配给该路线的罐头瓶数量和 7、14 或 28 天窗口，显示完成批次与原料余量；它不会安排多种原料的混合生产顺序。"
          },
          {
            "question": "原料品质会改变果酱或腌菜售价吗？",
            "answer": "不会。罐头瓶成品按配方基础售价计算；品质和适用职业影响的是原料直接出售的替代价值，工匠可以提高符合条件的罐头瓶成品价。"
          },
          {
            "question": "加工增值会扣除种子或购买成本吗？",
            "answer": "不会。增值比较当前库存加工后的价值与整批原料直接出售价值，不扣种子、购买或机器成本。设置保存在当前浏览器，也可以复制结果与假设。"
          }
        ]
      },
      "cta": {
        "title": "准备决定哪些原料要装罐了吗？",
        "description": "选择一批原料，比较罐头瓶成品与直接出售价值。",
        "label": "计算罐头瓶加工收益"
      },
      "comparison": {
        "eyebrow": "核对箱子里的罐头瓶原料",
        "title": "星露谷物语罐头瓶加工计算器与 ValleyMath 罐头瓶计算器、星露谷物语 Wiki 罐头瓶资料对比",
        "description": "按实际原料数量与罐头瓶数量估算果酱、腌菜等受支持产物，并在结果中保留未加工原料。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语罐头瓶加工计算器",
            "href": "/zh/tools/preserves-jar-processing"
          },
          {
            "name": "ValleyMath 罐头瓶计算器",
            "href": "https://valleymath.com/stardew/preserves-jar-calculator"
          },
          {
            "name": "星露谷物语 Wiki：罐头瓶资料",
            "href": "https://stardewvalleywiki.com/Preserves_Jar"
          }
        ],
        "rows": [
          {
            "label": "支持的原料",
            "values": [
              "选择受支持的作物、蘑菇或采集品并输入数量。",
              "选择物品；页面列出果酱、腌菜、陈年鱼籽和鱼子酱路线。",
              "查询水果、蔬菜、蘑菇、采集品与鱼籽的对应产物。"
            ]
          },
          {
            "label": "原售基准",
            "values": [
              "比较成品加余料，与整批原料直接出售的价值。",
              "将果酱、腌菜、鱼籽产品与所选原料原售比较。",
              "查基础售价公式和原料品质规则。"
            ]
          },
          {
            "label": "罐头瓶产能",
            "values": [
              "设置罐头瓶数量与 7、14、28 天窗口，查看期限内完成量。",
              "按实际罐头瓶数量和截止期限估算队列。",
              "查产品加工时间；不按个人库存计算队列。"
            ]
          },
          {
            "label": "批次余料",
            "values": [
              "分别显示完成加工数量和未加工原料。",
              "显示期限内已加工与剩余数量。",
              "查单件配方与成品售价；余料需自行记录。"
            ]
          },
          {
            "label": "品质与职业",
            "values": [
              "品质和职业会作用于原售基准及适用的成品售价。",
              "可为所选输入设置品质与职业。",
              "成品按原料基础售价计算；输入星级不改变成品售价。"
            ]
          },
          {
            "label": "使用结果",
            "values": [
              "可复制中文或英文结果与假设。",
              "可复制结果并继续使用多库存生产计划。",
              "将产物和时间表作为队列规划参考。"
            ]
          }
        ]
      }
    },
    "dehydrator-processing": {
      "toolName": "烘干机加工",
      "overview": {
        "eyebrow": "烘干机指南",
        "title": "先看五件一批能带来多少价值",
        "paragraphs": [
          "星露谷物语烘干机计算器估算一项库存制成果干、干蘑菇或葡萄干后的价值，并与整批原料直接出售作比较。",
          "每批需要五件同类、同品质原料。成品按配方售价计算；输入品质影响原售基准，符合条件的成品则会计入工匠加成。",
          "“全部加工收益”按完整批次计算，不限制机器数；“按机器与天数”会使用烘干机数量和 7、14 或 28 天窗口，模型按次日早晨完成一批估算。"
        ],
        "aside": "不足五件的余数仍按直接出售价值计入。数量少于五件，或所选原料没有烘干机配方时，整批都保留原售价值。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "果干",
            "title": "比较五件果干批次",
            "body": "查看果干批次售价、相对直接出售的增值，以及完整批次之外留下的原料。",
            "caseHint": "5 个蔓越莓 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "五个蔓越莓组成一批果干，额外原料仍按原价计入。"
          },
          {
            "number": "02",
            "eyebrow": "干蘑菇",
            "title": "检查蘑菇批次",
            "body": "原料列表为已收录的蘑菇提供烘干配方，红蘑菇除外；没有配方的原料保留原售价值。",
            "caseHint": "5 个普通蘑菇 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "五个普通蘑菇正好装满一批干蘑菇配方。"
          },
          {
            "number": "03",
            "eyebrow": "葡萄干",
            "title": "按固定葡萄配方计算",
            "body": "五个葡萄制作一批葡萄干，成品采用固定批次售价；符合条件时，工匠加成作用于成品。",
            "caseHint": "5 个葡萄（采集／夏季种子） · 工匠 · 全部加工收益",
            "caption": "五个葡萄的葡萄干售价为 600 金，工匠加成后为 840 金。"
          },
          {
            "number": "04",
            "eyebrow": "烘干机产能",
            "title": "计入机器与天数",
            "body": "按机器与天数模式会估算烘干机数量和加工期限内可完成的五件批次。",
            "caseHint": "6 个蔓越莓 · 工匠 · 1 台烘干机 · 7 天",
            "caption": "一批可在次日早晨完成，第六个蔓越莓仍按原价计入。"
          },
          {
            "number": "05",
            "eyebrow": "原料余数",
            "title": "看清凑不满一批的库存",
            "body": "结果会把已完成的烘干批次与原料余数分开，并保留余数的直接出售价值。",
            "caseHint": "4 个蔓越莓 · 普通 · 无职业加成 · 全部加工收益",
            "caption": "四件不足一批，模型会把四件都保留为原料余量。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "功能介绍",
        "title": "每批五件，余量也算清楚",
        "description": "把果干、干蘑菇和葡萄干的批次收益与原售价值对照，并显示数量、机器和期限造成的未加工库存。",
        "items": [
          {
            "title": "查看烘干配方",
            "body": "按所选原料查看果干、干蘑菇或葡萄干的批次价值。"
          },
          {
            "title": "理解五件一批",
            "body": "每批需要五件同类原料，品质也必须一致。"
          },
          {
            "title": "保留烘干余数",
            "body": "不足五件的原料仍按直接出售价格计入。"
          },
          {
            "title": "估算次日完成量",
            "body": "结合烘干机数量和加工窗口估算能完成的批次。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用步骤",
        "title": "检查一批烘干原料",
        "steps": [
          {
            "number": "01",
            "title": "选择一项原料和品质",
            "body": "输入原料数量。估算会把所有所选数量视为同一种、同品质原料。"
          },
          {
            "number": "02",
            "title": "设置估算方式与机器数",
            "body": "全部加工收益不受机器限制；按产能估算时，输入烘干机数量并选择 7、14 或 28 天期限。"
          },
          {
            "number": "03",
            "title": "查看成品批次与余数",
            "body": "核对已加工数量、原料余量、最终价值及相对直接出售的增值。"
          }
        ],
        "actionLabel": "计算烘干批次收益"
      },
      "whyChoose": {
        "eyebrow": "为什么使用此工具",
        "title": "成品批次与原料余数一起看",
        "description": "把五件一批的规则用于实际库存决策，不会把不足一批的原料误算成成品。",
        "items": [
          {
            "number": "01",
            "title": "掌握完整批次价值",
            "body": "将干货售价与五件原料直接出售的价值对照。"
          },
          {
            "number": "02",
            "title": "区分输入品质与成品价",
            "body": "品质影响原售机会成本，烘干成品按配方售价计算。"
          },
          {
            "number": "03",
            "title": "看见不足五件的余数",
            "body": "完整五件批次以外的原料仍按原售价值计入。"
          },
          {
            "number": "04",
            "title": "估算次日加工周期",
            "body": "结合机器数量和期限查看一个早晨周期的完成量。"
          },
          {
            "number": "05",
            "title": "保存或复制设置",
            "body": "设置保存在本机浏览器，结果可连同计算假设一起复制。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "烘干机计算说明",
        "description": "了解五件批次、成品售价、机器产能与原料余数的估算方式。",
        "items": [
          {
            "question": "为什么烘干机每批需要五件原料？",
            "answer": "当前配方每批消耗五件同类、同品质原料。计算器不会把不同物品合成一个混装批次。"
          },
          {
            "question": "哪些原料可以烘干？",
            "answer": "列表包含支持的水果和大多数已收录蘑菇，葡萄会显示为葡萄干。红蘑菇在此没有烘干路线；没有配方的原料仍按直接出售价值计算。"
          },
          {
            "question": "果干和葡萄干如何估价？",
            "answer": "模型按批次配方售价计算，并对符合条件的成品应用工匠加成。五个葡萄的葡萄干固定售价为 600 金，工匠加成后为 840 金，不使用通用果干公式。"
          },
          {
            "question": "输入品质会改变烘干成品价吗？",
            "answer": "不会。所选品质影响原料直接出售的对照价值，烘干成品使用配方售价；组成一批的五件原料都按所选同一品质计算。"
          },
          {
            "question": "烘干机批次什么时候完成？",
            "answer": "模型将批次视为次日早晨完成。产能估算按一个早晨为周期，并假设早晨收取成品、补料一次，不模拟早晨内的具体时刻。"
          },
          {
            "question": "多出的 1 到 4 件原料怎么处理？",
            "answer": "不足五件的余数不会算成已加工成品。结果会显示其数量与原售价值，再把成品和余数合计后与整批原料直接出售比较。"
          },
          {
            "question": "批次收益会扣除种子或机器成本吗？",
            "answer": "不会。模型比较加工成品和原料余数的价值与整批原料原售价值，不扣种子、购买或建造机器的成本。设置保存在当前浏览器，也可以复制结果与假设。"
          }
        ]
      },
      "cta": {
        "title": "准备检查这批五件原料了吗？",
        "description": "选择一项库存，查看烘干批次价值和未加工余数。",
        "label": "计算烘干批次收益"
      },
      "comparison": {
        "eyebrow": "逐批核对五件原料",
        "title": "星露谷物语烘干机加工计算器与 ValleyMath 烘干机计算器、星露谷物语 Wiki 烘干机资料对比",
        "description": "查看烘干机数量和期限内能完成多少个五件批次；不满批的原料继续按原售价计入。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语烘干机加工计算器",
            "href": "/zh/tools/dehydrator-processing"
          },
          {
            "name": "ValleyMath 烘干机计算器",
            "href": "https://valleymath.com/stardew/dehydrator-calculator"
          },
          {
            "name": "星露谷物语 Wiki：烘干机资料",
            "href": "https://stardewvalleywiki.com/Dehydrator"
          }
        ],
        "rows": [
          {
            "label": "每批数量",
            "values": [
              "按五件完整配方计算果干、蘑菇干和葡萄干。",
              "将果干、蘑菇干和葡萄干按五件批次估价。",
              "查询五件同类原料的要求与产品配方。"
            ]
          },
          {
            "label": "原售基准",
            "values": [
              "将成品价值与相同原料直接出售比较。",
              "比较批次成品和这批原料的原售价值。",
              "查成品公式；库存机会成本需自行计算。"
            ]
          },
          {
            "label": "期限产能",
            "values": [
              "设置烘干机数量和 7、14、28 天期限。",
              "为所选原料设置可用烘干机数量和期限。",
              "可查次日早晨完成的周期；不估算机器数量产能。"
            ]
          },
          {
            "label": "未满批余料",
            "values": [
              "未满五件的余料保留原售价值，不会算成半批产物。",
              "在剩余库存中保留未满五件的原料。",
              "查五件一批的规则；余料需自行记录。"
            ]
          },
          {
            "label": "原料设置",
            "values": [
              "设置品质和职业；原售机会成本仍按输入库存计算。",
              "可为所选物品设置品质和职业。",
              "查五个蘑菇或水果需按种类和品质一致的规则。"
            ]
          },
          {
            "label": "使用结果",
            "values": [
              "可复制中文或英文估算结果与假设。",
              "可复制结果并继续使用多库存生产计划。",
              "将机器配方和产出表作为参考。"
            ]
          }
        ]
      }
    },
    "keg-ingredient-ranking": {
      "toolName": "Keg 原料排行",
      "overview": {
        "eyebrow": "挑选下一批 Keg 原料",
        "title": "下一台 Keg 加工什么更合适？",
        "paragraphs": [
          "仓库里有几种原料待加工时，成品售价高不一定代表 Keg 用得最划算。先比较一份完整配方加工后，比直接出售原料多出的价值。",
          "你可以按单份原料、每个机器周期或每个游戏内加工分钟排序。三种口径回答不同问题；按分钟比较不包含收取等待。",
          "再选中一种原料，按现有库存、空闲 Keg 和 7、14 或 28 天期限核对能完成多少批。结果会把已加工数量和仍按原价出售的余量分开显示。"
        ],
        "aside": "每分钟增值用于比较单批效率，不代表每日产能。熊的知识与椰子来源只影响符合条件的原料原售价格。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "单份原料增值",
            "title": "比较每份原料多赚多少",
            "body": "扣除原料直接出售价值并计入配方批次后，查看每份已加工原料带来的增值。",
            "caseHint": "普通品质 · 无职业 · 排序口径：每份原料",
            "caption": "按单份比较，能看出不同批次配方的投入效率。"
          },
          {
            "number": "02",
            "eyebrow": "每批加工增值",
            "title": "查看一个完整 Keg 周期",
            "body": "比较完成一整批配方后增加的价值，同时看清该 Keg 配方消耗多少原料。",
            "caseHint": "普通品质 · 无职业 · 排序口径：每个机器周期",
            "caption": "周期口径展示一批配方完成后的增值。"
          },
          {
            "number": "03",
            "eyebrow": "加工时间效率",
            "title": "把游戏内分钟纳入比较",
            "body": "按单批增值除以 Keg 游戏内加工分钟排序；不计收取等待，因此不代表每日产能。",
            "caseHint": "普通品质 · 无职业 · 排序口径：每个加工分钟；对比啤酒花和远古水果",
            "caption": "按分钟时啤酒花高于远古水果，按周期时远古水果仍更高。"
          },
          {
            "number": "04",
            "eyebrow": "适用的价格条件",
            "title": "只应用相关原料条件",
            "body": "按原料可用品质筛选。职业会改变适用的售价与排行；熊的知识影响符合条件的浆果原售价值，椰子来源决定椰子是否适用农耕人加成。",
            "caseHint": "选择黑莓并开启熊的知识；再选椰子并将来源设为购买或礼赠。",
            "caption": "只有适用于该原料的条件才会改变估算。"
          },
          {
            "number": "05",
            "eyebrow": "你的实际库存",
            "title": "把排行带入库存核对",
            "body": "选中一行，输入原料库存、空闲 Keg 和可用天数。估算整批完成量，余料按原售价计入；设置保存在此浏览器，结果可复制。",
            "caseHint": "选咖啡豆 · 库存23 · 空闲Keg 2台 · 14天 · 复制排行与库存结果",
            "caption": "库存结果会分开显示已加工数量和原料余量。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "排行能帮你判断什么",
        "title": "比较 Keg 批次的三种实用口径",
        "description": "按当前决策选择排序方式，再用你手头的库存和加工时间核对。",
        "items": [
          {
            "title": "每份原料增值",
            "body": "配方批次大小不同时，比较单份投入增加的价值。"
          },
          {
            "title": "每个机器周期",
            "body": "查看完成一整批 Keg 配方后的增值。"
          },
          {
            "title": "每个游戏分钟",
            "body": "比较单批增值与加工时间，不含收取等待。"
          },
          {
            "title": "核对实际库存",
            "body": "按期限估算整批完成量、原料余量和加工增值。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "使用排行",
        "title": "从选原料到核对库存",
        "steps": [
          {
            "number": "01",
            "title": "设置比较条件",
            "body": "选择原料品质筛选条件和排行口径；再按需设置职业与价格条件，查看适用的估值结果。"
          },
          {
            "number": "02",
            "title": "选中一种原料",
            "body": "点选排行行，将原料带入库存检查。熊的知识和椰子来源只在适用时调整原售估算。"
          },
          {
            "number": "03",
            "title": "输入库存与期限",
            "body": "填写原料数量、空闲 Keg 数量和 7、14 或 28 天，查看已完成批次与余料；需要时复制排行和库存结果。"
          }
        ],
        "actionLabel": "比较 Keg 原料"
      },
      "whyChoose": {
        "eyebrow": "为什么使用这份排行",
        "title": "按自己的库存与时间做选择",
        "description": "把配方增值、加工周期和真正能投入的原料放在一起比较。",
        "items": [
          {
            "number": "01",
            "title": "按决策选择价值口径",
            "body": "分别查看每份原料、每个周期和每个加工分钟的增值，不混为一个排名。"
          },
          {
            "number": "02",
            "title": "比较完整配方批次",
            "body": "同时查看每批原料数量、成品售价、加工周期和增加的价值。"
          },
          {
            "number": "03",
            "title": "看清价格前提",
            "body": "品质、职业、熊的知识和椰子来源只在规则适用时计入。"
          },
          {
            "number": "04",
            "title": "按实际期限估算",
            "body": "结合空闲 Keg 查看哪些批次能完成，以及哪些原料会留下。"
          },
          {
            "number": "05",
            "title": "保留并带走结果",
            "body": "设置保存在此浏览器，排行和库存核对结果可以复制。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "关于 Keg 原料排行",
        "description": "了解三种排序口径和库存估算的边界。",
        "items": [
          {
            "question": "三种排行口径分别表示什么？",
            "answer": "每份原料是单批增值除以配方投入数量；每个周期展示一整批配方的增值；每个加工分钟则用单批增值除以 Keg 游戏内加工分钟。"
          },
          {
            "question": "每分钟增值能代表每日产量吗？",
            "answer": "不能。它不包含收取等待，只比较一批配方的增值与加工分钟。库存估算会另按空闲 Keg 数量和期限计算。"
          },
          {
            "question": "为什么换口径后原料顺序会变化？",
            "answer": "不同配方的投入数量和加工时间不同。单批增值较高的原料，按单份投入或每个加工分钟比较时未必仍排在前面。"
          },
          {
            "question": "为什么选择某些品质后看不到部分原料？",
            "answer": "排行会筛除没有所选品质档位的原料。没有品质档位的原料会始终以普通品质参加排行，不受此筛选项影响。"
          },
          {
            "question": "熊的知识和椰子来源会改什么？",
            "answer": "熊的知识影响符合条件的浆果原售价值；椰子来源影响椰子是否适用农耕人原售加成。这些条件不会改变无关原料。"
          },
          {
            "question": "库存估算会计算哪些内容？",
            "answer": "按 7、14 或 28 天期限和空闲 Keg 数量计算可完成的整批加工；未加工的原料仍按直接出售价格计入。"
          },
          {
            "question": "设置会自动分享或进入生产计划吗？",
            "answer": "设置保存在当前浏览器。你可以复制排行和选中原料的库存结果；此工具目前没有转入生产计划的功能。"
          }
        ]
      },
      "cta": {
        "title": "开始挑选下一批 Keg 原料",
        "description": "先看不同增值口径，再用自己的库存与空闲 Keg 核对。",
        "label": "比较 Keg 原料"
      },
      "comparison": {
        "eyebrow": "先看排行，再核对实际库存",
        "title": "星露谷物语 Keg 原料收益排行与 ValleyMath Keg 原料价格清单、星露谷物语 Wiki Keg 加工效率表对比",
        "description": "还没选定 Keg 原料时先浏览排行，再把选中的原料带入库存估算，查看空闲 Keg 和截止期限内的加工量。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语 Keg 原料价格清单",
            "href": "/zh/tools/keg-ingredient-ranking"
          },
          {
            "name": "ValleyMath Keg 原料价格清单与库存计算器",
            "href": "https://valleymath.com/stardew/what-to-put-in-kegs"
          },
          {
            "name": "星露谷物语 Wiki：Keg 加工效率表",
            "href": "https://stardewvalleywiki.com/Keg_Productivity"
          }
        ],
        "rows": [
          {
            "label": "从哪里开始",
            "values": [
              "先浏览所有支持 Keg 的原料排行，再选一种核对库存。",
              "浏览 Keg 价格排行，并测试选中的库存。",
              "浏览可排序的 Keg 原料与产物效率表。"
            ]
          },
          {
            "label": "排行口径",
            "values": [
              "按每份原料、每个机器周期或每个加工分钟的增值排序。",
              "按每件原料或每个早晨的额外金币排序。",
              "查原料售价、成品售价、每分钟效率和近似每日金币。"
            ]
          },
          {
            "label": "当前条件",
            "values": [
              "设置品质和职业；适用浆果与椰子可设置对应来源条件。",
              "设置物品品质、职业、空闲 Keg 数和截止期限。",
              "按品质行和职业专属表查看参考值。"
            ]
          },
          {
            "label": "库存估算",
            "values": [
              "选中排行行后输入库存、空闲 Keg 和天数，查看完成量与剩余原料。",
              "输入箱中物品、数量、空闲 Keg 和截止期限。",
              "文章表格不读取个人库存数量。"
            ]
          },
          {
            "label": "如何理解效率",
            "values": [
              "每加工分钟增值不计收取等待，也不是每日产能估算。",
              "按每早晨和每份原料展示排行，并另设库存期限检查。",
              "提供近似每日金币；次日内周期的估算注明连续收取补料假设。"
            ]
          },
          {
            "label": "后续使用",
            "values": [
              "可复制排行与选中库存结果，并附上计算条件。",
              "可复制结果，或将原料带入多库存生产计划。",
              "继续查阅可排序的参考数值和 Keg 说明。"
            ]
          }
        ]
      }
    },
    "cask-aging": {
      "toolName": "酒窖陈酿",
      "overview": {
        "eyebrow": "安排酒窖陈酿",
        "title": "这瓶酒何时能达到目标品质？",
        "paragraphs": [
          "已经酿好葡萄酒，准备装入酒窖木桶了吗？先选择酿酒水果、当前品质和想达到的目标，再安排装桶时间。",
          "每一档品质都有自己的陈酿时间：普通到银星14天，银星到金星再14天，金星到铱星再28天。计算只累计尚未完成的阶段。",
          "查看预计收取日期、每瓶售价增值，以及现有空桶能装下多少酒。工匠职业会改变售价，不会缩短陈酿时间。"
        ],
        "aside": "此计算器只估算水果酿成的葡萄酒在酒窖木桶中的陈酿；Keg 酿造时间另计。112天参考从普通品质葡萄酒开始，并假设酒源持续供应、每桶完成后立即重装。"
      },
      "features": {
        "items": [
          {
            "number": "01",
            "eyebrow": "还需陈酿多久",
            "title": "只计算剩下的品质阶段",
            "body": "选择葡萄酒已有品质和目标。每次升档都有固定陈酿时间：到银星14天，再到金星14天，金星到铱星28天。",
            "caseHint": "杨桃酒 · 普通→铱星 · 无工匠",
            "caption": "估算只累计尚未完成的阶段；出售职业不会缩短时间。"
          },
          {
            "number": "02",
            "eyebrow": "农场日历",
            "title": "查看跨季与跨年的收取日",
            "body": "输入木桶装酒时的季节、日期和农场年份，估算会把剩余天数推到正确的后续季节与年份。",
            "caseHint": "苹果酒 · 银星→金星 · 冬季20日 · 第1年",
            "caption": "此验证场景会在第2年春季6日收取。"
          },
          {
            "number": "03",
            "eyebrow": "每瓶增值",
            "title": "把售价变化和等待时间放一起",
            "body": "对比目标品质的酒瓶售价、每瓶增值和每桶每日增值。工匠职业影响售价，不改变陈酿时长。",
            "caseHint": "杨桃酒 · 普通→银星 · 工匠",
            "caption": "售价按所选水果、当前与目标品质及出售职业估算。"
          },
          {
            "number": "04",
            "eyebrow": "现有木桶",
            "title": "规划本轮能装多少酒",
            "body": "将待装酒瓶数与空桶数量对照，查看可装瓶数、等待数量、还需木桶及对应的木材和硬木。",
            "caseHint": "苹果酒 · 银星→金星 · 待装5瓶 · 空桶2只",
            "caption": "现在能装2瓶；其余3瓶等待，并显示补足木桶所需材料。"
          },
          {
            "number": "05",
            "eyebrow": "112天参考",
            "title": "估算木桶连续周转",
            "body": "查看每只木桶在112天内完成的普通到目标品质轮次，以及现有空桶合计可陈酿瓶数。此参考假设酒源持续供应并立即重装。",
            "caseHint": "苹果酒 · 普通→铱星 · 空桶2只",
            "caption": "此区间从普通品质开始，并假设每只完成的木桶都立即重新装酒。"
          }
        ]
      },
      "featureIntro": {
        "eyebrow": "计算器能帮你看什么",
        "title": "从当前品质排到酒窖装桶计划",
        "description": "把剩余时间、预计售价增值和本轮装桶能力放在一起比较。",
        "items": [
          {
            "title": "剩余陈酿时间",
            "body": "从葡萄酒当前品质开始，只计算到目标品质尚余的阶段。"
          },
          {
            "title": "预计收取日期",
            "body": "按28天一季的农场日历计算跨季与跨年日期。"
          },
          {
            "title": "每瓶增值",
            "body": "对比各目标的酒瓶售价和每桶每日增值。"
          },
          {
            "title": "本轮装桶能力",
            "body": "查看能装下的瓶数、等待瓶数和补桶材料。"
          }
        ]
      },
      "howToUse": {
        "eyebrow": "生成陈酿计划",
        "title": "设置酒瓶品质、目标与装桶日期",
        "steps": [
          {
            "number": "01",
            "title": "描述葡萄酒",
            "body": "选择酿酒水果、当前品质、目标品质，以及出售时是否有工匠职业。"
          },
          {
            "number": "02",
            "title": "设置装桶日期",
            "body": "输入计划把葡萄酒装入木桶时的季节、日期和农场年份。"
          },
          {
            "number": "03",
            "title": "核对装桶与收取计划",
            "body": "填写待装瓶数和现有空桶，查看收取日期、售价增值、等待瓶数和补桶材料；需要时复制计划。"
          }
        ],
        "actionLabel": "比较陈酿目标"
      },
      "whyChoose": {
        "eyebrow": "为什么使用这款计算器",
        "title": "装桶前先看清等待与容量",
        "description": "将目标品质所需时间、售价变化和空桶数量放在同一计划里判断。",
        "items": [
          {
            "number": "01",
            "title": "知道还要等多久",
            "body": "从葡萄酒当前品质计算，不重复累计已经完成的陈酿阶段。"
          },
          {
            "number": "02",
            "title": "把日期放进农场日历",
            "body": "查看预计季节、日期和年份，包含跨季与跨年。"
          },
          {
            "number": "03",
            "title": "按增值与时间比较目标",
            "body": "查看每瓶和每桶每日增值；工匠影响售价，不影响等待天数。"
          },
          {
            "number": "04",
            "title": "用好手头的空桶",
            "body": "区分本轮能装的酒和需要等待额外木桶的酒。"
          },
          {
            "number": "05",
            "title": "看懂长期参考的前提",
            "body": "112天参考按普通酒到目标品质计算，并假设酒源持续、完成后立即重装。"
          }
        ]
      },
      "faq": {
        "eyebrow": "常见问题",
        "title": "关于葡萄酒木桶陈酿",
        "description": "了解品质阶段、预计售价和酒窖参考的计算边界。",
        "items": [
          {
            "question": "这里可以计算哪些产品？",
            "answer": "此工具估算可由所选水果酿成的葡萄酒在酒窖木桶中的陈酿。Keg 酿造时间另计；它不估算其他木桶产品或混合酒窖排程。"
          },
          {
            "question": "每个葡萄酒品质阶段需要多久？",
            "answer": "普通到银星需要14天，银星到金星再需14天，金星到铱星再需28天。普通到铱星完整流程为56天。"
          },
          {
            "question": "葡萄酒已经是银星，还要从头计算吗？",
            "answer": "不用。选择当前品质后，计算器只统计到目标品质尚未完成的阶段。若目标低于当前品质，会标记为已超过目标。"
          },
          {
            "question": "预计日期会跨季或跨年吗？",
            "answer": "会。输入装桶季节、日期和农场年份后，预计日期会按每季28天向后推算，必要时进入下一年。"
          },
          {
            "question": "工匠职业会让木桶更快完成吗？",
            "answer": "不会。工匠职业影响葡萄酒的预计售价；剩余陈酿天数由当前品质和目标品质决定。"
          },
          {
            "question": "葡萄酒比空桶多时会怎样？",
            "answer": "装桶计划会显示现在可装的瓶数、等待空桶的瓶数，以及匹配剩余酒量还需多少只桶和木材、硬木。"
          },
          {
            "question": "112天参考采用什么前提？",
            "answer": "它从普通品质酒到所选目标计算每只桶可完成的整轮数，再乘以现有空桶数量；假设酒源持续供应、每桶完成后立即重装。这是产能参考，不是逐次交付日程。"
          }
        ]
      },
      "cta": {
        "title": "选择值得等待的品质",
        "description": "先比较收取日期与每瓶增值，再决定是否装桶。",
        "label": "比较陈酿目标"
      },
      "comparison": {
        "eyebrow": "为现有葡萄酒安排酒窖陈酿",
        "title": "星露谷物语葡萄酒陈酿时间计算器与 ValleyMath 葡萄酒陈酿时间计算器、星露谷物语 Wiki 酒窖木桶陈酿资料对比",
        "description": "设置葡萄酒当前品质、目标品质、起始日期、瓶数和空桶数量，估算收取日期、陈酿增值及待装酒瓶数。",
        "cornerLabel": "对比项",
        "products": [
          {
            "name": "星露谷物语葡萄酒陈酿时间计算器",
            "href": "/zh/tools/cask-aging"
          },
          {
            "name": "ValleyMath 葡萄酒陈酿时间计算器",
            "href": "https://valleymath.com/stardew/wine-aging-calculator"
          },
          {
            "name": "星露谷物语 Wiki：酒窖木桶陈酿资料",
            "href": "https://stardewvalleywiki.com/Cask"
          }
        ],
        "rows": [
          {
            "label": "从哪里开始",
            "values": [
              "设置葡萄酒当前品质、目标品质、季节日期和现有酒窖库存。",
              "设置当前与目标品质、日期、葡萄酒数量、空桶和职业。",
              "查哪些工匠产品可陈酿以及对应品质规则。"
            ]
          },
          {
            "label": "收取日期",
            "values": [
              "计算剩余陈酿天数，并将日期推进到后续季节或年份。",
              "显示达到所选目标品质的预计收取日期。",
              "查相对陈酿周期；日历日期需自行换算。"
            ]
          },
          {
            "label": "陈酿增值",
            "values": [
              "分别显示葡萄酒当前价值、每瓶增值和每桶每日增值。",
              "显示本轮输入与目标价值及陈酿总增值。",
              "查询陈酿产品的价值公式和品质倍率。"
            ]
          },
          {
            "label": "酒窖容量",
            "values": [
              "按瓶数与空桶数显示待装酒瓶、额外木桶材料和容量参考。",
              "输入葡萄酒和木桶数量，核对本轮酒窖容量。",
              "查静态酒窖容量和可达布局说明。"
            ]
          },
          {
            "label": "计算范围",
            "values": [
              "目前计算酒窖中的果酒陈酿；Keg 酿造时间另计。",
              "陈酿页聚焦葡萄酒，Keg 加工另有计算器。",
              "Cask 也可加工 Beer、Cheese、Goat Cheese、Mead 和 Pale Ale。"
            ]
          },
          {
            "label": "使用计划",
            "values": [
              "可复制日期、价值与装桶计划，支持中文和英文。",
              "可复制酒窖计划并查看陈酿公式。",
              "将更广的 Cask 规则和布局资料作为参考。"
            ]
          }
        ]
      }
    }
  }
} as const satisfies Readonly<
  Record<PublicLocale, Readonly<Record<ProcessingToolId, ProcessingToolGuideCopy>>>
>;

function isPublicLocale(locale: unknown): locale is PublicLocale {
  return (
    typeof locale === "string" &&
    publicLocales.includes(locale as PublicLocale)
  );
}

export function getProcessingToolGuideCopy(
  locale: PublicLocale,
  currentTool: ProcessingToolId,
): ProcessingToolGuideCopy {
  if (!isPublicLocale(locale)) {
    throw new Error(
      `Unsupported processing tool guide locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  getProcessingToolDefinition(currentTool);
  return processingToolGuideCopyByLocale[locale][currentTool];
}
