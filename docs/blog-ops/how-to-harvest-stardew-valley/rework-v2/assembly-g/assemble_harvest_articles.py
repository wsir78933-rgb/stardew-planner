#!/usr/bin/env python3
"""Assemble the frozen harvest handoffs into the existing article components."""

import hashlib
import json
import re
import shutil
from pathlib import Path

WORKSPACE_ROOT = Path(__file__).resolve().parents[5]
HANDOFF_DIRECTORY = WORKSPACE_ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs"
STAGED_DIRECTORY = WORKSPACE_ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged"
ARTICLE_DIRECTORY = WORKSPACE_ROOT / "src/blog/articles"
PUBLIC_BLOG_DIRECTORY = WORKSPACE_ROOT / "public/blog"
PUBLIC_ILLUSTRATION_DIRECTORY = PUBLIC_BLOG_DIRECTORY / "illustrations"
ASSEMBLY_DIRECTORY = Path(__file__).resolve().parent

EXPECTED_HANDOFF_FILE_SHA256 = {
    "en": "8ca4288debffa704154f48db2a58b68a2fadbd68fa2628040b49d37a7f56485f",
    "zh-CN": "896976369ee8abc18fbcc5983f2f5472fa5b0dcd216244f2046eeca6a390d7eb",
}
EXPECTED_BODY_HASH = {
    "en": "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67",
    "zh-CN": "30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd",
}
SITE_INTERNAL_HREFS = {
    "/",
    "/last-day-to-plant-stardew",
    "/what-to-grow-in-greenhouse-stardew",
}
ARTICLE_EXPORT_NAME = {
    "en": "HowToHarvestStardewValleyEnglishArticle",
    "zh-CN": "HowToHarvestStardewValleyChineseArticle",
}
FIGURE_COMPONENT_NAME = {
    "en": {
        "media-mature-crops": "HowToHarvestStardewValleyEnglishMatureCropsFigure",
        "media-trellis-paths": "HowToHarvestStardewValleyEnglishTrellisPathsFigure",
    },
    "zh-CN": {
        "media-mature-crops": "HowToHarvestStardewValleyChineseMatureCropsFigure",
        "media-trellis-paths": "HowToHarvestStardewValleyChineseTrellisPathsFigure",
    },
}
ARTICLE_FILE_NAME = {
    "en": "how-to-harvest-stardew-valley.en.tsx",
    "zh-CN": "how-to-harvest-stardew-valley.zh.tsx",
}
STAGED_PUBLIC_FILES = (
    "how-to-harvest-stardew-valley-cover.webp",
    "how-to-harvest-stardew-valley-cover.avif",
    "how-to-harvest-stardew-valley-mature-crops.webp",
    "how-to-harvest-stardew-valley-mature-crops.avif",
    "how-to-harvest-stardew-valley-trellis-paths.webp",
    "how-to-harvest-stardew-valley-trellis-paths.avif",
)
FIGURE_PATTERN = re.compile(
    r'^<figure id="(?P<figure_id>media-mature-crops|media-trellis-paths)">\n'
    r'<img src="(?P<src>/blog/illustrations/how-to-harvest-stardew-valley-(?:mature-crops|trellis-paths)\.webp)" '
    r'alt="(?P<alt>[^"]*)" width="1672" height="941" />\n'
    r"<figcaption>(?P<caption>.*)</figcaption>\n"
    r"</figure>$",
    re.DOTALL,
)
CAPTION_ANCHOR_PATTERN = re.compile(r'<a href="([^"]+)">([^<]*)</a>')
MARKDOWN_LINK_PATTERN = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def sha256_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(file_path.read_bytes())
    return digest.hexdigest()


def require_sha256(label: str, actual_sha256: str, expected_sha256: str) -> None:
    if actual_sha256 != expected_sha256:
        raise SystemExit(
            f"{label} sha256 mismatch. Received: {actual_sha256}. Expected: {expected_sha256}."
        )


