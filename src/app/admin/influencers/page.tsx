'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import {
  Plus, Search, Star, Instagram, Youtube, TrendingUp, ExternalLink,
  Edit, Trash2, Building2, UserCheck, MessageCircle, DollarSign,
  Phone, List, LayoutGrid, ArrowUpDown, ChevronUp, ChevronDown,
  X, Eye, CreditCard, BarChart2
} from 'lucide-react';
import influencersData from '@/data/influencers.json';

type ViewMode = 'list' | 'grid';
type SortKey = 'name' | 'followers' | 'engagement' | 'adFeePerPost' | 'totalRevenue' | 'totalCommission' | 'groupBuyRate';

// 팔로워 숫자로 변환 (정렬용)
const parseFollowers = (f: string) => {
  if (!f) return 0;
  if (f.includes('K')) return parseFloat(f) * 1000;
  if (f.includes('M')) return parseFloat(f) * 1000000;
  return parseFloat(f) || 0;
};
const parseEngagement = (e: string) => parseFloat(e?.replace('%', '') || '0');

export default function InfluencersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedInfluencer, setSelectedInfluencer] = useState<typeof influencers[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const influencers = influencersData.influencers;

  const filtered = influencers
    .filter(i => {
      const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform = selectedPlatform === 'all' || i.platform === selectedPlatform;
      return matchSearch && matchPlatform;
    })
    .sort((a, b) => {
      let av: number = 0, bv: number = 0;
      if (sortKey === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortKey === 'followers') { av = parseFollowers(a.followers); bv = parseFollowers(b.followers); }
      else if (sortKey === 'engagement') { av = parseEngagement(a.engagement); bv = parseEngagement(b.engagement); }
      else if (sortKey === 'adFeePerPost') { av = a.adFeePerPost || 0; bv = b.adFeePerPost || 0; }
      else if (sortKey === 'totalRevenue') { av = a.totalRevenue || 0; bv = b.totalRevenue || 0; }
      else if (sortKey === 'totalCommission') { av = a.totalCommission || 0; bv = b.totalCommission || 0; }
      else if (sortKey === 'groupBuyRate') { av = a.groupBuyRate || 0; bv = b.groupBuyRate || 0; }
      return sortDir === 'asc' ? av - bv : bv - av;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 text-gray-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />;
  };

  const openDetail = (inf: typeof influencers[0]) => {
    setSelectedInfluencer(inf);
    setShowModal(true);
  };

  const getPlatformIcon = (p: string) => {
    if (p === 'Instagram') return Instagram;
    if (p === 'YouTube') return Youtube;
    return TrendingUp;
  };

  // 전체 통계
  const totalRevenue = influencers.reduce((s, i) => s + (i.totalRevenue || 0), 0);
  const totalCommission = influencers.reduce((s, i) => s + (i.totalCommission || 0), 0);
  const avgRating = influencers.reduce((s, i) => s + i.rating, 0) / influencers.length;
  const totalProjects = influencers.reduce((s, i) => s + (i.totalProjects || i.projects || 0), 0);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold mb-1">인플루언서 관리</h1>
            <p className="text-gray-400 text-sm">전체 <span className="text-white font-semibold">{influencers.length}명</span>
              {filtered.length !== influencers.length && <span className="text-blue-400"> · 필터됨 {filtered.length}명</span>}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
            <Plus className="w-4 h-4" /> 인플루언서 등록
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 인플루언서</p>
            <p className="text-2xl font-bold">{influencers.length}명</p>
            <p className="text-xs text-gray-500 mt-1">활성 {influencers.filter(i => i.status === 'active').length}명 · 완료 {totalProjects}건</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수익 발생액</p>
            <p className="text-2xl font-bold text-blue-400">₩{Math.round(totalRevenue / 10000)}만</p>
            <p className="text-xs text-gray-500 mt-1">인플루언서별 누적</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수수료 지급</p>
            <p className="text-2xl font-bold text-green-400">₩{Math.round(totalCommission / 10000)}만</p>
            <p className="text-xs text-gray-500 mt-1">수익 대비 {Math.round(totalCommission / totalRevenue * 100)}%</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">평균 평점</p>
            <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
              {avgRating.toFixed(1)} <Star className="w-4 h-4 fill-yellow-400" />
            </p>
            <p className="text-xs text-gray-500 mt-1">포스팅 평균 ₩{Math.round(influencers.reduce((s,i)=>s+(i.adFeePerPost||0),0)/influencers.length/10000)}만</p>
          </div>
        </div>

        {/* 필터 & 뷰 토글 */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="이름, 카테고리 검색..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <select value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="all" className="bg-gray-800">전체 플랫폼</option>
            <option value="Instagram" className="bg-gray-800">Instagram</option>
            <option value="YouTube" className="bg-gray-800">YouTube</option>
            <option value="TikTok" className="bg-gray-800">TikTok</option>
          </select>
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

        {/* ───── 리스트 뷰 ───── */}
        {viewMode === 'list' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium w-8">#</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-white">
                      인플루언서 <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">플랫폼</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('followers')} className="flex items-center gap-1 hover:text-white ml-auto">
                      팔로워 <SortIcon k="followers" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">
                    <button onClick={() => handleSort('engagement')} className="flex items-center gap-1 hover:text-white ml-auto">
                      참여율 <SortIcon k="engagement" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">
                    <button onClick={() => handleSort('adFeePerPost')} className="flex items-center gap-1 hover:text-white ml-auto">
                      포스팅단가 <SortIcon k="adFeePerPost" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('groupBuyRate')} className="flex items-center gap-1 hover:text-white ml-auto">
                      공구수수료 <SortIcon k="groupBuyRate" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">
                    <button onClick={() => handleSort('totalRevenue')} className="flex items-center gap-1 hover:text-white ml-auto">
                      총수익 <SortIcon k="totalRevenue" />
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium hidden xl:table-cell">
                    <button onClick={() => handleSort('totalCommission')} className="flex items-center gap-1 hover:text-white ml-auto">
                      수수료지급 <SortIcon k="totalCommission" />
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inf, i) => {
                  const PIcon = getPlatformIcon(inf.platform);
                  return (
                    <tr key={inf.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => openDetail(inf)}>
                      <td className="px-4 py-3 text-gray-600 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                            {inf.image ? (
                              <Image src={inf.image} alt={inf.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-sm">
                                {inf.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{inf.name}</p>
                            <p className="text-xs text-gray-500">{inf.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs">
                          <PIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-300">{inf.platform}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{inf.followers}</td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-green-400 font-bold">{inf.engagement}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        ₩{(inf.adFeePerPost || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-purple-400 font-bold">{inf.groupBuyRate}%</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="text-blue-400 font-bold">₩{Math.round((inf.totalRevenue || 0) / 10000)}만</p>
                          <p className="text-xs text-gray-600">{inf.totalProjects || inf.projects}건</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden xl:table-cell">
                        <span className="text-yellow-400 font-semibold">₩{Math.round((inf.totalCommission || 0) / 10000)}만</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${inf.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                          {inf.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openDetail(inf)} className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-500">검색 결과가 없습니다.</div>
            )}
          </div>
        )}

        {/* ───── 카드 뷰 ───── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(inf => {
              const PIcon = getPlatformIcon(inf.platform);
              return (
                <div key={inf.id} onClick={() => openDetail(inf)}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group overflow-hidden">
                  {/* 이미지 */}
                  <div className="relative h-44 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {inf.image ? (
                      <Image src={inf.image} alt={inf.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white/30">
                        {inf.name[0]}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-xs">{inf.rating}</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inf.status === 'active' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
                        {inf.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-base">{inf.name}</h3>
                        {inf.realName && <p className="text-xs text-gray-400">({inf.realName})</p>}
                        <p className="text-xs text-blue-400 mt-0.5">{inf.category}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                        <PIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-400">{inf.platform}</span>
                      </div>
                    </div>

                    {/* 팔로워/참여율 */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">팔로워</p>
                        <p className="font-bold text-sm">{inf.followers}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">참여율</p>
                        <p className="font-bold text-sm text-green-400">{inf.engagement}</p>
                      </div>
                    </div>

                    {/* 수익 정보 */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-400" /> 수익 현황
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">총 수익</p>
                          <p className="font-bold text-blue-400">₩{Math.round((inf.totalRevenue || 0) / 10000)}만</p>
                        </div>
                        <div>
                          <p className="text-gray-500">수수료 지급</p>
                          <p className="font-bold text-yellow-400">₩{Math.round((inf.totalCommission || 0) / 10000)}만</p>
                        </div>
                        <div>
                          <p className="text-gray-500">포스팅단가</p>
                          <p className="font-bold text-white">₩{(inf.adFeePerPost || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">공구수수료</p>
                          <p className="font-bold text-green-400">{inf.groupBuyRate}%</p>
                        </div>
                      </div>
                    </div>

                    {/* 전문분야 태그 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(inf.specialty || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">{s}</span>
                      ))}
                    </div>

                    {/* 액션 */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      {inf.instagram && (
                        <a href={inf.instagram} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs transition-colors">
                          <Instagram className="w-3.5 h-3.5" /> SNS
                        </a>
                      )}
                      <button className="p-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 공구 플랫폼 */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">공구 플랫폼</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {influencersData.platforms.map(p => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 hover:border-white/30 rounded-xl p-3 flex items-center justify-between transition-all">
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.fee !== '미정' ? `수수료 ${p.fee}` : p.type}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ───── 상세 모달 ───── */}
      {showModal && selectedInfluencer && (() => {
        const inf = selectedInfluencer;
        const PIcon = getPlatformIcon(inf.platform);
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* 상단 이미지 + 기본 정보 */}
              <div className="relative h-52">
                {inf.image ? (
                  <Image src={inf.image} alt={inf.name} fill className="object-cover rounded-t-2xl" unoptimized />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-500 rounded-t-2xl flex items-center justify-center text-6xl font-bold text-white/30">
                    {inf.name[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent rounded-t-2xl" />
                <button onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold">{inf.name}</h2>
                  {inf.realName && <p className="text-gray-300 text-sm">실명: {inf.realName}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
                      <PIcon className="w-3 h-3" />{inf.platform}
                    </span>
                    <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">{inf.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${inf.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'}`}>
                      {inf.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* 채널 지표 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> 채널 지표
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">팔로워</p>
                      <p className="text-lg font-bold">{inf.followers}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">참여율</p>
                      <p className="text-lg font-bold text-green-400">{inf.engagement}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">평점</p>
                      <p className="text-lg font-bold text-yellow-400 flex items-center justify-center gap-1">
                        {inf.rating} <Star className="w-4 h-4 fill-yellow-400" />
                      </p>
                    </div>
                  </div>
                </div>

                {/* 수익 & 단가 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" /> 수익 & 단가 정보
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">총 발생 수익</p>
                      <p className="text-xl font-bold text-blue-400">₩{(inf.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">총 수수료 지급</p>
                      <p className="text-xl font-bold text-yellow-400">₩{(inf.totalCommission || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">포스팅 단가</p>
                      <p className="text-lg font-bold">₩{(inf.adFeePerPost || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">공구 수수료율</p>
                      <p className="text-lg font-bold text-green-400">{inf.groupBuyRate}%</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">최소 보장액</p>
                      <p className="text-lg font-bold text-purple-400">₩{(inf.minimumGuarantee || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">정산 방식</p>
                      <p className="text-lg font-bold">{inf.settlementCycle}</p>
                    </div>
                  </div>
                </div>

                {/* 계약 & 연락 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 계약 & 연락처
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-2"><Building2 className="w-4 h-4" /> 소속</span>
                      <span className="font-medium">{inf.agency}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-2"><UserCheck className="w-4 h-4" /> 계약 형태</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${inf.isExclusive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {inf.isExclusive ? '전속' : '비전속'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> 컨택 방법</span>
                      <span className="font-medium">{inf.contactMethod}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> 연락처</span>
                      <span className="font-medium">{inf.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">담당 매니저</span>
                      <span className="font-medium">{inf.manager || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">완료 프로젝트</span>
                      <span className="font-bold text-blue-400">{inf.totalProjects || inf.projects}건</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-400">계약 기간</span>
                      <span className="font-medium text-xs">{inf.contractStart} ~ {inf.contractEnd}</span>
                    </div>
                  </div>
                </div>

                {/* 전문 분야 */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">전문 분야</p>
                  <div className="flex flex-wrap gap-2">
                    {(inf.specialty || []).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">{s}</span>
                    ))}
                  </div>
                </div>

                {/* 메모 */}
                {inf.notes && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">메모</p>
                    <p className="text-sm text-gray-300">{inf.notes}</p>
                  </div>
                )}

                {/* SNS 버튼 */}
                {inf.instagram && (
                  <a href={inf.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-all">
                    <Instagram className="w-5 h-5" /> Instagram 바로가기
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </AdminLayout>
  );
}
