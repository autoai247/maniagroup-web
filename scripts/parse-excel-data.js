const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const baseDir = '/mnt/c/Users/user/OneDrive/민기현_SUPERS/매니아그룹';

// Excel files to parse
const excelFiles = [
  '마케팅/에이티매니아그룹_일일업무보고_박진수_221031.xlsx',
  '마케팅/웨딩_마케팅_정리_최종.xlsx',
  '자료/기업대상 요청자료_십이지_09.21 (1).xlsx',
  '자료/커머스_더웨이브코리아/더웨이브코리아 공구 가능제품 리스트_ 20250709.xlsx',
  '자료/커머스_직영/더매니아 공급제품리스트_1201.xlsx'
];

const extractedData = {
  projects: [],
  clients: [],
  products: [],
  metadata: {
    extractedAt: new Date().toISOString(),
    filesProcessed: 0
  }
};

function parseExcelFile(filePath, fileName) {
  try {
    console.log(`\n파싱 중: ${fileName}`);
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    console.log(`  시트 수: ${sheetNames.length}`);

    sheetNames.forEach((sheetName, idx) => {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      console.log(`  - ${sheetName}: ${data.length}행`);

      // Extract based on file type
      if (fileName.includes('일일업무보고')) {
        extractProjectsFromWorkReport(data, fileName);
      } else if (fileName.includes('웨딩_마케팅')) {
        extractWeddingProjects(data, fileName);
      } else if (fileName.includes('기업대상')) {
        extractClientData(data, fileName);
      } else if (fileName.includes('제품') || fileName.includes('리스트')) {
        extractProductData(data, fileName, sheetName);
      }
    });

    extractedData.metadata.filesProcessed++;
  } catch (error) {
    console.error(`  오류: ${error.message}`);
  }
}

function extractProjectsFromWorkReport(data, fileName) {
  // Skip header rows and extract project info
  for (let i = 1; i < Math.min(data.length, 20); i++) {
    const row = data[i];
    if (row && row.length > 2 && row[0] && typeof row[0] === 'string') {
      // Attempt to extract project name
      const projectName = String(row[0]).trim();
      if (projectName.length > 3 && projectName.length < 100) {
        extractedData.projects.push({
          name: projectName,
          source: fileName,
          date: '2022-10-31',
          type: '일일 업무',
          status: '완료'
        });
      }
    }
  }
}

function extractWeddingProjects(data, fileName) {
  // Extract wedding marketing projects
  for (let i = 1; i < Math.min(data.length, 30); i++) {
    const row = data[i];
    if (row && row.length > 1) {
      const item = String(row[0] || '').trim();
      if (item && item.length > 3 && item.length < 100 && !item.includes('합계')) {
        extractedData.projects.push({
          name: `웨딩 마케팅: ${item}`,
          source: fileName,
          category: '웨딩',
          type: '마케팅 프로젝트',
          status: '분석 완료'
        });
      }
    }
  }
}

function extractClientData(data, fileName) {
  // Extract client information
  for (let i = 1; i < Math.min(data.length, 50); i++) {
    const row = data[i];
    if (row && row.length > 1) {
      const clientName = String(row[0] || '').trim();
      if (clientName && clientName.length > 2 && clientName.length < 50 &&
          !clientName.includes('합계') && !clientName.includes('NO')) {
        extractedData.clients.push({
          name: clientName,
          source: fileName,
          category: '기업대상',
          requestDate: '2021-09-21'
        });
      }
    }
  }
}

function extractProductData(data, fileName, sheetName) {
  // Extract product information
  console.log(`    제품 추출 시작: ${sheetName}`);
  let extracted = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row && row.length > 0) {
      // 여러 컬럼에서 제품명 찾기
      for (let col = 0; col < Math.min(row.length, 5); col++) {
        const productName = String(row[col] || '').trim();

        // 제품명 필터링 조건 완화
        if (productName &&
            productName.length > 1 &&
            productName.length < 150 &&
            !productName.includes('합계') &&
            !productName.includes('NO.') &&
            !productName.includes('품목') &&
            !productName.includes('제품명') &&
            !productName.includes('상품명') &&
            !productName.match(/^[0-9]+$/) && // 숫자만 있는 것 제외
            !productName.match(/^\s*$/) // 공백만 있는 것 제외
        ) {
          // 중복 체크
          const isDuplicate = extractedData.products.some(p => p.name === productName);
          if (!isDuplicate) {
            extractedData.products.push({
              name: productName,
              source: fileName,
              sheet: sheetName,
              category: fileName.includes('더웨이브') ? '더웨이브코리아' : '더매니아 직영',
              description: row[col + 1] || row[col + 2] || '',
              price: row[col + 2] || row[col + 3] || row[col + 4] || '',
              status: '판매 가능',
              image: null // 추후 이미지 경로 추가
            });
            extracted++;
            break; // 해당 row에서 제품 하나 찾으면 다음 row로
          }
        }
      }
    }
  }
  console.log(`    → ${extracted}개 제품 추출됨`);
}

// Process all files
console.log('Excel 파일 파싱 시작...\n');

excelFiles.forEach(file => {
  const fullPath = path.join(baseDir, file);
  if (fs.existsSync(fullPath)) {
    parseExcelFile(fullPath, path.basename(file));
  } else {
    console.log(`파일 없음: ${file}`);
  }
});

// Clean up and deduplicate
extractedData.projects = extractedData.projects.slice(0, 15).filter((p, i, self) =>
  i === self.findIndex(t => t.name === p.name)
);

extractedData.clients = extractedData.clients.slice(0, 20).filter((c, i, self) =>
  i === self.findIndex(t => t.name === c.name)
);

extractedData.products = extractedData.products
  .filter((p, i, self) => i === self.findIndex(t => t.name === p.name))
  .slice(0, 50); // 최대 50개까지

// Save results
const outputFile = path.join(__dirname, '../src/data/extracted-data.json');
fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2), 'utf-8');

console.log('\n\n=== 추출 완료 ===');
console.log(`프로젝트: ${extractedData.projects.length}개`);
console.log(`광고주: ${extractedData.clients.length}개`);
console.log(`제품: ${extractedData.products.length}개`);
console.log(`\n저장 위치: ${outputFile}`);

// Print samples
if (extractedData.projects.length > 0) {
  console.log('\n[프로젝트 샘플]');
  extractedData.projects.slice(0, 3).forEach(p => {
    console.log(`  - ${p.name}`);
  });
}

if (extractedData.clients.length > 0) {
  console.log('\n[광고주 샘플]');
  extractedData.clients.slice(0, 3).forEach(c => {
    console.log(`  - ${c.name}`);
  });
}

if (extractedData.products.length > 0) {
  console.log('\n[제품 샘플]');
  extractedData.products.slice(0, 3).forEach(p => {
    console.log(`  - ${p.name}`);
  });
}