def load_frozen_handoff(locale: str) -> dict:
    file_name = "public-blog-handoff-en.json" if locale == "en" else "public-blog-handoff-zh.json"
    handoff_path = HANDOFF_DIRECTORY / file_name
    file_sha256 = sha256_file(handoff_path)
    require_sha256(str(handoff_path), file_sha256, EXPECTED_HANDOFF_FILE_SHA256[locale])
    handoff = json.loads(handoff_path.read_text(encoding="utf-8"))
    if handoff.get("locale") != locale:
        raise SystemExit(
            f"{file_name} locale mismatch. Received: {handoff.get('locale')!r}. Expected: {locale!r}."
        )
    body = handoff.get("body")
    if not isinstance(body, str) or body == "":
        raise SystemExit(f"{file_name} body must be a non-empty string. Received: {body!r}.")
    if "\r" in body or not body.endswith("\n"):
        raise SystemExit(f"{file_name} body must be LF and end with one newline.")
    body_hash = hashlib.sha256(body.encode("utf-8")).hexdigest()
    if handoff.get("bodyHash") != body_hash:
        raise SystemExit(
            f"{file_name} bodyHash field {handoff.get('bodyHash')} does not match body bytes {body_hash}."
        )
    require_sha256(f"{file_name} body", body_hash, EXPECTED_BODY_HASH[locale])
    if handoff.get("integrity", {}).get("frozen") is not True:
        raise SystemExit(f"{file_name} integrity.frozen is not true.")
    if handoff.get("integrity", {}).get("freezePublicBlogHandoff") is not True:
        raise SystemExit(f"{file_name} integrity.freezePublicBlogHandoff is not true.")
    return handoff


def split_markdown_blocks(body: str) -> list[str]:
    blocks: list[str] = []
    current_lines: list[str] = []
    for line in body.split("\n"):
        if line == "":
            if current_lines:
                blocks.append("\n".join(current_lines))
                current_lines = []
            continue
        current_lines.append(line)
    if current_lines:
        raise SystemExit("Handoff body has a trailing block without a closing blank line.")
    if len(blocks) != 37:
        raise SystemExit(f"Handoff body block count must be 37. Received: {len(blocks)}.")
    return blocks


def localize_public_href(href: str, locale: str) -> tuple[str, bool]:
    if href.startswith("https://"):
        return href, False
    if href not in SITE_INTERNAL_HREFS:
        raise SystemExit(f"Unexpected article href {href!r} for locale {locale!r}.")
    if locale == "en":
        return href, True
    if locale != "zh-CN":
        raise SystemExit(f"Unexpected article locale {locale!r}.")
    if href == "/":
        return "/zh", True
    return f"/zh{href}", True


def jsx_text(text: str) -> str:
    if any(character in text for character in "{}<>"):
        raise SystemExit(f"JSX text contains a reserved character. Received: {text!r}.")
    return text


def jsx_string_expression(value: str) -> str:
    return "{" + json.dumps(value, ensure_ascii=False) + "}"


def render_inline(text: str, locale: str) -> str:
    rendered: list[str] = []
    cursor = 0
    while cursor < len(text):
        if text.startswith("**", cursor):
            closing_index = text.find("**", cursor + 2)
            if closing_index < 0:
                raise SystemExit(f"Unclosed bold marker. Received: {text[cursor:cursor + 80]!r}.")
            bold_text = text[cursor + 2 : closing_index]
            rendered.append(f"<strong>{render_inline(bold_text, locale)}</strong>")
            cursor = closing_index + 2
            continue
        if text.startswith("[", cursor):
            link_match = MARKDOWN_LINK_PATTERN.match(text, cursor)
            if link_match is None or link_match.start() != cursor:
                raise SystemExit(f"Unparsed markdown link. Received: {text[cursor:cursor + 120]!r}.")
            label, href = link_match.group(1), link_match.group(2)
            localized_href, is_internal = localize_public_href(href, locale)
            class_attribute = ' className="blog-planner-link"' if is_internal else ""
            rendered.append(
                f"<a{class_attribute} href={jsx_string_expression(localized_href)}>"
                f"{render_inline(label, locale)}</a>"
            )
            cursor = link_match.end()
            continue
        next_marker = len(text)
        for marker in ("**", "["):
            marker_index = text.find(marker, cursor)
            if marker_index >= 0:
                next_marker = min(next_marker, marker_index)
        rendered.append(jsx_text(text[cursor:next_marker]))
        cursor = next_marker
    return "".join(rendered)


