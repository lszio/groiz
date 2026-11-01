import { defineConfig } from 'astro/config';

// groiz 工作区(zio-eco-docs ui-spec/groiz):hash 路由单页,业务 JS 在
// src/scripts/app.js 原样迁移;静态输出,nginx 托管 dist。
export default defineConfig({
  output: 'static',
});
