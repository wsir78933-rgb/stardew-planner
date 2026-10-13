import hashlib
import json
import sys
from pathlib import Path

REWORK_DIRECTORY_PATH = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2")
STAGED_DIRECTORY_PATH = REWORK_DIRECTORY_PATH / "media/staged"
MANIFEST_FILE_PATH = REWORK_DIRECTORY_PATH / "media/manifest.json"
BUILD_MEDIA_SCRIPT_PATH = REWORK_DIRECTORY_PATH / "media/build_media.py"
MEDIA_DOCUMENT_PATH = REWORK_DIRECTORY_PATH / "media.md"

STAGED_IMAGE_FILENAMES = (
    "how-to-harvest-stardew-valley-cover.avif",
    "how-to-harvest-stardew-valley-cover.webp",
    "how-to-harvest-stardew-valley-mature-crops.avif",
    "how-to-harvest-stardew-valley-mature-crops.webp",
    "how-to-harvest-stardew-valley-trellis-paths.avif",
    "how-to-harvest-stardew-valley-trellis-paths.webp",
)

OLD_MATURE_CROPS_DESCRIPTION = (
    "Close-up of central garden with 4x5 ripe orange pumpkins on tilled soil, "
    "player in blue overalls raising green crop, player in green shirt, and scarecrow"
)
NEW_MATURE_CROPS_DESCRIPTION = (
    "MultiplayerScreenshot2 daytime pumpkin patch close-up on tilled soil "
    "(top row has only two ripe pumpkins, not a full 4x5 grid), "
    "player in blue overalls raising green vegetable, player in green shirt, and scarecrow"
)

OLD_TRELLIS_PATHS_DESCRIPTION = (
    "Trellis garden rows: berry bushes, grape trellises on wooden posts, vertical tall crops, "
    "and player in red shirt walking down the clear aisle between trellis rows"
)
NEW_TRELLIS_PATHS_DESCRIPTION = (
    "Garden scene with two columns of wooden post purple grape trellises on the left and visible dirt path; "
    "right side shows yellow tall-stalk crops (not wooden grape trellises) with player in red shirt standing inside the yellow crop patch"
)

OLD_MEDIA_MATURE_CROPS_SECTION = """- **画面要素与真实性**:
  - 中央主视觉为 4 行 × 5 株成熟金橙色南瓜田（耕地泥土与绿叶藤蔓分明）；
  - 左侧农夫（蓝色背带裤）举着刚收获的绿色蔬菜（小白菜 Bok Choy）；
  - 南瓜田上方另一名绿色衣服玩家站在田间泥土上；
  - 下方有稻草人与石质矮墙通道；
  - **HUD 处理**: 原图左下角带文字的 `Bok Choy 6` 道具框在坐标 x:0..250, y:830..930，已被完全裁除。成品图没有任何文字框，不包含 HUD；
  - **动作事实定性**: 玩家手举绿色作物为联机状态展示，不能断言为右键采摘的单帧动画，仅按实际可见画面描述。在 390px 移动视口下，南瓜实体物理显示约 30px 宽，农夫与作物一目了然。"""

NEW_MEDIA_MATURE_CROPS_SECTION = """- **画面要素与真实性**:
  - 中央主视觉为 MultiplayerScreenshot2 白天南瓜近景（耕地泥土与绿叶藤蔓分明），南瓜田顶行只有两株成熟南瓜，并非完整 4×5 方阵（4 行总计 17 株成熟南瓜：顶行 2 株，下三行各 5 株）；
  - 左侧农夫（蓝色背带裤）手举绿色蔬菜（小白菜 Bok Choy），仅按可见画面记录，不能声称“刚收获”输入或动作时序；
  - 南瓜田上方另一名绿色衣服玩家站在田间泥土上；
  - 下方有稻草人与石质矮墙通道；
  - **HUD 处理**: 原图左下角带文字的 `Bok Choy 6` 道具框在坐标 x:0..250, y:830..930，已被完全裁除。成品图没有任何文字框，不包含 HUD；
  - **动作事实定性**: 玩家手举绿色蔬菜为联机状态静态呈现，不能断言为右键采摘动作或特定时序。390px 移动视口下的物理尺寸仅为粗略估算，未经原生浏览器自动化 PASS 测试。"""

