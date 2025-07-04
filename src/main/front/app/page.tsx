"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, Pill, Brain, TrendingUp, FileText, User, LogOut, LogIn, UserPlus } from "lucide-react"
import Dashboard from "@/components/dashboard"
import SelfAssessment from "@/components/self-assessment"
import DailyLog from "@/components/daily-log"
import MedicationManager from "@/components/medication-manager"
import Statistics from "@/components/statistics"
import ConsultationPrep from "@/components/consultation-prep"
import { logout, getUserInfo } from "@/lib/api"

export default function ADHDayApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "/placeholder-user.jpg"
  })
  const router = useRouter()

  // 컴포넌트 마운트 시 로그인 상태 확인 및 사용자 정보 가져오기
  useEffect(() => {
    console.log('페이지 로드 - 로그인 상태 확인 중...')
    const token = localStorage.getItem('authToken')
    console.log('저장된 토큰:', token ? '있음' : '없음')
    
    if (token) {
      setIsLoggedIn(true)
      console.log('로그인 상태로 설정됨')
      
      // localStorage에서 사용자 정보 확인
      const savedUserInfo = localStorage.getItem('userInfo')
      console.log('저장된 사용자 정보:', savedUserInfo)
      
      if (savedUserInfo) {
        try {
          const userInfo = JSON.parse(savedUserInfo)
          console.log('파싱된 사용자 정보:', userInfo)
          setUserProfile(userInfo)
        } catch (error) {
          console.error('저장된 사용자 정보 파싱 실패:', error)
        }
      } else {
        console.log('저장된 사용자 정보가 없음')
      }
      
      // 서버에서 최신 사용자 정보 가져오기 (백그라운드에서)
      fetchUserInfo()
    } else {
      console.log('토큰이 없어 로그아웃 상태로 설정됨')
    }
  }, [])

  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      if (response.data.user) {
        setUserProfile({
          name: response.data.user.name || response.data.user.email.split('@')[0], // 이름이 없으면 이메일 앞부분 사용
          email: response.data.user.email,
          avatar: response.data.user.avatar || "/placeholder-user.jpg"
        })
        console.log('서버에서 사용자 정보 업데이트됨:', response.data.user)
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error)
      // 에러가 발생해도 localStorage의 정보를 사용하므로 로그아웃하지 않음
      // 대신 콘솔에 경고만 출력
      console.warn('서버에서 사용자 정보를 가져올 수 없지만, 로컬 정보를 사용합니다.')
    }
  }

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleSignup = () => {
    router.push("/auth/signup")
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      setIsLoggedIn(false)
      setUserProfile({ name: "", email: "", avatar: "/placeholder-user.jpg" })
      alert('로그아웃되었습니다.')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 로컬에서 토큰과 사용자 정보 제거하고 로그아웃 처리
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
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
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              자가진단
            </TabsTrigger>
            <TabsTrigger value="daily-log" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              일지작성
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              약물관리
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              통계
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              상담준비
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="assessment">
            <SelfAssessment />
          </TabsContent>

          <TabsContent value="daily-log">
            <DailyLog />
          </TabsContent>

          <TabsContent value="medication">
            <MedicationManager />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics />
          </TabsContent>

          <TabsContent value="consultation">
            <ConsultationPrep />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
