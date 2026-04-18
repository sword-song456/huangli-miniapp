# 图片资源说明

## TabBar图标

需要准备以下图标文件（可选，已暂时移除）：

### 黄历图标
- `calendar.png` - 未选中状态（81x81px）
- `calendar-active.png` - 选中状态（81x81px）

### 平安卡图标
- `card.png` - 未选中状态（81x81px）
- `card-active.png` - 选中状态（81x81px）

## 背景图片

可以添加以下背景图片用于平安卡生成：
- `background-1.jpg` - 山水背景图1
- `background-2.jpg` - 山水背景图2
- `background-3.jpg` - 山水背景图3

## 图标设计建议

- 使用简洁的线条风格
- 颜色：未选中 #666666，选中 #d4524f
- 尺寸：81x81px（推荐）
- 格式：PNG（支持透明）

## 在线图标资源

- [iconfont](https://www.iconfont.cn/)
- [iconpark](https://iconpark.oceanengine.com/)
- [flaticon](https://www.flaticon.com/)

添加图标后，在 `app.json` 中取消注释 tabBar 的 iconPath 配置。
