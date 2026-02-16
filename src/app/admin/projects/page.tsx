'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Filter, Calendar, User, Tag, CheckCircle, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import realPartnersData from '@/data/real-partners.json';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // 실제 프로젝트 데이터 사용
  const projects = realPartnersData.realProjects;

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case '대기': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case '완료': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">프로젝트 관리</h1>
            <p className="text-gray-400">전체 프로젝트: {projects.length}개</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            새 프로젝트
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
                placeholder="프로젝트명 또는 클라이언트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 상태</option>
                <option value="진행중" className="bg-gray-800">진행중</option>
                <option value="대기" className="bg-gray-800">대기</option>
                <option value="완료" className="bg-gray-800">완료</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = getStatusIcon(project.status);
            return (
              <div
                key={project.id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      {project.client}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(project.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                    {project.status}
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                    {project.subCategory}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>진행률</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">시작일</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{project.startDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">종료일</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{project.endDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">예산</p>
                    <span className="font-semibold">{project.budget}</span>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">담당자</p>
                    <span className="font-semibold">{project.manager}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => alert(`"${project.name}" 프로젝트를 수정합니다.`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`)) {
                        alert('프로젝트가 삭제되었습니다.');
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">새 프로젝트 등록</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">프로젝트명</label>
                  <input
                    type="text"
                    placeholder="프로젝트명을 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">클라이언트</label>
                  <input
                    type="text"
                    placeholder="클라이언트명을 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">종료일</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">예산</label>
                  <input
                    type="text"
                    placeholder="예산을 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert('프로젝트가 등록되었습니다!');
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
