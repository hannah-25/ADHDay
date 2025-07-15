"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, Heart, Calendar, TrendingUp } from "lucide-react"

interface AssessmentResult {
  id: string
  date: string
  asrs: {
    score: number
    level: string
    description: string
    answers: number[]
  }
  gad7: {
    score: number
    level: string
    description: string
    answers: number[]
  }
  phq9: {
    score: number
    level: string
    description: string
    answers: number[]
  }
  selfDescription: string
  expectations: string
}

export default function AssessmentResults() {
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null)

  useEffect(() => {
    // localStorage에서 저장된 결과 불러오기
    const savedResults = localStorage.getItem('assessmentResults')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setResults(parsedResults)
        if (parsedResults.length > 0) {
          setSelectedResult(parsedResults[0]) // 가장 최근 결과 선택
        }
      } catch (error) {
        console.error('결과 데이터 파싱 실패:', error)
      }
    }
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case '높음':
      case '심함':
        return 'text-red-600'
      case '중간':
        return 'text-yellow-600'
      case '경미':
        return 'text-orange-600'
      case '최소':
        return 'text-blue-600'
      case '낮음':
      case '정상':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case '높음':
      case '심함':
        return 'destructive'
      case '중간':
        return 'secondary'
      case '경미':
        return 'outline'
      case '최소':
        return 'outline'
      case '낮음':
      case '정상':
        return 'default'
      default:
        return 'outline'
    }
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
                      <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            나도 ADHD일까?
          </CardTitle>
          <CardDescription>
            아직 자가진단을 완료하지 않았습니다. 자가진단을 먼저 진행해주세요.
          </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">자가진단 결과가 없습니다</p>
              <Button onClick={() => window.open('/assessment', '_blank')}>
                자가진단 시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            나도 ADHD일까? - 진단 결과
          </CardTitle>
          <CardDescription>
            과거 자가진단 결과를 확인하고 변화 추이를 분석해보세요
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 결과 목록 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">진단 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedResult?.id === result.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {new Date(result.date).toLocaleDateString('ko-KR')}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {index === 0 ? '최신' : `${results.length - index}회전`}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Badge 
                        variant={getLevelBadgeVariant(result.asrs.level)} 
                        className="text-xs"
                      >
                        ADHD: {result.asrs.level}
                      </Badge>
                      <Badge 
                        variant={getLevelBadgeVariant(result.gad7.level)} 
                        className="text-xs"
                      >
                        불안: {result.gad7.level}
                      </Badge>
                      <Badge 
                        variant={getLevelBadgeVariant(result.phq9.level)} 
                        className="text-xs"
                      >
                        우울: {result.phq9.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 선택된 결과 상세 */}
        <div className="lg:col-span-3">
          {selectedResult && (
            <div className="space-y-6">
              {/* 결과 요약 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>진단 결과 요약</span>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedResult.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ASRS 결과 */}
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Brain className="w-5 h-5 text-blue-600" />
                          ADHD (ASRS)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">총점</span>
                            <span className="text-xl font-bold">{selectedResult.asrs.score}/72</span>
                          </div>
                          <Progress value={(selectedResult.asrs.score / 72) * 100} />
                          <div className={`text-center ${getLevelColor(selectedResult.asrs.level)}`}>
                            <Badge variant={getLevelBadgeVariant(selectedResult.asrs.level)}>
                              {selectedResult.asrs.level}
                            </Badge>
                            <p className="text-sm mt-1">{selectedResult.asrs.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* GAD-7 결과 */}
                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          불안 (GAD-7)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">총점</span>
                            <span className="text-xl font-bold">{selectedResult.gad7.score}/21</span>
                          </div>
                          <Progress value={(selectedResult.gad7.score / 21) * 100} />
                          <div className={`text-center ${getLevelColor(selectedResult.gad7.level)}`}>
                            <Badge variant={getLevelBadgeVariant(selectedResult.gad7.level)}>
                              {selectedResult.gad7.level}
                            </Badge>
                            <p className="text-sm mt-1">{selectedResult.gad7.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* PHQ-9 결과 */}
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Heart className="w-5 h-5 text-purple-600" />
                          우울 (PHQ-9)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">총점</span>
                            <span className="text-xl font-bold">{selectedResult.phq9.score}/27</span>
                          </div>
                          <Progress value={(selectedResult.phq9.score / 27) * 100} />
                          <div className={`text-center ${getLevelColor(selectedResult.phq9.level)}`}>
                            <Badge variant={getLevelBadgeVariant(selectedResult.phq9.level)}>
                              {selectedResult.phq9.level}
                            </Badge>
                            <p className="text-sm mt-1">{selectedResult.phq9.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* 증상 서술 및 치료 목표 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">증상 서술</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[120px]">
                      {selectedResult.selfDescription || '증상 서술이 없습니다.'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">치료 목표</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[120px]">
                      {selectedResult.expectations || '치료 목표가 설정되지 않았습니다.'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 추이 분석 */}
              {results.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      변화 추이
                    </CardTitle>
                    <CardDescription>
                      최근 3회 진단 결과의 변화를 확인해보세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.slice(0, 3).map((result, index) => (
                        <div key={result.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium min-w-[80px]">
                            {new Date(result.date).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="flex gap-2 flex-1">
                            <Badge variant="outline" className="text-xs">
                              ADHD: {result.asrs.score}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              불안: {result.gad7.score}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              우울: {result.phq9.score}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {index === 0 ? '최신' : `${index + 1}회전`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => window.open('/assessment', '_blank')}>
          새로운 자가진단 시작
        </Button>
      </div>
    </div>
  )
} 