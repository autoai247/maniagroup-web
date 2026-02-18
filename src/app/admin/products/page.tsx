'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Plus, Search, Filter, Tag, Package, Edit, Trash2, Eye,
  CheckCircle, FileSpreadsheet, FileText, LayoutGrid, List,
  TrendingUp, ArrowUpDown, ChevronDown, ChevronUp, Upload,
  X, AlertCircle, Phone, Mail, Clock, ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import realPartnersData from '@/data/real-partners.json';

type ViewMode = 'list' | 'grid';
type SortKey = 'name' | 'retailPrice' | 'marginRate' | 'stock' | 'companyProfitRate';
type SortDir = 'asc' | 'desc';

interface NewProduct {
  name: string;
  brand: string;
  category: string;
  supplier: string;
  supplyPrice: string;
  retailPrice: string;
  groupBuyPrice: string;
  influencerFee: string;
  stock: string;
  moq: string;
  canGroup: boolean;
  image: string;
  description: string;
}

const EMPTY_PRODUCT: NewProduct = {
  name: '', brand: '', category: '', supplier: '더매니아 직영',
  supplyPrice: '', retailPrice: '', groupBuyPrice: '', influencerFee: '',
  stock: '', moq: '', canGroup: true, image: '', description: '',
};

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof realPartnersData.products[0] | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_PRODUCT);
  const [importText, setImportText] = useState('');

  const openDetail = (product: typeof realPartnersData.products[0]) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const products = realPartnersData.products;
  const categories = Array.from(new Set(products.map(p => p.category)));

  // 필터 + 정렬
  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0;
      if (sortKey === 'name') { av = a.name; bv = b.name; }
      else if (sortKey === 'retailPrice') { av = a.retailPrice || 0; bv = b.retailPrice || 0; }
      else if (sortKey === 'marginRate') { av = a.marginRate || 0; bv = b.marginRate || 0; }
      else if (sortKey === 'stock') { av = a.stock || 0; bv = b.stock || 0; }
      else if (sortKey === 'companyProfitRate') { av = a.companyProfitRate || 0; bv = b.companyProfitRate || 0; }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 text-gray-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />;
  };

  // 통계
  const totalRevenuePotential = products.reduce((s, p) => s + (p.companyProfit || 0) * (p.stock || 0), 0);
  const avgMargin = products.length ? Math.round(products.reduce((s, p) => s + (p.marginRate || 0), 0) / products.length) : 0;

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    const rows = [
      ['제품명', '브랜드', '카테고리', '공급사', '공급가', '판매가', '공구가', '마진율', '인플루언서%', '회사수익%', '재고', '최소주문', '공구가능', '상태'],
      ...filteredProducts.map(p => [
        p.name, p.brand, p.category, p.supplier,
        p.supplyPrice, p.retailPrice, p.groupBuyPrice,
        `${p.marginRate}%`, `${p.influencerFee}%`, `${p.companyProfitRate}%`,
        p.stock, p.moq, p.canGroup ? 'O' : 'X', p.status
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `제품목록_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // PDF 다운로드
  const handlePdfDownload = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>제품 목록</title>
    <style>body{font-family:'Malgun Gothic',sans-serif;padding:20px}h1{text-align:center;color:#333}
    table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}
    th,td{border:1px solid #ddd;padding:6px;text-align:left}
    th{background:#4f46e5;color:white}tr:nth-child(even){background:#f9f9f9}</style>
    </head><body><h1>MANIA GROUP - 제품 목록</h1>
    <p>생성일: ${new Date().toLocaleDateString('ko-KR')} | 총 ${filteredProducts.length}개</p>
    <table><thead><tr><th>제품명</th><th>브랜드</th><th>카테고리</th><th>공급가</th><th>판매가</th><th>공구가</th><th>마진율</th><th>회사수익률</th><th>재고</th><th>공구</th></tr></thead>
    <tbody>${filteredProducts.map(p => `<tr>
      <td>${p.name}</td><td>${p.brand}</td><td>${p.category}</td>
      <td>₩${(p.supplyPrice||0).toLocaleString()}</td><td>₩${(p.retailPrice||0).toLocaleString()}</td>
      <td>₩${(p.groupBuyPrice||0).toLocaleString()}</td><td>${p.marginRate}%</td>
      <td>${p.companyProfitRate}%</td><td>${p.stock}개</td><td>${p.canGroup?'O':'X'}</td>
    </tr>`).join('')}</tbody></table></body></html>`;
    const w = window.open('', '', 'width=1000,height=700');
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => { w.print(); w.close(); }, 300); }
  };

  // 신규 제품 마진 자동계산
  const calcMargin = (np: NewProduct) => {
    const supply = parseFloat(np.supplyPrice) || 0;
    const groupBuy = parseFloat(np.groupBuyPrice) || 0;
    const infFee = parseFloat(np.influencerFee) || 0;
    if (!supply || !groupBuy) return null;
    const margin = groupBuy - supply;
    const marginRate = Math.round((margin / groupBuy) * 100);
    const infAmt = Math.round(groupBuy * infFee / 100);
    const companyProfit = margin - infAmt;
    const companyRate = Math.round((companyProfit / groupBuy) * 100);
    return { margin, marginRate, infAmt, companyProfit, companyRate };
  };

  const calc = calcMargin(newProduct);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">제품 관리</h1>
            <p className="text-gray-400 text-sm">
              전체 <span className="text-white font-semibold">{products.length}개</span>
              {filteredProducts.length !== products.length && (
                <span className="text-blue-400"> · 필터됨 {filteredProducts.length}개</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all">
              <Upload className="w-4 h-4" /> 데이터 입력
            </button>
            <button onClick={handleExcelDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600/80 hover:bg-green-600 rounded-xl text-sm font-medium transition-all">
              <FileSpreadsheet className="w-4 h-4" /> 엑셀
            </button>
            <button onClick={handlePdfDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600/80 hover:bg-red-600 rounded-xl text-sm font-medium transition-all">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => { setNewProduct(EMPTY_PRODUCT); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
              <Plus className="w-4 h-4" /> 새 제품
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 제품</p>
            <p className="text-2xl font-bold">{products.length}개</p>
            <p className="text-xs text-gray-500 mt-1">판매중 {products.filter(p => p.status === '판매중').length}개</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">평균 마진율</p>
            <p className="text-2xl font-bold text-green-400">{avgMargin}%</p>
            <p className="text-xs text-gray-500 mt-1">공구가능 {products.filter(p => p.canGroup).length}개</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 재고</p>
            <p className="text-2xl font-bold text-yellow-400">{products.reduce((s, p) => s + (p.stock || 0), 0).toLocaleString()}개</p>
            <p className="text-xs text-gray-500 mt-1">카테고리 {categories.length}종</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">수익 잠재액</p>
            <p className="text-2xl font-bold text-purple-400">₩{Math.round(totalRevenuePotential / 10000)}만</p>
            <p className="text-xs text-gray-500 mt-1">재고 × 회사수익</p>
          </div>
        </div>

        {/* Filter & View Toggle Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* 검색 */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="제품명, 브랜드, 카테고리..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          {/* 카테고리 */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="all" className="bg-gray-800">전체 카테고리</option>
              {categories.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
            </select>
          </div>
          {/* 상태 */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="all" className="bg-gray-800">전체 상태</option>
            <option value="판매중" className="bg-gray-800">판매중</option>
            <option value="품절" className="bg-gray-800">품절</option>
            <option value="준비중" className="bg-gray-800">준비중</option>
          </select>
          {/* 뷰 토글 */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 ml-auto">
            <button onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              <List className="w-4 h-4" /> 리스트
            </button>
            <button onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              <LayoutGrid className="w-4 h-4" /> 카드
            </button>
          </div>
        </div>

        {/* ───── LIST VIEW ───── */}
        {viewMode === 'list' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium w-8">#</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                      제품명 <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">카테고리</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('retailPrice')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                      판매가 <SortIcon k="retailPrice" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">공구가</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('marginRate')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                      마진율 <SortIcon k="marginRate" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden xl:table-cell">
                    <button onClick={() => handleSort('companyProfitRate')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                      회사수익 <SortIcon k="companyProfitRate" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">
                    <button onClick={() => handleSort('stock')} className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                      재고 <SortIcon k="stock" />
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">공구</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, i) => (
                  <tr key={product.id}
                    onClick={() => openDetail(product)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-4 py-3 text-gray-600 text-xs">{i + 1}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                              <Package className="w-7 h-7 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight">{product.name}</p>
                          <p className="text-xs text-blue-400 mt-0.5">{product.brand}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold">₩{(product.retailPrice || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 hidden lg:table-cell">
                      ₩{(product.groupBuyPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${(product.marginRate || 0) >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {product.marginRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell">
                      <div className="text-right">
                        <span className="text-blue-400 font-semibold">{product.companyProfitRate}%</span>
                        <p className="text-xs text-gray-600">₩{(product.companyProfit || 0).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className={(product.stock || 0) < 100 ? 'text-orange-400' : 'text-white'}>
                        {(product.stock || 0).toLocaleString()}개
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.canGroup
                        ? <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">가능</span>
                        : <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-500 rounded-full">불가</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">{product.status}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDetail(product)}
                          className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => alert(`${product.name} 수정`)}
                          className="p-1.5 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => confirm(`"${product.name}" 삭제?`) && alert('삭제됨')}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-16 text-center text-gray-500">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* ───── GRID VIEW ───── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => openDetail(product)}
                className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all overflow-hidden group cursor-pointer">
                {/* Image */}
                <div className="relative h-40 bg-white/5">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <Package className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  {product.canGroup && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-semibold">공구</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-blue-400 mb-1">{product.brand}</p>
                  <p className="text-xs text-gray-500 mb-3">{product.category}</p>

                  <div className="grid grid-cols-3 gap-1 text-xs mb-3 bg-white/5 rounded-xl p-2">
                    <div className="text-center">
                      <p className="text-gray-500 mb-0.5">공급가</p>
                      <p className="font-semibold">₩{((product.supplyPrice || 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <p className="text-gray-500 mb-0.5">판매가</p>
                      <p className="font-semibold text-blue-400">₩{((product.retailPrice || 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-0.5">마진</p>
                      <p className="font-semibold text-green-400">{product.marginRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-500">회사수익</span>
                    <span className="font-bold text-purple-400">{product.companyProfitRate}% · ₩{(product.companyProfit || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openDetail(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors">
                      <Eye className="w-3 h-3" /> 상세
                    </button>
                    <button onClick={() => alert(`${product.name} 수정`)}
                      className="p-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button onClick={() => confirm(`삭제?`) && alert('삭제됨')}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* ───── 신규 제품 등록 모달 ───── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">새 제품 등록</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">제품명 *</label>
                    <input type="text" placeholder="ex. 모공 케어 팩" value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">브랜드 *</label>
                    <input type="text" placeholder="ex. 카오리온" value={newProduct.brand}
                      onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">카테고리</label>
                    <select value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="" className="bg-gray-800">선택</option>
                      {categories.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
                      <option value="기타" className="bg-gray-800">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">공급사</label>
                    <input type="text" value={newProduct.supplier}
                      onChange={e => setNewProduct({...newProduct, supplier: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-3 font-semibold">가격 정보 (원)</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">공급가 *</label>
                      <input type="number" placeholder="0" value={newProduct.supplyPrice}
                        onChange={e => setNewProduct({...newProduct, supplyPrice: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">판매가</label>
                      <input type="number" placeholder="0" value={newProduct.retailPrice}
                        onChange={e => setNewProduct({...newProduct, retailPrice: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">공구가 *</label>
                      <input type="number" placeholder="0" value={newProduct.groupBuyPrice}
                        onChange={e => setNewProduct({...newProduct, groupBuyPrice: e.target.value})}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">인플루언서 수수료 (%)</label>
                    <input type="number" placeholder="15" value={newProduct.influencerFee}
                      onChange={e => setNewProduct({...newProduct, influencerFee: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">재고 (개)</label>
                    <input type="number" placeholder="100" value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">최소주문 (개)</label>
                    <input type="number" placeholder="10" value={newProduct.moq}
                      onChange={e => setNewProduct({...newProduct, moq: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>

                {/* 자동 계산 미리보기 */}
                {calc && (
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-400" /> 수익 자동 계산
                    </p>
                    <div className="grid grid-cols-4 gap-3 text-center text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">마진</p>
                        <p className="font-bold text-green-400">₩{calc.margin.toLocaleString()}</p>
                        <p className="text-gray-600">{calc.marginRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">인플루언서</p>
                        <p className="font-bold text-yellow-400">₩{calc.infAmt.toLocaleString()}</p>
                        <p className="text-gray-600">{newProduct.influencerFee}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">회사수익</p>
                        <p className="font-bold text-blue-400">₩{calc.companyProfit.toLocaleString()}</p>
                        <p className="text-gray-600">{calc.companyRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">재고수익</p>
                        <p className="font-bold text-purple-400">
                          ₩{(calc.companyProfit * (parseInt(newProduct.stock) || 0)).toLocaleString()}
                        </p>
                        <p className="text-gray-600">잠재액</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">이미지 URL</label>
                  <input type="url" placeholder="https://..." value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newProduct.canGroup}
                    onChange={e => setNewProduct({...newProduct, canGroup: e.target.checked})}
                    className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-300">공동구매 가능</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { alert('제품이 등록되었습니다!'); setShowModal(false); }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:scale-105 transition-all">
                    등록하기
                  </button>
                  <button onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── 데이터 입력 모달 ───── */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold">데이터 입력 센터</h2>
                  <p className="text-xs text-gray-400 mt-1">새로운 제품/공급사 정보를 빠르게 정리하세요</p>
                </div>
                <button onClick={() => setShowImportModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 정보 정리 가이드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                  <p className="text-lg mb-1">📋</p>
                  <p className="text-xs font-semibold text-blue-400">CSV/엑셀 붙여넣기</p>
                  <p className="text-xs text-gray-500 mt-1">스프레드시트에서 바로 복사</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                  <p className="text-lg mb-1">✍️</p>
                  <p className="text-xs font-semibold text-purple-400">직접 입력</p>
                  <p className="text-xs text-gray-500 mt-1">한 줄씩 제품명, 가격 등</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                  <p className="text-lg mb-1">🤖</p>
                  <p className="text-xs font-semibold text-green-400">AI 자동 분류</p>
                  <p className="text-xs text-gray-500 mt-1">입력 후 카테고리 자동 분류</p>
                </div>
              </div>

              {/* 입력 형식 안내 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-300 mb-2">입력 형식 (쉼표 또는 탭으로 구분)</p>
                <p className="text-xs text-gray-500 font-mono bg-black/30 p-2 rounded-lg">
                  제품명, 브랜드, 공급가, 판매가, 공구가, 인플루언서%, 재고<br/>
                  ex) 모공케어팩, 카오리온, 8000, 20000, 14000, 15, 100
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">데이터 붙여넣기</label>
                <textarea
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={`제품명, 브랜드, 공급가, 판매가, 공구가, 인플루언서%, 재고\n모공케어팩, 카오리온, 8000, 20000, 14000, 15, 100\n시트마스크, JJ영, 8700, 22620, 16965, 20, 190`}
                  rows={8}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {importText.trim() && (
                <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-400 font-semibold">
                      {importText.trim().split('\n').filter(l => l.trim()).length}줄 감지됨
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      등록 후 제품 목록에 추가되고 AI가 카테고리를 자동 분류합니다.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    if (!importText.trim()) return;
                    alert(`${importText.trim().split('\n').filter(l => l.trim()).length}개 항목이 등록 대기 중입니다.\n실제 저장은 JSON/DB 연동 시 구현됩니다.`);
                    setImportText('');
                    setShowImportModal(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:scale-105 transition-all">
                  가져오기 실행
                </button>
                <button onClick={() => setShowImportModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ───── 제품 상세 모달 ───── */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 상단 이미지 */}
            <div className="relative h-56">
              {selectedProduct.image ? (
                <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover rounded-t-2xl" unoptimized />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-2xl flex items-center justify-center">
                  <Package className="w-16 h-16 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent rounded-t-2xl" />
              <button onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
              {selectedProduct.canGroup && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-500/90 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-semibold">공구 가능</span>
                </div>
              )}
              <div className="absolute bottom-4 left-5">
                <h2 className="text-xl font-bold leading-tight">{selectedProduct.name}</h2>
                <p className="text-blue-400 text-sm font-semibold">{selectedProduct.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{selectedProduct.category}</span>
                  <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">{selectedProduct.status}</span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* 설명 */}
              {selectedProduct.description && (
                <p className="text-sm text-gray-300 bg-white/5 rounded-xl p-3">{selectedProduct.description}</p>
              )}

              {/* 가격 구조 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-400" /> 가격 구조
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">공급가</p>
                    <p className="text-lg font-bold">₩{(selectedProduct.supplyPrice || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">판매가</p>
                    <p className="text-lg font-bold text-blue-400">₩{(selectedProduct.retailPrice || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">공구가</p>
                    <p className="text-lg font-bold text-green-400">₩{(selectedProduct.groupBuyPrice || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 수익 구조 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> 수익 구조
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">마진</p>
                    <p className="text-xl font-bold text-green-400">₩{(selectedProduct.margin || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">마진율 {selectedProduct.marginRate}%</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">인플루언서 수수료</p>
                    <p className="text-xl font-bold text-yellow-400">₩{(selectedProduct.influencerAmount || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedProduct.influencerFee}% 적용</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">회사 수익 (건당)</p>
                    <p className="text-xl font-bold text-blue-400">₩{(selectedProduct.companyProfit || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">수익률 {selectedProduct.companyProfitRate}%</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">재고 수익 잠재액</p>
                    <p className="text-xl font-bold text-purple-400">
                      ₩{((selectedProduct.companyProfit || 0) * (selectedProduct.stock || 0)).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">재고 {selectedProduct.stock}개 기준</p>
                  </div>
                </div>
              </div>

              {/* 재고 & 주문 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" /> 재고 & 주문 정보
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '현재 재고', value: `${selectedProduct.stock}개` },
                    { label: '최소 주문량', value: `${selectedProduct.moq}개` },
                    { label: '공구 최소수량', value: `${selectedProduct.groupMinQty}개` },
                    { label: '리드타임', value: selectedProduct.leadTime },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 공급사 정보 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> 공급사 정보
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">공급사</span>
                    <span className="font-medium">{selectedProduct.supplier}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 연락처</span>
                    <span className="font-medium">{selectedProduct.supplierContact}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> 이메일</span>
                    <span className="font-medium">{selectedProduct.supplierEmail}</span>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-sm transition-all">
                  닫기
                </button>
                <button onClick={() => alert('수정 기능 연동 예정')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:scale-105 transition-all">
                  정보 수정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
