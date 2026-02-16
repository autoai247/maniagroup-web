const path = require('path');

// .env.local 파일 로드
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

// 환경 변수에서 설정 로드
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID || 'YOUR_GROUP_CHAT_ID_HERE';
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');

// 환경변수 확인
console.log('🔧 환경변수 확인:');
console.log('   BOT_TOKEN:', BOT_TOKEN ? `${BOT_TOKEN.substring(0, 15)}...` : '❌ 없음');
console.log('   GROUP_CHAT_ID:', GROUP_CHAT_ID);

// 업로드 디렉토리 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 봇 생성
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 텔레그램 봇이 시작되었습니다!');

// ==================== 명령어 핸들러 ====================

// /start 명령어
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type; // 'private', 'group', 'supergroup'

  console.log(`✅ /start 수신 - Chat ID: ${chatId}, Type: ${chatType}`);

  const welcomeMessage = `
🎉 *매니아그룹 관리 봇*에 오신 것을 환영합니다!

*📱 초간단 사용법:*

*1️⃣ 파일 찾기 (제일 쉬움!)*
그냥 키워드만 입력하세요:
\`제품\` \`파트너\` \`계약\` \`제안\`
→ 버튼 나옴 → 클릭 → 파일 다운로드!

*2️⃣ 파일 업로드*
파일 첨부 → 전송 → 자동 처리!

*3️⃣ 상세 검색*
\`/찾기 키워드\` - 정확한 검색
\`/목록\` - 최근 10개 파일

*4️⃣ 정보 조회*
\`/프로젝트\` \`/파트너\` \`/제품\` \`/인플루언서\`

💡 *예시:*
"제품" 입력 → [제품 파일 버튼들] → 클릭 → 다운로드 완료!

📚 자세한 설명: /도움말
  `;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// /업로드 명령어
bot.onText(/\/업로드/, (msg) => {
  const chatId = msg.chat.id;
  const guideMessage = `
📤 *파일 업로드 가이드*

*1. 일반 파일 업로드*
파일을 채팅에 드래그하거나 첨부하세요.

*2. 설명 추가 (선택)*
파일과 함께 설명을 적으면 더 정확하게 분류됩니다.
예: "신규 제품 카탈로그"

*3. 자동 처리*
✅ 자동으로 다운로드
✅ 자동으로 분류
✅ 웹사이트에 등록

*지원 형식:*
📄 문서: PDF, DOCX, XLSX, PPTX
🖼️ 이미지: JPG, PNG, GIF
📹 영상: MP4, AVI, MOV

*크기 제한:* 20MB
  `;

  bot.sendMessage(chatId, guideMessage, { parse_mode: 'Markdown' });
});

// /목록 명령어 - 인라인 버튼으로 파일 선택
bot.onText(/\/목록/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // 업로드 디렉토리에서 파일 목록 가져오기
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(file => !file.startsWith('.'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(UPLOAD_DIR, a));
        const statB = fs.statSync(path.join(UPLOAD_DIR, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
      })
      .slice(0, 10);

    if (files.length === 0) {
      bot.sendMessage(chatId, '📋 아직 업로드된 파일이 없습니다.');
      return;
    }

    // 인라인 버튼 생성
    const keyboard = files.map((file, index) => [{
      text: `📄 ${file.replace(/^\d+_/, '')}`, // 타임스탬프 제거
      callback_data: `download_${file}`
    }]);

    bot.sendMessage(chatId, '📋 *최근 업로드된 파일* (클릭하여 다운로드)', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } catch (error) {
    console.error('목록 오류:', error);
    bot.sendMessage(chatId, '❌ 목록을 불러오는데 실패했습니다.');
  }
});

// /프로젝트 명령어
bot.onText(/\/프로젝트/, async (msg) => {
  const chatId = msg.chat.id;

  const projectMessage = `
📁 *진행 중인 프로젝트*

1. 🔵 비티진 온라인마케팅 (완료)
2. 🟢 더웨이브코리아 공구 프로젝트 (65%)
3. 🔵 웨딩 마케팅 캠페인 (완료)
4. 🟡 THE8MANIA 영상 제작 (80%)

🌐 자세한 정보:
http://localhost:3000/admin/projects
  `;

  bot.sendMessage(chatId, projectMessage, { parse_mode: 'Markdown' });
});

// /파트너 명령어
bot.onText(/\/파트너/, (msg) => {
  const chatId = msg.chat.id;

  const partnerMessage = `
🤝 *협력 파트너 목록*

1. ⭐ THE8MANIA (영상 제작) - 4.9점
2. ⭐ 저스트미라클 (이벤트) - 4.7점
3. ⭐ 나바코리아 (피트니스) - 4.8점
4. ⭐ 더웨이브코리아 (커머스) - 4.7점

🌐 전체 목록:
http://localhost:3000/admin/partners
  `;

  bot.sendMessage(chatId, partnerMessage, { parse_mode: 'Markdown' });
});

