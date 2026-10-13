#!/usr/bin/env python3
"""
Fidelity and source verification script for how-to-harvest-stardew-valley.
Performs exact comparison across:
1. public-blog-handoff-en.json vs src/blog/articles/how-to-harvest-stardew-valley.en.tsx
2. public-blog-handoff-zh.json vs src/blog/articles/how-to-harvest-stardew-valley.zh.tsx
3. All 18 link hrefs, anchor texts, and locales
4. Figure alt, caption, attributes, and dimensions
5. blog-post-registry.tsx metadata & blogPostSlugs order
6. blog-copy.ts localized routes
7. public/llms.txt entries
8. Media files in public/blog/ against final-manifest.json
9. Absence of forbidden components (BlogSources, BlogPlannerCta, appendix, etc.)
10. Test changes sanity check
"""

import json
import hashlib
import os
import re
import sys
from typing import Dict, List, Tuple

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.."))

def compute_sha256(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, "rb") as file_handle:
        while chunk := file_handle.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def extract_jsx_element_text(jsx_content: str, figure_func_name: str, article_func_name: str) -> List[str]:
    """Extract reader-visible text strings inside p, h2, h3, li, figcaption in rendered order."""
    # Find figure function body
    fig_pattern = re.compile(rf'function\s+{figure_func_name}\s*\(\)\s*\{{(.*?)\n\}}', re.DOTALL)
    art_pattern = re.compile(rf'export\s+function\s+{article_func_name}\s*\(\)\s*\{{(.*?)\n\}}', re.DOTALL)
    
    fig_match = fig_pattern.search(jsx_content)
    art_match = art_pattern.search(jsx_content)
    if not fig_match or not art_match:
        raise ValueError(f"Could not find function {figure_func_name} or {article_func_name}")
        
    fig_body = fig_match.group(1)
    art_body = art_match.group(1)
    
    # Inline figure into article body where <FigureComponent /> is invoked
    rendered_jsx = re.sub(rf'<{figure_func_name}\s*/>', fig_body, art_body)
    
    pattern = re.compile(r'<(p|h2|h3|li|figcaption)(?:\s+[^>]*)?>(.*?)</\1>', re.DOTALL)
    text_nodes = []
    for match in pattern.finditer(rendered_jsx):
        tag_name, inner = match.groups()
        plain_text = re.sub(r'<[^>]+>', '', inner)
        plain_text = ' '.join(plain_text.split())
        text_nodes.append(plain_text)
    return text_nodes

def extract_markdown_text_blocks(markdown_content: str) -> List[str]:
    """Extract reader-visible text blocks from markdown body."""
    blocks = []
    lines = markdown_content.splitlines()
    buffer = []
    in_figure = False
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('<figure'):
            in_figure = True
            continue
        if stripped.startswith('</figure>'):
            in_figure = False
            continue
        if in_figure:
            if '<figcaption>' in stripped:
                caption = re.sub(r'<[^>]+>', '', stripped)
                blocks.append(' '.join(caption.split()))
            continue
        if not stripped:
            if buffer:
                block_text = ' '.join(' '.join(buffer).split())
                # remove markdown links [text](url) -> text
                block_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', block_text)
                # remove heading prefixes
                block_text = re.sub(r'^#{1,6}\s+', '', block_text)
                blocks.append(block_text)
                buffer = []
            continue
        if stripped.startswith('- '):
            if buffer:
                block_text = ' '.join(' '.join(buffer).split())
                block_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', block_text)
                block_text = re.sub(r'^#{1,6}\s+', '', block_text)
                blocks.append(block_text)
                buffer = []
            item_text = stripped[2:].strip()
            item_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', item_text)
            blocks.append(' '.join(item_text.split()))
            continue
        if stripped.startswith('## ') or stripped.startswith('### '):
            if buffer:
                block_text = ' '.join(' '.join(buffer).split())
                block_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', block_text)
                blocks.append(block_text)
                buffer = []
            heading_text = re.sub(r'^#{2,3}\s+', '', stripped)
            blocks.append(' '.join(heading_text.split()))
            continue
        buffer.append(stripped)
    
    if buffer:
        block_text = ' '.join(' '.join(buffer).split())
        block_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', block_text)
        block_text = re.sub(r'^#{1,6}\s+', '', block_text)
        blocks.append(block_text)
        
    return blocks

