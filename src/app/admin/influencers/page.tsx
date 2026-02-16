'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Star, Instagram, Youtube, TrendingUp, ExternalLink, Mail, Phone, Edit, Trash2, Building2, UserCheck, MessageCircle } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">총 인플루언서</p>
            <p className="text-2xl font-bold">{influencers.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">진행 프로젝트</p>
            <p className="text-2xl font-bold text-blue-400">{influencers.reduce((sum, i) => sum + i.projects, 0)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">평균 평점</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              {(influencers.reduce((sum, i) => sum + i.rating, 0) / influencers.length).toFixed(1)}
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">이번 달 신규</p>
            <p className="text-2xl font-bold text-green-400">+0</p>
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

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">진행 프로젝트</p>
                    <p className="font-semibold text-blue-400">{influencer.projects}개</p>
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