// /제품 명령어
bot.onText(/\/제품/, (msg) => {
  const chatId = msg.chat.id;

  const productMessage = `
🛍️ *제품 목록* (전체 50개)

*뷰티/화장품*
• Where is Pore? 모공케어
• JJ YOUNG 업&다운 마스크
• PEACE WATER 나이트 마스크

*생활용품*
• 브이쉴드 살균 스프레이
• 클린온 손 세정제

*반려동물*
• 뽀로로펫 유산균

🌐 전체 제품 카탈로그:
http://localhost:3000/admin/products

💾 제품 목록 다운로드:
엑셀/PDF 다운로드는 웹사이트에서 가능합니다.
  `;

  bot.sendMessage(chatId, productMessage, { parse_mode: 'Markdown' });
});

// /인플루언서 명령어
bot.onText(/\/인플루언서/, (msg) => {
  const chatId = msg.chat.id;
  console.log(`✅ /인플루언서 수신 - Chat ID: ${chatId}, Type: ${msg.chat.type}`);

  const influencerMessage = `
👥 *인플루언서 목록* (전체 15명)

*피트니스/헬스*
⭐ 문핏 (520K) - 피트니스 전문
⭐ 소미핏 (280K) - 홈트 전문

*뷰티*
⭐ 소은 (450K) - 메이크업 전문
⭐ 제니 (320K) - 스킨케어 전문

*라이프스타일*
⭐ 규리 (180K) - 일상/브이로그
⭐ 진주 (350K) - 패션/뷰티

*푸드*
⭐ 요미 (240K) - 맛집 탐방
⭐ 쿡킹밤 (290K) - 레시피

🌐 전체 인플루언서 정보:
http://localhost:3000/admin/influencers

💡 협업 문의는 DM 또는 담당자에게 연락주세요!
  `;

  bot.sendMessage(chatId, influencerMessage, { parse_mode: 'Markdown' });
});

