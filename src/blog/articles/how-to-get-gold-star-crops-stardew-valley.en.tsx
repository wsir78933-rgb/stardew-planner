import { PublicPicture } from "../../components/public-picture";
import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";

const goldStarCropEnglishSources = [
  { href: "https://stardewvalleywiki.com/Farming", label: "Farming" },
  { href: "https://stardewvalleywiki.com/Crops", label: "Crops" },
  { href: "https://stardewvalleywiki.com/Foraging", label: "Foraging" },
  { href: "https://stardewvalleywiki.com/Fiber", label: "Fiber" },
  { href: "https://stardewvalleywiki.com/Fertilizer", label: "Fertilizer" },
  { href: "https://stardewvalleywiki.com/Deluxe_Fertilizer", label: "Deluxe Fertilizer" },
  { href: "https://stardewvalleywiki.com/Basic_Fertilizer", label: "Basic Fertilizer" },
  { href: "https://stardewvalleywiki.com/Quality_Fertilizer", label: "Quality Fertilizer" },
  { href: "https://stardewvalleywiki.com/Pierre%27s_General_Store", label: "Pierre’s General Store" },
  { href: "https://stardewvalleywiki.com/Farmer%27s_Lunch", label: "Farmer’s Lunch" },
  { href: "https://stardewvalleywiki.com/Cooking", label: "Cooking" },
  { href: "https://stardewvalleywiki.com/Bundles", label: "Bundles" },
  { href: "https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567", label: "Crop.harvest code" },
  { href: "https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1", label: "Random.NextDouble" },
] as const;

