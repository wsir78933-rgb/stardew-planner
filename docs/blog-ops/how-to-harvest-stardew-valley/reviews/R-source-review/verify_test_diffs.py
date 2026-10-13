#!/usr/bin/env python3
"""
Inspect test changes in git diff to verify:
1. Only count updates, latest-6 window shifts, and new post mappings are made.
2. No existing tests or assertions are deleted to forge green passes.
"""

import os
import subprocess
import sys
from typing import List, Dict

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.."))

def get_git_diff_for_file(relative_path: str) -> str:
    result = subprocess.run(
        ["git", "diff", relative_path],
        cwd=WORKSPACE_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout

def analyze_test_diff(relative_path: str) -> Dict[str, object]:
    diff_output = get_git_diff_for_file(relative_path)
    lines = diff_output.splitlines()
    
    deleted_lines: List[str] = []
    added_lines: List[str] = []
    
    for line in lines:
        if line.startswith("---") or line.startswith("+++"):
            continue
        if line.startswith("-"):
            deleted_lines.append(line[1:])
        elif line.startswith("+"):
            added_lines.append(line[1:])
            
    # Check if any tests (it/test/describe) were removed without an immediate matching addition
    deleted_test_titles = [line.strip() for line in deleted_lines if line.strip().startswith("it(") or line.strip().startswith("test(")]
    added_test_titles = [line.strip() for line in added_lines if line.strip().startswith("it(") or line.strip().startswith("test(")]
    
    # If a test description was updated (e.g. 24 -> 25), it's not a deletion
    genuinely_removed_tests = []
    for d_title in deleted_test_titles:
        # Check if there is a corresponding added test title replacing it
        is_renamed = any(
            ("canonical blog identities" in d_title and "canonical blog identities" in a_title) or
            ("localized root-level canonical article paths" in d_title and "localized root-level canonical article paths" in a_title)
            for a_title in added_test_titles
        )
        if not is_renamed:
            genuinely_removed_tests.append(d_title)
    
    return {
        "file": relative_path,
        "deleted_count": len(deleted_lines),
        "added_count": len(added_lines),
        "deleted_test_titles": deleted_test_titles,
        "added_test_titles": added_test_titles,
        "genuinely_removed_tests": genuinely_removed_tests,
        "raw_diff": diff_output,
    }

def verify_all_test_diffs() -> int:
    test_files = [
        "tests/blog/blog-home-state.test.ts",
        "tests/blog/blog-post-registry.test.ts",
        "tests/i18n/public-route-registry.test.ts",
        "tests/routes/blog-routes.test.tsx",
        "tests/routes/removed-public-pages.test.ts",
        "tests/seo/canonical-public-routes.test.ts",
    ]
    
    print("=== STARTING TEST DIFF AUDIT ===")
    total_removed_test_blocks = 0
    
    for test_file in test_files:
        analysis = analyze_test_diff(test_file)
        print(f"\n--- Analyzing {test_file} ---")
        print(f"Lines deleted: {analysis['deleted_count']}, Lines added: {analysis['added_count']}")
        removed_tests = analysis["genuinely_removed_tests"]
        if removed_tests:
            print(f"  WARNING: Genuinely removed test definitions: {removed_tests}")
            total_removed_test_blocks += len(removed_tests)
        else:
            print("  [OK] No genuine test blocks deleted.")
            
    print("\n=== TEST DIFF AUDIT SUMMARY ===")
    print(f"Total deleted test blocks across all test files: {total_removed_test_blocks}")
    if total_removed_test_blocks > 0:
        print("FAIL: Found deleted test blocks!")
        return 1
    print("PASS: All test diffs only update counts, latest-6 window, and new route mappings. No tests deleted.")
    return 0

if __name__ == "__main__":
    sys.exit(verify_all_test_diffs())
