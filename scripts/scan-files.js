const fs = require('fs');
const path = require('path');

const baseDir = '/mnt/c/Users/user/OneDrive/민기현_SUPERS/매니아그룹';
const outputFile = path.join(__dirname, '../src/data/scanned-files.json');

function getFileType(ext) {
  const types = {
    '.pdf': 'pdf',
    '.docx': 'word',
    '.doc': 'word',
    '.xlsx': 'excel',
    '.xls': 'excel',
    '.pptx': 'ppt',
    '.ppt': 'ppt',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.png': 'image',
    '.mp4': 'video',
    '.mov': 'video',
    '.avi': 'video'
  };
  return types[ext.toLowerCase()] || 'file';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function scanDirectory(dir, baseDir) {
  const files = [];

  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and hidden directories
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'maniagroup-web') {
            scan(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          const fileTypes = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];

          if (fileTypes.includes(ext.toLowerCase())) {
            const relativePath = path.relative(baseDir, fullPath);
            const folderName = path.dirname(relativePath);

            files.push({
              id: files.length + 1,
              name: item,
              path: fullPath,
              relativePath: relativePath,
              folder: folderName === '.' ? '루트' : folderName,
              type: getFileType(ext),
              size: formatFileSize(stat.size),
              sizeBytes: stat.size,
              uploadDate: stat.mtime.toISOString().split('T')[0],
              modifiedDate: stat.mtime.toISOString(),
              category: null, // Will be set by AI
              subCategory: null,
              isAIClassified: false,
              uploadedBy: '시스템'
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning ${currentDir}:`, error.message);
    }
  }

  scan(dir);
  return files;
}

console.log('파일 스캔 시작...');
const scannedFiles = scanDirectory(baseDir, baseDir);

console.log(`총 ${scannedFiles.length}개 파일 발견`);

// Save to JSON
const data = {
  scannedAt: new Date().toISOString(),
  totalFiles: scannedFiles.length,
  files: scannedFiles
};

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8');
console.log(`파일 정보 저장 완료: ${outputFile}`);

// Print summary
const typeCounts = scannedFiles.reduce((acc, file) => {
  acc[file.type] = (acc[file.type] || 0) + 1;
  return acc;
}, {});

console.log('\n파일 형식별 통계:');
Object.entries(typeCounts).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}개`);
});
