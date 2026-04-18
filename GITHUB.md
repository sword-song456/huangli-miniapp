# GitHub管理指南

## 初始化完成

Git仓库已初始化，首次提交已完成。

## 推送到GitHub

### 1. 在GitHub创建仓库
访问 https://github.com/new 创建新仓库：
- 仓库名：`huangli-miniapp`
- 描述：节气老黄历小程序 - 适合老年人的黄历查询和平安卡生成工具
- 可见性：Public 或 Private
- **不要**勾选"Initialize this repository with a README"

### 2. 关联远程仓库
```bash
cd /Users/sword/Desktop/sword_code/huangli-miniapp

# 添加远程仓库
git remote add origin https://github.com/your-username/huangli-miniapp.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 使用SSH（推荐）
如果你配置了SSH密钥：
```bash
git remote add origin git@github.com:your-username/huangli-miniapp.git
git push -u origin main
```

## 日常开发流程

### 修改代码后提交
```bash
# 查看修改状态
git status

# 添加修改的文件
git add .

# 提交修改
git commit -m "描述你的修改"

# 推送到GitHub
git push
```

### 常用命令
```bash
# 查看提交历史
git log --oneline

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature

# 拉取最新代码
git pull
```

## 安全提示

### 已保护的敏感信息
`.gitignore` 已配置忽略以下文件：
- `utils/api.config.js` - API密钥配置
- `project.private.config.json` - 项目私有配置

### 配置API密钥
团队成员克隆项目后需要：
```bash
# 复制示例配置
cp utils/api.config.example.js utils/api.config.js

# 编辑配置文件，填入真实的API密钥
# 此文件不会被提交到Git
```

## 协作开发

### 分支策略
- `main` - 主分支，稳定版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 修复分支

### Pull Request流程
1. 创建功能分支
2. 开发并提交代码
3. 推送到GitHub
4. 创建Pull Request
5. 代码审查
6. 合并到主分支

## GitHub Actions（可选）

可以配置自动化流程：
- 代码检查
- 自动测试
- 自动部署

## 项目徽章

在README中添加徽章展示项目状态：
```markdown
![GitHub stars](https://img.shields.io/github/stars/your-username/huangli-miniapp)
![GitHub forks](https://img.shields.io/github/forks/your-username/huangli-miniapp)
![GitHub issues](https://img.shields.io/github/issues/your-username/huangli-miniapp)
```

## 备份建议

- 定期推送到GitHub
- 重要版本打tag
- 保持提交信息清晰

```bash
# 创建版本标签
git tag -a v1.0.0 -m "首个正式版本"
git push origin v1.0.0
```
