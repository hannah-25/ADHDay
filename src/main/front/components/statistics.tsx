"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, Pill, Heart } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const weeklyData = [
  { day: "월", medication: 100, mood: 7, effectiveness: 8 },
  { day: "화", medication: 100, mood: 6, effectiveness: 7 },
  { day: "수", medication: 50, mood: 5, effectiveness: 4 },
  { day: "목", medication: 100, mood: 8, effectiveness: 9 },
  { day: "금", medication: 100, mood: 7, effectiveness: 8 },
  { day: "토", medication: 0, mood: 4, effectiveness: 2 },
  { day: "일", medication: 100, mood: 6, effectiveness: 6 },
]

const monthlyMoodData = [
  { week: "1주차", happy: 3, neutral: 2, sad: 1, anxious: 1 },
  { week: "2주차", happy: 4, neutral: 2, sad: 0, anxious: 1 },
  { week: "3주차", happy: 2, neutral: 3, sad: 2, anxious: 0 },
  { week: "4주차", happy: 5, neutral: 1, sad: 1, anxious: 0 },
]

export default function Statistics() {
  const currentWeek = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            통계 및 분석
          </CardTitle>
          <CardDescription>약물 복용 패턴과 증상 변화를 시각적으로 확인하세요</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">주간 분석</TabsTrigger>
          <TabsTrigger value="monthly">월간 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* 주간 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">복용률</p>
                    <p className="text-2xl font-bold">85.7%</p>
                  </div>
                  <Pill className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">평균 기분</p>
                    <p className="text-2xl font-bold">6.1/10</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">약물 효과</p>
                    <p className="text-2xl font-bold">7.1/10</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">일지 작성</p>
                    <p className="text-2xl font-bold">6/7일</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 주간 트렌드 차트 */}
          <Card>
            <CardHeader>
              <CardTitle>주간 트렌드</CardTitle>
              <CardDescription>복용률, 기분, 약물 효과의 일별 변화</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="medication" stroke="#3b82f6" strokeWidth={2} name="복용률 (%)" />
                  <Line type="monotone" dataKey="mood" stroke="#ef4444" strokeWidth={2} name="기분 점수" />
                  <Line type="monotone" dataKey="effectiveness" stroke="#10b981" strokeWidth={2} name="약물 효과" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 주간 패턴 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>주간 패턴 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">긍정적 패턴</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 평일 복용률이 높을 때 약물 효과도 함께 상승</li>
                    <li>• 목요일에 가장 좋은 컨디션을 보임</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">개선 필요</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• 주말 복용률 저하로 인한 효과 감소</li>
                    <li>• 수요일 컨디션 난조 원인 파악 필요</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          {/* 월간 감정 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>월간 감정 분포</CardTitle>
              <CardDescription>주차별 감정 상태 변화</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyMoodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="happy" stackId="a" fill="#10b981" name="기쁨" />
                  <Bar dataKey="neutral" stackId="a" fill="#6b7280" name="보통" />
                  <Bar dataKey="sad" stackId="a" fill="#3b82f6" name="슬픔" />
                  <Bar dataKey="anxious" stackId="a" fill="#f59e0b" name="불안" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 월간 캘린더 뷰 */}
          <Card>
            <CardHeader>
              <CardTitle>월간 캘린더</CardTitle>
              <CardDescription>일별 복용 여부와 주요 이벤트</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div key={day} className="aspect-square border rounded-lg p-1 text-sm">
                    <div className="font-medium">{day}</div>
                    <div className="flex flex-col gap-1 mt-1">
                      {day % 3 !== 0 && <div className="w-2 h-2 bg-blue-500 rounded-full" title="약물 복용" />}
                      {day === 15 && (
                        <Badge variant="outline" className="text-xs p-0 px-1">
                          상담
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>약물 복용</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    상담
                  </Badge>
                  <span>의사 상담</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 월간 종합 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>월간 종합 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">이번 달 성과</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">전체 복용률</span>
                      <Badge>87%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">일지 작성률</span>
                      <Badge>92%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">평균 약물 효과</span>
                      <Badge>7.3/10</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">다음 달 목표</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• 주말 복용률 90% 이상 유지</p>
                    <p>• 부작용 모니터링 강화</p>
                    <p>• 수면 패턴 개선</p>
                    <p>• 정기 상담 일정 준수</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
