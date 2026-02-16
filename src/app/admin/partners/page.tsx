'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Mail, Phone, Globe, Tag, Star, Edit, Trash2, Eye } from 'lucide-react';
import categoriesData from '@/data/categories.json';
import realPartnersData from '@/data/real-partners.json';
import Link from 'next/link';

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // 실제 파트너 데이터 사용
  const partners = realPartnersData.partners;

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">파트너/실행사 관리</h1>
            <p className="text-gray-400">전체 파트너: {partners.length}개사</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            새 파트너 등록
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="파트너사명 또는 담당자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 카테고리</option>
                {categoriesData.categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-gray-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">활성 파트너</p>
            <p className="text-2xl font-bold">{partners.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">평균 평점</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              {(partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1)}
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">총 진행 프로젝트</p>
            <p className="text-2xl font-bold">{partners.reduce((sum, p) => sum + p.projectCount, 0)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">카테고리 수</p>
            <p className="text-2xl font-bold">{new Set(partners.map(p => p.category)).size}</p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl font-bold">
                  {partner.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{partner.rating}</span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
              <p className="text-sm text-blue-400 mb-3 font-semibold">{partner.category}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {partner.specialties.map((specialty, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{partner.website}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-gray-400 mb-1">담당자</p>
                  <p className="font-semibold">{partner.contact}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">프로젝트</p>
                  <p className="font-semibold text-blue-400">{partner.projectCount}개</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/partners/${partner.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
                >
                  <Eye className="w-4 h-4" />
                  상세
                </Link>
                <button
                  onClick={() => alert(`"${partner.name}" 파트너 정보를 수정합니다.`)}
                  className="flex items-center justify-center px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`"${partner.name}" 파트너를 삭제하시겠습니까?`)) {
                      alert('파트너가 삭제되었습니다.');
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
        {filteredPartners.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">새 파트너 등록</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">파트너사명</label>
                  <input
                    type="text"
                    placeholder="파트너사명을 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">카테고리</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="" className="bg-gray-800">카테고리 선택</option>
                    {categoriesData.categories.map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-gray-800">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">담당자</label>
                    <input
                      type="text"
                      placeholder="담당자명"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">연락처</label>
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">웹사이트</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert('파트너가 등록되었습니다! 설정 페이지에서 "분류 실행하기"를 눌러 자동 분류를 진행하세요.');
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
