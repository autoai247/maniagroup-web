'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Search, Filter, Mail, Phone, Building, Calendar, FolderKanban, Edit, Trash2, Eye } from 'lucide-react';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const clients = [
    {
      id: 1,
      name: 'ABC 주식회사',
      industry: 'IT/소프트웨어',
      contact: '김대리',
      email: 'contact@abc.com',
      phone: '02-1234-5678',
      projectCount: 5,
      activeProjects: 2,
      totalBudget: '2억 5천만원',
      registeredDate: '2024-06-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'XYZ 코리아',
      industry: '화장품/뷰티',
      contact: '이과장',
      email: 'marketing@xyz.co.kr',
      phone: '02-2345-6789',
      projectCount: 3,
      activeProjects: 1,
      totalBudget: '1억 2천만원',
      registeredDate: '2024-08-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'DEF 컴퍼니',
      industry: '제조/유통',
      contact: '박부장',
      email: 'info@def.com',
      phone: '031-3456-7890',
      projectCount: 8,
      activeProjects: 3,
      totalBudget: '5억원',
      registeredDate: '2023-12-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'GHI 식품',
      industry: 'F&B/외식',
      contact: '최사장',
      email: 'ceo@ghi-food.com',
      phone: '02-4567-8901',
      projectCount: 2,
      activeProjects: 1,
      totalBudget: '8천만원',
      registeredDate: '2025-01-05',
      status: 'active'
    },
    {
      id: 5,
      name: 'JKL 엔터테인먼트',
      industry: '엔터테인먼트',
      contact: '정대표',
      email: 'business@jkl-ent.com',
      phone: '02-5678-9012',
      projectCount: 4,
      activeProjects: 0,
      totalBudget: '3억원',
      registeredDate: '2024-03-22',
      status: 'inactive'
    },
    {
      id: 6,
      name: 'MNO 라이프',
      industry: '리빙/홈인테리어',
      contact: '강실장',
      email: 'pr@mnolife.com',
      phone: '031-6789-0123',
      projectCount: 6,
      activeProjects: 2,
      totalBudget: '1억 8천만원',
      registeredDate: '2024-05-18',
      status: 'active'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">광고주 관리</h1>
            <p className="text-gray-400">전체 광고주: {clients.length}개사</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            새 광고주 등록
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="광고주명, 담당자, 업종 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                그리드
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                리스트
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">활성 광고주</p>
            <p className="text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">진행 중 프로젝트</p>
            <p className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.activeProjects, 0)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">총 프로젝트</p>
            <p className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.projectCount, 0)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">신규 (이번달)</p>
            <p className="text-2xl font-bold text-green-400">+2</p>
          </div>
        </div>

        {/* Clients Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl font-bold">
                    {client.name.charAt(0)}
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    client.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {client.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold mb-2">{client.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{client.industry}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">{client.contact}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">진행중</p>
                    <p className="text-lg font-bold text-blue-400">{client.activeProjects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">총 프로젝트</p>
                    <p className="text-lg font-bold">{client.projectCount}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm">
                    <Eye className="w-4 h-4" />
                    상세
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">광고주</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">업종</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">담당자</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">연락처</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">프로젝트</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">상태</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{client.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{client.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{client.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-blue-400 font-semibold">{client.activeProjects}</span>
                      <span className="text-gray-500"> / {client.projectCount}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        client.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {client.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
