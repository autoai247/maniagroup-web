const TelegramBot = require('node-telegram-bot-api');

const token = '8211049535:AAFy28gUJlRBvLX4E152OW2ZjYCz24nZBms';

// 봇 생성
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 텔레그램 봇 테스트 시작...');

// /start 명령어
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '✅ 봇이 정상 작동 중입니다!');
  console.log('✅ /start 명령어 수신:', chatId);
});

// 모든 메시지
bot.on('message', (msg) => {
  console.log('📨 메시지 수신:', msg.text);
});

// 에러 처리
bot.on('polling_error', (error) => {
  console.error('❌ 폴링 에러:', error.message);
});

console.log('✅ 봇이 준비되었습니다!');
console.log('💡 텔레그램에서 /start 를 입력해보세요.');
