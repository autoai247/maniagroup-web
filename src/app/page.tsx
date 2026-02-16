import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: '대카테고리', value: '18개', icon: Target },
    { label: '중카테고리', value: '95+', icon: Sparkles },
    { label: '세부항목', value: '280+', icon: Zap },
    { label: '파트너사', value: '50+', icon: Users },
  ];

  const categories = [
    { id: 1, name: '퍼포먼스 마케팅', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'SNS 마케팅 & 콘텐츠', icon: '📱', color: 'from-pink-500 to-rose-500' },
    { id: 3, name: '인플루언서 & 바이럴', icon: '⭐', color: 'from-purple-500 to-indigo-500' },
    { id: 4, name: '로컬 & 지도 마케팅', icon: '📍', color: 'from-green-500 to-emerald-500' },
    { id: 5, name: 'SEO & 웹사이트 최적화', icon: '🔍', color: 'from-orange-500 to-amber-500' },
    { id: 6, name: '미디어 & PR', icon: '📰', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MANIA GROUP
            </h1>
            <p className="text-3xl font-semibold mb-4">
              전산업 비즈니스 & 마케팅
            </p>
            <p className="text-xl text-gray-300 mb-8">
              어떤 업종, 어떤 규모의 광고주도 100% 커버하는 완전체 통합 마케팅 솔루션
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <Icon className="w-8 h-8 mb-3 mx-auto text-blue-400" />
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2">
                서비스 둘러보기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20">
                상담 문의
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Preview */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">
            18개 대카테고리로 모든 마케팅을 해결합니다
          </h2>
          <p className="text-center text-gray-400 mb-12">
            퍼포먼스부터 글로벌까지, 완벽한 마케팅 생태계
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <div key={category.id} className="group relative overflow-hidden bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <div className="flex items-center text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    자세히 보기
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-all border border-white/20">
              전체 18개 카테고리 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4">통합 솔루션</h3>
              <p className="text-gray-400">
                18개 카테고리, 95+ 중카테고리로 모든 마케팅 니즈를 한 곳에서 해결
              </p>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-3xl">
                🤝
              </div>
              <h3 className="text-2xl font-bold mb-4">검증된 파트너</h3>
              <p className="text-gray-400">
                50+ 협력사와 함께 최고의 마케팅 결과를 제공합니다
              </p>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-4">데이터 기반</h3>
              <p className="text-gray-400">
                체계적인 관리 시스템으로 모든 프로젝트를 투명하게 관리
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            매니아그룹과 함께 성공적인 마케팅을 경험해보세요
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:scale-105 transition-all">
            무료 상담 신청하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p className="mb-2">© 2025 MANIA GROUP. All rights reserved.</p>
          <p className="text-sm">전산업 비즈니스 & 마케팅 통합 마스터 카테고리 v4.0</p>
        </div>
      </footer>
    </div>
  );
}
