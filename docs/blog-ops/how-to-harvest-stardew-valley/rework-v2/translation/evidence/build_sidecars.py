#!/usr/bin/env python3
"""Write the Chinese SEO, media, and public-reference sidecars for this translation."""

import hashlib
import json
import unicodedata
from pathlib import Path


ENGLISH_BODY_HASH = "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
PRESS_URL = "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png"
PRESS_CREDIT = (
    'ConcernedApe，<a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">'
    "星露谷物语新闻素材截图</a>。"
)
WIKI_VERSION_NOTE = "维基修订号就是 URL 里的 oldid。"

REWORK_ROOT = Path(__file__).resolve().parents[2]
TRANSLATION_ROOT = REWORK_ROOT / "translation"
CHINESE_BODY_PATH = TRANSLATION_ROOT / "zh-body.md"


def read_nfc_lf_text(path):
    raw_bytes = path.read_bytes()
    if raw_bytes.startswith(b"\xef\xbb\xbf"):
        raise SystemExit(f"{path} starts with a UTF-8 BOM.")
    if b"\r" in raw_bytes:
        raise SystemExit(f"{path} contains CR. Expected LF only.")
    text = raw_bytes.decode("utf-8")
    if unicodedata.normalize("NFC", text) != text:
        raise SystemExit(f"{path} is not Unicode NFC.")
    if not text.endswith("\n"):
        raise SystemExit(f"{path} does not end with a newline.")
    return text


