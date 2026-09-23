import { BlogSources } from "../../components/blog/blog-sources";
import { PublicPicture } from "../../components/public-picture";

function ProfitMarginPriceBoundaryFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="Diagram showing Stardew Valley Profit Margin prices that scale and shop costs and rewards that stay unchanged"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-price-boundary.webp"
        width={1672}
      />
      <figcaption>
        This diagram separates selected sale and seed prices from categories outside the multiplier. It labels Wheat as 6g at 25% instead of 25g and Willy's Crab Pots as 1,500g, so the examples are not mistaken for a rule covering every shop item.
      </figcaption>
    </figure>
  );
}

function ProfitMarginAdvancedOptionsFigure() {
  return (
    <figure className="blog-article-media">
      <PublicPicture
        alt="Schematic of the Stardew Valley new-game path to Advanced Options and the Profit Margin selector"
        decoding="async"
        height={941}
        loading="lazy"
        src="/blog/illustrations/profit-margin-stardew-advanced-options.webp"
        width={1672}
      />
      <figcaption>
        This platform-neutral menu-path diagram is not a platform-specific screenshot. It shows New Game → wrench/Advanced Options → Profit Margin → Normal/75%/50%/25% → create the farm, based on the documented path in the Stardew Valley Wiki's Options page.
      </figcaption>
    </figure>
  );
}

function ProfitMarginSources() {
  return (
    <BlogSources
      checkedLabel="Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer."
      heading="Sources"
      items={[
        {
          href: "https://stardewvalleywiki.com/Options",
          label: "Stardew Valley Wiki: Options",
          note: " — the four values, selected sale and seed price multiplier, integer truncation and 1g floor, and the documented new-game Advanced Options path.",
        },
        {
          href: "https://stardewvalleywiki.com/Multiplayer",
          label: "Stardew Valley Wiki: Multiplayer",
          note: " — affected sale categories, scaled seed and selected Joja prices, unchanged categories and rewards, Wheat and Crab Pot examples, and the multiplayer rebalance explanation.",
        },
      ]}
    />
  );
}

