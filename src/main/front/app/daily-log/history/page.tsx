"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react"

export default function DailyLogHistoryPage() {
  const router = useRouter()

  // 임시 데이터 - 실제로는 localStorage나 API에서 가져올 데이터
  const mockLogs = [
    {
      id: 1,
      date: "2024-12-20",
      mood: "보통",
      focus: 7,
      energy: 6,
      sleep: 8,
      medication: "복용 완료",
      notes: "오늘은 집중력이 괜찮았고, 업무를 잘 마칠 수 있었다."
    },
    {
      id: 2,
      date: "2024-12-19",
      mood: "좋음",
      focus: 8,
      energy: 7,
      sleep: 7,
      medication: "복용 완료",
      notes: "약물 효과가 잘 나타나고 있다. 실수가 줄어들었다."
    },
    {
      id: 3,
      date: "2024-12-18",
      mood: "나쁨",
      focus: 4,
      energy: 3,
      sleep: 6,
      medication: "복용 완료",
      notes: "오늘은 집중하기 어려웠고, 업무에서 실수가 많았다."
    }
  ]

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "좋음": return "bg-green-100 text-green-800"
      case "보통": return "bg-yellow-100 text-yellow-800"
      case "나쁨": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">일지 기록</h1>
          <p className="text-gray-600">
            과거 일지 기록을 확인하고 패턴을 분석해보세요
          </p>
        </div>

        {/* Log History */}
        <div className="space-y-4">
          {mockLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {new Date(log.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </CardTitle>
                  </div>
                  <Badge className={getMoodColor(log.mood)}>
                    {log.mood}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">집중력</p>
                    <p className="text-2xl font-bold text-blue-600">{log.focus}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">에너지</p>
                    <p className="text-2xl font-bold text-green-600">{log.energy}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">수면</p>
                    <p className="text-2xl font-bold text-purple-600">{log.sleep}시간</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">약물</p>
                    <Badge variant={log.medication === "복용 완료" ? "default" : "destructive"}>
                      {log.medication}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">메모</span>
                  </div>
                  <p className="text-sm text-gray-600">{log.notes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockLogs.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">아직 작성된 일지가 없습니다</p>
              <Button onClick={() => window.open('/daily-log', '_blank')}>
                첫 일지 작성하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 