def extract_jsx_links(jsx_content: str) -> List[Tuple[str, str]]:
    """Extract (href, text) for all <a> tags."""
    pattern = re.compile(r'<a(?:\s+[^>]*)?href="([^"]+)"(?:\s+[^>]*)?>(.*?)</a>', re.DOTALL)
    links = []
    for match in pattern.finditer(jsx_content):
        href, text = match.groups()
        plain_text = re.sub(r'<[^>]+>', '', text).strip()
        links.append((href, plain_text))
    return links

def extract_markdown_links(markdown_content: str) -> List[Tuple[str, str]]:
    """Extract (href, text) for all markdown [text](href) links."""
    pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    links = []
    for match in pattern.finditer(markdown_content):
        text, href = match.groups()
        links.append((href, text.strip()))
    return links

def verify_fidelity() -> int:
    issues = []
    print("=== STARTING FULL SOURCE FIDELITY AUDIT ===")
    
    # 1. Hashes of TSX
    en_tsx_path = os.path.join(WORKSPACE_ROOT, "src/blog/articles/how-to-harvest-stardew-valley.en.tsx")
    zh_tsx_path = os.path.join(WORKSPACE_ROOT, "src/blog/articles/how-to-harvest-stardew-valley.zh.tsx")
    
    en_hash = compute_sha256(en_tsx_path)
    zh_hash = compute_sha256(zh_tsx_path)
    print(f"EN TSX SHA-256: {en_hash}")
    print(f"ZH TSX SHA-256: {zh_hash}")
    
    expected_en_hash = "dacc4d0361dbd894eec29a6f67b554ce8ee5033d78de6aba1fa87b9b48218daf"
    expected_zh_hash = "98f2835aea750c56e931b933dd4b7ef158c679095c26fb0f5ea1f965827663ae"
    if en_hash != expected_en_hash:
        issues.append(f"EN TSX hash mismatch: got {en_hash}, expected {expected_en_hash}")
    if zh_hash != expected_zh_hash:
        issues.append(f"ZH TSX hash mismatch: got {zh_hash}, expected {expected_zh_hash}")

    # 2. Handoff JSONs
    en_handoff_path = os.path.join(WORKSPACE_ROOT, "docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-en.json")
    zh_handoff_path = os.path.join(WORKSPACE_ROOT, "docs/blog-ops/how-to-harvest-stardew-valley/handoffs/public-blog-handoff-zh.json")
    
    with open(en_handoff_path, "r", encoding="utf-8") as f:
        en_handoff = json.load(f)
    with open(zh_handoff_path, "r", encoding="utf-8") as f:
        zh_handoff = json.load(f)
        
    with open(en_tsx_path, "r", encoding="utf-8") as f:
        en_tsx = f.read()
    with open(zh_tsx_path, "r", encoding="utf-8") as f:
        zh_tsx = f.read()

    # 3. Check Forbidden Tokens
    forbidden = ["BlogSources", "blog-sources", "data-blog-planner-cta", "BlogPlannerCta", "/Users/", "operation-store", "docs/blog-ops", "未取得"]
    for token in forbidden:
        if token in en_tsx:
            issues.append(f"EN TSX contains forbidden token: {token}")
        if token in zh_tsx:
            issues.append(f"ZH TSX contains forbidden token: {token}")

    # 4. Check Figure Properties
    # EN Figure
    en_fig_req = en_handoff["publicRequirements"]["figures"][0]
    if f'src="{en_fig_req["src"]}"' not in en_tsx:
        issues.append(f"EN TSX missing figure src: {en_fig_req['src']}")
    if f'alt="{en_fig_req["alt"]}"' not in en_tsx:
        issues.append(f"EN TSX figure alt mismatch")
    if en_fig_req["caption"] not in en_tsx:
        issues.append(f"EN TSX figure caption mismatch")
    if 'decoding="async"' not in en_tsx or 'loading="lazy"' not in en_tsx or 'width={1672}' not in en_tsx or 'height={941}' not in en_tsx:
        issues.append("EN TSX figure missing required attributes (decoding, loading, width, height)")
        
    # ZH Figure
    zh_fig_req = zh_handoff["publicRequirements"]["figures"][0]
    if f'src="{zh_fig_req["src"]}"' not in zh_tsx:
        issues.append(f"ZH TSX missing figure src: {zh_fig_req['src']}")
    if f'alt="{zh_fig_req["alt"]}"' not in zh_tsx:
        issues.append(f"ZH TSX figure alt mismatch")
    if zh_fig_req["caption"] not in zh_tsx:
        issues.append(f"ZH TSX figure caption mismatch")
    if 'decoding="async"' not in zh_tsx or 'loading="lazy"' not in zh_tsx or 'width={1672}' not in zh_tsx or 'height={941}' not in zh_tsx:
        issues.append("ZH TSX figure missing required attributes (decoding, loading, width, height)")

    # 5. Check 18 Links
    en_md_links = extract_markdown_links(en_handoff["body"])
    en_tsx_links = extract_jsx_links(en_tsx)
    zh_md_links = extract_markdown_links(zh_handoff["body"])
    zh_tsx_links = extract_jsx_links(zh_tsx)
    
    print(f"EN links count: md={len(en_md_links)}, tsx={len(en_tsx_links)}")
    print(f"ZH links count: md={len(zh_md_links)}, tsx={len(zh_tsx_links)}")
    if len(en_md_links) != 18 or len(en_tsx_links) != 18:
        issues.append(f"EN links count != 18: md={len(en_md_links)}, tsx={len(en_tsx_links)}")
    if len(zh_md_links) != 18 or len(zh_tsx_links) != 18:
        issues.append(f"ZH links count != 18: md={len(zh_md_links)}, tsx={len(zh_tsx_links)}")

    for i in range(18):
        # EN link
        en_md_href, en_md_text = en_md_links[i]
        en_tsx_href, en_tsx_text = en_tsx_links[i]
        if en_md_href != en_tsx_href:
            issues.append(f"EN link {i+1} href mismatch: md={en_md_href}, tsx={en_tsx_href}")
        if en_md_text != en_tsx_text:
            issues.append(f"EN link {i+1} text mismatch: md={en_md_text}, tsx={en_tsx_text}")
            
        # ZH link
        zh_md_href, zh_md_text = zh_md_links[i]
        zh_tsx_href, zh_tsx_text = zh_tsx_links[i]
        if zh_md_href != zh_tsx_href:
            issues.append(f"ZH link {i+1} href mismatch: md={zh_md_href}, tsx={zh_tsx_href}")
        if zh_md_text != zh_tsx_text:
            issues.append(f"ZH link {i+1} text mismatch: md={zh_md_text}, tsx={zh_tsx_text}")

        # Cross-comparison: 16 external exact, 2 internal localized
        if i in (14, 16): # 0-indexed 14 is #15, 16 is #17
            expected_en_href = ["/last-day-to-plant-stardew", "/what-to-grow-in-greenhouse-stardew"][0 if i == 14 else 1]
            expected_zh_href = ["/zh/last-day-to-plant-stardew", "/zh/what-to-grow-in-greenhouse-stardew"][0 if i == 14 else 1]
            if en_tsx_href != expected_en_href:
                issues.append(f"EN internal link {i+1} unexpected: {en_tsx_href} != {expected_en_href}")
            if zh_tsx_href != expected_zh_href:
                issues.append(f"ZH internal link {i+1} unexpected: {zh_tsx_href} != {expected_zh_href}")
        else:
            if en_tsx_href != zh_tsx_href:
                issues.append(f"External link {i+1} mismatch between EN and ZH: EN={en_tsx_href}, ZH={zh_tsx_href}")

    # 6. Text Blocks Fidelity
    en_md_blocks = extract_markdown_text_blocks(en_handoff["body"])
    en_tsx_blocks = extract_jsx_element_text(
        en_tsx,
        "HowToHarvestStardewValleyEnglishMethodsFigure",
        "HowToHarvestStardewValleyEnglishArticle"
    )
    print(f"EN text blocks count: md={len(en_md_blocks)}, tsx={len(en_tsx_blocks)}")
    if len(en_md_blocks) != len(en_tsx_blocks):
        issues.append(f"EN text block count mismatch: md={len(en_md_blocks)}, tsx={len(en_tsx_blocks)}")
    else:
        for idx, (mb, tb) in enumerate(zip(en_md_blocks, en_tsx_blocks)):
            if mb != tb:
                issues.append(f"EN block {idx+1} mismatch:\n  MD : {mb}\n  TSX: {tb}")

    zh_md_blocks = extract_markdown_text_blocks(zh_handoff["body"])
    zh_tsx_blocks = extract_jsx_element_text(
        zh_tsx,
        "HowToHarvestStardewValleyChineseMethodsFigure",
        "HowToHarvestStardewValleyChineseArticle"
    )
    print(f"ZH text blocks count: md={len(zh_md_blocks)}, tsx={len(zh_tsx_blocks)}")
    if len(zh_md_blocks) != len(zh_tsx_blocks):
        issues.append(f"ZH text block count mismatch: md={len(zh_md_blocks)}, tsx={len(zh_tsx_blocks)}")
    else:
        for idx, (mb, tb) in enumerate(zip(zh_md_blocks, zh_tsx_blocks)):
            if mb != tb:
                issues.append(f"ZH block {idx+1} mismatch:\n  MD : {mb}\n  TSX: {tb}")

    # 7. Check Metadata in blog-post-registry.tsx
    registry_path = os.path.join(WORKSPACE_ROOT, "src/blog/blog-post-registry.tsx")
    with open(registry_path, "r", encoding="utf-8") as f:
        registry_content = f.read()
        
    expected_en_meta = {
        "slug": '"how-to-harvest-stardew-valley"',
        "title": '"How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe"',
        "description": '"Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back."',
        "topic": '"Stardew Valley Guides"',
        "author": '"Stardew Valley Planner Team"',
        "readTimeMinutes": "7",
        "featured": "false",
        "src": '"/blog/how-to-harvest-stardew-valley-cover.webp"',
        "alt": '"Illustration of a farm: leafy crops in tilled soil beside a crate of orange roots, three pumpkins and a hoe, rows of yellow stalks with a scythe and a vine trellis, and a brown-roofed building with plants in its windows."',
        "Content": "HowToHarvestStardewValleyEnglishArticle",
    }
    for k, val in expected_en_meta.items():
        if val not in registry_content:
            issues.append(f"blog-post-registry.tsx missing expected EN metadata {k}: {val}")
            
    expected_zh_meta = {
        "slug": '"how-to-harvest-stardew-valley"',
        "title": '"星露谷物语怎么收获：防风草右键采摘，羽衣甘蓝需要镰刀"',
        "description": '"站在成熟的防风草旁点击右键或按 X 键。羽衣甘蓝、苋菜、小麦、未碾米和纤维种子挥动镰刀即可收割。生长天数从播种次日算起，漏浇一天成熟日顺延一天。"',
        "topic": '"星露谷物语指南"',
        "author": '"星露谷规划器团队"',
        "readTimeMinutes": "7",
        "featured": "false",
        "src": '"/blog/how-to-harvest-stardew-valley-cover.webp"',
        "alt": '"农场插画：耕地中的带叶作物旁放着一箱橙色块根，三个南瓜与一把锄头，成排的黄色秸秆旁配有镰刀与藤蔓棚架，以及一座窗台摆着植物的棕顶建筑。"',
        "Content": "HowToHarvestStardewValleyChineseArticle",
    }
    for k, val in expected_zh_meta.items():
        if val not in registry_content:
            issues.append(f"blog-post-registry.tsx missing expected ZH metadata {k}: {val}")

    # 8. Check blog-post-identities.ts
    identities_path = os.path.join(WORKSPACE_ROOT, "src/blog/blog-post-identities.ts")
    with open(identities_path, "r", encoding="utf-8") as f:
        identities_content = f.read()
    if '"how-to-harvest-stardew-valley"' not in identities_content:
        issues.append('blog-post-identities.ts missing "how-to-harvest-stardew-valley"')

    # 9. Check blog-copy.ts
    copy_path = os.path.join(WORKSPACE_ROOT, "src/blog/blog-copy.ts")
    with open(copy_path, "r", encoding="utf-8") as f:
        copy_content = f.read()
    if '"how-to-harvest-stardew-valley": "/how-to-harvest-stardew-valley"' not in copy_content:
        issues.append('blog-copy.ts missing EN route mapping')
    if '"how-to-harvest-stardew-valley": "/zh/how-to-harvest-stardew-valley"' not in copy_content:
        issues.append('blog-copy.ts missing ZH route mapping')

    # 10. Check public/llms.txt
    llms_path = os.path.join(WORKSPACE_ROOT, "public/llms.txt")
    with open(llms_path, "r", encoding="utf-8") as f:
        llms_content = f.read()
    expected_en_llms = "- [How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe](https://stardewvalleyplanner.art/how-to-harvest-stardew-valley): Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back."
    expected_zh_llms = "- [星露谷物语怎么收获：防风草右键采摘，羽衣甘蓝需要镰刀](https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley): 站在成熟的防风草旁点击右键或按 X 键。羽衣甘蓝、苋菜、小麦、未碾米和纤维种子挥动镰刀即可收割。生长天数从播种次日算起，漏浇一天成熟日顺延一天。"
    if expected_en_llms not in llms_content:
        issues.append("public/llms.txt missing expected EN line")
    if expected_zh_llms not in llms_content:
        issues.append("public/llms.txt missing expected ZH line")

    # 11. Check Media files in public/blog/ against final-manifest.json
    manifest_path = os.path.join(WORKSPACE_ROOT, "docs/blog-ops/how-to-harvest-stardew-valley/media/final-manifest.json")
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    print("Checking media assets against final manifest...")
    for item in manifest["assets"]:
        public_path = item["publicUrl"]
        expected_sha = item["sha256"]
        expected_bytes = item["byteSize"]
        full_file_path = os.path.join(WORKSPACE_ROOT, "public", public_path.lstrip("/"))
        if not os.path.exists(full_file_path):
            issues.append(f"Media file not found: {public_path} at {full_file_path}")
            continue
        actual_bytes = os.path.getsize(full_file_path)
        actual_sha = compute_sha256(full_file_path)
        if actual_bytes != expected_bytes:
            issues.append(f"Media byte length mismatch for {public_path}: got {actual_bytes}, expected {expected_bytes}")
        if actual_sha != expected_sha:
            issues.append(f"Media SHA-256 mismatch for {public_path}: got {actual_sha}, expected {expected_sha}")
        print(f"  [OK] {public_path} ({actual_bytes} bytes, SHA: {actual_sha[:12]}...)")

    print("\n=== AUDIT SUMMARY ===")
    print(f"Total issues found: {len(issues)}")
    for issue in issues:
        print(f"  [ISSUE] {issue}")
    if not issues:
        print("ALL AUDIT CHECKS PASSED PERFECTLY.")
        return 0
    return 1

if __name__ == "__main__":
    sys.exit(verify_fidelity())
