# pixel-v2 接入

第一次 `apply_pixel_v2.py` 在写入 handoff 时抛出 `KeyError: 'blog/house-upgrade-stardew-cover.webp'`，因为公共路径少了 `public/` 前缀。异常后已把文章和 12 个公共文件回滚。补上前缀后，第二次又在 manifest 的同一类 key 上失败并回滚。第三次退出码 0，输出 `{"ok": true, "qualifiedEn": 1084, "pureHan": 1645}`。不是第一次就成功。

视觉审查报告写明没有 blocker。三张原图和 6 个导出的 sha256 与 provenance 一致后才替换。

实测尺寸是 1672×941。宽高比与 16/9 相差 0.000945，没有改像素，也没有写成精确 16:9。

英文合格词数 1085 → 1084。中文去图注汉字 1647 → 1645。去掉图注和图片引用句后，新旧正文相等。

英文 bodyHash `151c81afa41a5411345c0f33866f08c6819da2c30afdcde610d6135e56774fa8`。中文 bodyHash `00a612b48022fa7256f89b7fc5eb0386b34d17b6f272f079da9f62eb40998bc4`。英文 publicFieldsSha256 `fa3cb7a8df969b3f91ffa3ab9fb3aaad4748e132a3e9deaf8d348287d584f597`。中文 publicFieldsSha256 `75b3d2a26d14cad3b49df9eeb20c2e1bbffd0e776c463d3317f6c13248592d15`。

12 个公共文件都和对应导出 cmp 退出码 0。旧 handoff、旧 AssemblyManifest、lock 和中文草稿的哈希没有改。没有声称用户审美或部署通过。后续构建若要跑，用 `pnpm exec next build --webpack`。浏览器是中英各桌面和手机共 4 个视图。
