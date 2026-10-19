import { JsonLdScript } from "../../src/components/json-ld-script";
import { PlannerHomepage } from "../../src/components/planner-homepage";
import { japaneseHomepagePathname } from "../../src/seo/canonical-public-routes";
import { createJapaneseHomepageMetadata } from "../../src/seo/page-metadata";
import { createJapaneseHomepageWebApplicationStructuredData } from "../../src/seo/page-structured-data";

const japanesePlannerTitle =
  "スターデューバレー プランナー｜無料のオンライン牧場レイアウトツール";
const japanesePlannerDescription =
  "スタバレのレイアウトツールで、ゲーム内で建てる前に牧場を計画。8種類の牧場から選び、建物や作物を配置できます。季節の切り替え、スプリンクラーの範囲確認、セーブデータの読み込みにも対応。";

export const metadata = createJapaneseHomepageMetadata({
  title: japanesePlannerTitle,
  description: japanesePlannerDescription,
});

export default function JapanesePlannerPage() {
  return (
    <>
      <PlannerHomepage locale="ja" />
      <JsonLdScript
        structuredData={createJapaneseHomepageWebApplicationStructuredData({
          name: japanesePlannerTitle,
          description: japanesePlannerDescription,
          pathname: japaneseHomepagePathname,
        })}
      />
    </>
  );
}
