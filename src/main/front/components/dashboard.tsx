"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bell, CheckCircle, AlertCircle, TrendingUp, Calendar, Pill } from "lucide-react"

export default function Dashboard() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">안녕하세요! 👋</CardTitle>
          <CardDescription className="text-blue-100">{today} - 오늘도 함께 성장해나가요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-2">오늘의 진행률</p>
              <Progress value={65} className="bg-blue-400" />
            </div>
            <Badge variant="secondary" className="bg-white text-blue-600">
              65% 완료
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">약물 복용</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">오늘 2회 중 1회 복용 완료</p>
            <Button size="sm" className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              복용 체크
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">일지 작성</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">오늘의 감정과 상태를 기록해보세요</p>
            <Button size="sm" variant="outline" className="w-full">
              일지 쓰기
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">주간 리포트</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">이번 주 패턴을 분석해보세요</p>
            <Button size="sm" variant="outline" className="w-full">
              리포트 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              오늘의 알림
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">오후 약물 복용 시간</p>
                <p className="text-xs text-gray-600">14:00 - 콘서타 18mg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">다음 상담 예약</p>
                <p className="text-xs text-gray-600">12월 30일 오후 2시</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 기록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">어제 일지</p>
                <p className="text-xs text-gray-600">집중력 향상, 약간의 두통</p>
              </div>
              <Badge variant="outline">완료</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">약물 효과</p>
                <p className="text-xs text-gray-600">업무 실수 감소 8/10</p>
              </div>
              <Badge variant="outline">기록됨</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