OLD_MEDIA_TRELLIS_PATHS_SECTION = """- **画面要素与真实性**:
  - 左侧为木桩葡萄棚架行与红果灌木丛，中间为通往木门的铺石小径；
  - 右侧为 4 列垂直生长的棚架作物（带黄花的高大作物），**一名红衣黑发玩家正清晰站立并穿行于两列棚架之间的泥土通道内**；
  - 右侧为石屋墙体与铺石隔离带，顶部为整齐木栅栏与木门；
  - **核心教学价值**: 直观向读者展现为什么棚架作物必须留出通道——作物本身形成无法穿过的屏障，玩家必须通过留出的过道在侧面触及作物。在 390px 移动视口下，垂直棚架与玩家走位极为清晰。"""

NEW_MEDIA_TRELLIS_PATHS_SECTION = """- **画面要素与真实性**:
  - 左侧两列为木桩紫葡萄棚架与红果灌木丛，中间泥地过道与通往木门的铺石小径可见；
  - 右侧为 4 列黄色高茎植株（带黄花高茎作物，并非木质葡萄棚架），红衫角色（红衣黑发）在其田块内部，而非穿行于左侧木棚架通道中；
  - 右侧为石屋墙体与铺石隔离带，顶部为整齐木栅栏与木门；
  - **教学与展示价值**: 展现葡萄棚架列与黄色高茎作物田块及过道布局。390px 移动视口下的物理尺寸仅为估算值，未经原生浏览器自动化 PASS 测试。"""

OLD_MEDIA_TILE_ASSERTION = "- **AVIF 512-tile 历史避坑核验**: 采用 `ffmpeg -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p` 规避了 macOS sips 的 512px tile 分割瑕疵。反解出的 PNG 已经过 `view_file` 工具逐一实际查看，画面完整连续，无任何网格或切片黑线。"
NEW_MEDIA_TILE_ASSERTION = "- **编码与反解核验**: 采用 `ffmpeg -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p` 编码 AVIF。反解出的 PNG 已经过 `view_file` 工具逐一实际查看，本批 view 未见切片黑线或网格异常（无 raw 复现证据下不作‘macOS 512 历史规避’因果断言）。需明确：WebP 与 AVIF 的 1672×941 尺寸一致仅代表像素分辨率一致，二者为不同有损压缩算法，并非字节或像素级无损一致。"

OLD_MEDIA_CONCLUSION = "- **验证结论**: 尺寸 100% 均为 1672×941，WebP 与 AVIF 解码一致，无任何 512 tile 割裂，封面体积远低于 1.25 MB。"
NEW_MEDIA_CONCLUSION = "- **验证结论**: 像素分辨率 100% 均为 1672×941（注：格式间尺寸一致仅代表分辨率相同，非无损像素一致）；反解图像本批 view 未见黑线；封面体积远低于 1.25 MB；390px 移动视口仅为估算，不作 browser PASS 断言。"


def calculate_file_sha256(target_file_path: Path) -> str:
    if not target_file_path.is_file():
        raise FileNotFoundError(f"File not found for hash calculation: {target_file_path}")
    return hashlib.sha256(target_file_path.read_bytes()).hexdigest()


def snapshot_staged_asset_hashes(staged_folder: Path) -> dict[str, str]:
    if not staged_folder.is_dir():
        raise NotADirectoryError(f"Staged folder not found: {staged_folder}")
    staged_hashes: dict[str, str] = {}
    for filename in STAGED_IMAGE_FILENAMES:
        file_path = staged_folder / filename
        staged_hashes[filename] = calculate_file_sha256(file_path)
    if len(staged_hashes) != 6:
        raise ValueError(f"Expected 6 staged image hashes, got {len(staged_hashes)}")
    return staged_hashes