def visible_inline(text: str) -> str:
    without_bold = text.replace("**", "")
    return MARKDOWN_LINK_PATTERN.sub(lambda match: match.group(1), without_bold)


def render_caption(caption: str, locale: str) -> tuple[str, str]:
    rendered: list[str] = []
    visible: list[str] = []
    cursor = 0
    for anchor_match in CAPTION_ANCHOR_PATTERN.finditer(caption):
        before = caption[cursor : anchor_match.start()]
        rendered.append(jsx_text(before))
        visible.append(before)
        href, label = anchor_match.group(1), anchor_match.group(2)
        localized_href, is_internal = localize_public_href(href, locale)
        class_attribute = ' className="blog-planner-link"' if is_internal else ""
        rendered.append(
            f"<a{class_attribute} href={jsx_string_expression(localized_href)}>{jsx_text(label)}</a>"
        )
        visible.append(label)
        cursor = anchor_match.end()
    remainder = caption[cursor:]
    if "<" in remainder:
        raise SystemExit(f"Unparsed caption markup. Received: {remainder!r}.")
    rendered.append(jsx_text(remainder))
    visible.append(remainder)
    return "".join(rendered), "".join(visible)


def render_figure(block: str, locale: str) -> tuple[str, str, dict]:
    figure_match = FIGURE_PATTERN.match(block)
    if figure_match is None:
        raise SystemExit(f"Unparsed figure block. Received: {block!r}.")
    figure_id = figure_match.group("figure_id")
    src = figure_match.group("src")
    expected_src = f"/blog/illustrations/how-to-harvest-stardew-valley-{figure_id.removeprefix('media-')}.webp"
    if src != expected_src:
        raise SystemExit(f"Figure {figure_id} src mismatch. Received: {src!r}. Expected: {expected_src!r}.")
    alt = figure_match.group("alt")
    caption_jsx, caption_visible = render_caption(figure_match.group("caption"), locale)
    component_name = FIGURE_COMPONENT_NAME[locale][figure_id]
    component_source = (
        f"function {component_name}() {{\n"
        "  return (\n"
        f'    <figure className="blog-article-media" id={jsx_string_expression(figure_id)}>\n'
        "      <PublicPicture\n"
        f"        alt={jsx_string_expression(alt)}\n"
        '        decoding="async"\n'
        "        height={941}\n"
        '        loading="lazy"\n'
        f"        src={jsx_string_expression(src)}\n"
        "        width={1672}\n"
        "      />\n"
        "      <figcaption>\n"
        f"        {caption_jsx}\n"
        "      </figcaption>\n"
        "    </figure>\n"
        "  );\n"
        "}\n"
    )
    figure_record = {
        "id": figure_id,
        "src": src,
        "alt": alt,
        "captionVisible": caption_visible,
        "componentName": component_name,
    }
    return component_source, f"      <{component_name} />", figure_record


