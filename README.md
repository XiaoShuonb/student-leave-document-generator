# 学生请假材料生成器

一个面向学校请假场景的纯前端材料生成工具。用户只需填写一次请假信息并上传学生、家长签名，即可生成三份材料的图片预览，并下载 PNG、PDF 或可编辑的 Word 文件。

在线体验：[https://modification.default.support/](https://modification.default.support/)

## 功能

- 一次填写姓名、班级、请假原因、时间、去向和联系电话
- 自动生成《请假申请书》《家长知情同意书》《安全告知书》
- 上传学生签名和家长签名
- 在浏览器中自动裁剪签名并去除白色背景
- 三页 A4 排版实时预览
- 下载单页高清 PNG
- 下载三页 PDF
- 下载可继续编辑的 Word 文档
- 支持电脑和手机浏览器

## 隐私设计

请假信息、电话号码和签名图片均在用户浏览器中处理。项目没有数据库，也不会将这些内容上传到服务器。关闭或刷新页面后，当前填写的数据会被清除。

## 技术栈

- React 19
- TypeScript
- Next.js / Vinext
- Tailwind CSS
- `html-to-image`：生成图片预览
- `jsPDF`：生成 PDF
- `docx`：生成 Word 文档

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

开发服务器默认运行在：

```text
http://localhost:5173
```

## 编译

项目已配置为纯静态导出：

```bash
npm run build
```

编译结果位于：

```text
dist/client
```

部署时只需上传该目录中的文件，不需要在服务器上运行 Node.js、PHP 或数据库。

## Nginx 部署

将 `dist/client` 内的全部文件上传到网站根目录，然后配置 Nginx：

```nginx
server {
    listen 80;
    server_name example.com;
    root /www/wwwroot/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

宝塔面板中可以直接创建纯静态网站，并将编译文件上传到对应的网站根目录。

## 项目结构

```text
app/page.tsx       页面交互、模板内容与文件生成逻辑
app/globals.css    页面和 A4 文档样式
public/favicon.svg 网站图标
next.config.ts     静态导出配置
```

## 注意事项

- 首次使用前，建议对照学校最新模板确认文字、字段和签名位置。
- 浏览器生成的 Word 文档可以继续编辑，不同办公软件可能存在少量字体或分页差异。
- 签名属于敏感个人信息，请在可信设备上操作。

## License

[MIT](LICENSE)
