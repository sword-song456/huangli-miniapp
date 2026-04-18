# 节气老黄历小程序

一款专为老年人设计的黄历查询和平安卡生成小程序，具有极强的群裂变传播能力。

## 功能特点

- **每日黄历查询** - 显示农历、节气、宜忌事项
- **今日平安卡生成** - 自动生成带天气、黄历、山水图的早安图
- **AI祝福语** - 每日生成平安祝福文案
- **群裂变传播** - 适合老年人分享到微信群

## 技术栈

- 微信小程序原生开发
- 万年历API（聚合数据/天行数据）
- Canvas 2D绘图
- Promise异步处理

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/huangli-miniapp.git
cd huangli-miniapp
```

### 2. 配置API密钥
```bash
# 复制配置文件
cp utils/api.config.example.js utils/api.config.js

# 编辑配置文件，填入你的API密钥
# 需要申请：
# - 聚合数据万年历API: https://www.juhe.cn/
# - 天行数据API: https://www.tianapi.com/
# - 心知天气API: https://www.seniverse.com/
```

### 3. 配置小程序AppID
修改 `project.config.json` 文件：
```json
{
  "appid": "你的小程序AppID"
}
```

### 4. 导入项目
- 打开微信开发者工具
- 选择"导入项目"
- 选择项目目录
- 开始开发调试

## 项目结构

```
huangli-miniapp/
├── pages/              # 页面
│   ├── index/         # 首页-黄历展示
│   └── card/          # 平安卡生成页
├── utils/             # 工具函数
│   ├── api.js        # API接口
│   ├── api.config.js # API密钥配置（不提交到Git）
│   └── calendar.js   # 日历计算
├── app.js            # 小程序入口
├── app.json          # 全局配置
└── app.wxss          # 全局样式
```

## 文档

- [开发文档](./DEVELOPMENT.md) - 详细的开发指南
- [部署指南](./DEPLOY.md) - 上线发布流程

## 变现方式

- 流量主广告（底部常驻）
- 高转发率带来持续流量
- 预计日活1000人可月入300-900元

## 注意事项

1. **API密钥安全**
   - 不要将 `api.config.js` 提交到Git
   - 使用环境变量或配置文件管理密钥

2. **隐私保护**
   - 获取位置需用户授权
   - 不收集敏感信息

3. **审核规范**
   - 不能有诱导分享
   - 广告位置要合理
   - 内容要健康向上

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请提交Issue或联系开发者。
