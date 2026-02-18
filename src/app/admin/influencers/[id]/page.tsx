'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import {
  ArrowLeft, Edit2, Save, X, Plus, ExternalLink,
  Instagram, Youtube, Globe, Phone, Mail,
  Star, Users, TrendingUp, DollarSign,
  CreditCard, FileText, UserCheck,
  CheckCircle, Hash, MessageCircle,
  Calendar, RefreshCw, Briefcase
} from 'lucide-react';
import influencersData from '@/data/influencers.json';

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

export default function InfluencerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const influencerId = Number(params.id);

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<Influencer | null>(null);
  const [saveNotice, setSaveNotice] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`influencer_${influencerId}`);
    let base = influencersData.influencers.find((i) => i.id === influencerId) as Influencer | undefined;
    if (stored) {
      base = JSON.parse(stored) as Influencer;
    }
    if (base) {
      setInfluencer(base);
      setDraft(JSON.parse(JSON.stringify(base)));
    }
  }, [influencerId]);

  const saveInfluencer = useCallback(() => {
    if (!draft) return;
    localStorage.setItem(`influencer_${influencerId}`, JSON.stringify(draft));
    setInfluencer(draft);
    setEditMode(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  }, [draft, influencerId]);

  const cancelEdit = () => {
    setDraft(influencer ? JSON.parse(JSON.stringify(influencer)) : null);
    setEditMode(false);
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim() || !draft) return;
    if (!draft.specialty.includes(newSpecialty.trim())) {
      setDraft({ ...draft, specialty: [...draft.specialty, newSpecialty.trim()] });
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (tag: string) => {
    if (!draft) return;
    setDraft({ ...draft, specialty: draft.specialty.filter((t) => t !== tag) });
  };

  if (!influencer || !draft) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">인플루언서를 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  const d = editMode ? draft : influencer;
  const formatWon = (n: number) => `₩${n.toLocaleString()}`;
  const netRevenue = (d.totalRevenue || 0) - (d.totalCommission || 0);

  const Field = ({
    label,
    value,
    editVal,
    onChange,
    type = 'text',
    placeholder = '',
  }: {
    label: string;
    value: string | number | boolean;
    editVal?: string | number;
    onChange?: (v: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      {editMode && onChange ? (
        <input
          type={type}
          value={editVal !== undefined ? editVal : String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      ) : (
        <p className="text-sm font-medium text-white">{String(value) || '-'}</p>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        {/* 저장 알림 */}
        {saveNotice && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl shadow-xl">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">저장되었습니다!</span>
          </div>
        )}

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm text-gray-400">인플루언서 관리</p>
              <h1 className="text-xl font-bold">{influencer.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" /> 취소
                </button>
                <button
                  onClick={saveInfluencer}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium"
                >
                  <Save className="w-4 h-4" /> 저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium"
              >
                <Edit2 className="w-4 h-4" /> 편집
              </button>
            )}
          </div>
        </div>

        {/* 프로필 헤더 카드 */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-5">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
              <Image
                src={editMode ? draft.image : influencer.image}
                alt={influencer.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-2xl font-bold">{d.name}</h2>
                {d.realName && <span className="text-gray-400 text-sm">({d.realName})</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  d.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {d.status === 'active' ? '활성' : '비활성'}
                </span>
                {d.isExclusive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">전속</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-3">{d.category} · {d.platform} · {d.agency}</p>

              {/* 주요 지표 */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="font-bold">{d.followers}</span>
                  <span className="text-gray-500 text-xs">팔로워</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-green-400">{d.engagement}</span>
                  <span className="text-gray-500 text-xs">참여율</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{d.rating}</span>
                  <span className="text-gray-500 text-xs">평점</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">{d.totalProjects}</span>
                  <span className="text-gray-500 text-xs">프로젝트</span>
                </div>
              </div>
            </div>
          </div>
          {editMode && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <label className="text-xs text-gray-400 mb-1 block">프로필 이미지 URL</label>
              <input
                type="text"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* 수익 현황 요약 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 매출 발생액</p>
            <p className="text-xl font-bold text-blue-300">{formatWon(d.totalRevenue || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">{d.totalProjects}건 합산</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">총 수수료 지급</p>
            <p className="text-xl font-bold text-red-300">{formatWon(d.totalCommission || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">공구 수수료 합산</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">순수익 (회사)</p>
            <p className="text-xl font-bold text-green-300">{formatWon(netRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">매출 - 수수료</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">건당 평균 매출</p>
            <p className="text-xl font-bold text-purple-300">
              {d.totalProjects ? formatWon(Math.round((d.totalRevenue || 0) / d.totalProjects)) : '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">총매출 / 프로젝트 수</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">기본 정보</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="활동명"
                  value={d.name}
                  editVal={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                />
                <Field
                  label="실명"
                  value={d.realName}
                  editVal={draft.realName}
                  onChange={(v) => setDraft({ ...draft, realName: v })}
                  placeholder="실명 입력"
                />
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">플랫폼</label>
                  {editMode ? (
                    <select
                      value={draft.platform}
                      onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
                      className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option>Instagram</option>
                      <option>YouTube</option>
                      <option>TikTok</option>
                      <option>Naver Blog</option>
                      <option>카카오</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium">{d.platform}</p>
                  )}
                </div>
                <Field
                  label="카테고리"
                  value={d.category}
                  editVal={draft.category}
                  onChange={(v) => setDraft({ ...draft, category: v })}
                />
                <Field
                  label="팔로워"
                  value={d.followers}
                  editVal={draft.followers}
                  onChange={(v) => setDraft({ ...draft, followers: v })}
                  placeholder="예: 520K"
                />
                <Field
                  label="참여율 (engagement)"
                  value={d.engagement}
                  editVal={draft.engagement}
                  onChange={(v) => setDraft({ ...draft, engagement: v })}
                  placeholder="예: 8.5%"
                />
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">소속사/에이전시</label>
                  {editMode ? (
                    <select
                      value={draft.agency}
                      onChange={(e) => setDraft({ ...draft, agency: e.target.value })}
                      className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option>프리랜서</option>
                      <option>MCN 소속</option>
                      <option>연예기획사</option>
                      <option>소속사 협의</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium">{d.agency}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">전속 여부</label>
                  {editMode ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={draft.isExclusive}
                        onChange={(e) => setDraft({ ...draft, isExclusive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">전속 계약</span>
                    </label>
                  ) : (
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      d.isExclusive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {d.isExclusive ? '전속' : '비전속'}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">상태</label>
                  {editMode ? (
                    <select
                      value={draft.status}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                      className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                      <option value="pause">일시중지</option>
                    </select>
                  ) : (
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      d.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {d.status === 'active' ? '활성' : '비활성'}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">평점</label>
                  {editMode ? (
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={draft.rating}
                      onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{d.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 연락처 & SNS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold">연락처 & SNS</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      placeholder="연락처"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    d.phone ? (
                      <a href={`tel:${d.phone}`} className="text-sm text-blue-400">{d.phone}</a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      placeholder="이메일"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    d.email ? (
                      <a href={`mailto:${d.email}`} className="text-sm text-blue-400">{d.email}</a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.instagram || ''}
                      onChange={(e) => setDraft({ ...draft, instagram: e.target.value })}
                      placeholder="Instagram URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    d.instagram ? (
                      <a
                        href={d.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        Instagram <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.youtube || ''}
                      onChange={(e) => setDraft({ ...draft, youtube: e.target.value })}
                      placeholder="YouTube 채널 URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    d.youtube ? (
                      <a
                        href={d.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">컨택 방법</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.contactMethod}
                        onChange={(e) => setDraft({ ...draft, contactMethod: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{d.contactMethod || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">담당자</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.contactPerson}
                        onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{d.contactPerson || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 특기/전문 분야 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-pink-400" />
                <h2 className="font-semibold">전문 분야</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {d.specialty.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                    <span className="text-sm text-blue-300">{tag}</span>
                    {editMode && (
                      <button onClick={() => removeSpecialty(tag)} className="text-gray-500 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                      placeholder="분야 입력"
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-blue-500 w-28"
                    />
                    <button onClick={addSpecialty} className="text-blue-400 hover:text-blue-300">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 메모 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <h2 className="font-semibold">메모 / 특이사항</h2>
              </div>
              {editMode ? (
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{d.notes || '-'}</p>
              )}
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 수익 구조 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <h2 className="font-semibold">수익 구조</h2>
                {editMode && <span className="ml-auto text-xs text-gray-400">직접 수정 가능</span>}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">포스팅 단가</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.adFeePerPost}
                        onChange={(e) => setDraft({ ...draft, adFeePerPost: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-base font-bold text-yellow-300">{formatWon(d.adFeePerPost || 0)}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">최소 보장금</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.minimumGuarantee}
                        onChange={(e) => setDraft({ ...draft, minimumGuarantee: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-base font-bold">{formatWon(d.minimumGuarantee || 0)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-purple-300 mb-1">협찬 수수료</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.commissionRate}
                        onChange={(e) => setDraft({ ...draft, commissionRate: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-xl font-bold text-purple-300">{d.commissionRate}%</p>
                    )}
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-300 mb-1">공구 수수료</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.groupBuyRate}
                        onChange={(e) => setDraft({ ...draft, groupBuyRate: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-xl font-bold text-blue-300">{d.groupBuyRate}%</p>
                    )}
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-green-300 mb-1">정산 주기</p>
                    {editMode ? (
                      <select
                        value={draft.settlementCycle}
                        onChange={(e) => setDraft({ ...draft, settlementCycle: e.target.value })}
                        className="w-full bg-gray-800 border border-white/10 rounded-lg px-1 py-1 text-xs focus:outline-none"
                      >
                        <option>월말정산</option>
                        <option>건별정산</option>
                        <option>분기정산</option>
                        <option>반기정산</option>
                      </select>
                    ) : (
                      <p className="text-xs font-bold text-green-300">{d.settlementCycle}</p>
                    )}
                  </div>
                </div>

                {/* 수익 현황 */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-3">누적 수익 현황</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">총 매출 발생</span>
                      <span className="font-bold text-blue-300">{formatWon(d.totalRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">총 수수료 지급</span>
                      <span className="font-bold text-red-300">- {formatWon(d.totalCommission || 0)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold">회사 순수익</span>
                      <span className="font-bold text-xl text-green-300">{formatWon(netRevenue)}</span>
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">총 매출액</label>
                      <input
                        type="number"
                        value={draft.totalRevenue}
                        onChange={(e) => setDraft({ ...draft, totalRevenue: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">총 수수료</label>
                      <input
                        type="number"
                        value={draft.totalCommission}
                        onChange={(e) => setDraft({ ...draft, totalCommission: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">총 프로젝트</label>
                      <input
                        type="number"
                        value={draft.totalProjects}
                        onChange={(e) => setDraft({ ...draft, totalProjects: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 계약 정보 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h2 className="font-semibold">계약 정보</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">계약 시작일</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={draft.contractStart}
                      onChange={(e) => setDraft({ ...draft, contractStart: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{d.contractStart}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">계약 종료일</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={draft.contractEnd}
                      onChange={(e) => setDraft({ ...draft, contractEnd: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{d.contractEnd}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">자동 갱신</label>
                  {editMode ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={draft.autoRenewal}
                        onChange={(e) => setDraft({ ...draft, autoRenewal: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">자동 갱신</span>
                    </label>
                  ) : (
                    <div className="flex items-center gap-1 mt-1">
                      <RefreshCw className="w-4 h-4 text-green-400" />
                      <span className={`text-sm font-medium ${d.autoRenewal ? 'text-green-400' : 'text-gray-400'}`}>
                        {d.autoRenewal ? '자동 갱신' : '수동 갱신'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">담당 매니저</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.manager}
                      onChange={(e) => setDraft({ ...draft, manager: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{d.manager}</p>
                  )}
                </div>
              </div>

              {/* 계약 만료 D-day */}
              {(() => {
                const end = new Date(d.contractEnd);
                const today = new Date();
                const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isExpired = diff < 0;
                const isSoon = diff >= 0 && diff <= 30;
                return (
                  <div className={`mt-3 p-3 rounded-xl flex items-center gap-2 ${
                    isExpired ? 'bg-red-500/10 border border-red-500/20' :
                    isSoon ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-green-500/10 border border-green-500/20'
                  }`}>
                    <Calendar className={`w-4 h-4 ${isExpired ? 'text-red-400' : isSoon ? 'text-yellow-400' : 'text-green-400'}`} />
                    <span className={`text-sm font-medium ${isExpired ? 'text-red-300' : isSoon ? 'text-yellow-300' : 'text-green-300'}`}>
                      {isExpired ? `계약 만료 (${Math.abs(diff)}일 경과)` : `계약 만료까지 D-${diff}`}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* 정산 계좌 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold">정산 계좌</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">은행</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.accountBank}
                        onChange={(e) => setDraft({ ...draft, accountBank: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{d.accountBank}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">예금주</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.accountHolder}
                        onChange={(e) => setDraft({ ...draft, accountHolder: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{d.accountHolder}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">계좌번호</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.accountNumber}
                      onChange={(e) => setDraft({ ...draft, accountNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium font-mono bg-white/5 px-3 py-2 rounded-xl">{d.accountNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
