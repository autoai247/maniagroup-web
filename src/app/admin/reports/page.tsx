'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  FileText, FileSpreadsheet, Download, Package, Star, Building2,
  FolderKanban, CheckCircle, Users, TrendingUp, Eye, Printer
} from 'lucide-react';
import realPartnersData from '@/data/real-partners.json';
import influencersData from '@/data/influencers.json';

type ReportType = 'client' | 'partner' | 'full';

const TODAY = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
const TODAY_ISO = new Date().toISOString().split('T')[0];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('client');
  const [previewOpen, setPreviewOpen] = useState(false);

  const products = realPartnersData.products;
  const partners = realPartnersData.partners;
  const projects = realPartnersData.realProjects;
  const influencers = influencersData.influencers;

  /* ─────────── CSV 유틸 ─────────── */
  const toCSV = (rows: (string | number | boolean | null | undefined)[][]) =>
    rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  /* ─────────── 광고주용 엑셀 ─────────── */
  const downloadClientExcel = () => {
    const rows = [
      ['=== MANIA GROUP - 광고주 제안 자료 ===', '', '', '', '', '', ''],
      ['생성일', TODAY, '', '담당팀', 'MANIA GROUP', '', ''],
      ['', '', '', '', '', '', ''],
      ['[ 제공 가능 서비스 ]', '', '', '', '', '', ''],
      ['서비스명', '카테고리', '세부 서비스', '공구가능', '인플루언서 연계', '예상 마진율', '비고'],
      ...products.map(p => [
        p.name, p.brand, p.category,
        p.canGroup ? 'O' : 'X',
        `${p.influencerFee}% 수수료`,
        `${p.marginRate}%`,
        p.description || ''
      ]),
      ['', '', '', '', '', '', ''],
      ['[ 연계 가능 인플루언서 ]', '', '', '', '', '', ''],
      ['이름', '플랫폼', '팔로워', '참여율', '카테고리', '전문 분야', '소속'],
      ...influencers.map(i => [
        i.name, i.platform, i.followers, i.engagement,
        i.category, (i.specialty || []).join(' / '), i.agency
      ]),
      ['', '', '', '', '', '', ''],
      ['[ 파트너/실행사 ]', '', '', '', '', '', ''],
      ['파트너명', '카테고리', '전문분야', '프로젝트 수', '평점', '', ''],
      ...partners.map(p => [
        p.name, p.category, (p.specialties || []).join(' / '),
        p.projectCount, p.rating, '', ''
      ]),
    ];
    downloadCSV(toCSV(rows), `MANIA_광고주제안서_${TODAY_ISO}.csv`);
  };

  /* ─────────── 실행사용 엑셀 ─────────── */
  const downloadPartnerExcel = () => {
    const rows = [
      ['=== MANIA GROUP - 실행사 파트너 자료 ===', '', '', '', '', '', '', '', '', ''],
      ['생성일', TODAY, '', '기밀', '내부공유용', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['[ 제품 상세 - 수익 구조 ]', '', '', '', '', '', '', '', '', ''],
      ['제품명', '브랜드', '카테고리', '공급가', '판매가', '공구가', '마진율', '인플루언서%', '회사수익%', '회사수익(건)'],
      ...products.map(p => [
        p.name, p.brand, p.category,
        p.supplyPrice, p.retailPrice, p.groupBuyPrice,
        `${p.marginRate}%`, `${p.influencerFee}%`,
        `${p.companyProfitRate}%`, p.companyProfit
      ]),
      ['', '', '', '', '', '', '', '', '', ''],
      ['[ 인플루언서 - 단가 정보 ]', '', '', '', '', '', '', '', '', ''],
      ['이름', '플랫폼', '팔로워', '참여율', '포스팅비(원)', '공구수수료%', '최소보장(원)', '정산방식', '담당매니저', '연락처'],
      ...influencers.map(i => [
        i.name, i.platform, i.followers, i.engagement,
        i.adFeePerPost, `${i.groupBuyRate}%`,
        i.minimumGuarantee, i.settlementCycle, i.manager, i.phone
      ]),
      ['', '', '', '', '', '', '', '', '', ''],
      ['[ 진행 프로젝트 현황 ]', '', '', '', '', '', '', '', '', ''],
      ['프로젝트명', '클라이언트', '카테고리', '세부카테고리', '상태', '진행률', '시작일', '종료일', '', ''],
      ...projects.map(p => [
        p.name, p.client, p.category, p.subCategory,
        p.status, `${p.progress}%`, p.startDate, p.endDate, '', ''
      ]),
    ];
    downloadCSV(toCSV(rows), `MANIA_실행사자료_${TODAY_ISO}.csv`);
  };

  /* ─────────── 종합 엑셀 ─────────── */
  const downloadFullExcel = () => {
    const totalPotential = products.reduce((s, p) => s + (p.companyProfit || 0) * (p.stock || 0), 0);
    const avgMargin = Math.round(products.reduce((s, p) => s + (p.marginRate || 0), 0) / products.length);
    const rows = [
      ['=== MANIA GROUP - 종합 현황 보고서 ===', '', '', ''],
      ['생성일', TODAY, '전산업 마케팅 통합 솔루션', ''],
      ['', '', '', ''],
      ['[ 핵심 지표 요약 ]', '', '', ''],
      ['구분', '수치', '비고', ''],
      ['관리 제품 수', `${products.length}개`, `공구가능 ${products.filter(p => p.canGroup).length}개`, ''],
      ['평균 마진율', `${avgMargin}%`, '', ''],
      ['재고 수익 잠재액', `₩${Math.round(totalPotential / 10000)}만원`, '', ''],
      ['파트너/실행사', `${partners.length}개사`, '', ''],
      ['인플루언서', `${influencers.length}명`, '', ''],
      ['프로젝트 현황', `전체 ${projects.length}개`, `진행중 ${projects.filter(p => p.status === '진행중').length}개`, ''],
      ['', '', '', ''],
      ['[ 제품 전체 ]', '', '', ''],
      ['제품명', '브랜드', '카테고리', '공급가', '판매가', '공구가', '마진율', '인플루언서%', '회사수익%', '재고'],
      ...products.map(p => [
        p.name, p.brand, p.category,
        p.supplyPrice, p.retailPrice, p.groupBuyPrice,
        `${p.marginRate}%`, `${p.influencerFee}%`, `${p.companyProfitRate}%`, p.stock
      ]),
      ['', '', '', ''],
      ['[ 인플루언서 전체 ]', '', '', ''],
      ['이름', '플랫폼', '팔로워', '참여율', '카테고리', '포스팅비', '공구수수료%', '소속'],
      ...influencers.map(i => [
        i.name, i.platform, i.followers, i.engagement,
        i.category, i.adFeePerPost, `${i.groupBuyRate}%`, i.agency
      ]),
      ['', '', '', ''],
      ['[ 파트너 전체 ]', '', '', ''],
      ['파트너명', '카테고리', '전문분야', '프로젝트수', '평점'],
      ...partners.map(p => [
        p.name, p.category, (p.specialties || []).join(' / '), p.projectCount, p.rating
      ]),
      ['', '', '', ''],
      ['[ 프로젝트 현황 ]', '', '', ''],
      ['프로젝트명', '클라이언트', '상태', '진행률', '카테고리', '시작일', '종료일'],
      ...projects.map(p => [
        p.name, p.client, p.status, `${p.progress}%`, p.category, p.startDate, p.endDate
      ]),
    ];
    downloadCSV(toCSV(rows), `MANIA_종합보고서_${TODAY_ISO}.csv`);
  };

  /* ─────────── PDF 공통 스타일 ─────────── */
  const PDF_STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif; background: #fff; color: #1a1a2e; font-size: 11px; }
    @page { margin: 15mm 12mm; size: A4; }
    .page { padding: 0; }
    .cover { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; padding: 40px; min-height: 200px; border-radius: 8px; margin-bottom: 20px; }
    .cover h1 { font-size: 28px; font-weight: 700; letter-spacing: 2px; margin-bottom: 8px; }
    .cover .subtitle { font-size: 14px; opacity: 0.8; margin-bottom: 20px; }
    .cover .meta { font-size: 11px; opacity: 0.6; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; display: flex; gap: 30px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 700; color: #0f3460; border-left: 4px solid #4f46e5; padding-left: 10px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #4f46e5; color: white; padding: 7px 8px; text-align: left; font-weight: 600; }
    td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    tr:hover td { background: #eff6ff; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 9px; font-weight: 600; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-yellow { background: #fef9c3; color: #a16207; }
    .badge-gray { background: #f3f4f6; color: #6b7280; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .summary-card { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px; padding: 14px; }
    .summary-card.green { background: linear-gradient(135deg, #11998e, #38ef7d); }
    .summary-card.blue { background: linear-gradient(135deg, #2193b0, #6dd5ed); }
    .summary-card.orange { background: linear-gradient(135deg, #f7971e, #ffd200); color: #333; }
    .summary-card h3 { font-size: 9px; opacity: 0.85; margin-bottom: 6px; }
    .summary-card .val { font-size: 20px; font-weight: 700; }
    .summary-card .sub { font-size: 9px; opacity: 0.75; margin-top: 3px; }
    .notice { background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px 12px; font-size: 10px; color: #78350f; border-radius: 0 4px 4px 0; margin-bottom: 16px; }
    .footer { text-align: center; color: #9ca3af; font-size: 9px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
    .progress-bar { background: #e5e7eb; border-radius: 999px; height: 6px; overflow: hidden; }
    .progress-fill { background: linear-gradient(to right, #4f46e5, #7c3aed); height: 100%; border-radius: 999px; }
  `;

  /* ─────────── 광고주용 PDF ─────────── */
  const downloadClientPDF = () => {
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>MANIA GROUP 광고주 제안서</title>
    <style>${PDF_STYLE}</style></head><body>
    <div class="page">
      <div class="cover">
        <h1>MANIA GROUP</h1>
        <div class="subtitle">전산업 비즈니스 & 마케팅 통합 솔루션 제안서</div>
        <div style="background:rgba(255,255,255,0.1);display:inline-block;padding:6px 14px;border-radius:20px;font-size:12px;margin-bottom:15px;">광고주 전용 자료</div>
        <div class="meta">
          <span>생성일: ${TODAY}</span>
          <span>대카테고리: 18개</span>
          <span>파트너사: ${partners.length}개</span>
          <span>인플루언서: ${influencers.length}명</span>
        </div>
      </div>

      <div class="notice">본 자료는 MANIA GROUP이 광고주님께 제공하는 서비스 안내 자료입니다. 가격 및 조건은 협의 가능합니다.</div>

      <!-- 요약 -->
      <div class="summary-grid">
        <div class="summary-card">
          <h3>제공 제품/서비스</h3>
          <div class="val">${products.length}개</div>
          <div class="sub">공구가능 ${products.filter(p => p.canGroup).length}개</div>
        </div>
        <div class="summary-card green">
          <h3>연계 인플루언서</h3>
          <div class="val">${influencers.length}명</div>
          <div class="sub">다플랫폼 운영</div>
        </div>
        <div class="summary-card blue">
          <h3>파트너/실행사</h3>
          <div class="val">${partners.length}개사</div>
          <div class="sub">검증된 실행 네트워크</div>
        </div>
        <div class="summary-card orange">
          <h3>누적 프로젝트</h3>
          <div class="val">${projects.length}개</div>
          <div class="sub">진행중 ${projects.filter(p => p.status === '진행중').length}개</div>
        </div>
      </div>

      <!-- 제품/서비스 -->
      <div class="section">
        <div class="section-title">제공 가능 제품 & 서비스</div>
        <table>
          <thead><tr>
            <th style="width:25%">제품명</th><th style="width:12%">브랜드</th>
            <th style="width:14%">카테고리</th><th style="width:12%">판매가</th>
            <th style="width:12%">공구가</th><th style="width:8%">공구</th>
            <th>설명</th>
          </tr></thead>
          <tbody>
            ${products.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.brand}</td>
              <td><span class="badge badge-blue">${p.category}</span></td>
              <td style="text-align:right">₩${(p.retailPrice || 0).toLocaleString()}</td>
              <td style="text-align:right;color:#15803d;font-weight:600">₩${(p.groupBuyPrice || 0).toLocaleString()}</td>
              <td style="text-align:center">${p.canGroup ? '<span class="badge badge-green">가능</span>' : '<span class="badge badge-gray">불가</span>'}</td>
              <td style="color:#6b7280">${p.description || '-'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 인플루언서 -->
      <div class="section">
        <div class="section-title">연계 인플루언서 네트워크</div>
        <table>
          <thead><tr>
            <th>이름</th><th>플랫폼</th><th>팔로워</th><th>참여율</th>
            <th>카테고리</th><th>전문 분야</th><th>포스팅 단가</th>
          </tr></thead>
          <tbody>
            ${influencers.map(i => `<tr>
              <td><strong>${i.name}</strong></td>
              <td><span class="badge badge-blue">${i.platform}</span></td>
              <td style="font-weight:600">${i.followers}</td>
              <td style="color:#15803d;font-weight:600">${i.engagement}</td>
              <td>${i.category}</td>
              <td style="color:#6b7280">${(i.specialty || []).join(', ')}</td>
              <td style="text-align:right">₩${(i.adFeePerPost || 0).toLocaleString()}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 파트너 -->
      <div class="section">
        <div class="section-title">파트너 / 실행사 네트워크</div>
        <table>
          <thead><tr><th>파트너명</th><th>카테고리</th><th>전문 분야</th><th>프로젝트</th><th>평점</th></tr></thead>
          <tbody>
            ${partners.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td><span class="badge badge-blue">${p.category}</span></td>
              <td>${(p.specialties || []).join(', ')}</td>
              <td style="text-align:center">${p.projectCount}건</td>
              <td style="text-align:center;color:#d97706;font-weight:700">★ ${p.rating}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">MANIA GROUP · 전산업 비즈니스 & 마케팅 통합 솔루션 · ${TODAY} 기준</div>
    </div></body></html>`;
    printHTML(html, `MANIA_광고주제안서_${TODAY_ISO}`);
  };

  /* ─────────── 실행사용 PDF ─────────── */
  const downloadPartnerPDF = () => {
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>MANIA GROUP 실행사 자료</title>
    <style>${PDF_STYLE}</style></head><body>
    <div class="page">
      <div class="cover">
        <h1>MANIA GROUP</h1>
        <div class="subtitle">실행사 파트너 공유 자료 (내부용)</div>
        <div style="background:rgba(255,200,0,0.2);display:inline-block;padding:6px 14px;border-radius:20px;font-size:12px;color:#fcd34d;margin-bottom:15px;">실행사 전용 · 기밀자료</div>
        <div class="meta">
          <span>생성일: ${TODAY}</span>
          <span>제품 수: ${products.length}개</span>
          <span>인플루언서: ${influencers.length}명</span>
        </div>
      </div>

      <div class="notice">본 자료는 파트너 실행사 전용 내부 공유 자료입니다. 외부 유출을 금지합니다.</div>

      <!-- 제품 수익 구조 -->
      <div class="section">
        <div class="section-title">제품 수익 구조 상세</div>
        <table>
          <thead><tr>
            <th>제품명</th><th>공급가</th><th>판매가</th><th>공구가</th>
            <th>마진율</th><th>인플루언서%</th><th>회사수익%</th><th>회사수익(건)</th><th>재고</th>
          </tr></thead>
          <tbody>
            ${products.map(p => `<tr>
              <td><strong>${p.name}</strong><br><span style="color:#6b7280;font-size:9px">${p.brand} · ${p.category}</span></td>
              <td style="text-align:right">₩${(p.supplyPrice || 0).toLocaleString()}</td>
              <td style="text-align:right">₩${(p.retailPrice || 0).toLocaleString()}</td>
              <td style="text-align:right;color:#15803d;font-weight:600">₩${(p.groupBuyPrice || 0).toLocaleString()}</td>
              <td style="text-align:center;font-weight:700;color:${(p.marginRate || 0) >= 50 ? '#15803d' : '#d97706'}">${p.marginRate}%</td>
              <td style="text-align:center;color:#7c3aed">${p.influencerFee}%</td>
              <td style="text-align:center;color:#1d4ed8;font-weight:700">${p.companyProfitRate}%</td>
              <td style="text-align:right;font-weight:600">₩${(p.companyProfit || 0).toLocaleString()}</td>
              <td style="text-align:center">${(p.stock || 0).toLocaleString()}개</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 인플루언서 단가표 -->
      <div class="section">
        <div class="section-title">인플루언서 단가 & 정산 정보</div>
        <table>
          <thead><tr>
            <th>이름</th><th>플랫폼</th><th>팔로워</th><th>참여율</th>
            <th>포스팅비</th><th>공구수수료</th><th>최소보장</th><th>정산방식</th><th>담당</th>
          </tr></thead>
          <tbody>
            ${influencers.map(i => `<tr>
              <td><strong>${i.name}</strong><br><span style="color:#6b7280;font-size:9px">${i.category}</span></td>
              <td><span class="badge badge-blue">${i.platform}</span></td>
              <td style="font-weight:600">${i.followers}</td>
              <td style="color:#15803d;font-weight:600">${i.engagement}</td>
              <td style="text-align:right">₩${(i.adFeePerPost || 0).toLocaleString()}</td>
              <td style="text-align:center;font-weight:600;color:#7c3aed">${i.groupBuyRate}%</td>
              <td style="text-align:right">₩${(i.minimumGuarantee || 0).toLocaleString()}</td>
              <td><span class="badge badge-gray">${i.settlementCycle}</span></td>
              <td style="color:#6b7280">${i.manager || '-'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 프로젝트 현황 -->
      <div class="section">
        <div class="section-title">프로젝트 진행 현황</div>
        <table>
          <thead><tr><th>프로젝트명</th><th>클라이언트</th><th>카테고리</th><th>상태</th><th>진행률</th><th>기간</th></tr></thead>
          <tbody>
            ${projects.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.client}</td>
              <td><span class="badge badge-blue">${p.subCategory}</span></td>
              <td><span class="badge ${p.status === '진행중' ? 'badge-blue' : p.status === '완료' ? 'badge-green' : 'badge-yellow'}">${p.status}</span></td>
              <td style="min-width:80px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${p.progress}%"></div></div>
                  <span style="font-weight:600;white-space:nowrap">${p.progress}%</span>
                </div>
              </td>
              <td style="font-size:9px;color:#6b7280">${p.startDate} ~ ${p.endDate}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">MANIA GROUP 내부 자료 · 실행사 전용 · ${TODAY} 기준 · 무단 외부 배포 금지</div>
    </div></body></html>`;
    printHTML(html, `MANIA_실행사자료_${TODAY_ISO}`);
  };

  /* ─────────── 종합 PDF ─────────── */
  const downloadFullPDF = () => {
    const totalPotential = products.reduce((s, p) => s + (p.companyProfit || 0) * (p.stock || 0), 0);
    const avgMargin = Math.round(products.reduce((s, p) => s + (p.marginRate || 0), 0) / products.length);

    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>MANIA GROUP 종합 보고서</title>
    <style>${PDF_STYLE}</style></head><body>
    <div class="page">
      <div class="cover">
        <h1>MANIA GROUP</h1>
        <div class="subtitle">종합 현황 보고서 — 전산업 비즈니스 & 마케팅</div>
        <div style="background:rgba(255,255,255,0.1);display:inline-block;padding:6px 14px;border-radius:20px;font-size:12px;margin-bottom:15px;">종합 리포트</div>
        <div class="meta">
          <span>생성일: ${TODAY}</span>
          <span>제품: ${products.length}개</span>
          <span>파트너: ${partners.length}개사</span>
          <span>인플루언서: ${influencers.length}명</span>
          <span>프로젝트: ${projects.length}개</span>
        </div>
      </div>

      <!-- 핵심 지표 -->
      <div class="summary-grid">
        <div class="summary-card">
          <h3>관리 제품 수</h3>
          <div class="val">${products.length}개</div>
          <div class="sub">평균마진 ${avgMargin}%</div>
        </div>
        <div class="summary-card green">
          <h3>재고 수익 잠재액</h3>
          <div class="val">₩${Math.round(totalPotential / 10000)}만</div>
          <div class="sub">재고 × 회사수익 기준</div>
        </div>
        <div class="summary-card blue">
          <h3>파트너 네트워크</h3>
          <div class="val">${partners.length}개사</div>
          <div class="sub">인플루언서 ${influencers.length}명</div>
        </div>
        <div class="summary-card orange">
          <h3>프로젝트 현황</h3>
          <div class="val">${projects.length}개</div>
          <div class="sub">진행중 ${projects.filter(p => p.status === '진행중').length}개</div>
        </div>
      </div>

      <!-- 제품 전체 -->
      <div class="section">
        <div class="section-title">제품 전체 현황</div>
        <table>
          <thead><tr>
            <th>제품명</th><th>브랜드</th><th>카테고리</th><th>공급가</th>
            <th>판매가</th><th>공구가</th><th>마진율</th><th>회사수익%</th><th>재고</th>
          </tr></thead>
          <tbody>
            ${products.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.brand}</td>
              <td><span class="badge badge-blue">${p.category}</span></td>
              <td style="text-align:right">₩${(p.supplyPrice || 0).toLocaleString()}</td>
              <td style="text-align:right">₩${(p.retailPrice || 0).toLocaleString()}</td>
              <td style="text-align:right;color:#15803d;font-weight:600">₩${(p.groupBuyPrice || 0).toLocaleString()}</td>
              <td style="text-align:center;font-weight:700;color:${(p.marginRate || 0) >= 50 ? '#15803d' : '#d97706'}">${p.marginRate}%</td>
              <td style="text-align:center;font-weight:700;color:#1d4ed8">${p.companyProfitRate}%</td>
              <td style="text-align:center">${(p.stock || 0).toLocaleString()}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 인플루언서 -->
      <div class="section">
        <div class="section-title">인플루언서 현황</div>
        <table>
          <thead><tr><th>이름</th><th>플랫폼</th><th>팔로워</th><th>참여율</th><th>카테고리</th><th>포스팅비</th><th>공구수수료</th></tr></thead>
          <tbody>
            ${influencers.map(i => `<tr>
              <td><strong>${i.name}</strong></td>
              <td><span class="badge badge-blue">${i.platform}</span></td>
              <td style="font-weight:600">${i.followers}</td>
              <td style="color:#15803d;font-weight:600">${i.engagement}</td>
              <td>${i.category}</td>
              <td style="text-align:right">₩${(i.adFeePerPost || 0).toLocaleString()}</td>
              <td style="text-align:center;font-weight:600">${i.groupBuyRate}%</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 파트너 -->
      <div class="section">
        <div class="section-title">파트너 / 실행사</div>
        <table>
          <thead><tr><th>파트너명</th><th>카테고리</th><th>전문 분야</th><th>프로젝트</th><th>평점</th></tr></thead>
          <tbody>
            ${partners.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td><span class="badge badge-blue">${p.category}</span></td>
              <td>${(p.specialties || []).join(', ')}</td>
              <td style="text-align:center">${p.projectCount}건</td>
              <td style="text-align:center;color:#d97706;font-weight:700">★ ${p.rating}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <!-- 프로젝트 -->
      <div class="section">
        <div class="section-title">프로젝트 전체 현황</div>
        <table>
          <thead><tr><th>프로젝트명</th><th>클라이언트</th><th>카테고리</th><th>상태</th><th>진행률</th><th>기간</th></tr></thead>
          <tbody>
            ${projects.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.client}</td>
              <td><span class="badge badge-blue">${p.category}</span></td>
              <td><span class="badge ${p.status === '진행중' ? 'badge-blue' : p.status === '완료' ? 'badge-green' : 'badge-yellow'}">${p.status}</span></td>
              <td style="min-width:80px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${p.progress}%"></div></div>
                  <span style="font-weight:600">${p.progress}%</span>
                </div>
              </td>
              <td style="font-size:9px;color:#6b7280">${p.startDate} ~ ${p.endDate}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">MANIA GROUP 종합 현황 보고서 · ${TODAY} 기준</div>
    </div></body></html>`;
    printHTML(html, `MANIA_종합보고서_${TODAY_ISO}`);
  };

  const printHTML = (html: string, _filename: string) => {
    const w = window.open('', '_blank', 'width=1000,height=800');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  };

  /* ─────────── 리포트 설정 ─────────── */
  const reports = [
    {
      type: 'client' as ReportType,
      title: '광고주 제안서',
      desc: '광고주에게 전달하기 위한 서비스 소개 자료입니다.\n가격 구조 내부 정보는 제외되며, 제품·인플루언서·파트너 네트워크를 소개합니다.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      tag: '외부 공유용',
      tagColor: 'bg-blue-500/20 text-blue-400',
      includes: ['제품 & 서비스 목록 (판매가/공구가)', '연계 인플루언서 프로필', '파트너/실행사 네트워크'],
      excludes: ['공급가', '마진율', '회사수익 구조', '인플루언서 정산 상세'],
      onExcel: downloadClientExcel,
      onPDF: downloadClientPDF,
    },
    {
      type: 'partner' as ReportType,
      title: '실행사 파트너 자료',
      desc: '실행사·파트너사에 공유하는 내부 자료입니다.\n수익 구조, 인플루언서 단가, 정산 조건 등 전체 정보가 포함됩니다.',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      tag: '내부/파트너 공유',
      tagColor: 'bg-purple-500/20 text-purple-400',
      includes: ['제품 수익 구조 (공급가·마진·회사수익)', '인플루언서 단가 & 정산 조건', '프로젝트 진행 현황'],
      excludes: [],
      onExcel: downloadPartnerExcel,
      onPDF: downloadPartnerPDF,
    },
    {
      type: 'full' as ReportType,
      title: '종합 현황 보고서',
      desc: '전체 데이터를 하나의 문서로 정리한 종합 보고서입니다.\n내부 경영 보고 및 전체 현황 파악용으로 사용하세요.',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      border: 'border-green-500/30',
      bg: 'bg-green-500/10',
      tag: '종합 내부 보고',
      tagColor: 'bg-green-500/20 text-green-400',
      includes: ['제품 전체 + 수익 구조', '인플루언서 전체 현황', '파트너 네트워크', '프로젝트 현황', '핵심 지표 요약'],
      excludes: [],
      onExcel: downloadFullExcel,
      onPDF: downloadFullPDF,
    },
  ];

  const selected = reports.find(r => r.type === selectedReport)!;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">리포트 & 내보내기</h1>
          <p className="text-gray-400 text-sm">광고주·실행사에게 전달할 자료를 생성하세요. PDF 또는 엑셀(CSV) 형식으로 다운로드합니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 리포트 선택 카드 */}
          <div className="lg:col-span-1 space-y-3">
            {reports.map(r => {
              const Icon = r.icon;
              const isSelected = selectedReport === r.type;
              return (
                <button key={r.type} onClick={() => setSelectedReport(r.type)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${isSelected ? `${r.bg} ${r.border} border-2` : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{r.title}</h3>
                        {isSelected && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      </div>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${r.tagColor}`}>{r.tag}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 선택된 리포트 상세 */}
          <div className="lg:col-span-2">
            <div className={`${selected.bg} border ${selected.border} rounded-2xl p-6`}>
              {/* 타이틀 */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${selected.color} rounded-xl flex items-center justify-center`}>
                  {(() => { const Icon = selected.icon; return <Icon className="w-6 h-6 text-white" />; })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selected.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selected.tagColor}`}>{selected.tag}</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-5 whitespace-pre-line">{selected.desc}</p>

              {/* 포함/미포함 항목 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 포함 항목
                  </p>
                  <ul className="space-y-1.5">
                    {selected.includes.map((item, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                {selected.excludes.length > 0 && (
                  <div className="bg-black/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                      <span className="w-3.5 h-3.5 inline-flex items-center justify-center text-xs">✕</span> 미포함 (외부 보호)
                    </p>
                    <ul className="space-y-1.5">
                      {selected.excludes.map((item, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 데이터 요약 */}
              <div className="grid grid-cols-3 gap-3 mb-6 bg-black/20 rounded-xl p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">제품</span>
                  </div>
                  <p className="text-lg font-bold">{products.length}개</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">인플루언서</span>
                  </div>
                  <p className="text-lg font-bold">{influencers.length}명</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FolderKanban className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">프로젝트</span>
                  </div>
                  <p className="text-lg font-bold">{projects.length}개</p>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={selected.onPDF}
                  className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r ${selected.color} rounded-xl font-semibold hover:scale-105 transition-all`}>
                  <Printer className="w-5 h-5" />
                  PDF 다운로드
                </button>
                <button onClick={selected.onExcel}
                  className="flex items-center justify-center gap-2 py-4 bg-green-600/80 hover:bg-green-600 rounded-xl font-semibold transition-all">
                  <FileSpreadsheet className="w-5 h-5" />
                  엑셀(CSV) 다운로드
                </button>
              </div>

              <p className="text-xs text-gray-600 text-center mt-3">
                PDF는 인쇄 미리보기 화면이 열립니다 · 엑셀은 Excel에서 열어 사용하세요
              </p>
            </div>

            {/* 빠른 다운로드 - 전체 */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-gray-400" /> 빠른 다운로드 — 전체 자료
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={downloadClientPDF}
                  className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-medium">광고주 PDF</span>
                </button>
                <button onClick={downloadPartnerPDF}
                  className="flex flex-col items-center gap-1.5 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-medium">실행사 PDF</span>
                </button>
                <button onClick={downloadFullPDF}
                  className="flex flex-col items-center gap-1.5 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-xs font-medium">종합 PDF</span>
                </button>
                <button onClick={downloadClientExcel}
                  className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-medium">광고주 엑셀</span>
                </button>
                <button onClick={downloadPartnerExcel}
                  className="flex flex-col items-center gap-1.5 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all">
                  <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-medium">실행사 엑셀</span>
                </button>
                <button onClick={downloadFullExcel}
                  className="flex flex-col items-center gap-1.5 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all">
                  <FileSpreadsheet className="w-5 h-5 text-green-400" />
                  <span className="text-xs font-medium">종합 엑셀</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
