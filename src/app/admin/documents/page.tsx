'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Upload, Search, Filter, FileText, Image, FileVideo, File, Download, Trash2, Tag, Cpu, FolderOpen } from 'lucide-react';
import categoriesData from '@/data/categories.json';
import scannedFilesData from '@/data/scanned-files.json';

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Use real scanned files
  const documents = scannedFilesData.files;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'video': return FileVideo;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'from-red-500 to-pink-500';
      case 'excel': return 'from-green-500 to-emerald-500';
      case 'word': return 'from-blue-500 to-cyan-500';
      case 'ppt': return 'from-orange-500 to-red-500';
      case 'video': return 'from-purple-500 to-pink-500';
      case 'image': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">문서 관리</h1>
            <p className="text-gray-400">전체 문서: {scannedFilesData.totalFiles}개 (실제 파일)</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all">
            <Upload className="w-5 h-5" />
            문서 업로드
          </button>
        </div>

        {/* AI Classification Info Banner */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                자동 분류 시스템
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">활성</span>
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                업로드된 문서를 자동으로 18개 카테고리 중 적절한 분류로 배정합니다.
                PDF, Word, Excel, 이미지, 영상 등 다양한 형식을 지원합니다.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">자동 분류: <span className="text-white font-semibold">{documents.filter(d => d.isAIClassified).length}개</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-400">수동 분류: <span className="text-white font-semibold">{documents.filter(d => !d.isAIClassified).length}개</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="파일명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 카테고리</option>
                {categoriesData.categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-gray-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">전체 파일 형식</option>
                <option value="pdf" className="bg-gray-800">PDF</option>
                <option value="word" className="bg-gray-800">Word</option>
                <option value="excel" className="bg-gray-800">Excel</option>
                <option value="ppt" className="bg-gray-800">PowerPoint</option>
                <option value="video" className="bg-gray-800">동영상</option>
                <option value="image" className="bg-gray-800">이미지</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">총 문서</p>
            <p className="text-2xl font-bold">{scannedFilesData.totalFiles}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">AI 자동 분류</p>
            <p className="text-2xl font-bold text-green-400">{scannedFilesData.classifiedCount || documents.filter(d => d.isAIClassified).length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">최근 스캔</p>
            <p className="text-2xl font-bold text-blue-400">{new Date(scannedFilesData.scannedAt).toLocaleDateString('ko-KR')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">총 용량</p>
            <p className="text-2xl font-bold">{(documents.reduce((sum, d) => sum + (d.sizeBytes || 0), 0) / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/10">
            {filteredDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              return (
                <div key={doc.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${getFileColor(doc.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <FileIcon className="w-6 h-6 text-white" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{doc.name}</h3>
                        {doc.isAIClassified && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold flex-shrink-0">
                            <Cpu className="w-3 h-3" />
                            자동
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {doc.category}
                        </span>
                        <span>•</span>
                        <span>{doc.subCategory}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>by {doc.uploadedBy}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
