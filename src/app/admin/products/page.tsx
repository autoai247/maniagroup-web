'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Filter, Tag, Package, Edit, Trash2, Eye, CheckCircle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import Image from 'next/image';
import realPartnersData from '@/data/real-partners.json';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // 실제 제품 데이터 사용
  const products = realPartnersData.products;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  // 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    const csvData = [
      ['제품명', '브랜드', '카테고리', '공급사', '가격', '상태', '공구가능'],
      ...filteredProducts.map(p => [
        p.name,
        p.brand,
        p.category,
        p.supplier,
        p.price || '상세문의',
        p.status,
        p.canGroup ? 'O' : 'X'
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell =>
      `"${String(cell).replace(/"/g, '""')}"`
    ).join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `제품목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // PDF 다운로드 함수 (간단한 HTML to PDF)
  const handlePdfDownload = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>제품 목록</title>
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #667eea; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>MANIA GROUP - 제품 목록</h1>
        <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
        <table>
          <thead>
            <tr>
              <th>제품명</th>
              <th>브랜드</th>
              <th>카테고리</th>
              <th>공급사</th>
              <th>가격</th>
              <th>공구가능</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProducts.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.brand}</td>
                <td>${p.category}</td>
                <td>${p.supplier}</td>
                <td>${p.price || '상세문의'}</td>
                <td>${p.canGroup ? 'O' : 'X'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">제품 관리</h1>
            <p className="text-gray-400">전체 제품: {products.length}개</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExcelDownload}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all"
            >
              <FileSpreadsheet className="w-5 h-5" />
              엑셀 다운로드
            </button>
            <button
              onClick={handlePdfDownload}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all"
            >
              <FileText className="w-5 h-5" />
              PDF 다운로드
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              새 제품 등록
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="제품명 또는 브랜드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 카테고리</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20">
            <p className="text-sm text-gray-400 mb-1">총 제품 수</p>
            <p className="text-3xl font-bold">{products.length}개</p>
            <p className="text-xs text-gray-500 mt-1">판매중: {products.filter(p => p.status === '판매중').length}개</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-xl p-4 border border-green-500/20">
            <p className="text-sm text-gray-400 mb-1">평균 마진율</p>
            <p className="text-3xl font-bold text-green-400">
              {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + (p.marginRate || 0), 0) / products.length) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">총 마진: ₩{products.reduce((sum, p) => sum + (p.margin || 0) * (p.stock || 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/20">
            <p className="text-sm text-gray-400 mb-1">총 재고 가치</p>
            <p className="text-3xl font-bold text-yellow-400">
              ₩{Math.round(products.reduce((sum, p) => sum + (p.supplyPrice || 0) * (p.stock || 0), 0) / 10000)}만
            </p>
            <p className="text-xs text-gray-500 mt-1">재고: {products.reduce((sum, p) => sum + (p.stock || 0), 0).toLocaleString()}개</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-lg rounded-xl p-4 border border-pink-500/20">
            <p className="text-sm text-gray-400 mb-1">공구 가능</p>
            <p className="text-3xl font-bold text-pink-400">{products.filter(p => p.canGroup).length}개</p>
            <p className="text-xs text-gray-500 mt-1">카테고리: {categories.length}개</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
            >
              {/* Image */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-white/5">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                    <Package className="w-16 h-16 text-white/50" />
                  </div>
                )}
                {product.canGroup && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-xs">공구가능</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-blue-400 mb-1 font-semibold">{product.brand}</p>
              <p className="text-xs text-gray-400 mb-3">{product.category}</p>

              {/* Pricing Details */}
              <div className="space-y-2 mb-4">
                {/* 가격 정보 */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 border border-blue-500/20">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400 mb-1">공급가</p>
                      <p className="font-bold text-white">₩{product.supplyPrice?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">판매가</p>
                      <p className="font-bold text-blue-400">₩{product.retailPrice?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">공구가</p>
                      <p className="font-bold text-green-400">₩{product.groupBuyPrice?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                {/* 수익 정보 */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-3 border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">마진</span>
                    <span className="text-sm font-bold text-green-400">
                      ₩{product.margin?.toLocaleString() || '0'} ({product.marginRate || 0}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">인플루언서</span>
                    <span className="text-sm font-bold text-yellow-400">
                      ₩{product.influencerAmount?.toLocaleString() || '0'} ({product.influencerFee || 0}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">회사 수익</span>
                    <span className="text-sm font-bold text-blue-400">
                      ₩{product.companyProfit?.toLocaleString() || '0'} ({product.companyProfitRate || 0}%)
                    </span>
                  </div>
                </div>

                {/* 재고 정보 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400 mb-1">재고</p>
                    <p className="text-sm font-bold">{product.stock || 0}개</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400 mb-1">최소주문</p>
                    <p className="text-sm font-bold">{product.moq || 0}개</p>
                  </div>
                </div>
              </div>

              {/* Supplier */}
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">{product.supplier}</span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-center text-sm font-semibold">
                  {product.status}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`"${product.name}" 제품 상세 정보를 확인합니다.`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
                >
                  <Eye className="w-4 h-4" />
                  상세
                </button>
                <button
                  onClick={() => alert(`"${product.name}" 제품 정보를 수정합니다.`)}
                  className="flex items-center justify-center px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`"${product.name}" 제품을 삭제하시겠습니까?`)) {
                      alert('제품이 삭제되었습니다.');
                    }
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">새 제품 등록</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">제품명</label>
                  <input
                    type="text"
                    placeholder="제품명을 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">브랜드</label>
                    <input
                      type="text"
                      placeholder="브랜드명"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">카테고리</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="" className="bg-gray-800">선택</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">가격</label>
                  <input
                    type="text"
                    placeholder="가격 정보"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">이미지 URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 accent-green-500" />
                    <span className="text-sm font-medium text-gray-300">공동구매 가능</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert('제품이 등록되었습니다! 설정 페이지에서 "분류 실행하기"를 눌러 자동 분류를 진행하세요.');
                      setShowModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
                  >
                    등록하기
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
