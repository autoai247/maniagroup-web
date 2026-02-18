'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import {
  Plus, Search, Star, Instagram, Youtube, TrendingUp, ExternalLink,
  Edit, Trash2, DollarSign, List, LayoutGrid,
  ArrowUpDown, ChevronUp, ChevronDown, Eye, X, Phone
} from 'lucide-react';
import influencersData from '@/data/influencers.json';

type ViewMode = 'list' | 'grid';
type SortKey = 'name' | 'followers' | 'engagement' | 'adFeePerPost' | 'totalRevenue' | 'totalCommission' | 'groupBuyRate';

interface Influencer {
  id: number;
  name: string;
  realName: string;
  platform: string;
  category: string;
  followers: string;
  engagement: string;
  instagram?: string;
  youtube?: string;
  agency: string;
  isExclusive: boolean;
  contactMethod: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: string;
  projects: number;
  rating: number;
  specialty: string[];
  notes: string;
  image: string;
  thumbnail: string;
  adFeePerPost: number;
  commissionRate: number;
  groupBuyRate: number;
  minimumGuarantee: number;
  settlementCycle: string;
  accountBank: string;
  accountNumber: string;
  accountHolder: string;
  contractStart: string;
  contractEnd: string;
  autoRenewal: boolean;
  manager: string;
  totalProjects: number;
  totalRevenue: number;
  totalCommission: number;
}

interface NewInfluencer {
  name: string;
  realName: string;
  platform: string;
  category: string;
  followers: string;
  engagement: string;
  agency: string;
  isExclusive: boolean;
  instagram: string;
  youtube: string;
  phone: string;
  email: string;
  adFeePerPost: string;
  commissionRate: string;
  groupBuyRate: string;
  minimumGuarantee: string;
  settlementCycle: string;
  notes: string;
}

const EMPTY_FORM: NewInfluencer = {
  name: '', realName: '', platform: 'Instagram', category: '',
  followers: '', engagement: '', agency: '프리랜서', isExclusive: false,
  instagram: '', youtube: '', phone: '', email: '',
  adFeePerPost: '', commissionRate: '', groupBuyRate: '', minimumGuarantee: '',
  settlementCycle: '월말정산', notes: '',
};

const parseFollowers = (f: string) => {
  if (!f) return 0;
  if (f.includes('K')) return parseFloat(f) * 1000;
  if (f.includes('M')) return parseFloat(f) * 1000000;
  return parseFloat(f) || 0;
};
const parseEngagement = (e: string) => parseFloat(e?.replace('%', '') || '0');