def render_block(block: str, locale: str) -> tuple[str, list[str]]:
    if block.startswith("<figure "):
        raise SystemExit("Figure blocks must be rendered before ordinary blocks.")
    if block.startswith("### "):
        heading = block[4:]
        return f"      <h3>{render_inline(heading, locale)}</h3>", [visible_inline(heading)]
    if block.startswith("## "):
        heading = block[3:]
        return f"      <h2>{render_inline(heading, locale)}</h2>", [visible_inline(heading)]
    if block.startswith("- "):
        items: list[str] = []
        visible_items: list[str] = []
        for line in block.split("\n"):
            if not line.startswith("- "):
                raise SystemExit(f"List line does not start with '- '. Received: {line!r}.")
            item_text = line[2:]
            items.append(f"        <li>{render_inline(item_text, locale)}</li>")
            visible_items.append(visible_inline(item_text))
        return "      <ul>\n" + "\n".join(items) + "\n      </ul>", visible_items
    if block.startswith("#"):
        raise SystemExit(f"Unexpected heading depth. Received: {block!r}.")
    return f"      <p>\n        {render_inline(block, locale)}\n      </p>", [visible_inline(block)]


def assemble_article_source(locale: str, handoff: dict) -> tuple[str, dict]:
    figure_components: list[str] = []
    article_children: list[str] = []
    visible_blocks: list[dict] = []
    figure_records: list[dict] = []
    for block in split_markdown_blocks(handoff["body"]):
        if block.startswith("<figure "):
            component_source, child_source, figure_record = render_figure(block, locale)
            figure_components.append(component_source)
            article_children.append(child_source)
            visible_blocks.append(
                {
                    "kind": "figcaption",
                    "id": figure_record["id"],
                    "text": [figure_record["captionVisible"]],
                }
            )
            figure_records.append(figure_record)
            continue
        child_source, visible_text = render_block(block, locale)
        article_children.append(child_source)
        kind = "list" if block.startswith("- ") else "heading" if block.startswith("#") else "paragraph"
        visible_blocks.append({"kind": kind, "text": visible_text})
    if len(figure_components) != 2:
        raise SystemExit(f"{locale} figure count must be 2. Received: {len(figure_components)}.")
    export_name = ARTICLE_EXPORT_NAME[locale]
    source = (
        'import { PublicPicture } from "../../components/public-picture";\n\n'
        + "\n".join(figure_components)
        + "\n"
        + f"export function {export_name}() {{\n"
        + "  return (\n"
        + "    <article>\n"
        + "\n".join(article_children)
        + "\n"
        + "    </article>\n"
        + "  );\n"
        + "}\n"
    )
    return source, {"visibleBlocks": visible_blocks, "figures": figure_records}


def public_destination(file_name: str) -> Path:
    if file_name.startswith("how-to-harvest-stardew-valley-cover."):
        return PUBLIC_BLOG_DIRECTORY / file_name
    if file_name.startswith("how-to-harvest-stardew-valley-mature-crops.") or file_name.startswith(
        "how-to-harvest-stardew-valley-trellis-paths."
    ):
        return PUBLIC_ILLUSTRATION_DIRECTORY / file_name
    raise SystemExit(f"Unexpected staged public file name. Received: {file_name!r}.")


def expected_asset_sha256(handoff: dict) -> dict[str, str]:
    requirements = handoff["publicRequirements"]
    expected: dict[str, str] = {}
    cover = requirements["cover"]
    expected[Path(cover["src"]).name] = cover["sha256"]
    expected[Path(cover["avif"]).name] = cover["avifSha256"]
    for figure in requirements["figures"]:
        expected[Path(figure["src"]).name] = figure["sha256"]
        expected[Path(figure["avif"]).name] = figure["avifSha256"]
    return expected


def install_staged_assets(expected_sha256_by_name: dict[str, str]) -> list[dict]:
    installed: list[dict] = []
    for file_name in STAGED_PUBLIC_FILES:
        if file_name not in expected_sha256_by_name:
            raise SystemExit(f"Staged file {file_name} is missing from the frozen handoff hashes.")
        source_path = STAGED_DIRECTORY / file_name
        destination_path = public_destination(file_name)
        source_sha256 = sha256_file(source_path)
        require_sha256(str(source_path), source_sha256, expected_sha256_by_name[file_name])
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source_path, destination_path)
        installed_sha256 = sha256_file(destination_path)
        require_sha256(str(destination_path), installed_sha256, expected_sha256_by_name[file_name])
        installed.append(
            {
                "fileName": file_name,
                "publicPath": "/" + str(destination_path.relative_to(WORKSPACE_ROOT / "public")),
                "sha256": installed_sha256,
                "byteSize": destination_path.stat().st_size,
            }
        )
    return installed


