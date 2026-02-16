const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/influencers.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 팔로워 수에 따른 광고비 계산
function calculateAdFee(followersStr) {
  const followers = parseInt(followersStr.replace(/K|M/gi, ''));
  const isMillions = followersStr.includes('M');

  if (isMillions) {
    return followers * 1000000; // 1M = 100만원
  } else {
    // K 단위
    if (followers >= 500) return 500000;  // 50K = 50만원
    if (followers >= 300) return 400000;
    if (followers >= 200) return 300000;
    if (followers >= 100) return 200000;
    return 150000;
  }
}

// 카테고리별 수수료율
const commissionRates = {
  '피트니스/헬스': 18,
  '뷰티': 20,
  '라이프스타일': 15,
  '웹예능': 25,
  '푸드': 17,
  '패션': 20,
  '여행': 22
};

// 인플루언서 데이터 업데이트
data.influencers = data.influencers.map((inf, index) => {
  const adFee = calculateAdFee(inf.followers);
  const commissionRate = commissionRates[inf.category] || 15;
  const groupBuyRate = commissionRate + 5; // 공구는 5% 더
  const minimumGuarantee = Math.round(adFee * 0.6); // 최소 보장은 60%

  // 랜덤 실적 생성
  const totalProjects = inf.projects || (5 + Math.round(Math.random() * 20));
  const totalRevenue = Math.round(adFee * totalProjects * (1.2 + Math.random() * 0.5));
  const totalCommission = Math.round(totalRevenue * (commissionRate / 100));

  return {
    ...inf,
    // 수수료 정보
    adFeePerPost: adFee,
    commissionRate,
    groupBuyRate,
    minimumGuarantee,

    // 정산 정보
    settlementCycle: ['월말정산', '건별정산', '분기정산'][index % 3],
    accountBank: ['국민은행', '신한은행', '우리은행', '하나은행'][index % 4],
    accountNumber: `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90000 + 10000)}`,
    accountHolder: inf.realName || inf.name,

    // 계약 정보
    contractStart: '2024-01-01',
    contractEnd: '2024-12-31',
    autoRenewal: index % 2 === 0,

    // 연락처 정보 (기존 유지 + 추가)
    phone: inf.phone || `010-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    email: inf.email || `${inf.name.toLowerCase()}@example.com`,
    manager: ['김민수', '박지영', '이수진', '최준호', '정유진'][index % 5],

    // 실적
    totalProjects,
    totalRevenue,
    totalCommission,

    // 기존 필드 유지
    projects: totalProjects,
    rating: inf.rating || (4.5 + Math.random() * 0.5),
    status: inf.status || 'active'
  };
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ 인플루언서 데이터 업데이트 완료!');
console.log(`👥 총 ${data.influencers.length}명 처리\n`);

// 샘플 출력
const sample = data.influencers[0];
console.log(`📋 샘플: ${sample.name}`);
console.log(`팔로워: ${sample.followers}`);
console.log(`광고비/건: ₩${sample.adFeePerPost.toLocaleString()}`);
console.log(`수수료율: ${sample.commissionRate}%`);
console.log(`공구 수수료: ${sample.groupBuyRate}%`);
console.log(`최소 보장: ₩${sample.minimumGuarantee.toLocaleString()}`);
console.log(`총 매출: ₩${sample.totalRevenue.toLocaleString()}`);
console.log(`총 수수료: ₩${sample.totalCommission.toLocaleString()}`);
console.log(`정산 주기: ${sample.settlementCycle}`);
