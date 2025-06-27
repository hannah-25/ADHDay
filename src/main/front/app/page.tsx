"use client"

import { useState } from "react"
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

export default function ADHDayApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "해나",
    email: "judyjjj106@gmail.com",
    avatar: "/placeholder-user.jpg"
  })
  const router = useRouter()

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleSignup = () => {
    router.push("/auth/signup")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
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
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{userProfile.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
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
