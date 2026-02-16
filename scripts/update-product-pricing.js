const fs = require('fs');
const path = require('path');

// 데이터 파일 경로
const dataPath = path.join(__dirname, '../src/data/real-partners.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 제품 카테고리별 기본 가격 범위
const priceRanges = {
  '뷰티/화장품': { supply: [8000, 15000], retail: [25000, 35000] },
  '생활용품': { supply: [3000, 8000], retail: [12000, 20000] },
  '건강식품': { supply: [15000, 30000], retail: [45000, 80000] },
  '반려동물': { supply: [10000, 20000], retail: [30000, 50000] },
  '패션': { supply: [20000, 40000], retail: [60000, 100000] },
  '식품': { supply: [5000, 15000], retail: [15000, 35000] }
};

// 가격 계산 함수
function calculatePricing(category, index) {
  const range = priceRanges[category] || priceRanges['생활용품'];

  // 공급가 (랜덤하게 범위 내에서 선택)
  const supplyPrice = Math.round(
    range.supply[0] + (range.supply[1] - range.supply[0]) * (index % 10) / 10
  );

  // 판매가 (공급가의 2.5~3배)
  const retailPrice = Math.round(supplyPrice * (2.5 + (index % 5) * 0.1));

  // 공구가 (판매가의 70~80%)
  const groupBuyPrice = Math.round(retailPrice * (0.7 + (index % 3) * 0.05));

  // 마진 (공구가 - 공급가)
  const margin = groupBuyPrice - supplyPrice;

  // 마진율
  const marginRate = Math.round((margin / groupBuyPrice) * 100);

  // 인플루언서 수수료율 (15~25%)
  const influencerFee = 15 + (index % 3) * 5;

  // 인플루언서 수수료 금액
  const influencerAmount = Math.round(groupBuyPrice * (influencerFee / 100));

  // 회사 수익
  const companyProfit = margin - influencerAmount;

  // 회사 수익률
  const companyProfitRate = Math.round((companyProfit / groupBuyPrice) * 100);

  // 재고 (100~1000)
  const stock = 100 + Math.round((index % 10) * 90);

  // 최소주문수량 (10~100)
  const moq = 10 + (index % 10) * 10;

  // 공구 최소 수량 (50~200)
  const groupMinQty = 50 + (index % 4) * 50;

  return {
    supplyPrice,
    retailPrice,
    groupBuyPrice,
    margin,
    marginRate,
    influencerFee,
    influencerAmount,
    companyProfit,
    companyProfitRate,
    stock,
    moq,
    groupMinQty,
    leadTime: ['3일', '5일', '7일', '10일'][index % 4]
  };
}

// 모든 제품 업데이트
data.products = data.products.map((product, index) => {
  const pricing = calculatePricing(product.category, index);

  return {
    ...product,
    ...pricing,
    // price 필드 업데이트
    price: `₩${pricing.retailPrice.toLocaleString()}`,
    // 공급처 연락처 추가
    supplierContact: '02-1234-5678',
    supplierEmail: 'supply@maniagroup.com'
  };
});

// 파일 저장
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ 제품 가격 정보 업데이트 완료!');
console.log(`📦 총 ${data.products.length}개 제품 처리`);
console.log('\n💰 샘플 제품 정보:');
const sample = data.products[0];
console.log(`제품: ${sample.name}`);
console.log(`공급가: ₩${sample.supplyPrice.toLocaleString()}`);
console.log(`판매가: ₩${sample.retailPrice.toLocaleString()}`);
console.log(`공구가: ₩${sample.groupBuyPrice.toLocaleString()}`);
console.log(`마진: ₩${sample.margin.toLocaleString()} (${sample.marginRate}%)`);
console.log(`인플루언서: ₩${sample.influencerAmount.toLocaleString()} (${sample.influencerFee}%)`);
console.log(`회사수익: ₩${sample.companyProfit.toLocaleString()} (${sample.companyProfitRate}%)`);
console.log(`재고: ${sample.stock}개`);