export function HowToGetGoldStarCropsStardewValleyEnglishArticle() {
  return (
    <>
      <p>
        {"Regular crops use your Farming level and the fertilizer on the tile to determine quality when you harvest. Exact Gold means Gold itself, excluding Iridium. To improve your odds, compare fertilizer choices at the Farming level you’ll have when you harvest; with Deluxe, a higher level can shift more results to Iridium and lower the exact-Gold chance. At Farming 5, Quality Fertilizer gives a 34.3% exact-Gold chance; Farmer’s Lunch can bring that to 50.3% if it raises you to Farming 8 and is active at harvest ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"). Wild Seed forage uses Foraging instead, and Fiber is always Normal, so the odds below do not apply to either ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Foraging"}>{"Foraging"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Fiber"}>{"Fiber"}</a>
        {")."}
      </p>
      <h2>{"What affects crop quality at harvest?"}</h2>
      <p>
        {"A crop can be Normal, Silver, Gold, or Iridium. Iridium is a higher quality than Gold, but no seed or fertilizer guarantees a Gold result ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"Saving seeds from a higher-quality crop does not improve the next crop’s odds. The next crop is judged on its own harvest, not the seed’s quality ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"Unless noted otherwise, the chances below apply to one crop item that receives a quality check. At Farming 5, exact-Gold chances are 11% with no fertilizer, 22.67% with Basic Fertilizer, 34.33% with Quality Fertilizer, and 35.42% with Deluxe Fertilizer ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"). Deluxe is only slightly ahead of Quality at this level, and most Deluxe results are still not exact Gold ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"Without fertilizer, exact-Gold chance is 1% at Farming 0, 11% at Farming 5, and 21% at Farming 10 ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"The formulas use three variables:"}
      </p>
      <div aria-label="Farming variables and meanings" className="blog-table-scroll" role="region" tabIndex={0}>
        <table aria-label="Farming variables and meanings" className="blog-data-table blog-data-table--wrap">
          <colgroup>
            <col style={{ width: "6rem" }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{"Symbol"}</th>
              <th scope="col">{"Meaning"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>{"f"}</code></td>
              <td>{"Effective Farming level at harvest, including any food buff still active then."}</td>
            </tr>
            <tr>
              <td><code>{"t"}</code></td>
              <td>{"Fertilizer tier: none "}
        <code>{"0"}</code>
        {", Basic "}
        <code>{"1"}</code>
        {", Quality "}
        <code>{"2"}</code>
        {", Deluxe "}
        <code>{"3"}</code>
        {"."}</td>
            </tr>
            <tr>
              <td><code>{"c"}</code></td>
              <td>{"Raw Gold threshold from the formula below; it is an intermediate value, not the final exact-Gold chance."}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>{"Raw Gold threshold"}</strong>
        {" ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"):"}
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"c = 0.2 × (f / 10)\n  + 0.2 × t × ((f + 2) / 12)\n  + 0.01\n"}</code>
      </pre>
      <p>
        <code>{"Random.NextDouble()"}</code>
        {" returns a value in "}
        <code>{"[0,1)"}</code>
        {". When raw "}
        <code>{"c ≤ 1"}</code>
        {", the check passes with probability "}
        <code>{"c"}</code>
        {"; when "}
        <code>{"c > 1"}</code>
        {", every possible draw passes for a 100% effective chance. The effective pass chance is "}
        <code>{"min(1,c)"}</code>
        {", even though the game does not clamp raw "}
        <code>{"c"}</code>
        {" ("}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"Crop.harvest code"}</a>
        {"; "}
        <a href={"https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1"}>{"Random.NextDouble"}</a>
        {")."}
      </p>
      <p>
        <strong>{"No fertilizer, Basic, or Quality Fertilizer ("}
        <code>{"t = 0, 1, or 2"}</code>
        {")"}</strong>
      </p>
      <p>
        {"Each uses "}
        <code>{"c"}</code>
        {" for its Gold check. The exact-Gold chance is:"}
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"min(1,c)\n"}</code>
      </pre>
      <p>
        {"("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")"}
      </p>
      <p>
        <strong>{"Deluxe Fertilizer ("}
        <code>{"t = 3"}</code>
        {")"}</strong>
      </p>
      <p>
        {"Deluxe checks Iridium first at raw threshold "}
        <code>{"c / 2"}</code>
        {". Only if that check fails does it check Gold at raw threshold "}
        <code>{"c"}</code>
        {" ("}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"Crop.harvest code"}</a>
        {")."}
      </p>
      <p>
        <strong>{"Exact-Gold chance:"}</strong>
      </p>
      <pre style={{ maxWidth: "100%", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
        <code>{"[1 − min(1,c / 2)] × min(1,c)\n"}</code>
      </pre>
      <p>
        {"When "}
        <code>{"c ≤ 1"}</code>
        {", this simplifies to "}
        <code>{"(1 − c / 2) × c"}</code>
        {". When "}
        <code>{"c > 1"}</code>
        {", the Gold check always passes if reached, so exact Gold depends on the earlier Iridium check failing ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"; "}
        <a href={"https://learn.microsoft.com/en-us/dotnet/api/system.random.nextdouble?view=netframework-4.8.1"}>{"Random.NextDouble"}</a>
        {")."}
      </p>
      <p>
        {"With Deluxe Fertilizer, a higher Farming level can lower exact-Gold odds ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"; "}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"Crop.harvest code"}</a>
        {"):"}
      </p>
      <div aria-label="Farming-level Gold and Iridium probabilities" className="blog-table-scroll" role="region" tabIndex={0}>
        <table aria-label="Farming-level Gold and Iridium probabilities" className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">{"Farming level"}</th>
              <th scope="col">{"Exact Gold"}</th>
              <th scope="col">{"Iridium"}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"13"}</td>
              <td>{"49%"}</td>
              <td>{"51%"}</td>
            </tr>
            <tr>
              <td>{"14"}</td>
              <td>{"45.5%"}</td>
              <td>{"54.5%"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        {"At Farming 10, Quality Fertilizer gives 61% exact Gold, while Deluxe gives 48.195% exact Gold and 40.5% Iridium, for 88.695% Gold-or-better ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"). For Gold itself, choose Quality; Deluxe’s earlier Iridium check lowers its exact-Gold chance. If your goal also counts Iridium, choose Deluxe for its higher Gold-or-better chance."}
      </p>
      <h2>{"Choose a quality fertilizer you can still apply"}</h2>
      <p>
        {"A tilled soil tile holds one fertilizer type, so keep existing Basic or Quality in place; Deluxe can’t replace either. Apply Basic or Quality Fertilizer before the seed sprouts. If you want to use Deluxe later, choose a different unfertilized tile; it can still go on before or after planting at any growth stage, including after the crop is fully grown, but before harvest ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"Deluxe Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"Check which fertilizers the crop can still take at its current growth stage. At Farming 5, Quality and Deluxe are close—34.33% versus 35.42% per checked item. At Farming 10, Quality gives more exact Gold than Deluxe ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"Basic Fertilizer unlocks at Farming 1 and takes 2 Sap to craft 1. Quality Fertilizer unlocks at Farming 9 and takes 4 Sap plus 1 fish to craft 2. The Deluxe Fertilizer recipe is available in Qi’s Walnut Room for 20 Qi Gems; 1 Iridium Bar and 40 Sap craft 5 ("}
        <a href={"https://stardewvalleywiki.com/Basic_Fertilizer"}>{"Basic Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Quality_Fertilizer"}>{"Quality Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"Deluxe Fertilizer"}</a>
        {")."}
      </p>
      <p>
        {"Pierre sells Quality Fertilizer for 150g starting in Year 2. Depending on your progress, it may be available before you unlock the Farming 9 crafting recipe ("}
        <a href={"https://stardewvalleywiki.com/Quality_Fertilizer"}>{"Quality Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Pierre%27s_General_Store"}>{"Pierre’s General Store"}</a>
        {")."}
      </p>
      <p>
        {"Speed-Gro changes growth timing; crop-quality fertilizer affects quality. Use Speed-Gro when you want faster growth and a quality fertilizer when you want to change the quality roll ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"Fertilizer"}</a>
        {")."}
      </p>
      <h2>{"Time Farmer’s Lunch for harvest"}</h2>
      <p>
        {"Farmer’s Lunch adds 3 Farming for 5m35s; with a base level of 5, it raises you to Farming 8 while the meal lasts ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <p>
        {"With Quality Fertilizer, the exact-Gold chance rises from 34.33% at Farming 5 to 50.33% at Farming 8. Eat Farmer’s Lunch as you start harvesting, then pick the crops while the meal is active. If you eat after a crop’s quality has been checked, it won’t change that result ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"). If harvesting takes longer than 5m35s, only crops picked before the meal wears off get the Farming 8 rate. Later crops use the Farming level active when you pick them ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <figure className="blog-article-media">
        <PublicPicture
          alt="Horizontal bar chart comparing exact-Gold chances: at Farming 5, no fertilizer is 11.0%, Basic Fertilizer is 22.7%, Quality Fertilizer is 34.3%, and Deluxe Fertilizer is 35.4%. A separate Quality Fertilizer result at Farming 8 with Farmer’s Lunch active at harvest is 50.3%."
          height={1100}
          src="/blog/illustrations/how-to-get-gold-star-crops-stardew-valley-quality-odds-en.webp"
          style={{ aspectRatio: "1 / 1", objectFit: "contain" }}
          width={1100}
        />
        <figcaption className="whitespace-pre-line">{"Each bar shows the chance of Gold itself, excluding Iridium, for one crop item that receives a quality check. At Farming 5, Quality Fertilizer gives a 34.3% chance. If your base Farming level is 5, Farmer’s Lunch raises it to 8 while active at harvest. With Quality Fertilizer, your exact-Gold chance is 50.3%.\n\nWith Deluxe Fertilizer at Farming 5, exact Gold is 35.4% and Iridium is 23.0%. Together, those results total 58.4% Gold-or-better."}</figcaption>
      </figure>
      <p>
        {"Farmer’s Lunch unlocks at Farming 3 and needs 1 Omelet plus 1 Parsnip. Cook it in the kitchen from the first farmhouse upgrade, or use a Cookout Kit at Foraging 3 ("}
        <a href={"https://stardewvalleywiki.com/Farmer%27s_Lunch"}>{"Farmer’s Lunch"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Cooking"}>{"Cooking"}</a>
        {")."}
      </p>
      <p>
        {"With Quality Fertilizer, ten single-output harvests have an expected average of 3.43 Gold crops at Farming 5 and 5.03 with the Farming 8 lunch buff. For another batch size, multiply the number of quality-checked items by the per-item chance. For example, 20 items at a 50.33% chance with Quality Fertilizer have an expected average of 10.07 Gold crops, not a guaranteed count ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {")."}
      </p>
      <h2>{"For a Gold-quality bundle, count Iridium too"}</h2>
      <p>
        {"A bundle that asks for Gold accepts Iridium too. That makes Gold-or-better a different goal from exact Gold ("}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"Bundles"}</a>
        {")."}
      </p>
      <p>
        {"At Farming 5 with Deluxe Fertilizer, the chance is 35.42% for exact Gold and 23% for Iridium, or 58.42% Gold-or-better ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"Bundles"}</a>
        {"). Use 35.42% when you need Gold itself and 58.42% when Iridium also qualifies. This is a per-crop chance, not the chance of filling a bundle that needs several items."}
      </p>
      <h2>{"Count the items that actually receive a quality roll"}</h2>
      <p>
        {"Quality fertilizer affects every harvest cycle of a multi-harvest crop, but at most one item in a multi-item harvest gets a quality check. That item can still be Normal; receiving the check does not guarantee an upgrade ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {"). A Blueberry harvest has three berries and a Coffee Bean harvest has four, so at most one berry or bean gets the check per harvest ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {")."}
      </p>
      <p>
        {"Giant Crops are a separate case: they yield 15–21 Normal-quality items, so those items do not count as Gold crops ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {")."}
      </p>
      <section className="gold-star-crops-faq">
        <h2>{"Gold Star Crops in Stardew Valley: FAQ"}</h2>
        <BlogFaqList
          items={[
            { question: "Can fertilizer guarantee Gold-quality crops?", answer: (
              <p>
                {"No. For ordinary crops that use Farming’s quality rule, fertilizer changes the odds at harvest but cannot guarantee exact Gold ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"). Wild Seed forage uses Foraging for quality, while Fiber is always Normal; those Farming-based odds do not apply to either ("}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Foraging"}>{"Foraging"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Fiber"}>{"Fiber"}</a>
        {")."}
              </p>
            ) },
            { question: "When should I apply fertilizer for Gold crops?", answer: (
              <p>
                {"A tilled soil tile can hold only one fertilizer type, and a new one will not replace the fertilizer already there. Apply Basic or Quality before the seed sprouts. Deluxe can go on an unfertilized tile at any growth stage, even after the crop is fully grown, as long as you apply it before harvest ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Deluxe_Fertilizer"}>{"Deluxe Fertilizer"}</a>
        {")."}
              </p>
            ) },
            { question: "Does a Farming buff always increase exact-Gold odds?", answer: (
              <p>
                {"No. It depends on the fertilizer. With Deluxe, exact Gold is 49% at Farming 13 but 45.5% at Farming 14 as more results go to Iridium ("}
        <a href={"https://stardewvalleywiki.com/Farming"}>{"Farming"}</a>
        {"; "}
        <a href={"https://github.com/Dannode36/StardewValleyDecompiled/blob/main/Stardew%20Valley/StardewValley/Crop.cs#L552-L567"}>{"Crop.harvest code"}</a>
        {")."}
              </p>
            ) },
            { question: "Does a Gold-quality bundle accept an Iridium crop?", answer: (
              <p>
                {"Yes. A bundle that asks for Gold accepts higher-quality items, so Iridium meets the Gold minimum. That is Gold-or-better, not exact Gold ("}
        <a href={"https://stardewvalleywiki.com/Bundles"}>{"Bundles"}</a>
        {")."}
              </p>
            ) },
            { question: "Do multi-harvest crops get a quality roll for every item?", answer: (
              <p>
                {"Quality fertilizer affects every harvest cycle, but in a multi-item harvest at most one item gets a quality check. That item can still be Normal; the check does not guarantee an upgrade. A Blueberry harvest has three berries and a Coffee Bean harvest has four, so at most one item in each harvest gets the check ("}
        <a href={"https://stardewvalleywiki.com/Fertilizer"}>{"Fertilizer"}</a>
        {"; "}
        <a href={"https://stardewvalleywiki.com/Crops"}>{"Crops"}</a>
        {")."}
              </p>
            ) },
          ]}
        />
      </section>
      <BlogSources heading={"Sources"} items={goldStarCropEnglishSources} />
    </>
  );
}
