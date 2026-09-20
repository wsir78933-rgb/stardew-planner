# G-restore-dev — how-to-level-up-farming-stardew

Role: Agent G (assembly ops). Restore local Next.js on port **3003**. Not E. Articles were not rewritten.

Locked slug: `how-to-level-up-farming-stardew`  
Identity: 18th in `blogPostSlugs`, already present after `do-you-have-to-water-trees-stardew`.

## Why restore

E-en-page and E-zh-page both FAIL with `Connection refused` on `127.0.0.1:3003`. Before this restore:

- `lsof -nP -iTCP:3003 -sTCP:LISTEN` — empty
- `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/how-to-level-up-farming-stardew` → `000` (fail)
- `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew` → `000` (fail)

A different product (`AI image editor`) was listening on **3002** via Vite. That process was left alone.

## Change

From `/Users/wusir/Desktop/开发项目集合/stardew planner`:

```sh
pnpm dev
```

`scripts/dev.sh` frees 3003 then runs `next dev --port 3003`.

Stdout (Ready):

```
> @ dev /Users/wusir/Desktop/开发项目集合/stardew planner
> sh scripts/dev.sh

▲ Next.js 16.3.0 (Turbopack)
- Local:         http://localhost:3003
- Network:       http://192.168.18.143:3003
✓ Ready in 336ms
✓ Running next.config.ts took 72ms
- Experiments (use with caution):
  ✓ globalNotFound
```

Listener after Ready:

```
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    11010 wusir   13u  IPv6 0x24e55da976f3a314      0t0  TCP *:3003 (LISTEN)
```

`dynamicParams` 404 restart was **not** needed: slug is already in `blogPostSlugs`; both article URLs returned 200 on the first Ready.

Dev server **left running** on 3003 for E re-open.

## Observable acceptance — curl stdout

Exact command: `curl -s -o /dev/null -w "%{http_code}"`

```
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/how-to-level-up-farming-stardew
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew
200
```

Cheap asset checks (same command):

```
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/how-to-level-up-farming-stardew-cover.webp
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/illustrations/farming-xp-source-map.webp
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/illustrations/farming-xp-first-product-only.webp
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp
200
$ curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp
200
```

## Locked titles in HTML

EN `http://127.0.0.1:3003/how-to-level-up-farming-stardew`

- HTTP **200**
- `<title>` / `<h1>`: `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150`

ZH `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew`

- HTTP **200**
- `<title>` / `<h1>`: `星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150`

## Not done

- Did not deploy.
- Did not edit article meaning, registry, or source files.
- Did not kill the 3002 Vite listener.
- User-reachable origin for E remains `http://127.0.0.1:3003` only.
