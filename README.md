## 主要功能

- 用户注册、登录、登出
- 项目、投标、企业等信息浏览
- 会员信息、个人中心
- 登录鉴权与页面访问保护
- 全局错误兜底，防止页面空白

## 登录保护与错误兜底

- 受保护页面通过 `PrivateRoute` 组件实现，未登录用户访问时自动跳转到 `/login`。
- 全局用 `ErrorBoundary` 组件包裹，任何页面报错不会导致全局空白，会显示友好错误提示。
- 各页面接口请求均有 loading、error、无数据等兜底处理，提升用户体验。

## 启动与开发

1. 安装依赖

   ```bash
   npm install
   ```

2. 本地开发

   ```bash
   npm run dev
   ```

   默认访问地址为 [http://localhost:5173](http://localhost:5173)

3. 生产构建

   ```bash
   npm run build
   ```

4. 预览构建产物

   ```bash
   npm run preview
   ```

## 代码规范

- 使用 ESLint 进行代码检查，命令：`npm run lint`
- 推荐使用函数式组件与 hooks
- UI 统一采用 Material UI 组件库

## 其他说明

- 本项目需配合后端 API 使用，接口地址见 `.env` 或源码 axios 请求部分
- 如需扩展页面或组件，建议参考现有风格与结构

---

如有问题请联系项目维护者。
