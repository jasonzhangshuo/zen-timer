# Vercel 部署自查（zen-timer-rho.vercel.app 不更新时）

## 1. 确认连接的仓库

- 打开 [Vercel Dashboard](https://vercel.com/dashboard) → 进入项目 **zen-timer-rho**
- **Settings** → **Git**
- 确认 **Connected Git Repository** 是：`jasonzhangshuo/zen-timer`（GitHub）
- 若不是，点 **Disconnect** 后重新 **Import** 该仓库

## 2. 确认生产分支

- 同一页 **Production Branch** 设为 **main** 或 **production**（和你推送的分支一致）
- 当前仓库已同步：**main** 与 **production** 均为最新提交

## 3. 手动触发重新部署

- 顶部 **Deployments** → 找到最新一次部署
- 右侧 **⋯** → **Redeploy** → 勾选 **Use existing Build Cache** 可取消（全新构建）→ 确认
- 等待状态变为 **Ready**（约 1～3 分钟）

## 4. 确认是否为新版本

- 打开 https://zen-timer-rho.vercel.app/
- 首页右下角「寻径·归真」旁会有一串很小的**构建时间**（如 `2025-02-03 12:00:00`）
- 若该时间与本次部署时间一致，说明已是新版本；若没有或时间很旧，仍是旧部署

## 5. 若 Vercel 连的是 GitLab

- 本地需先推送到 GitLab：`git push gitlab main`（按提示登录）
- 或在 Vercel 中把 Git 连接改为 GitHub 的 `jasonzhangshuo/zen-timer`，再按上面步骤操作
