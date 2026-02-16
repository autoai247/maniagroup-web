'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { User, Bell, Shield, Database, Cpu, Save, RefreshCw, Play, CheckCircle, Loader } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 프로필
    name: '관리자',
    email: 'admin@maniagroup.com',
    phone: '02-1234-5678',

    // 알림 설정
    emailNotifications: true,
    projectUpdates: true,
    clientMessages: false,
    partnerMessages: true,

    // AI 설정
    aiAutoClassify: true,
    aiConfidenceThreshold: 80,

    // 데이터 설정
    dataRetentionDays: 365,
    autoBackup: true,
    backupFrequency: 'weekly'
  });

  const [saved, setSaved] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [classifyResult, setClassifyResult] = useState<{success: boolean; message: string} | null>(null);

  const handleSave = () => {
    // TODO: 실제 저장 로직
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClassify = async () => {
    setClassifying(true);
    setClassifyResult(null);

    // TODO: 실제 분류 로직 - classify-files.js 스크립트 실행
    // 시뮬레이션
    setTimeout(() => {
      setClassifying(false);
      setClassifyResult({
        success: true,
        message: '58개 파일이 성공적으로 분류되었습니다.'
      });

      // 3초 후 결과 메시지 숨김
      setTimeout(() => setClassifyResult(null), 5000);
    }, 3000);
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">설정</h1>
          <p className="text-gray-400">시스템 설정 및 환경 구성</p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">프로필 설정</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">연락처</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">알림 설정</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium">이메일 알림 받기</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium">프로젝트 업데이트 알림</span>
              <input
                type="checkbox"
                checked={settings.projectUpdates}
                onChange={(e) => setSettings({ ...settings, projectUpdates: e.target.checked })}
                className="w-5 h-5 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium">광고주 메시지 알림</span>
              <input
                type="checkbox"
                checked={settings.clientMessages}
                onChange={(e) => setSettings({ ...settings, clientMessages: e.target.checked })}
                className="w-5 h-5 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium">파트너사 메시지 알림</span>
              <input
                type="checkbox"
                checked={settings.partnerMessages}
                onChange={(e) => setSettings({ ...settings, partnerMessages: e.target.checked })}
                className="w-5 h-5 accent-blue-500"
              />
            </label>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">자동 분류 설정</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <span className="font-medium block mb-1">자동 분류 활성화</span>
                <span className="text-sm text-gray-400">업로드된 문서를 자동으로 카테고리에 분류합니다</span>
              </div>
              <input
                type="checkbox"
                checked={settings.aiAutoClassify}
                onChange={(e) => setSettings({ ...settings, aiAutoClassify: e.target.checked })}
                className="w-5 h-5 accent-blue-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                신뢰도 임계값: {settings.aiConfidenceThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.aiConfidenceThreshold}
                onChange={(e) => setSettings({ ...settings, aiConfidenceThreshold: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                분류 신뢰도가 이 값 이상일 때만 자동 분류됩니다
              </p>
            </div>
          </div>
        </div>

        {/* Manual Classification */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">수동 분류 실행</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-300 mb-3">
                새로 등록된 파일이나 파트너 정보를 수동으로 분류할 수 있습니다.
                자동 분류가 완료되지 않았거나, 재분류가 필요한 경우 사용하세요.
              </p>
              <ul className="text-xs text-gray-400 space-y-1 mb-4">
                <li>• 등록된 모든 파일을 스캔합니다</li>
                <li>• 파일명과 폴더명 기반으로 카테고리를 자동 분류합니다</li>
                <li>• 파트너와 프로젝트도 함께 분류됩니다</li>
                <li>• 분류 결과는 각 관리 페이지에 즉시 반영됩니다</li>
              </ul>
            </div>

            <button
              onClick={handleClassify}
              disabled={classifying}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                classifying
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105'
              }`}
            >
              {classifying ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  분류 진행 중...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  분류 실행하기
                </>
              )}
            </button>

            {classifyResult && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                classifyResult.success
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}>
                {classifyResult.success ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Shield className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{classifyResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Data Settings */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">데이터 관리</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                데이터 보관 기간 (일)
              </label>
              <input
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <span className="font-medium block mb-1">자동 백업 활성화</span>
                <span className="text-sm text-gray-400">시스템 데이터를 자동으로 백업합니다</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                className="w-5 h-5 accent-green-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">백업 주기</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily" className="bg-gray-800">매일</option>
                <option value="weekly" className="bg-gray-800">매주</option>
                <option value="monthly" className="bg-gray-800">매월</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">시스템 정보</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">버전</span>
              <span className="font-semibold">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">마지막 업데이트</span>
              <span className="font-semibold">2025-02-17</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">데이터베이스</span>
              <span className="font-semibold text-green-400">정상</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            <Save className="w-5 h-5" />
            {saved ? '저장 완료!' : '설정 저장'}
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all border border-white/20">
            <RefreshCw className="w-5 h-5" />
            초기화
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center">
            설정이 성공적으로 저장되었습니다.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