def execute_exact_string_replacement(target_file: Path, target_old_text: str, target_new_text: str) -> None:
    if not target_file.is_file():
        raise FileNotFoundError(f"Target file does not exist: {target_file}")
    file_content = target_file.read_text(encoding="utf-8")
    match_count = file_content.count(target_old_text)
    if match_count == 0:
        raise ValueError(f"FailFast: target_old_text not found in {target_file}: {target_old_text!r}")
    if match_count > 1:
        raise ValueError(f"FailFast: target_old_text found {match_count} times in {target_file}: {target_old_text!r}")
    updated_content = file_content.replace(target_old_text, target_new_text)
    target_file.write_text(updated_content, encoding="utf-8")
    print(f"PASS: Replaced target text in {target_file.name}")


def patch_manifest_file(manifest_file: Path) -> None:
    execute_exact_string_replacement(manifest_file, OLD_MATURE_CROPS_DESCRIPTION, NEW_MATURE_CROPS_DESCRIPTION)
    execute_exact_string_replacement(manifest_file, OLD_TRELLIS_PATHS_DESCRIPTION, NEW_TRELLIS_PATHS_DESCRIPTION)
    with manifest_file.open("r", encoding="utf-8") as manifest_file_handle:
        parsed_manifest = json.load(manifest_file_handle)
    if parsed_manifest.get("stagedCount") != 6:
        raise ValueError(f"Invalid stagedCount in manifest: {parsed_manifest.get('stagedCount')}")
    print(f"PASS: Manifest JSON parsed successfully and validated.")


def patch_build_media_script(build_media_script: Path) -> None:
    execute_exact_string_replacement(build_media_script, OLD_MATURE_CROPS_DESCRIPTION, NEW_MATURE_CROPS_DESCRIPTION)
    execute_exact_string_replacement(build_media_script, OLD_TRELLIS_PATHS_DESCRIPTION, NEW_TRELLIS_PATHS_DESCRIPTION)
    print(f"PASS: build_media.py updated successfully.")


def patch_media_documentation(media_doc: Path) -> None:
    execute_exact_string_replacement(media_doc, OLD_MEDIA_MATURE_CROPS_SECTION, NEW_MEDIA_MATURE_CROPS_SECTION)
    execute_exact_string_replacement(media_doc, OLD_MEDIA_TRELLIS_PATHS_SECTION, NEW_MEDIA_TRELLIS_PATHS_SECTION)
    execute_exact_string_replacement(media_doc, OLD_MEDIA_TILE_ASSERTION, NEW_MEDIA_TILE_ASSERTION)
    execute_exact_string_replacement(media_doc, OLD_MEDIA_CONCLUSION, NEW_MEDIA_CONCLUSION)
    print(f"PASS: media.md documentation updated successfully.")


def verify_asset_byte_immutability(
    staged_folder: Path,
    baseline_hashes: dict[str, str]
) -> None:
    current_hashes = snapshot_staged_asset_hashes(staged_folder)
    for filename, baseline_hash in baseline_hashes.items():
        current_hash = current_hashes[filename]
        if current_hash != baseline_hash:
            raise ValueError(
                f"Byte modification detected for {filename}! Baseline {baseline_hash} != Current {current_hash}"
            )
        print(f"PASS [SHA256 Match]: {filename} -> {current_hash}")


def main() -> None:
    print("=== Phase 1: Snapshot initial staged asset SHA-256 hashes ===")
    initial_hashes = snapshot_staged_asset_hashes(STAGED_DIRECTORY_PATH)
    for filename, file_hash in initial_hashes.items():
        print(f"  INITIAL {filename}: {file_hash}")

    print("\n=== Phase 2: Apply mechanical FailFast corrections ===")
    patch_manifest_file(MANIFEST_FILE_PATH)
    patch_build_media_script(BUILD_MEDIA_SCRIPT_PATH)
    patch_media_documentation(MEDIA_DOCUMENT_PATH)

    print("\n=== Phase 3: Verify asset byte immutability (Before vs After) ===")
    verify_asset_byte_immutability(STAGED_DIRECTORY_PATH, initial_hashes)

    print("\n=== SUCCESS: All mechanical corrections completed with zero image byte drift. ===")


if __name__ == "__main__":
    main()
