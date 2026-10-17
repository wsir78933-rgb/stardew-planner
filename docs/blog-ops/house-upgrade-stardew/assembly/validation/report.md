# Validation report: house-upgrade-stardew

Technical verification only. This is not a browser pass, a user final review, or a production deploy.

Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客-2`. HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`. Checked 2026-10-16.

## Environment

`package.json` and `pnpm-lock.yaml` match HEAD and the 2026-10-15 baseline digests. `git diff --exit-code` on those two files exited 0. The current main checkout's copies differ; that difference is recorded in `environment-and-hashes.txt` and is not a failure of this HEAD. Proof: `head-package-proof.txt`.

`node_modules` is a symlink to `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`. Installed versions: Node v24.18.0, pnpm 10.22.0, Next 16.3.0, React 19.2.8, TypeScript 5.9.3, Vitest 3.2.4, serve 14.2.6. They match `package.json` and `resume-preflight/report.md`.

Installed Next 16.3.0 docs say `params` is a Promise, `dynamicParams: false` returns 404, static export rejects `dynamicParams: true` and the default image loader, `trailingSlash` left false writes `out/<slug>.html`, `alternates.languages` keys are written as `hreflang`, and `public/` files are served from the URL root. `next.config.ts` has `output: "export"` and `images.unoptimized: true`. `next dev` was not run.

## Frozen inputs

Coordinator hashes match the files on disk, including both public handoffs, both body hashes, both article modules, both binding reports, `AssemblyManifest.json`, and `integration-report.md`. `articles.en.outputSha256` and `articles.zh-CN.outputSha256` are null. The module hashes live in the binding reports and match the files: English `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5`, Chinese `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba`. The manifest was not edited.

The Chinese binding report says the module is 9658 bytes. The file with that hash is 14218 bytes. The hash is the identity that matched.

All 12 public media files match the freeze hashes, match their production sources, and `sips` reports 1672×941. Public blog WebP/AVIF are 81 each. Homepage stays 27. Combined WebP is 108. The same 12 hashes are in `out/`.

## Commands

`pnpm typecheck` exited 0. `pnpm exec next build --webpack` exited 0 and generated 68 static pages. `find` counted 66 HTML files. `pnpm test` was not used.

Interface Vitest exited 1: 8 failed, 237 passed, 245 tests. Full Vitest exited 1: 12 failed, 2478 passed, 2490 tests. Item comparison is in `baseline-comparison.md`.

## Rendered pages

Both `out/house-upgrade-stardew.html` and `out/zh/house-upgrade-stardew.html` exist.

For each locale, the document title, the one `h1`, the meta description, Open Graph title and description, canonical, and `hreflang` `en` / `zh-CN` / `x-default` equal the frozen SEO. The language switch lists English `/house-upgrade-stardew` and 中文 `/zh/house-upgrade-stardew`.

Inside `#blog-article-house-upgrade-stardew`, 32 body blocks match the frozen body in order: 6 `h2`, 2 `h3`, one table, two figures, and the paragraphs. Body link count is 50 in each language, including one `https://stardewvalleyplanner.art/carpenter-stardew` link. The two body captions match the frozen caption sentences. Each body image is 1672×941, `loading="lazy"`, `decoding="async"`, with the sibling AVIF. The header cover uses the frozen alt, 1672×941, and no `loading` attribute. The cover caption from the media record is not in the header. `BlogSources` adds one extra heading, `Sources` or `来源`, after one planner CTA. Those are not counted as body headings.

The first HTML checker exited 1 with `ERROR_COUNT=4` because it required a space between the source label and the version note. The component renders `{item.label}` and the note span with no space. That log is preserved as `render-check.txt` and `render-check-initial.txt`. The corrected check compares label text, note span, and href separately. It exited 0. All 12 references in both languages match, including the one Version History note in each language.

`out/sitemap.xml` has 62 `<loc>` entries, both house URLs, and no contact URL. `out/llms.txt` equals `public/llms.txt`, contains exactly two house-upgrade bullets with the frozen title, description, and canonical URL, and still has zero `stardew-fruit` matches.

## Preview

Plain terminal `term_b00ff36c-e442-4fa4-91bd-8dd22a174071`, started 2026-10-16T23:12:16+0800. Listener PID 21887, cwd this worktree, command in `preview.json`. `lsof` shows `127.0.0.1:3010` only. Curl at 2026-10-16T23:12:30+0800 returned 200 for both routes, and each body hash equals the `out` HTML. Listeners on 3000–3007 were left running. This preview terminal is not a worker and was not stopped.

No browser check was run.
