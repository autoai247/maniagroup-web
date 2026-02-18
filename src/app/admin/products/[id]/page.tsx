'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import {
  ArrowLeft, Edit2, Save, X, Plus, Trash2, ExternalLink,
  Instagram, Youtube, Globe, MessageCircle, Package,
  TrendingUp, DollarSign, Warehouse, Truck, Phone, Mail,
  ChevronLeft, ChevronRight, Play, Hash, Tag, ShoppingCart,
  CheckCircle, AlertCircle, Camera
} from 'lucide-react';
import realPartnersData from '@/data/real-partners.json';

interface VideoItem {
  url: string;
  title: string;
  type: 'youtube' | 'vimeo' | 'url';
}

type BaseProduct = Omit<(typeof realPartnersData.products)[0], 'videos'>;

interface Product extends BaseProduct {
  images: string[];
  videos: VideoItem[];
  website: string;
  sns: { instagram: string; naverBlog: string; kakao: string; youtube: string };
  hashtags: string[];
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newHashtag, setNewHashtag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showAddImage, setShowAddImage] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  useEffect(() => {
    // localStorage에서 덮어쓴 제품 데이터 확인
    const stored = localStorage.getItem(`product_${productId}`);
    let base = realPartnersData.products.find((p) => p.id === productId) as Product | undefined;
    if (stored) {
      base = JSON.parse(stored) as Product;
    } else if (base) {
      // 기본 필드 보완
      base = {
        ...base,
        images: (base as Product).images ?? [base.image],
        videos: (base as Product).videos ?? [],
        website: (base as Product).website ?? '',
        sns: (base as Product).sns ?? { instagram: '', naverBlog: '', kakao: '', youtube: '' },
        hashtags: (base as Product).hashtags ?? [],
      };
    }
    if (base) {
      setProduct(base);
      setDraft(base);
    }
  }, [productId]);

  const saveProduct = useCallback(() => {
    if (!draft) return;
    // 마진 자동 계산
    const margin = draft.groupBuyPrice - draft.supplyPrice;
    const marginRate = Math.round((margin / draft.groupBuyPrice) * 100);
    const influencerAmount = Math.round(draft.groupBuyPrice * (draft.influencerFee / 100));
    const companyProfit = margin - influencerAmount;
    const companyProfitRate = Math.round((companyProfit / draft.groupBuyPrice) * 100);
    const updated = { ...draft, margin, marginRate, influencerAmount, companyProfit, companyProfitRate };
    localStorage.setItem(`product_${productId}`, JSON.stringify(updated));
    setProduct(updated);
    setDraft(updated);
    setEditMode(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  }, [draft, productId]);

  const cancelEdit = () => {
    setDraft(product);
    setEditMode(false);
  };

  const addImage = () => {
    if (!newImageUrl.trim() || !draft) return;
    setDraft({ ...draft, images: [...draft.images, newImageUrl.trim()] });
    setNewImageUrl('');
    setShowAddImage(false);
  };

  const removeImage = (idx: number) => {
    if (!draft) return;
    const imgs = draft.images.filter((_, i) => i !== idx);
    setDraft({ ...draft, images: imgs });
    if (activeImageIdx >= imgs.length) setActiveImageIdx(Math.max(0, imgs.length - 1));
  };

  const addVideo = () => {
    if (!newVideoUrl.trim() || !draft) return;
    const youtubeId = getYouTubeId(newVideoUrl);
    const type = youtubeId ? 'youtube' : newVideoUrl.includes('vimeo') ? 'vimeo' : 'url';
    setDraft({ ...draft, videos: [...draft.videos, { url: newVideoUrl.trim(), title: newVideoTitle || '영상', type }] });
    setNewVideoUrl('');
    setNewVideoTitle('');
    setShowAddVideo(false);
  };

  const removeVideo = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, videos: draft.videos.filter((_, i) => i !== idx) });
  };

  const addHashtag = () => {
    if (!newHashtag.trim() || !draft) return;
    const tag = newHashtag.trim().replace(/^#/, '');
    if (!draft.hashtags.includes(tag)) setDraft({ ...draft, hashtags: [...draft.hashtags, tag] });
    setNewHashtag('');
  };

  const removeHashtag = (tag: string) => {
    if (!draft) return;
    setDraft({ ...draft, hashtags: draft.hashtags.filter((t) => t !== tag) });
  };

  if (!product || !draft) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">제품을 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  const displayData = editMode ? draft : product;
  const images = displayData.images?.length ? displayData.images : [displayData.image];
  const formatWon = (n: number) => `₩${n.toLocaleString()}`;

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        {/* 저장 알림 */}
        {saveNotice && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl shadow-xl animate-pulse">
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
              <p className="text-sm text-gray-400">제품 관리</p>
              <h1 className="text-xl font-bold">{product.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
                <button
                  onClick={saveProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium transition-opacity hover:opacity-90"
                >
                  <Save className="w-4 h-4" />
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium"
              >
                <Edit2 className="w-4 h-4" />
                편집
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-6">
            {/* 이미지 갤러리 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">이미지 갤러리</h2>
                <span className="ml-auto text-sm text-gray-400">{images.length}장</span>
              </div>

              {/* 메인 이미지 */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/40 mb-3">
                <Image
                  src={images[activeImageIdx] || images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx((i) => Math.max(0, i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx((i) => Math.min(images.length - 1, i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-lg text-xs">
                  {activeImageIdx + 1} / {images.length}
                </div>
              </div>

              {/* 썸네일 */}
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <button
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImageIdx === idx ? 'border-blue-500' : 'border-white/10'
                      }`}
                    >
                      <Image src={img} alt={`이미지 ${idx + 1}`} fill className="object-cover" />
                    </button>
                    {editMode && (
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <button
                    onClick={() => setShowAddImage(true)}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-500 flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              {showAddImage && editMode && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                    placeholder="이미지 URL 입력"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={addImage} className="px-3 py-2 bg-blue-600 rounded-xl text-sm">추가</button>
                  <button onClick={() => setShowAddImage(false)} className="px-3 py-2 bg-white/10 rounded-xl text-sm">취소</button>
                </div>
              )}
            </div>

            {/* 영상 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold">영상</h2>
                {editMode && (
                  <button
                    onClick={() => setShowAddVideo(true)}
                    className="ml-auto text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> 영상 추가
                  </button>
                )}
              </div>

              {displayData.videos.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">등록된 영상이 없습니다.</p>
              )}

              {displayData.videos.map((video, idx) => {
                const ytId = getYouTubeId(video.url);
                return (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{video.title}</span>
                      {editMode && (
                        <button onClick={() => removeVideo(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {ytId ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full h-full"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                    ) : (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" /> {video.url}
                      </a>
                    )}
                  </div>
                );
              })}

              {showAddVideo && editMode && (
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="영상 제목 (예: 제품 소개 영상)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addVideo()}
                      placeholder="YouTube URL 또는 영상 링크"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button onClick={addVideo} className="px-3 py-2 bg-blue-600 rounded-xl text-sm">추가</button>
                    <button onClick={() => setShowAddVideo(false)} className="px-3 py-2 bg-white/10 rounded-xl text-sm">취소</button>
                  </div>
                </div>
              )}
            </div>

            {/* SNS & 링크 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold">SNS & 링크</h2>
              </div>
              <div className="space-y-3">
                {/* 홈페이지 */}
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.website}
                      onChange={(e) => setDraft({ ...draft, website: e.target.value })}
                      placeholder="홈페이지 URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    displayData.website ? (
                      <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        {displayData.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                {/* 인스타그램 */}
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.sns.instagram}
                      onChange={(e) => setDraft({ ...draft, sns: { ...draft.sns, instagram: e.target.value } })}
                      placeholder="Instagram URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    displayData.sns.instagram ? (
                      <a href={displayData.sns.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        Instagram <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                {/* 네이버 블로그 */}
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.sns.naverBlog}
                      onChange={(e) => setDraft({ ...draft, sns: { ...draft.sns, naverBlog: e.target.value } })}
                      placeholder="네이버 블로그 URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    displayData.sns.naverBlog ? (
                      <a href={displayData.sns.naverBlog} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        네이버 블로그 <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                {/* 유튜브 */}
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.sns.youtube}
                      onChange={(e) => setDraft({ ...draft, sns: { ...draft.sns, youtube: e.target.value } })}
                      placeholder="YouTube 채널 URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    displayData.sns.youtube ? (
                      <a href={displayData.sns.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
                {/* 카카오 */}
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.sns.kakao}
                      onChange={(e) => setDraft({ ...draft, sns: { ...draft.sns, kakao: e.target.value } })}
                      placeholder="카카오 채널 URL"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    displayData.sns.kakao ? (
                      <a href={displayData.sns.kakao} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        카카오 채널 <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-gray-500 text-sm">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-400" />
                <h2 className="font-semibold">기본 정보</h2>
                {editMode ? null : (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    displayData.status === '판매중' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {displayData.status}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">제품명</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{displayData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">브랜드</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={draft.brand}
                        onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium">{displayData.brand}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">카테고리</label>
                    {editMode ? (
                      <select
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                        className="w-full bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option>뷰티/화장품</option>
                        <option>생활용품</option>
                        <option>반려동물</option>
                        <option>식품/건강</option>
                        <option>패션/의류</option>
                        <option>디지털/가전</option>
                        <option>스포츠/레저</option>
                        <option>기타</option>
                      </select>
                    ) : (
                      <p className="text-sm font-medium">{displayData.category}</p>
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
                        <option>판매중</option>
                        <option>판매중지</option>
                        <option>품절</option>
                        <option>준비중</option>
                      </select>
                    ) : (
                      <p className="text-sm font-medium">{displayData.status}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">제품 설명</label>
                  {editMode ? (
                    <textarea
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-300">{displayData.description}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">공동구매 가능</label>
                  {editMode ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.canGroup}
                        onChange={(e) => setDraft({ ...draft, canGroup: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">공동구매 가능</span>
                    </label>
                  ) : (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      displayData.canGroup ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {displayData.canGroup ? '공구 가능' : '공구 불가'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 가격 구조 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <h2 className="font-semibold">가격 구조</h2>
                {editMode && (
                  <span className="ml-auto text-xs text-gray-400">저장 시 자동 계산됩니다</span>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">공급가</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.supplyPrice}
                        onChange={(e) => setDraft({ ...draft, supplyPrice: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-200">{formatWon(displayData.supplyPrice)}</p>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">소비자가</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.retailPrice}
                        onChange={(e) => setDraft({ ...draft, retailPrice: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-200">{formatWon(displayData.retailPrice)}</p>
                    )}
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <p className="text-xs text-blue-300 mb-1">공구가</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={draft.groupBuyPrice}
                        onChange={(e) => setDraft({ ...draft, groupBuyPrice: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-bold text-blue-300">{formatWon(displayData.groupBuyPrice)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-xs text-green-300 mb-1">마진</p>
                    <p className="text-sm font-bold text-green-300">{formatWon(displayData.margin)}</p>
                    <p className="text-xs text-green-400 mt-0.5">{displayData.marginRate}%</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                    <p className="text-xs text-purple-300 mb-1">인플루언서 수수료</p>
                    {editMode ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={draft.influencerFee}
                          onChange={(e) => setDraft({ ...draft, influencerFee: Number(e.target.value) })}
                          className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-sm text-purple-300">%</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-purple-300">{formatWon(displayData.influencerAmount)}</p>
                        <p className="text-xs text-purple-400 mt-0.5">{displayData.influencerFee}%</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-blue-300 mb-1">회사 수익</p>
                      <p className="text-lg font-bold text-white">{formatWon(displayData.companyProfit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">수익률</p>
                      <p className="text-2xl font-bold text-blue-300">{displayData.companyProfitRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 재고 & 납기 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Warehouse className="w-5 h-5 text-orange-400" />
                <h2 className="font-semibold">재고 & 납기</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">현재 재고</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={draft.stock}
                      onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.stock.toLocaleString()}개</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">최소 발주량 (MOQ)</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={draft.moq}
                      onChange={(e) => setDraft({ ...draft, moq: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.moq.toLocaleString()}개</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">공구 최소수량</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={draft.groupMinQty}
                      onChange={(e) => setDraft({ ...draft, groupMinQty: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.groupMinQty.toLocaleString()}개</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">납기 기간</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.leadTime}
                      onChange={(e) => setDraft({ ...draft, leadTime: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.leadTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 공급처 정보 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold">공급처 정보</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">공급처</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.supplier}
                      onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm font-medium">{displayData.supplier}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.supplierContact}
                      onChange={(e) => setDraft({ ...draft, supplierContact: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <a href={`tel:${displayData.supplierContact}`} className="text-sm text-blue-400">{displayData.supplierContact}</a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {editMode ? (
                    <input
                      type="text"
                      value={draft.supplierEmail}
                      onChange={(e) => setDraft({ ...draft, supplierEmail: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <a href={`mailto:${displayData.supplierEmail}`} className="text-sm text-blue-400">{displayData.supplierEmail}</a>
                  )}
                </div>
              </div>
            </div>

            {/* 해시태그 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-pink-400" />
                <h2 className="font-semibold">해시태그</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayData.hashtags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                    <span className="text-sm text-gray-300">#{tag}</span>
                    {editMode && (
                      <button onClick={() => removeHashtag(tag)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                      placeholder="태그 입력 후 Enter"
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-blue-500 w-36"
                    />
                    <button onClick={addHashtag} className="text-blue-400 hover:text-blue-300">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