def sha256_text(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def require_quote(chinese_body, quote, reference_id, expected_count):
    if quote == "":
        raise SystemExit(f"{reference_id} has an empty quote.")
    actual_count = chinese_body.count(quote)
    if actual_count != expected_count:
        raise SystemExit(
            f"{reference_id} quote count must be {expected_count}. "
            f"Received {actual_count}. Quote: {quote!r}"
        )


def reference_record(reference_id, label, url, quote, occurrence, version_note=None):
    if not url.startswith("https://"):
        raise SystemExit(f"{reference_id} url must start with https://. Received: {url!r}")
    if url not in quote:
        raise SystemExit(f"{reference_id} url is missing from its quote. URL: {url!r}")
    record = {
        "id": reference_id,
        "label": label,
        "url": url,
        "appliesTo": {"quote": quote, "occurrence": occurrence},
    }
    if version_note is not None:
        record["versionNote"] = version_note
    return record


def build_references():
    wiki = WIKI_VERSION_NOTE
    return [
        reference_record(
            "zh-steam-parsnip-right-click",
            "Steam 社区讨论：怎么收防风草",
            "https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411",
            "站在成熟植株旁边[右键点它](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411)",
            1,
        ),
        reference_record(
            "zh-wiki-parsnip-stages",
            "星露谷物语维基：防风草",
            "https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123",
            "一株[防风草](https://stardewvalleywiki.com/index.php?title=Parsnip&oldid=191123)浇水长 4 天，才会出现可以收获的图像。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-pumpkin-stages",
            "星露谷物语维基：南瓜",
            "https://stardewvalleywiki.com/index.php?title=Pumpkin&oldid=194726",
            "一株[南瓜](https://stardewvalleywiki.com/index.php?title=Pumpkin&oldid=194726)浇水长 13 天，才会出现可以收获的图像",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-blueberry-regrowth",
            "星露谷物语维基：蓝莓",
            "https://stardewvalleywiki.com/index.php?title=Blueberry&oldid=192090",
            "像[蓝莓](https://stardewvalleywiki.com/index.php?title=Blueberry&oldid=192090)（Blueberry）这种会多次收获的作物，要 13 天才第一次成熟。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-crops-watering",
            "星露谷物语维基：作物",
            "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979",
            "[作物必须每天浇水，才能按最快速度生长](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-controls-action",
            "星露谷物语维基：操作",
            "https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481",
            "[X 和右键映射成同一个 Check/Do Action](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-controls-tool",
            "星露谷物语维基：操作",
            "https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481",
            "[左键和 C](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481)绑定的是使用工具或放置物品。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-calendar-replant",
            "星露谷物语维基：作物生长日历",
            "https://stardewvalleywiki.com/index.php?title=Crop_Growth_Calendars&oldid=189875",
            "[作物生长日历](https://stardewvalleywiki.com/index.php?title=Crop_Growth_Calendars&oldid=189875)，只收一次的地块要整个季节都有产出，是按收获当天重新播种并浇水来算的。",
            1,
            wiki,
        ),
        reference_record(
            "zh-forum-hold-right-click",
            "星露谷官方论坛：PC 操作与移动端",
            "https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699",
            "[按住右键，并且鼠标不要靠近角色](https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699)",
            1,
        ),
        reference_record(
            "zh-forum-x-mapped",
            "星露谷官方论坛：PC 操作与移动端",
            "https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699",
            "[X 映射成右键](https://forums.stardewvalley.net/threads/pc-controls-vs-mobile.8990/post-53699)",
            1,
        ),
        reference_record(
            "zh-wiki-scythe-examples",
            "星露谷物语维基：镰刀",
            "https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696",
            "另外一些作物必须用普通[镰刀](https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696)来收，例如苋菜、甘蓝菜和小麦。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-kale",
            "星露谷物语维基：甘蓝菜",
            "https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520",
            "[甘蓝菜要用镰刀或更好的镰刀来收](https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-fiber-seeds",
            "星露谷物语维基：纤维种子",
            "https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587",
            "[纤维种子要用镰刀来收](https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-unmilled-rice",
            "星露谷物语维基：未碾米",
            "https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130",
            "[未碾米要用镰刀来收](https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-mobile-scythe",
            "星露谷物语维基：移动端操作",
            "https://stardewvalleywiki.com/index.php?title=Mobile_Controls&oldid=189843",
            "[先选中镰刀，再使用它](https://stardewvalleywiki.com/index.php?title=Mobile_Controls&oldid=189843)",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-iridium-scythe",
            "星露谷物语维基：铱镰刀",
            "https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836",
            "[铱镰刀](https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836)是 1.6 耕种精通（Farming Mastery）给的那把镰刀。挥过的范围内，能收耕地上长出来的作物，普通作物也包括在内。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-giant-crops",
            "星露谷物语维基：巨大作物",
            "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Giant_Crops",
            "会掉落[15 到 21 个普通品质的物品](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Giant_Crops)。巨大作物换季不会死，所以可以留在田里，等到你准备砍的时候再砍。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-trellis",
            "星露谷物语维基：棚架作物",
            "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Trellis_Crops",
            "[青豆、啤酒花和葡萄](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Trellis_Crops)（Green Bean、Hops、Grape）长在棚架上。活着的棚架走不穿，所以每株都要有一格能站在旁边。植株死了以后，那一格就可以走过去。",
            1,
            wiki,
        ),
        reference_record(
            "zh-wiki-season-wither",
            "星露谷物语维基：作物",
            "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979",
            "[不再当季的作物会在第 1 天枯萎](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979)，并留下枯株",
            1,
            wiki,
        ),
        reference_record(
            "zh-press-multiplayer-2-mature",
            "ConcernedApe 的星露谷物语新闻素材截图",
            PRESS_URL,
            PRESS_CREDIT,
            1,
        ),
        reference_record(
            "zh-press-multiplayer-2-trellis",
            "ConcernedApe 的星露谷物语新闻素材截图",
            PRESS_URL,
            PRESS_CREDIT,
            2,
        ),
    ]


def assert_reference_quotes(chinese_body, references):
    if len(references) != 21:
        raise SystemExit(f"reference count must be 21. Received {len(references)}.")
    seen_quotes = {}
    for record in references:
        quote = record["appliesTo"]["quote"]
        occurrence = record["appliesTo"]["occurrence"]
        previous = seen_quotes.get(quote)
        if previous is None:
            seen_quotes[quote] = occurrence
        elif occurrence == previous + 1:
            seen_quotes[quote] = occurrence
        else:
            raise SystemExit(
                f"Repeated quote has unexpected occurrences {previous} then {occurrence}. "
                f"Quote: {quote!r}"
            )
    for quote, highest_occurrence in seen_quotes.items():
        require_quote(chinese_body, quote, quote[:24], highest_occurrence)


def build_seo(chinese_body_hash):
    return {
        "schemaVersion": 1,
        "locale": "zh-CN",
        "country": "US",
        "slug": "how-to-harvest-stardew-valley",
        "title": "星露谷物语怎么收作物：徒手、镰刀或斧头",
        "h1": "星露谷物语怎么收作物：徒手、镰刀或斧头",
        "description": "防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。",
        "titleEqualsH1": True,
        "topic": "星露谷物语指南",
        "author": "星露谷规划器团队",
        "readTimeMinutes": 6,
        "featured": False,
        "datePublished": None,
        "publicPath": "/zh/how-to-harvest-stardew-valley",
        "canonicalUrl": "https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley",
        "bodyHash": chinese_body_hash,
        "sourceEnglishBodyHash": ENGLISH_BODY_HASH,
        "schemaType": "Article",
        "faq": None,
        "status": "pending_translation_review",
        "freezePublicBlogHandoff": False,
        "cover": {
            "src": "/blog/how-to-harvest-stardew-valley-cover.webp",
            "avif": "/blog/how-to-harvest-stardew-valley-cover.avif",
            "width": 1672,
            "height": 941,
            "alt": "傍晚的农场：一块耕地里是橙色南瓜，田块周围是土路，南瓜旁边是一排排木棚架。",
            "caption": "农场的傍晚：橙色南瓜铺满土路旁的耕地，这块地旁边是木棚架。ConcernedApe，星露谷物语新闻素材截图。",
            "creditName": "ConcernedApe",
            "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png",
        },
        "figures": [
            {
                "id": "media-mature-crops",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif",
                "width": 1672,
                "height": 941,
                "alt": "土路旁的耕地上长着饱满的橙色南瓜。",
                "caption": "饱满的橙色南瓜立在土路旁边的耕地上。" + PRESS_CREDIT,
                "creditName": "ConcernedApe",
                "creditUrl": PRESS_URL,
            },
            {
                "id": "media-trellis-paths",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif",
                "width": 1672,
                "height": 941,
                "alt": "两排木棚架中间有一条空土路，路旁的棚架上有紫色葡萄。",
                "caption": "两排木棚架中间隔着一条空土路，路旁的棚架上是一串串紫色葡萄。" + PRESS_CREDIT,
                "creditName": "ConcernedApe",
                "creditUrl": PRESS_URL,
            },
        ],
    }


def translated_media_copy(english_media, chinese_body_hash, seo):
    media = {
        "version": english_media["version"],
        "locale": "zh-CN",
        "slug": english_media["slug"],
        "bodySha256NfcLf": chinese_body_hash,
        "sourceEnglishBodyHash": ENGLISH_BODY_HASH,
        "publicUrlStatus": english_media["publicUrlStatus"],
        "images": [],
    }
    cover = seo["cover"]
    mature = seo["figures"][0]
    trellis = seo["figures"][1]
    text_by_id = {
        "media-cover": {
            "alt": cover["alt"],
            "caption": cover["caption"],
            "bodyAnchor": None,
        },
        "media-mature-crops": {
            "alt": mature["alt"],
            "caption": mature["caption"],
            "bodyAnchor": "怎么看出作物可以收",
        },
        "media-trellis-paths": {
            "alt": trellis["alt"],
            "caption": trellis["caption"],
            "bodyAnchor": "棚架作物旁边留出走得到的路",
        },
    }
    for english_image in english_media["images"]:
        image_id = english_image["id"]
        if image_id not in text_by_id:
            raise SystemExit(f"Unexpected English media id: {image_id!r}")
        translated = dict(english_image)
        replacement = text_by_id[image_id]
        translated["alt"] = replacement["alt"]
        translated["caption"] = replacement["caption"]
        if replacement["bodyAnchor"] is None:
            translated.pop("bodyAnchor", None)
        else:
            translated["bodyAnchor"] = replacement["bodyAnchor"]
        media["images"].append(translated)
    if len(media["images"]) != 3:
        raise SystemExit(f"media image count must be 3. Received {len(media['images'])}.")
    return media


def write_json(path, payload):
    encoded = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if unicodedata.normalize("NFC", encoded) != encoded:
        raise SystemExit(f"JSON for {path.name} is not NFC.")
    path.write_bytes(encoded.encode("utf-8"))


def main():
    chinese_body = read_nfc_lf_text(CHINESE_BODY_PATH)
    chinese_body_hash = sha256_text(chinese_body)
    references = build_references()
    assert_reference_quotes(chinese_body, references)
    seo = build_seo(chinese_body_hash)
    english_media = json.loads((REWORK_ROOT / "en-media.locked.json").read_text(encoding="utf-8"))
    media = translated_media_copy(english_media, chinese_body_hash, seo)
    reference_document = {
        "version": "rework-v2",
        "locale": "zh-CN",
        "slug": "how-to-harvest-stardew-valley",
        "bodyHash": chinese_body_hash,
        "sourceEnglishBodyHash": ENGLISH_BODY_HASH,
        "bodyFile": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/zh-body.md",
        "referenceCount": 21,
        "references": references,
    }
    write_json(TRANSLATION_ROOT / "zh-seo.json", seo)
    write_json(TRANSLATION_ROOT / "zh-media.json", media)
    write_json(TRANSLATION_ROOT / "zh-public-references.json", reference_document)
    print(f"chinese_body_hash {chinese_body_hash}")
    print("wrote zh-seo.json zh-media.json zh-public-references.json")


if __name__ == "__main__":
    main()
