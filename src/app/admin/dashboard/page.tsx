'use client';

import AdminLayout from '@/components/AdminLayout';
import { TrendingUp, Users, Building2, FileText, FolderKanban, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { icon: FolderKanban, label: '진행 중인 프로젝트', value: '24', change: '+3', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: '총 광고주', value: '156', change: '+12', color: 'from-purple-500 to-pink-500' },
    { icon: Building2, label: '파트너사', value: '52', change: '+2', color: 'from-green-500 to-emerald-500' },
    { icon: FileText, label: '문서 보관', value: '1,234', change: '+45', color: 'from-orange-500 to-red-500' },
  ];

  const recentProjects = [
    { id: 1, name: 'ABC 기업 SNS 마케팅', client: 'ABC 주식회사', status: '진행중', category: 'SNS 마케팅', progress: 65 },
    { id: 2, name: 'XYZ 브랜드 인플루언서 캠페인', client: 'XYZ 코리아', status: '진행중', category: '인플루언서', progress: 80 },
    { id: 3, name: 'DEF 제품 퍼포먼스 광고', client: 'DEF 컴퍼니', status: '대기', category: '퍼포먼스 마케팅', progress: 20 },
    { id: 4, name: 'GHI 로컬 마케팅', client: 'GHI 식품', status: '진행중', category: '로컬 마케팅', progress: 45 },
    { id: 5, name: 'JKL 글로벌 마케팅', client: 'JKL 엔터', status: '완료', category: '해외 마케팅', progress: 100 },
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

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대시보드</h1>
          <p className="text-gray-400">매니아그룹 관리 시스템 현황</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">최근 프로젝트</h2>
            <a href="/admin/projects" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
              전체 보기 →
            </a>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project) => {
              const StatusIcon = getStatusIcon(project.status);
              return (
                <div
                  key={project.id}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-400">클라이언트: {project.client}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(project.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      {project.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                      {project.category}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>진행률</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">카테고리별 프로젝트</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">퍼포먼스 마케팅</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">SNS 마케팅</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">인플루언서</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">기타</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">이번 달 성과</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">신규 프로젝트</span>
                <span className="font-semibold text-green-400">+7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">완료 프로젝트</span>
                <span className="font-semibold text-blue-400">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">신규 광고주</span>
                <span className="font-semibold text-purple-400">+8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">매출 달성률</span>
                <span className="font-semibold text-yellow-400">92%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">빠른 액션</h3>
            <div className="space-y-2">
              <a href="/admin/projects" className="block px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm font-semibold">
                + 새 프로젝트 등록
              </a>
              <a href="/admin/clients" className="block px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all text-sm font-semibold">
                + 새 광고주 등록
              </a>
              <a href="/admin/documents" className="block px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all text-sm font-semibold">
                + 문서 업로드
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
