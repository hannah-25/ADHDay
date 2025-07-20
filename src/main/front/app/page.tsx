"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {  TrendingUp,  User, LogOut, LogIn, UserPlus, Info } from "lucide-react"
import Dashboard from "@/components/dashboard"
import Statistics from "@/components/statistics"
import { logout } from "@/lib/api"

export default function ADHDayApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [statisticsTab, setStatisticsTab] = useState("weekly")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "/placeholder-user.jpg"
  })
  const router = useRouter()

  // JWT 디코딩 함수
  function decodeJWT(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // 컴포넌트 마운트 시 로그인 상태 확인 및 사용자 정보 가져오기
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      const user = decodeJWT(token);
      if (user && (user.sub || user.email)) {
        setUserProfile({
          name: user.name || (user.sub ? user.sub.split('@')[0] : (user.email ? user.email.split('@')[0] : '사용자')),
          email: user.sub || user.email || '',
          avatar: "/placeholder-user.jpg"
        });
        setIsLoggedIn(true);
        return;
      }
    }
    setIsLoggedIn(false);
    setUserProfile({ name: "", email: "", avatar: "/placeholder-user.jpg" });
  }, []);

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleSignup = () => {
    router.push("/auth/signup")
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsLoggedIn(false)
      setUserProfile({ name: "", email: "", avatar: "/placeholder-user.jpg" })
      alert('로그아웃되었습니다.')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 로컬에서 토큰과 사용자 정보 제거하고 로그아웃 처리
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsLoggedIn(false)
      setUserProfile({ name: "", email: "", avatar: "/placeholder-user.jpg" })
      alert('로그아웃되었습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          {/* Navigation Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">ADHDay</h1>
            </div>
            
            {/* Login/User Profile Section */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name || userProfile.email} />
                        <AvatarFallback>{(userProfile.name || userProfile.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{userProfile.name || userProfile.email || '사용자'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile.name || userProfile.email || '사용자'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile.email || '이메일 없음'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>프로필</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>설정</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleLogin}>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </Button>
                  <Button size="sm" onClick={handleSignup}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    회원가입
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Title and Description */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ADHDay</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ADHD인의 증상과 감정 상태, 약물 복용 효과를 기록하고 분석하여 더 나은 일상을 만들어가는 여정을 함께합니다
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              ADHD를 araboza!
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              onReportClick={() => { setActiveTab('statistics'); setStatisticsTab('weekly'); }}
              onConsultationClick={() => { setActiveTab('statistics'); setStatisticsTab('consultation'); }}
            />
          </TabsContent>

          <TabsContent value="info">
            <div className="max-w-2xl mx-auto py-16">
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">ADHD를 araboza!</h2>
                <p className="text-gray-700 mb-2">ADHD 질병 정보, 약 정보 등 다양한 자료가 곧 업로드될 예정입니다.</p>
                <p className="text-gray-500">최신 의학 정보와 실생활 팁, 약물 정보, 자주 묻는 질문 등 유익한 콘텐츠를 준비 중입니다.<br/>조금만 기다려 주세요!</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics selectedTab={statisticsTab} onTabChange={setStatisticsTab} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
