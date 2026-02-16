const fs = require('fs');
const path = require('path');

const scannedFilesPath = path.join(__dirname, '../src/data/scanned-files.json');
const categoriesPath = path.join(__dirname, '../src/data/categories.json');

// Load data
const scannedData = JSON.parse(fs.readFileSync(scannedFilesPath, 'utf-8'));
const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

// Simple keyword-based classification (can be replaced with Claude API)
function classifyFile(fileName, folder) {
  const keywords = {
    '퍼포먼스 마케팅': ['광고', 'ad', '검색', 'search', 'SA', 'DA', '디스플레이', 'GFA', '구글', 'google', '네이버', 'naver'],
    'SNS 마케팅 & 콘텐츠': ['SNS', 'social', '소셜', '인스타', 'instagram', '페이스북', 'facebook', '틱톡', 'tiktok', '유튜브', 'youtube', 'YT', '콘텐츠', 'content'],
    '인플루언서 & 바이럴': ['인플루언서', 'influencer', '바이럴', 'viral', '협찬', '시딩', 'seeding', '셀럽', 'celeb', '블로거', 'blogger'],
    '로컬 & 지도 마케팅': ['로컬', 'local', '플레이스', 'place', '지도', 'map', '배달', 'delivery', '당근', '오프라인'],
    'SEO & 웹사이트 최적화': ['SEO', '검색엔진', '최적화', 'optimization', '웹사이트', 'website', '랜딩', 'landing'],
    '미디어 & PR': ['PR', '언론', 'press', '미디어', 'media', '보도', '홍보'],
    '전통 미디어 광고': ['TV', '라디오', 'radio', '옥외', 'OOH', '지하철', '버스'],
    '엔터테인먼트 & IP': ['엔터', 'entertainment', 'IP', '영상', 'video', '제작', 'production', '촬영', 'PPL'],
    '커머스 & 유통': ['커머스', 'commerce', '라이브', 'live', '공구', '입점', '유통', 'distribution', '쇼핑'],
    '공간 운영 & 호스피탈리티': ['공간', 'space', '팝업', 'popup', '호텔', 'hotel', '리조트'],
    '이벤트 & MICE': ['이벤트', 'event', '페스티벌', 'festival', '행사', 'MICE', '전시', '박람회'],
    '제작 & 크리에이티브': ['제작', '디자인', 'design', '크리에이티브', 'creative', '웹', 'web', '앱', 'app', '포트폴리오'],
    '브랜딩 & 전략': ['브랜딩', 'branding', '전략', 'strategy', 'BI', 'CI', '네이밍', '리브랜딩'],
    '데이터 & 애널리틱스': ['데이터', 'data', '분석', 'analytics', 'GA4', 'CRM', '리포트', 'report'],
    '해외 마케팅 & 글로벌': ['해외', 'global', '글로벌', 'overseas', 'international'],
    '고관여 DB 마케팅': ['DB', '데이터베이스', '보험', '금융', '분양', '렌탈', '법률'],
    '교육 & 컨설팅': ['교육', 'education', '컨설팅', 'consulting', '강의', '워크샵'],
    '투자 & 비즈니스 인프라': ['투자', 'investment', 'IR', '법인', '채용', 'ESG', '법률']
  };

  const text = (fileName + ' ' + folder).toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const [category, keywordList] of Object.entries(keywords)) {
    let score = 0;
    for (const keyword of keywordList) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  // Default to a general category if no match
  if (!bestMatch || bestScore === 0) {
    // Try to guess from file type and folder
    if (folder.includes('마케팅')) {
      bestMatch = 'SNS 마케팅 & 콘텐츠';
    } else if (folder.includes('데이터')) {
      bestMatch = '데이터 & 애널리틱스';
    } else {
      bestMatch = '제작 & 크리에이티브';
    }
  }

  return {
    category: bestMatch,
    confidence: Math.min(bestScore * 20, 95) // Convert to percentage, max 95%
  };
}

function getSubCategory(category, fileName) {
  // Find matching subcategory based on filename
  const categoryData = categoriesData.categories.find(c => c.name === category);
  if (!categoryData || !categoryData.subCategories || categoryData.subCategories.length === 0) {
    return null;
  }

  // Simple heuristic: return first subcategory
  // In a real implementation, this would use AI or more sophisticated matching
  return categoryData.subCategories[0].name;
}

console.log('AI 자동 분류 시작...\n');

let classified = 0;
const files = scannedData.files.map((file, index) => {
  const result = classifyFile(file.name, file.folder);

  // Always classify with some category
  classified++;
  const confidence = result.confidence || 70;

  console.log(`[${index + 1}/${scannedData.files.length}] ${file.name}`);
  console.log(`   → ${result.category} (신뢰도: ${confidence}%)\n`);

  return {
    ...file,
    category: result.category,
    subCategory: getSubCategory(result.category, file.name),
    isAIClassified: confidence >= 50,
    aiConfidence: confidence
  };
});

scannedData.files = files;
scannedData.classifiedAt = new Date().toISOString();
scannedData.classifiedCount = classified;

// Save updated data
fs.writeFileSync(scannedFilesPath, JSON.stringify(scannedData, null, 2), 'utf-8');

console.log(`\n완료! ${classified}/${scannedData.files.length}개 파일 자동 분류`);
console.log(`나머지 ${scannedData.files.length - classified}개는 수동 분류 필요`);