// /찾기 명령어 - 키워드로 파일 검색
bot.onText(/\/찾기 (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const keyword = match[1].trim();

  try {
    // 파일 검색
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(file => !file.startsWith('.'))
      .filter(file => file.toLowerCase().includes(keyword.toLowerCase()));

    if (files.length === 0) {
      bot.sendMessage(chatId, `❌ "${keyword}"로 검색된 파일이 없습니다.`);
      return;
    }

    // 검색 결과를 인라인 버튼으로
    const keyboard = files.slice(0, 10).map(file => [{
      text: `📄 ${file.replace(/^\d+_/, '')}`,
      callback_data: `download_${file}`
    }]);

    bot.sendMessage(chatId, `🔍 *"${keyword}"* 검색 결과: ${files.length}개\n\n클릭하여 다운로드:`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } catch (error) {
    console.error('검색 오류:', error);
    bot.sendMessage(chatId, '❌ 검색 중 오류가 발생했습니다.');
  }
});

// 간단 검색 - 키워드만 입력 (명령어 없이)
bot.onText(/^(제품|파트너|프로젝트|계약|제안|보고서|카탈로그|이미지|사진|영상|문서|엑셀|pdf|ppt|word|최근|오늘|어제|이번주)$/i, async (msg) => {
  const chatId = msg.chat.id;
  const keyword = msg.text.trim();

  try {
    // 파일 검색
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(file => !file.startsWith('.'))
      .filter(file => file.toLowerCase().includes(keyword.toLowerCase()));

    if (files.length === 0) {
      bot.sendMessage(chatId, `❌ "${keyword}" 관련 파일이 없습니다.\n\n/업로드 명령어로 파일을 업로드해주세요.`);
      return;
    }

    // 최대 5개까지 버튼으로 표시
    const keyboard = files.slice(0, 5).map(file => [{
      text: `📄 ${file.replace(/^\d+_/, '')}`,
      callback_data: `download_${file}`
    }]);

    // 더 보기 버튼 추가
    if (files.length > 5) {
      keyboard.push([{
        text: `📋 전체 보기 (${files.length}개)`,
        callback_data: `search_all_${keyword}`
      }]);
    }

    bot.sendMessage(chatId, `🔍 *"${keyword}"* 관련 파일:`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } catch (error) {
    console.error('간단 검색 오류:', error);
  }
});

// /정보 명령어 (디버그용)
bot.onText(/\/정보/, (msg) => {
  const chatId = msg.chat.id;
  const chat = msg.chat;

  const infoMessage = `
🔍 *채팅 정보*

📱 Chat ID: \`${chatId}\`
👥 Type: ${chat.type}
📝 Title: ${chat.title || 'N/A'}
👤 Username: ${chat.username || 'N/A'}

🤖 봇 상태: ✅ 작동 중
🔗 그룹 연동: ${chatId === parseInt(GROUP_CHAT_ID) ? '✅ 연동됨' : '❌ 미연동'}

💡 이 정보를 개발자에게 전달하면 디버깅에 도움이 됩니다.
  `;

  bot.sendMessage(chatId, infoMessage, { parse_mode: 'Markdown' });
});

// /도움말 명령어
bot.onText(/\/도움말/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
📚 *매니아그룹 봇 사용 가이드*

*🤖 주요 기능*
1. 파일 자동 업로드 & 분류
2. 프로젝트/파트너/제품 정보 조회
3. 실시간 알림 수신
4. **파일 검색 & 다운로드** ⭐ NEW!

*📱 사용 방법*

*파일 업로드:*
파일을 채팅에 올리면 자동 처리됩니다.
(PDF, Excel, Word, 이미지 등)

*파일 찾기 (매우 쉬움!):*
방법1: 키워드만 입력
  예: \`제품\` → 제품 관련 파일 버튼 표시

방법2: /찾기 명령어
  예: \`/찾기 카탈로그\` → 카탈로그 파일 검색

방법3: /목록 명령어
  예: \`/목록\` → 최근 10개 파일 표시

*다운로드:*
버튼만 클릭하면 파일이 바로 전송됩니다!

*빠른 등록:*
제품: 제품명 / 브랜드 / 가격
파트너: 회사명 / 담당자 / 연락처

*정보 조회:*
/목록 - 최근 파일 (버튼 클릭으로 다운로드)
/찾기 키워드 - 파일 검색
/프로젝트 - 프로젝트 현황
/파트너 - 파트너 정보
/제품 - 제품 카탈로그
/인플루언서 - 인플루언서 리스트

*💡 활용 팁*
• 파일명에 키워드 포함하면 찾기 쉬움
• "제품", "파트너", "계약" 등 키워드만 입력해도 검색됨
• 버튼 클릭만으로 파일 다운로드 가능
• 중요한 파일은 ⭐ 이모지를 붙여주세요

*🌐 웹사이트*
http://localhost:3000
  `;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// ==================== 파일 업로드 처리 ====================

// 문서 파일 (PDF, Word, Excel, etc.)
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const document = msg.document;
  const caption = msg.caption || '';

  console.log('📄 문서 파일 수신:', document.file_name);

  try {
    // 파일 정보 가져오기
    const file = await bot.getFile(document.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    // 파일 다운로드
    const response = await axios.get(fileUrl, { responseType: 'stream' });
    const fileName = `${Date.now()}_${document.file_name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // 파일 저장
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('✅ 파일 저장 완료:', fileName);

    // 사용자에게 알림
    const successMessage = `
✅ *파일 업로드 완료!*

📄 파일명: ${document.file_name}
📦 크기: ${(document.file_size / 1024 / 1024).toFixed(2)} MB
📝 설명: ${caption || '(없음)'}
⏰ 시간: ${new Date().toLocaleString('ko-KR')}

🔄 자동 분류 진행 중...
📊 웹사이트에서 확인 가능합니다.
    `;

    bot.sendMessage(chatId, successMessage, { parse_mode: 'Markdown' });

    // TODO: 자동 분류 스크립트 실행
    // TODO: 데이터베이스에 저장
    // TODO: 웹사이트에 업데이트 알림

  } catch (error) {
    console.error('❌ 파일 처리 오류:', error);
    bot.sendMessage(chatId, '❌ 파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
});

// 사진 파일
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1]; // 가장 큰 사이즈
  const caption = msg.caption || '';

  console.log('🖼️ 사진 수신');

  try {
    const file = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    const response = await axios.get(fileUrl, { responseType: 'stream' });
    const fileName = `${Date.now()}_photo.jpg`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('✅ 사진 저장 완료:', fileName);

    bot.sendMessage(chatId, `✅ 사진이 업로드되었습니다!\n📝 설명: ${caption || '(없음)'}`, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('❌ 사진 처리 오류:', error);
    bot.sendMessage(chatId, '❌ 사진 업로드 중 오류가 발생했습니다.');
  }
});

// ==================== 텍스트 메시지 처리 ====================

// 빠른 등록 (제품, 파트너 등)
bot.on('message', (msg) => {
  // 명령어나 파일이 아닌 일반 텍스트 메시지만 처리
  if (!msg.text || msg.text.startsWith('/') || msg.document || msg.photo) {
    return;
  }

  const chatId = msg.chat.id;
  const text = msg.text;

  // 제품 등록: "제품: 제품명 / 브랜드 / 가격"
  if (text.startsWith('제품:')) {
    const parts = text.replace('제품:', '').split('/').map(s => s.trim());
    if (parts.length >= 2) {
      const [name, brand, price] = parts;
      bot.sendMessage(chatId, `✅ 제품이 등록되었습니다!\n\n📦 제품명: ${name}\n🏷️ 브랜드: ${brand}\n💰 가격: ${price || '상세문의'}`);
      // TODO: 데이터베이스에 저장
    } else {
      bot.sendMessage(chatId, '❌ 형식이 올바르지 않습니다.\n예: 제품: 제품명 / 브랜드 / 가격');
    }
    return;
  }

  // 파트너 등록: "파트너: 회사명 / 담당자 / 연락처"
  if (text.startsWith('파트너:')) {
    const parts = text.replace('파트너:', '').split('/').map(s => s.trim());
    if (parts.length >= 2) {
      const [company, contact, phone] = parts;
      bot.sendMessage(chatId, `✅ 파트너가 등록되었습니다!\n\n🏢 회사명: ${company}\n👤 담당자: ${contact}\n📞 연락처: ${phone || '미등록'}`);
      // TODO: 데이터베이스에 저장
    } else {
      bot.sendMessage(chatId, '❌ 형식이 올바르지 않습니다.\n예: 파트너: 회사명 / 담당자 / 연락처');
    }
    return;
  }
});

// ==================== 인라인 버튼 클릭 처리 ====================

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    // 파일 다운로드 버튼
    if (data.startsWith('download_')) {
      const fileName = data.replace('download_', '');
      const filePath = path.join(UPLOAD_DIR, fileName);

      // 파일 존재 확인
      if (!fs.existsSync(filePath)) {
        bot.answerCallbackQuery(query.id, {
          text: '❌ 파일을 찾을 수 없습니다.',
          show_alert: true
        });
        return;
      }

      // 파일 정보
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024 / 1024).toFixed(2);

      // 파일 전송
      bot.answerCallbackQuery(query.id, {
        text: '📤 파일을 전송하는 중...'
      });

      await bot.sendDocument(chatId, filePath, {
        caption: `📄 *${fileName.replace(/^\d+_/, '')}*\n📦 크기: ${fileSize} MB\n⏰ ${new Date().toLocaleString('ko-KR')}`,
        parse_mode: 'Markdown'
      });

      console.log(`✅ 파일 전송 완료: ${fileName}`);
    }

    // 전체 보기 버튼
    if (data.startsWith('search_all_')) {
      const keyword = data.replace('search_all_', '');

      const files = fs.readdirSync(UPLOAD_DIR)
        .filter(file => !file.startsWith('.'))
        .filter(file => file.toLowerCase().includes(keyword.toLowerCase()));

      const fileList = files.map((file, index) =>
        `${index + 1}. 📄 ${file.replace(/^\d+_/, '')}`
      ).join('\n');

      bot.answerCallbackQuery(query.id);

      bot.sendMessage(chatId, `📋 *"${keyword}"* 전체 파일 목록:\n\n${fileList}\n\n💡 /찾기 ${keyword} 명령어로 다운로드할 수 있습니다.`, {
        parse_mode: 'Markdown'
      });
    }

  } catch (error) {
    console.error('버튼 처리 오류:', error);
    bot.answerCallbackQuery(query.id, {
      text: '❌ 오류가 발생했습니다.',
      show_alert: true
    });
  }
});

// ==================== 에러 처리 ====================

bot.on('polling_error', (error) => {
  console.error('폴링 에러:', error);
});

// ==================== 유틸리티 함수 ====================

// 그룹챗으로 알림 전송
function sendNotificationToGroup(message) {
  if (GROUP_CHAT_ID && GROUP_CHAT_ID !== 'YOUR_GROUP_CHAT_ID_HERE') {
    bot.sendMessage(GROUP_CHAT_ID, message, { parse_mode: 'Markdown' });
  }
}

// 웹사이트에서 호출할 수 있는 API
function sendTelegramNotification(type, data) {
  let message = '';

  switch (type) {
    case 'new_project':
      message = `🆕 *새 프로젝트 등록*\n\n📁 ${data.name}\n👤 ${data.client}\n📅 ${data.startDate} ~ ${data.endDate}`;
      break;
    case 'new_partner':
      message = `🤝 *새 파트너 등록*\n\n🏢 ${data.name}\n📂 ${data.category}\n⭐ 평점: ${data.rating}`;
      break;
    case 'new_product':
      message = `🛍️ *새 제품 등록*\n\n📦 ${data.name}\n🏷️ ${data.brand}\n💰 ${data.price}`;
      break;
  }

  if (message) {
    sendNotificationToGroup(message);
  }
}

// 모듈 내보내기
module.exports = {
  bot,
  sendNotificationToGroup,
  sendTelegramNotification
};

console.log('✅ 봇이 준비되었습니다. 메시지를 기다리는 중...');
