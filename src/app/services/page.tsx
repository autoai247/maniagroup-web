import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import categoriesData from '@/data/categories.json';

export default function ServicesPage() {
  const categories = categoriesData.categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              홈으로
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MANIA GROUP
            </h1>
            <Link href="/contact" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold hover:scale-105 transition-all">
              상담 문의
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>

        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            전산업 비즈니스 & 마케팅
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            18개 대카테고리 · 95+ 중카테고리 · 280+ 세부항목
          </p>
          <p className="text-lg text-gray-400">
            어떤 업종, 어떤 규모의 광고주도 100% 커버하는 완전체 마케팅 솔루션
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {categories.map((category, idx) => (
              <div key={category.id} className="scroll-mt-24" id={`category-${category.id}`}>
                {/* Category Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-5xl">{category.icon}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold">{category.name}</h2>
                        <span className="text-sm text-gray-400 font-mono">#{category.id}</span>
                      </div>
                      <p className="text-gray-400">{category.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 pl-16">{category.summary}</p>
                </div>

                {/* Sub-categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.subCategories.map((subCat) => (
                    <div
                      key={subCat.id}
                      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105 group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}></div>

                      <div className="relative">
                        <h3 className="text-xl font-bold mb-4 text-white">{subCat.name}</h3>
                        <ul className="space-y-2">
                          {subCat.services.map((service, sIdx) => (
                            <li key={sIdx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                {idx < categories.length - 1 && (
                  <div className="mt-16 border-t border-white/10"></div>
                )}
              </div>
            ))}
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:scale-105 transition-all">
              무료 상담 신청하기
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20">
              <ArrowLeft className="w-5 h-5" />
              홈으로 돌아가기
            </Link>
          </div>
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