export default function InfluencersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [influencerList, setInfluencerList] = useState<Influencer[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [form, setForm] = useState<NewInfluencer>(EMPTY_FORM);

  // 목록 초기화: JSON + localStorage 병합
  useEffect(() => {
    const deleted: number[] = JSON.parse(localStorage.getItem('influencer_deleted') || '[]');
    const additions: Influencer[] = JSON.parse(localStorage.getItem('influencer_additions') || '[]');

    const base = influencersData.influencers.map(inf => {
      const stored = localStorage.getItem(`influencer_${inf.id}`);
      return (stored ? JSON.parse(stored) : inf) as Influencer;
    });

    const all = [...base, ...additions].filter(inf => !deleted.includes(inf.id));
    setInfluencerList(all);
  }, []);

  const categories = Array.from(new Set(influencerList.map(i => i.category).filter(Boolean)));

  const filtered = influencerList
    .filter(i => {
      const matchSearch =
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.realName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform = selectedPlatform === 'all' || i.platform === selectedPlatform;
      const matchCategory = selectedCategory === 'all' || i.category === selectedCategory;
      return matchSearch && matchPlatform && matchCategory;
    })
    .sort((a, b) => {
      if (sortKey === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      let av = 0, bv = 0;
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

  const getPlatformIcon = (p: string) => {
    if (p === 'Instagram') return Instagram;
    if (p === 'YouTube') return Youtube;
    return TrendingUp;
  };

  const handleDelete = (inf: Influencer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`"${inf.name}" 을(를) 삭제하시겠습니까?`)) return;
    const deleted: number[] = JSON.parse(localStorage.getItem('influencer_deleted') || '[]');
    localStorage.setItem('influencer_deleted', JSON.stringify([...deleted, inf.id]));
    setInfluencerList(prev => prev.filter(i => i.id !== inf.id));
  };

  const handleRegister = () => {
    if (!form.name.trim()) return;
    const additions: Influencer[] = JSON.parse(localStorage.getItem('influencer_additions') || '[]');
    const newId = Date.now();
    const newInf: Influencer = {
      id: newId,
      name: form.name,
      realName: form.realName,
      platform: form.platform,
      category: form.category,
      followers: form.followers,
      engagement: form.engagement,
      agency: form.agency,
      isExclusive: form.isExclusive,
      instagram: form.instagram,
      youtube: form.youtube,
      phone: form.phone,
      email: form.email,
      contactMethod: form.instagram ? 'Instagram DM' : '전화',
      contactPerson: '',
      status: 'active',
      projects: 0,
      rating: 0,
      specialty: [],
      notes: form.notes,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&size=400&background=6366f1&color=ffffff&bold=true&font-size=0.4`,
      thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&size=200&background=6366f1&color=ffffff&bold=true&font-size=0.4`,
      adFeePerPost: Number(form.adFeePerPost) || 0,
      commissionRate: Number(form.commissionRate) || 0,
      groupBuyRate: Number(form.groupBuyRate) || 0,
      minimumGuarantee: Number(form.minimumGuarantee) || 0,
      settlementCycle: form.settlementCycle,
      accountBank: '',
      accountNumber: '',
      accountHolder: '',
      contractStart: new Date().toISOString().split('T')[0],
      contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      autoRenewal: false,
      manager: '',
      totalProjects: 0,
      totalRevenue: 0,
      totalCommission: 0,
    };
    localStorage.setItem('influencer_additions', JSON.stringify([...additions, newInf]));
    setInfluencerList(prev => [...prev, newInf]);
    setForm(EMPTY_FORM);
    setShowRegisterModal(false);
  };

  // 통계
  const totalRevenue = influencerList.reduce((s, i) => s + (i.totalRevenue || 0), 0);
  const totalCommission = influencerList.reduce((s, i) => s + (i.totalCommission || 0), 0);
  const avgRating = influencerList.length ? influencerList.reduce((s, i) => s + i.rating, 0) / influencerList.length : 0;
  const totalProjects = influencerList.reduce((s, i) => s + (i.totalProjects || i.projects || 0), 0);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold mb-1">인플루언서 관리</h1>
            <p className="text-gray-400 text-sm">
              전체 <span className="text-white font-semibold">{influencerList.length}명</span>
              {filtered.length !== influencerList.length && (
                <span className="text-blue-400"> · 필터됨 {filtered.length}명</span>
              )}
            </p>
          </div>
          <button
            onClick={() => { setForm(EMPTY_FORM); setShowRegisterModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> 인플루언서 등록
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 인플루언서</p>
            <p className="text-2xl font-bold">{influencerList.length}명</p>
            <p className="text-xs text-gray-500 mt-1">활성 {influencerList.filter(i => i.status === 'active').length}명 · {totalProjects}건</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수익 발생액</p>
            <p className="text-2xl font-bold text-blue-400">₩{Math.round(totalRevenue / 10000)}만</p>
            <p className="text-xs text-gray-500 mt-1">인플루언서별 누적</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수수료 지급</p>
            <p className="text-2xl font-bold text-green-400">₩{Math.round(totalCommission / 10000)}만</p>
            <p className="text-xs text-gray-500 mt-1">
              수익 대비 {totalRevenue ? Math.round(totalCommission / totalRevenue * 100) : 0}%
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">평균 평점</p>
            <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
              {avgRating.toFixed(1)} <Star className="w-4 h-4 fill-yellow-400" />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              평균단가 ₩{influencerList.length ? Math.round(influencerList.reduce((s, i) => s + (i.adFeePerPost || 0), 0) / influencerList.length / 10000) : 0}만
            </p>
          </div>
        </div>

        {/* 필터 & 뷰 토글 */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 카테고리 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all" className="bg-gray-800">전체 플랫폼</option>
            <option value="Instagram" className="bg-gray-800">Instagram</option>
            <option value="YouTube" className="bg-gray-800">YouTube</option>
            <option value="TikTok" className="bg-gray-800">TikTok</option>
          </select>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all" className="bg-gray-800">전체 카테고리</option>
            {categories.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
          </select>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 ml-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" /> 리스트
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" /> 카드
            </button>
          </div>
        </div>

        {/* 리스트 뷰 */}
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
                    <tr
                      key={inf.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin/influencers/${inf.id}`)}
                    >
                      <td className="px-4 py-3 text-gray-600 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                            <Image src={inf.image} alt={inf.name} fill className="object-cover" unoptimized />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{inf.name}</p>
                            <p className="text-xs text-gray-500">{inf.category || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs">
                          <PIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-300">{inf.platform}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{inf.followers || '-'}</td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-green-400 font-bold">{inf.engagement || '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        {inf.adFeePerPost ? `₩${inf.adFeePerPost.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-purple-400 font-bold">{inf.groupBuyRate ? `${inf.groupBuyRate}%` : '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="text-blue-400 font-bold">
                            {inf.totalRevenue ? `₩${Math.round(inf.totalRevenue / 10000)}만` : '-'}
                          </p>
                          <p className="text-xs text-gray-600">{inf.totalProjects || inf.projects}건</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden xl:table-cell">
                        <span className="text-yellow-400 font-semibold">
                          {inf.totalCommission ? `₩${Math.round(inf.totalCommission / 10000)}만` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${inf.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                          {inf.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => router.push(`/admin/influencers/${inf.id}`)}
                            className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/influencers/${inf.id}`)}
                            className="p-1.5 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(inf, e)}
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
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

        {/* 카드 뷰 */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(inf => {
              const PIcon = getPlatformIcon(inf.platform);
              return (
                <div
                  key={inf.id}
                  onClick={() => router.push(`/admin/influencers/${inf.id}`)}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="relative h-44 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Image src={inf.image} alt={inf.name} fill className="object-cover" unoptimized />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-xs">{inf.rating || '-'}</span>
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
                        <p className="text-xs text-blue-400 mt-0.5">{inf.category || '-'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                        <PIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-400">{inf.platform}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">팔로워</p>
                        <p className="font-bold text-sm">{inf.followers || '-'}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-0.5">참여율</p>
                        <p className="font-bold text-sm text-green-400">{inf.engagement || '-'}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-400" /> 수익 현황
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">총 수익</p>
                          <p className="font-bold text-blue-400">
                            {inf.totalRevenue ? `₩${Math.round(inf.totalRevenue / 10000)}만` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">수수료 지급</p>
                          <p className="font-bold text-yellow-400">
                            {inf.totalCommission ? `₩${Math.round(inf.totalCommission / 10000)}만` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">포스팅단가</p>
                          <p className="font-bold text-white">
                            {inf.adFeePerPost ? `₩${inf.adFeePerPost.toLocaleString()}` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">공구수수료</p>
                          <p className="font-bold text-green-400">{inf.groupBuyRate ? `${inf.groupBuyRate}%` : '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(inf.specialty || []).slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">{s}</span>
                      ))}
                    </div>

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      {inf.instagram && (
                        <a
                          href={inf.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-xs transition-colors"
                        >
                          <Instagram className="w-3.5 h-3.5" /> SNS
                        </a>
                      )}
                      <button
                        onClick={() => router.push(`/admin/influencers/${inf.id}`)}
                        className="p-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(inf, e)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      >
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
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 hover:border-white/30 rounded-xl p-3 flex items-center justify-between transition-all"
              >
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

      {/* 인플루언서 등록 모달 */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">인플루언서 등록</h2>
              <button onClick={() => setShowRegisterModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">활동명 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="예: 문핏"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">실명</label>
                  <input
                    type="text"
                    value={form.realName}
                    onChange={e => setForm({ ...form, realName: e.target.value })}
                    placeholder="예: 홍길동"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">플랫폼</label>
                  <select
                    value={form.platform}
                    onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Naver Blog</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">카테고리</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="예: 피트니스/헬스"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">팔로워</label>
                  <input
                    type="text"
                    value={form.followers}
                    onChange={e => setForm({ ...form, followers: e.target.value })}
                    placeholder="예: 52K"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">참여율</label>
                  <input
                    type="text"
                    value={form.engagement}
                    onChange={e => setForm({ ...form, engagement: e.target.value })}
                    placeholder="예: 8.5%"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">소속사</label>
                  <select
                    value={form.agency}
                    onChange={e => setForm({ ...form, agency: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>프리랜서</option>
                    <option>MCN 소속</option>
                    <option>연예기획사</option>
                    <option>소속사 협의</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isExclusive"
                    checked={form.isExclusive}
                    onChange={e => setForm({ ...form, isExclusive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isExclusive" className="text-sm text-gray-300 cursor-pointer">전속 계약</label>
                </div>
              </div>

              {/* 연락처 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">연락처</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">이메일</label>
                  <input
                    type="text"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Instagram URL</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={e => setForm({ ...form, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">YouTube URL</label>
                  <input
                    type="text"
                    value={form.youtube}
                    onChange={e => setForm({ ...form, youtube: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 수익 구조 */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-3 font-semibold">수익 구조</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">포스팅 단가 (원)</label>
                    <input
                      type="number"
                      value={form.adFeePerPost}
                      onChange={e => setForm({ ...form, adFeePerPost: e.target.value })}
                      placeholder="500000"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">최소 보장금 (원)</label>
                    <input
                      type="number"
                      value={form.minimumGuarantee}
                      onChange={e => setForm({ ...form, minimumGuarantee: e.target.value })}
                      placeholder="300000"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">공구 수수료율 (%)</label>
                    <input
                      type="number"
                      value={form.groupBuyRate}
                      onChange={e => setForm({ ...form, groupBuyRate: e.target.value })}
                      placeholder="23"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">협찬 수수료율 (%)</label>
                    <input
                      type="number"
                      value={form.commissionRate}
                      onChange={e => setForm({ ...form, commissionRate: e.target.value })}
                      placeholder="18"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">정산 주기</label>
                    <select
                      value={form.settlementCycle}
                      onChange={e => setForm({ ...form, settlementCycle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm focus:outline-none"
                    >
                      <option>월말정산</option>
                      <option>건별정산</option>
                      <option>분기정산</option>
                      <option>반기정산</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 메모 */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">메모</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="특이사항, 컨택 방법 등..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegister}
                  disabled={!form.name.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100"
                >
                  등록하기
                </button>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
