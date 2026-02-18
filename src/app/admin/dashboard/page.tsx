'use client';

import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { TrendingUp, Users, Building2, Package, FolderKanban, CheckCircle, Clock, AlertCircle, Star, ArrowRight, Plus, Upload } from 'lucide-react';
import realPartnersData from '@/data/real-partners.json';
import influencersData from '@/data/influencers.json';

export default function DashboardPage() {
  const products = realPartnersData.products;
  const partners = realPartnersData.partners;
  const projects = realPartnersData.realProjects;
  const influencers = influencersData.influencers;

  // 실제 데이터 기반 통계
  const totalRevenuePotential = products.reduce((s, p) => s + (p.companyProfit || 0) * (p.stock || 0), 0);
  const avgMarginRate = products.length ? Math.round(products.reduce((s, p) => s + (p.marginRate || 0), 0) / products.length) : 0;
  const activeProjects = projects.filter(p => p.status === '진행중').length;

  const stats = [
    { icon: FolderKanban, label: '진행 중 프로젝트', value: `${activeProjects}`, sub: `전체 ${projects.length}개`, color: 'from-blue-500 to-cyan-500' },
    { icon: Package, label: '관리 제품', value: `${products.length}개`, sub: `평균마진 ${avgMarginRate}%`, color: 'from-purple-500 to-pink-500' },
    { icon: Building2, label: '파트너사', value: `${partners.length}개`, sub: '전속 파트너', color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: '인플루언서', value: `${influencers.length}명`, sub: '활성 채널', color: 'from-orange-500 to-red-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중': return 'text-blue-400 bg-blue-500/20';
      case '대기': return 'text-yellow-400 bg-yellow-500/20';
      case '완료': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '진행중': return Clock;
      case '대기': return AlertCircle;
      case '완료': return CheckCircle;
      default: return Clock;
    }
  };

  // 제품 마진 TOP 3
  const topProducts = [...products].sort((a, b) => (b.companyProfitRate || 0) - (a.companyProfitRate || 0)).slice(0, 3);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">대시보드</h1>
            <p className="text-gray-400 text-sm">매니아그룹 관리 현황 · {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {/* 빠른 입력 */}
          <div className="flex gap-2">
            <Link href="/admin/products"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all">
              <Upload className="w-4 h-4" /> 데이터 입력
            </Link>
            <Link href="/admin/projects"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-semibold hover:scale-105 transition-all">
              <Plus className="w-4 h-4" /> 새 프로젝트
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-0.5">{stat.value}</h3>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 최근 프로젝트 */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">실제 프로젝트 현황</h2>
              <Link href="/admin/projects" className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1">
                전체 보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {projects.map((project) => {
                const StatusIcon = getStatusIcon(project.status);
                return (
                  <div key={project.id}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{project.client} · {project.subCategory}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${getStatusColor(project.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {project.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded">{project.category}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>진행률</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                            style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 우측 사이드 */}
          <div className="space-y-5">
            {/* 수익 TOP 제품 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> 수익률 TOP 제품
                </h3>
                <Link href="/admin/products" className="text-blue-400 hover:text-blue-300 text-xs">더보기</Link>
              </div>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-orange-600 text-white'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.brand}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400 flex-shrink-0">{p.companyProfitRate}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">재고 수익 잠재액</span>
                  <span className="font-bold text-purple-400">₩{Math.round(totalRevenuePotential / 10000)}만</span>
                </div>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-bold mb-4">빠른 액션</h3>
              <div className="space-y-2">
                <Link href="/admin/products" className="flex items-center gap-2 px-3 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all text-xs font-semibold">
                  <Package className="w-4 h-4" /> 제품 등록 / 리스트 보기
                </Link>
                <Link href="/admin/influencers" className="flex items-center gap-2 px-3 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-all text-xs font-semibold">
                  <Star className="w-4 h-4" /> 인플루언서 관리
                </Link>
                <Link href="/admin/partners" className="flex items-center gap-2 px-3 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all text-xs font-semibold">
                  <Building2 className="w-4 h-4" /> 파트너 / 실행사
                </Link>
                <Link href="/admin/documents" className="flex items-center gap-2 px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl transition-all text-xs font-semibold">
                  <Users className="w-4 h-4" /> 문서 업로드
                </Link>
              </div>
            </div>

            {/* 인플루언서 현황 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">인플루언서 현황</h3>
                <Link href="/admin/influencers" className="text-blue-400 hover:text-blue-300 text-xs">관리</Link>
              </div>
              <div className="space-y-3">
                {influencers.map(inf => (
                  <div key={inf.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {inf.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{inf.name}</p>
                      <p className="text-xs text-gray-500">{inf.platform} · {inf.followers}</p>
                    </div>
                    <span className="text-xs text-yellow-400 font-semibold">{inf.engagement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