export function ProfitMarginStardewEnglishArticle() {
  return (
    <article>
      <h2>What Is Profit Margin in Stardew Valley?</h2>
      <p>Profit Margin in <a href="https://stardewvalleywiki.com/Options">Stardew Valley</a> is the game's multiplier for selected item sale prices and seed prices. New farms offer Normal/100%, 75%, 50%, and 25%. Lower settings reduce both selected sale income and listed seed prices; they do not multiply every shop cost, building, upgrade, or quest reward.</p>
      <p>The name can sound like an accounting term, but this setting is not a calculation of net earnings divided by revenue. It changes listed prices inside the game's economy. The useful question is which prices will move, and which costs will stay put when you choose a setting.</p>
      <p>You choose the setting while creating a new farm through the new-game Advanced Options control. Normal leaves the reference prices in place, while 75%, 50%, and 25% make selected sales pay less and selected seeds cost less. That two-sided rule matters more than the percentage label by itself.</p>
      <p>Because the setting changes selected prices on both sides of a transaction, it is better understood as a budget constraint than as a universal discount. A lower value can reduce the amount received for an affected sale and the listed price of a covered seed, while a fixed cost still demands its normal amount. The setting can therefore change how a budget feels without changing every number in the game.</p>
      <h2>How the four Profit Margin settings change selected prices</h2>
      <p>The four choices are multipliers for the prices covered by the setting. They are not ratings for player skill, and the percentages do not describe the share of profit you keep after expenses.</p>
      <div
        aria-label="Profit Margin settings and selected price effects"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Setting</th>
              <th scope="col">Multiplier reading</th>
              <th scope="col">What it means for an affected sale or seed price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal / 100%</td>
              <td>1.00×</td>
              <td>Uses the normal reference price.</td>
            </tr>
            <tr>
              <td>75%</td>
              <td>0.75×</td>
              <td>Uses 75% of the affected price before the game's rounding rule.</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>0.50×</td>
              <td>Uses 50% of the affected price before the game's rounding rule.</td>
            </tr>
            <tr>
              <td>25%</td>
              <td>0.25×</td>
              <td>Uses 25% of the affected price before the game's rounding rule.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>The <a href="https://stardewvalleywiki.com/Options">Stardew Valley Wiki's Options page</a> states that fractional prices are truncated to an integer and never fall below 1g. A result such as 6.25g becomes 6g, not 6.25g. The floor matters for low-value prices, while truncation matters whenever the multiplier does not produce a whole number.</p>
      <p>When checking a price, first read what is being sold or bought and compare it with the source-backed category list. A crop sale, a Pierre seed, and a named selected Joja price belong to the affected side; a building or tool upgrade does not. Only after that classification should you read Normal/100%, 75%, 50%, or 25% as the multiplier and apply truncation and the 1g floor. Keep the affected amount and the next planned expense separate: a lower sale does not imply a lower building price, and a lower seed price does not imply a lower quest reward. For a quick budget check, compare those two categories instead of treating the percentage as a discount for the whole plan. If the item or service is absent from the named categories, mark it unclassified and stop before estimating from another example; check a current source that names that item or category.</p>
      <h3>What does 75% Profit Margin mean?</h3>
      <p>At 75%, an affected item or seed uses the 75% setting, then the result follows the integer and 1g rules. It does not mean that every coin you earn is worth 75% or that every purchase costs 75%. The same setting can lower a crop sale and lower a covered seed price while leaving a building, tool upgrade, or quest reward unchanged.</p>
      <p>The two sides are easy to miss when you look only at the sale-box number. A lower margin makes selected sales less valuable, but it also makes selected seeds cheaper. That does not cancel the challenge in a simple one-for-one way, because costs outside the multiplier still have to be paid at their normal values.</p>
      <p>One concrete source example shows why the rounding rule belongs next to the percentage table: the <a href="https://stardewvalleywiki.com/Multiplayer">Multiplayer page</a> gives Wheat as 6g at 25% instead of 25g. That is a truncated 25% result, not a rule that every item or shop can be inferred from one Wheat price.</p>
      <h2>What Profit Margin affects—and what it leaves unchanged</h2>
      <p>The setting is easiest to use when you classify a price before planning around it. The <a href="https://stardewvalleywiki.com/Multiplayer">Stardew Valley Wiki's Multiplayer page</a> lists the affected sale categories and the costs that remain outside the multiplier. It also explains lower margins as an economy rebalance for the productivity of multiple active players.</p>
      <h3>Prices that scale</h3>
      <p>The affected side includes selected item sales such as crops, forage, minerals, and cooked foods. Pierre's seed prices scale, and the Wiki also names selected Joja prices: Grass Starter, Sugar, Wheat Flour, and Rice. “Selected” is important: the rule is not a license to multiply every number in every shop. Treat the selected Joja list as a narrow category and do not extend its multiplier to a different Joja purchase without source support.</p>
      <h3>Costs, shops, and rewards that stay fixed</h3>
      <p>The unchanged side includes the Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards. The same source gives Willy's Crab Pots as a boundary example: they remain 1,500g even when income from affected sales is reduced.</p>
      <p>Use this matrix as a category check rather than as a second price table:</p>
      <div
        aria-label="Affected versus fixed Profit Margin categories"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Affected by Profit Margin</th>
              <th scope="col">Not affected by Profit Margin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Selected item sale prices, including crops, forage, minerals, and cooked foods</td>
              <td>Blacksmith prices</td>
            </tr>
            <tr>
              <td>Pierre seed prices</td>
              <td>Fish Shop prices</td>
            </tr>
            <tr>
              <td>Selected Joja prices: Grass Starter, Sugar, Wheat Flour, and Rice</td>
              <td>Traveling Cart prices</td>
            </tr>
            <tr>
              <td>The Wheat sale example changes from 25g to 6g at 25%</td>
              <td>Buildings and tool upgrades</td>
            </tr>
            <tr>
              <td></td>
              <td>Quest gold rewards; Willy's Crab Pots remain 1,500g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>The practical result is a mixed economy. If your income comes from a covered crop sale, that income is reduced at a lower setting. If your next goal is a building or tool upgrade, the named fixed-cost category does not become 25% cheaper just because your crop sale did. Use the matrix when a price looks surprising, and do not turn the nearest example into a rule for an unnamed category.</p>
      <p>Read the matrix item by item when making a budget. A Wheat sale and a Crab Pot purchase can appear in the same plan, but the source examples place them on different sides: the sale example changes at 25%, while the Crab Pot example remains 1,500g. Do not combine them into one discount rate. This boundary lets you compare a changing income amount with a fixed-cost target without claiming that the setting moves both together. For a separate Year 1 income plan, see <a className="blog-planner-link" href="/how-to-earn-money-stardew">How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning</a>.</p>
      <ProfitMarginPriceBoundaryFigure />
      <h2>What is the best Profit Margin for a new farm?</h2>
      <p>There is no source-backed universal best value. Choose from the farm you are starting, the number of active players, the pace or constraint you actually want, and whether you accept that fixed costs will not drop with every sale price. Normal/100% is the reference economy. A lower value is a deliberate change to selected income and seed prices, not an achievement badge or a measured promise about how many days a run will take.</p>
      <p>Use the decision matrix as a lookup, not as a ranking. Before selecting a value, write down who will be active, whether the goal is the reference economy or a tighter constraint, and which upcoming expense matters to the plan. Then classify that expense: a covered sale or seed responds to the setting, while a named fixed category does not. The choice is sound when those inputs describe the experience you want; it is not sound merely because a percentage is popular or sounds moderate.</p>
      <div
        aria-label="New farm Profit Margin choices"
        className="blog-table-scroll"
        role="region"
        tabIndex={0}
      >
        <table className="blog-data-table blog-data-table--wrap">
          <thead>
            <tr>
              <th scope="col">Farm situation</th>
              <th scope="col">Starting choice to consider</th>
              <th scope="col">Why it fits the decision</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First solo farm or a standard solo start</td>
              <td>Normal / 100%</td>
              <td>Keeps the reference sale and seed prices while you learn the rest of the game.</td>
            </tr>
            <tr>
              <td>Co-op farm with several active players</td>
              <td>75%, 50%, or 25%, based on the desired constraint</td>
              <td>The Multiplayer page describes lower margins as an economy rebalance for multiple active players.</td>
            </tr>
            <tr>
              <td>Experienced players planning a deliberate challenge</td>
              <td>50% or 25%</td>
              <td>Makes the selected sale-and-seed economy a visible constraint without treating the percentage as an exact difficulty score.</td>
            </tr>
            <tr>
              <td>A group that wants a noticeable but not lowest setting</td>
              <td>75%</td>
              <td>A reasonable preference when the group wants a lower setting without choosing the lowest option; it is not a universal recommendation.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>“Best” is a match between the chosen setting and the farm’s stated inputs, not a ranking in which one percentage wins for everyone. The available choices can be organized, but no lookup can supply a goal that the group has not named. If the group cannot say what pressure it wants to feel, it has not supplied enough input to make a best-setting judgment.</p>
      <h3>A worked choice for a fixed-cost plan</h3>
      <p>Imagine two experienced players planning an early building purchase while wanting a visible constraint on selected sales. They can list the affected sales they expect to rely on, identify the building as a fixed-cost target, and use that plan as the test: if 75% still leaves the affected-sale budget workable, it may fit; if the constraint is too mild, they can consider a lower value. If a price in the plan cannot be classified from the named categories, they should pause the comparison instead of estimating it from another item. This is a planning scenario, not a measured pacing result, and it does not establish a completion date.</p>
      <p>The word “best” should stay tied to that reasoning. A setting may fit a group's intended constraint and still be a poor fit for a different group with another budget or pace. If the chosen constraint makes the first farm less enjoyable, a later new farm can use a different value; the percentage is a setup choice, not a permanent judgment about player skill.</p>
      <h3>Is 75% Profit Margin good?</h3>
      <p>75% is a reasonable choice when you want a visible economy constraint without selecting the lowest setting. It is good for that purpose only if the reduced selected sale income, cheaper covered seeds, and unchanged fixed costs match your group and desired pace. It is not automatically better for solo play, automatically correct for co-op, or proof that the farm will progress at a specific rate.</p>
      <p>Before confirming a percentage, check the next kind of cost you care about. If it is a crop or covered seed, the setting is relevant. If it is a building, tool upgrade, or quest reward, expect that category to remain outside the multiplier. Then ask whether the lower selected income still produces the pace you want.</p>
      <p>That answer makes 75% a middle option in the lookup, not a promise of middle difficulty. Its effect is defined by the affected price categories; whether it feels mild or tight depends on what the farm sells and which fixed costs the group plans to pay. Use the category boundary and the group's stated constraint instead of reading the label as a prediction.</p>
      <h2>Where to choose Profit Margin when starting a new farm</h2>
      <p>The public <a href="https://stardewvalleywiki.com/Options">Stardew Valley Wiki Options page</a> documents the high-level new-game path. Treat the labels and placement below as the documented path, not a promise that every platform and version shows identical wording.</p>
      <h3>Open Advanced Options from the new-game setup</h3>
      <ol>
        <li>Start a new farm and open the new-game setup screen.</li>
        <li>Open the wrench or Advanced Options control documented for the setup screen.</li>
        <li>Find the Profit Margin selector.</li>
        <li>Choose Normal/100%, 75%, 50%, or 25%.</li>
        <li>Create the farm after checking that the selected value matches the economy you intend to play.</li>
      </ol>
      <p>This path is for a new-farm decision only; it does not establish an existing-farm procedure.</p>
      <p>The important check is the selected value before the farm is created. Read it together with the price boundary above: the choice controls the documented sale and seed categories, while fixed costs and rewards remain outside that multiplier. The menu path tells you where to make the choice; it does not turn the percentage into a universal discount.</p>
      <ProfitMarginAdvancedOptionsFigure />
      <h3>Check the choice before creating the save</h3>
      <ul>
        <li>Count the players who will be active in the farm you are creating.</li>
        <li>Decide whether you want the reference economy, a co-op rebalance, or an intentional challenge.</li>
        <li>Confirm that you understand which selected sales and seed prices scale and which listed costs and rewards stay fixed.</li>
      </ul>
      <p>Use all three answers together rather than treating one label as a recommendation. If the player context, intended constraint, and price categories agree, the new-farm choice is ready to confirm.</p>
      <p>If the wrench or Advanced Options labels differ from the documented path on your platform or version, pause and check current, platform-specific guidance rather than guessing at an unsupported procedure. If the menu matches and the selected value fits the intended economy, create the farm with that choice.</p>
      <ProfitMarginSources />
    </article>
  );
}
