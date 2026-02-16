#!/bin/bash

# 텔레그램 봇 시작 스크립트

echo "🤖 매니아그룹 텔레그램 봇 시작 중..."

# 환경 변수 로드
if [ -f ../.env.local ]; then
    export $(cat ../.env.local | xargs)
    echo "✅ 환경 변수 로드 완료"
else
    echo "❌ .env.local 파일이 없습니다!"
    echo "📝 .env.local.example을 복사하여 .env.local을 만들고 설정하세요."
    exit 1
fi

# 봇 토큰 확인
if [ "$TELEGRAM_BOT_TOKEN" == "YOUR_BOT_TOKEN_HERE" ]; then
    echo "❌ 봇 토큰이 설정되지 않았습니다!"
    echo "📝 TELEGRAM_SETUP.md 파일을 참고하여 봇을 생성하고 토큰을 설정하세요."
    exit 1
fi

# 업로드 디렉토리 생성
mkdir -p ../public/uploads

echo "✅ 설정 완료"
echo "🚀 봇 시작..."
echo ""

# 봇 실행
node bot.js
