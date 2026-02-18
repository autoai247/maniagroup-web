'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Star,
  Package,
  Download
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // 인증 체크
    const authenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');

    if (!authenticated) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setUserEmail(email || '');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: '대시보드', href: '/admin/dashboard' },
    { icon: FolderKanban, label: '프로젝트 관리', href: '/admin/projects' },
    { icon: Users, label: '광고주 관리', href: '/admin/clients' },
    { icon: Building2, label: '파트너/실행사', href: '/admin/partners' },
    { icon: Star, label: '인플루언서', href: '/admin/influencers' },
    { icon: Package, label: '제품 관리', href: '/admin/products' },
    { icon: FileText, label: '문서 관리', href: '/admin/documents' },
    { icon: Download, label: '리포트/내보내기', href: '/admin/reports' },
    { icon: Settings, label: '설정', href: '/admin/settings' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-black/40 backdrop-blur-lg border-r border-white/10 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {isSidebarOpen ? (
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MANIA GROUP
                </h1>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}

            {/* Home Link */}
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all border-t border-white/10 mt-4 pt-4"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">홈페이지</span>}
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/10">
            {isSidebarOpen ? (
              <div className="mb-3 p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">로그인 계정</p>
                <p className="text-sm font-medium truncate">{userEmail}</p>
              </div>
            ) : (
              <div className="mb-3 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>로그아웃</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
