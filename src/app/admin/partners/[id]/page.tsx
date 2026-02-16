'use client';

import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Star, Mail, Phone, Globe, Building2, Calendar, FolderOpen, FileText, Award, TrendingUp } from 'lucide-react';
import realPartnersData from '@/data/real-partners.json';
import scannedFilesData from '@/data/scanned-files.json';

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = parseInt(params.id as string);

  // 파트너 정보 찾기
  const partner = realPartnersData.partners.find(p => p.id === partnerId);

  // 해당 파트너와 관련된 파일 찾기
  const relatedFiles = scannedFilesData.files.filter(file =>
    file.path.toLowerCase().includes(partner?.name.toLowerCase() || '')
  );

  // 해당 파트너와 관련된 프로젝트 찾기
  const relatedProjects = realPartnersData.realProjects.filter(project =>
    project.client === partner?.name || project.name.includes(partner?.name || '')
  );

  if (!partner) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
            <p className="text-gray-400">파트너를 찾을 수 없습니다.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              돌아가기
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          파트너 목록으로
        </button>

        {/* Partner Info Card */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl font-bold">
                {partner.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{partner.name}</h1>
                <p className="text-xl text-blue-400 font-semibold mb-3">{partner.category}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{partner.rating}</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-semibold">
                    {partner.projectCount}개 프로젝트
                  </div>
                  <div className={`px-3 py-1 rounded-lg font-semibold ${
                    partner.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {partner.status === 'active' ? '활성' : '비활성'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">연락처 정보</h3>
              <div className="space-y-2">
                {partner.contact && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="text-white">담당자: {partner.contact}</span>
                  </div>
                )}
                {partner.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-white">{partner.email}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-white">{partner.phone}</span>
                  </div>
                )}
                {partner.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {partner.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-3">전문 분야</h3>
              <div className="flex flex-wrap gap-2">
                {partner.specialties.map((specialty, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-semibold">
                    {specialty}
                  </span>
                ))}
              </div>
              {partner.portfolio && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">{partner.portfolio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold text-blue-400">{partner.rating}</p>
              <p className="text-sm text-gray-400">평균 평점</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-purple-400">{partner.projectCount}</p>
              <p className="text-sm text-gray-400">진행 프로젝트</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold text-green-400">{relatedFiles.length}</p>
              <p className="text-sm text-gray-400">관련 문서</p>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FolderOpen className="w-6 h-6" />
              관련 프로젝트
            </h2>
            <div className="space-y-3">
              {relatedProjects.map((project) => (
                <div key={project.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                          {project.category}
                        </span>
                        {project.subCategory && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                            {project.subCategory}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">기간: </span>
                          <span className="text-white">{project.startDate} ~ {project.endDate}</span>
                        </div>
                        {project.budget && (
                          <div>
                            <span className="text-gray-400">예산: </span>
                            <span className="text-white">{project.budget}</span>
                          </div>
                        )}
                        {project.manager && (
                          <div>
                            <span className="text-gray-400">담당자: </span>
                            <span className="text-white">{project.manager}</span>
                          </div>
                        )}
                        {project.source && (
                          <div>
                            <span className="text-gray-400">출처: </span>
                            <span className="text-white text-xs truncate">{project.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap ${
                        project.status === '완료'
                          ? 'bg-green-500/20 text-green-400'
                          : project.status === '진행중'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.status}
                      </div>
                      {project.progress !== undefined && (
                        <div className="mt-2 text-center">
                          <p className="text-xs text-gray-400">진행률</p>
                          <p className="text-lg font-bold">{project.progress}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Files */}
        {relatedFiles.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              관련 문서 및 자료
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedFiles.map((file) => (
                <div key={file.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{file.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                          {file.type}
                        </span>
                        <span className="text-xs text-gray-400">{file.size}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(file.modifiedDate).toLocaleDateString('ko-KR')}
                      </p>
                      {file.category && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                          {file.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Related Files */}
        {relatedFiles.length === 0 && relatedProjects.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <p className="text-gray-400">관련 프로젝트 및 문서가 없습니다.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
