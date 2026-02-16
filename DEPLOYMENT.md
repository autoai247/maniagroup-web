# 🚀 서버 배포 가이드

## 📋 목차
1. [간단 배포 (Vercel + Railway)](#방법-1-간단-배포-추천)
2. [VPS 배포 (AWS/DigitalOcean)](#방법-2-vps-배포)
3. [Docker 배포](#방법-3-docker-배포)

---

# 방법 1: 간단 배포 (추천!)

## 🌐 웹사이트 배포 - Vercel (무료)

### 1단계: GitHub에 코드 업로드

```bash
cd /mnt/c/Users/user/OneDrive/민기현_SUPERS/매니아그룹/maniagroup-web

# Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/maniagroup-web.git
git push -u origin main
```

### 2단계: Vercel 배포

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택 (maniagroup-web)
5. "Deploy" 클릭!

**완료!** 자동으로 배포됩니다.

### 3단계: 환경 변수 설정

Vercel 대시보드에서:
1. Settings → Environment Variables
2. 추가:
   ```
   TELEGRAM_BOT_TOKEN=8211049535:AAFy28gUJlRBvLX4E152OW2ZjYCz24nZBms
   TELEGRAM_GROUP_CHAT_ID=-5107079263
   ```

---

## 🤖 텔레그램 봇 배포 - Railway (무료)

### 1단계: Railway 가입

1. https://railway.app 접속
2. GitHub 계정으로 로그인

### 2단계: 새 프로젝트 생성

1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 선택

### 3단계: 시작 명령어 설정

Railway 대시보드에서:

**Settings → Deploy:**
```
Start Command: npm run bot
```

### 4단계: 환경 변수

Variables 탭에서:
```
TELEGRAM_BOT_TOKEN=8211049535:AAFy28gUJlRBvLX4E152OW2ZjYCz24nZBms
TELEGRAM_GROUP_CHAT_ID=-5107079263
```

### 5단계: 배포!

자동으로 배포되고 봇이 24시간 작동합니다!

---

# 방법 2: VPS 배포

## 🖥️ AWS EC2 / DigitalOcean / Vultr

### 1단계: 서버 생성

**AWS EC2 예시:**
- Ubuntu 22.04 LTS
- t2.micro (프리티어)
- 보안그룹: 포트 3000, 80, 443 열기

**DigitalOcean Droplet:**
- Ubuntu 22.04
- $6/월 플랜
- 방화벽 설정

### 2단계: 서버 접속

```bash
ssh ubuntu@your-server-ip
```

### 3단계: 환경 설정

```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt-get install git

# PM2 설치 (프로세스 관리자)
sudo npm install -g pm2
```

### 4단계: 코드 배포

```bash
# 저장소 클론
git clone https://github.com/your-username/maniagroup-web.git
cd maniagroup-web

# 의존성 설치
npm install

# 환경 변수 설정
nano .env.local
```

`.env.local` 내용:
```env
TELEGRAM_BOT_TOKEN=8211049535:AAFy28gUJlRBvLX4E152OW2ZjYCz24nZBms
TELEGRAM_GROUP_CHAT_ID=-5107079263
NEXT_PUBLIC_API_URL=http://your-server-ip:3000
```

### 5단계: 빌드 및 실행

```bash
# Next.js 빌드
npm run build

# PM2로 웹사이트 실행
pm2 start npm --name "maniagroup-web" -- start

# PM2로 봇 실행
pm2 start npm --name "telegram-bot" -- run bot

# PM2 자동 시작 설정
pm2 startup
pm2 save
```

### 6단계: Nginx 설정 (선택사항)

도메인이 있다면:

```bash
sudo apt-get install nginx

# Nginx 설정
sudo nano /etc/nginx/sites-available/maniagroup
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 활성화
sudo ln -s /etc/nginx/sites-available/maniagroup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7단계: SSL 인증서 (무료)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

# 방법 3: Docker 배포

## 🐳 Docker로 배포

### 1단계: Dockerfile 생성

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 의존성 복사
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 포트 노출
EXPOSE 3000

# 실행
CMD ["npm", "start"]
```

### 2단계: 봇 Dockerfile

```dockerfile
# telegram-bot/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY telegram-bot ./telegram-bot
COPY .env.local ./.env.local

CMD ["node", "telegram-bot/bot.js"]
```

### 3단계: docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always

  bot:
    build:
      context: .
      dockerfile: telegram-bot/Dockerfile
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_GROUP_CHAT_ID=${TELEGRAM_GROUP_CHAT_ID}
    restart: always
```

### 4단계: 배포

```bash
# 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

---

# 📊 배포 방법 비교

| 방법 | 난이도 | 비용 | 자동화 | 추천도 |
|------|--------|------|--------|--------|
| Vercel + Railway | ⭐ 쉬움 | 무료 | ✅ 높음 | ⭐⭐⭐⭐⭐ |
| VPS (AWS/DO) | ⭐⭐⭐ 중간 | $5-10/월 | ⚠️ 수동 | ⭐⭐⭐⭐ |
| Docker | ⭐⭐⭐⭐ 어려움 | 서버 비용 | ✅ 높음 | ⭐⭐⭐ |

---

# 🎯 추천 배포 전략

## 소규모 (개인/소기업)
→ **Vercel + Railway** (무료!)

## 중규모 (스타트업)
→ **VPS + PM2** ($6/월)

## 대규모 (기업)
→ **AWS/GCP + Docker + Kubernetes**

---

# 🔧 배포 후 확인사항

## 웹사이트 체크리스트

- [ ] 사이트 접속 가능
- [ ] 로그인 작동
- [ ] 모든 페이지 로딩
- [ ] 파일 업로드 작동
- [ ] 엑셀/PDF 다운로드 작동

## 텔레그램 봇 체크리스트

- [ ] /start 응답
- [ ] 파일 업로드 감지
- [ ] 파일 검색 작동
- [ ] 버튼 클릭 다운로드
- [ ] 명령어 모두 작동

---

# 🆘 문제 해결

## 웹사이트가 안 열려요

```bash
# 서버 상태 확인
pm2 status

# 로그 확인
pm2 logs maniagroup-web

# 재시작
pm2 restart maniagroup-web
```

## 봇이 응답하지 않아요

```bash
# 봇 상태 확인
pm2 status telegram-bot

# 로그 확인
pm2 logs telegram-bot

# 재시작
pm2 restart telegram-bot
```

## 환경 변수 오류

```bash
# .env.local 확인
cat .env.local

# 권한 확인
chmod 600 .env.local
```

---

# 📱 배포 후 사용

## 접속 URL

- **웹사이트**: https://your-domain.com (또는 http://server-ip:3000)
- **관리자**: https://your-domain.com/admin/login
- **텔레그램**: 그룹챗에서 봇 사용

## 업데이트 방법

```bash
# 서버 접속
ssh ubuntu@your-server-ip

# 코드 업데이트
cd maniagroup-web
git pull

# 재빌드
npm run build

# 재시작
pm2 restart all
```

---

# 🎉 완료!

배포가 완료되면:
- ✅ 24시간 접속 가능
- ✅ 핸드폰에서 언제든 사용
- ✅ 텔레그램 봇 자동 작동
- ✅ 팀 전체가 사용 가능

**시작하세요!** 🚀