def preserved_method_assets() -> list[str]:
    preserved_names = (
        "how-to-harvest-stardew-valley-en-methods.webp",
        "how-to-harvest-stardew-valley-en-methods.avif",
        "how-to-harvest-stardew-valley-zh-methods.webp",
        "how-to-harvest-stardew-valley-zh-methods.avif",
    )
    preserved: list[str] = []
    for file_name in preserved_names:
        file_path = PUBLIC_ILLUSTRATION_DIRECTORY / file_name
        if not file_path.is_file():
            raise SystemExit(f"Old method asset is missing and must be kept. Received path: {file_path}.")
        preserved.append(file_name)
    return preserved


def main() -> None:
    if WORKSPACE_ROOT.name != "博客-2":
        raise SystemExit(f"Assembler workspace must be 博客-2. Received: {WORKSPACE_ROOT}.")
    english_handoff = load_frozen_handoff("en")
    chinese_handoff = load_frozen_handoff("zh-CN")
    if chinese_handoff["integrity"].get("sourceEnglishBodyHash") != EXPECTED_BODY_HASH["en"]:
        raise SystemExit(
            "Chinese handoff sourceEnglishBodyHash does not match the frozen English body. "
            f"Received: {chinese_handoff['integrity'].get('sourceEnglishBodyHash')!r}."
        )
    if chinese_handoff["integrity"].get("eTranslationReview") != "PASS":
        raise SystemExit(
            "Chinese handoff eTranslationReview is not PASS. "
            f"Received: {chinese_handoff['integrity'].get('eTranslationReview')!r}."
        )
    english_expected_assets = expected_asset_sha256(english_handoff)
    chinese_expected_assets = expected_asset_sha256(chinese_handoff)
    if english_expected_assets != chinese_expected_assets:
        raise SystemExit("English and Chinese handoffs disagree on the six public asset hashes.")
    english_source, english_mapping = assemble_article_source("en", english_handoff)
    chinese_source, chinese_mapping = assemble_article_source("zh-CN", chinese_handoff)
    (ARTICLE_DIRECTORY / ARTICLE_FILE_NAME["en"]).write_text(english_source, encoding="utf-8", newline="\n")
    (ARTICLE_DIRECTORY / ARTICLE_FILE_NAME["zh-CN"]).write_text(chinese_source, encoding="utf-8", newline="\n")
    installed_assets = install_staged_assets(english_expected_assets)
    mapping = {
        "englishBodyHash": EXPECTED_BODY_HASH["en"],
        "chineseBodyHash": EXPECTED_BODY_HASH["zh-CN"],
        "english": english_mapping,
        "chinese": chinese_mapping,
        "englishSeo": {
            "title": english_handoff["seo"]["title"],
            "description": english_handoff["seo"]["description"],
            "coverAlt": english_handoff["seo"]["cover"]["alt"],
            "coverCaption": english_handoff["seo"]["cover"]["caption"],
        },
        "chineseSeo": {
            "title": chinese_handoff["seo"]["title"],
            "description": chinese_handoff["seo"]["description"],
            "coverAlt": chinese_handoff["seo"]["cover"]["alt"],
            "coverCaption": chinese_handoff["seo"]["cover"]["caption"],
        },
        "installedAssets": installed_assets,
        "preservedMethodAssets": preserved_method_assets(),
    }
    (ASSEMBLY_DIRECTORY / "visible-body-expectation.json").write_text(
        json.dumps(mapping, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"assembled articles and {len(installed_assets)} public assets")


if __name__ == "__main__":
    main()
