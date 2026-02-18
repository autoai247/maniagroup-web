'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Star, Instagram, Youtube, TrendingUp, ExternalLink, Edit, Trash2, Building2, UserCheck, MessageCircle, DollarSign, BarChart3 } from 'lucide-react';
import influencersData from '@/data/influencers.json';

export default function InfluencersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const influencers = influencersData.influencers;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      default: return TrendingUp;
    }
  };

  const filteredInfluencers = influencers.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inf.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || inf.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">인플루언서 관리</h1>
            <p className="text-gray-400">전체 인플루언서: {influencers.length}명</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            인플루언서 등록
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
                placeholder="인플루언서명 또는 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 플랫폼</option>
                <option value="Instagram" className="bg-gray-800">Instagram</option>
                <option value="YouTube" className="bg-gray-800">YouTube</option>
                <option value="TikTok" className="bg-gray-800">TikTok</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">총 인플루언서</p>
            <p className="text-2xl font-bold">{influencers.length}명</p>
            <p className="text-xs text-gray-500 mt-1">활성 {influencers.filter(i => i.status === 'active').length}명</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수익 발생액</p>
            <p className="text-2xl font-bold text-blue-400">
              ₩{Math.round(influencers.reduce((sum, i) => sum + (i.totalRevenue || 0), 0) / 10000)}만
            </p>
            <p className="text-xs text-gray-500 mt-1">누적 프로젝트 기준</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수수료 지급액</p>
            <p className="text-2xl font-bold text-green-400">
              ₩{Math.round(influencers.reduce((sum, i) => sum + (i.totalCommission || 0), 0) / 10000)}만
            </p>
            <p className="text-xs text-gray-500 mt-1">정산 완료 기준</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">평균 평점</p>
            <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
              {(influencers.reduce((sum, i) => sum + i.rating, 0) / influencers.length).toFixed(1)}
              <Star className="w-4 h-4 fill-yellow-400" />
            </p>
            <p className="text-xs text-gray-500 mt-1">총 {influencers.reduce((sum, i) => sum + (i.totalProjects || 0), 0)}건 완료</p>
          </div>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => {
            const PlatformIcon = getPlatformIcon(influencer.platform);
            return (
              <div
                key={influencer.id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                {/* Header with Image */}
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  {influencer.image ? (
                    <Image
                      src={influencer.image}
                      alt={influencer.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold bg-gradient-to-br from-pink-500 to-purple-500">
                      {influencer.name.charAt(0)}
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">{influencer.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold mb-1">{influencer.name}</h3>
                {influencer.realName && (
                  <p className="text-sm text-gray-400 mb-2">({influencer.realName})</p>
                )}
                <p className="text-sm text-blue-400 mb-3 font-semibold">{influencer.category}</p>

                {/* Platform & Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{influencer.platform}</span>
                    </div>
                    <p className="font-semibold">{influencer.followers}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400 mb-1">참여율</p>
                    <p className="font-semibold">{influencer.engagement}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {influencer.specialty.slice(0, 3).map((spec, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Agency & Contract Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">소속:</span>
                    <span className="text-white font-medium">{influencer.agency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">계약:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      influencer.isExclusive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {influencer.isExclusive ? '전속' : '비전속'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">컨택:</span>
                    <span className="text-white font-medium">{influencer.contactMethod}</span>
                  </div>
                </div>

                {/* 수익 정보 */}
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" /> 수익 현황
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">총 발생 수익</p>
                      <p className="font-bold text-blue-400 text-sm">₩{((influencer.totalRevenue || 0) / 10000).toFixed(0)}만</p>
                    </div>
                    <div>
                      <p className="text-gray-500">총 수수료</p>
                      <p className="font-bold text-yellow-400 text-sm">₩{((influencer.totalCommission || 0) / 10000).toFixed(0)}만</p>
                    </div>
                    <div>
                      <p className="text-gray-500">포스팅 단가</p>
                      <p className="font-bold text-white">₩{(influencer.adFeePerPost || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">공구 수수료율</p>
                      <p className="font-bold text-green-400">{influencer.groupBuyRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">최소 보장액</p>
                      <p className="font-bold text-purple-400">₩{(influencer.minimumGuarantee || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">정산 방식</p>
                      <p className="font-bold text-white">{influencer.settlementCycle}</p>
                    </div>
                  </div>
                </div>

                {/* 프로젝트 통계 */}
                <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">완료 프로젝트</p>
                      <p className="font-semibold text-blue-400">{influencer.totalProjects || influencer.projects}건</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">담당 매니저</p>
                    <p className="text-xs font-medium text-white">{influencer.manager || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">상태</p>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                      {influencer.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {influencer.instagram && (
                    <a
                      href={influencer.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-all text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredInfluencers.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Platforms Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">공구 플랫폼</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {influencersData.platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold mb-1">{platform.name}</h3>
                  <p className="text-sm text-gray-400">{platform.type}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
