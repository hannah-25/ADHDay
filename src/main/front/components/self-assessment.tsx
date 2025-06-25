"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileText, Target } from "lucide-react"

const asrsQuestions = [
  "일을 마무리하는 데 어려움이 있다",
  "체계적인 일을 할 때 순서대로 하기 어렵다",
  "약속이나 해야 할 일을 잊어버린다",
  "오랫동안 집중해야 하는 일을 피하거나 미룬다",
  "오래 앉아있을 때 손발을 만지작거리거나 꼼지락거린다",
  "마치 모터가 달린 것처럼 지나치게 활동적이거나 뭔가 하지 않으면 안 된다고 느낀다",
]

const scaleLabels = ["전혀 그렇지 않다", "거의 그렇지 않다", "때때로 그렇다", "자주 그렇다", "매우 자주 그렇다"]

export default function SelfAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [asrsAnswers, setAsrsAnswers] = useState<number[]>(new Array(6).fill(-1))
  const [selfDescription, setSelfDescription] = useState("")
  const [expectations, setExpectations] = useState("")

  const handleAsrsAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...asrsAnswers]
    newAnswers[questionIndex] = value
    setAsrsAnswers(newAnswers)
  }

  const calculateAsrsScore = () => {
    return asrsAnswers.reduce((sum, answer) => sum + (answer >= 0 ? answer : 0), 0)
  }

  const getAsrsInterpretation = (score: number) => {
    if (score >= 14) return { level: "높음", color: "text-red-600", description: "전문의 상담을 권장합니다" }
    if (score >= 10) return { level: "중간", color: "text-yellow-600", description: "추가 평가가 도움될 수 있습니다" }
    return { level: "낮음", color: "text-green-600", description: "현재 증상이 경미합니다" }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            자가 진단 및 초기 평가
          </CardTitle>
          <CardDescription>ADHD 증상을 체계적으로 평가하고 치료 목표를 설정해보세요</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            증상 서술
          </TabsTrigger>
          <TabsTrigger value="asrs" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            ASRS 체크리스트
          </TabsTrigger>
          <TabsTrigger value="expectations" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            치료 목표
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>나의 ADHD 증상 서술</CardTitle>
              <CardDescription>
                자신이 경험하는 증상을 자유롭게 기록해주세요. 이 내용은 향후 치료 효과 평가의 기준점이 됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="예시: 어릴 때부터 물건을 자주 떨어뜨리거나 잃어버립니다. 수업 시간에 집중하기 어려워 항상 졸았고, 중요한 내용을 놓쳐서 친구들에게 물어보곤 했습니다..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">기록 가이드</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 기억력, 집중력 관련 경험</li>
                  <li>• 충동성, 과잉행동 증상</li>
                  <li>• 회피 성향이나 미루는 습관</li>
                  <li>• 일상생활이나 업무에서의 어려움</li>
                  <li>• 대인관계에서의 문제</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asrs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ASRS v1.1 자가 체크리스트</CardTitle>
              <CardDescription>
                WHO에서 개발한 성인 ADHD 선별 도구입니다. 지난 6개월간의 경험을 바탕으로 응답해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {asrsQuestions.map((question, index) => (
                <div key={index} className="space-y-3">
                  <Label className="text-base font-medium">
                    {index + 1}. {question}
                  </Label>
                  <RadioGroup
                    value={asrsAnswers[index]?.toString() || ""}
                    onValueChange={(value) => handleAsrsAnswer(index, Number.parseInt(value))}
                    className="flex flex-wrap gap-4"
                  >
                    {scaleLabels.map((label, scaleIndex) => (
                      <div key={scaleIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={scaleIndex.toString()} id={`q${index}-${scaleIndex}`} />
                        <Label htmlFor={`q${index}-${scaleIndex}`} className="text-sm">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              {asrsAnswers.every((answer) => answer >= 0) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>평가 결과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const score = calculateAsrsScore()
                      const interpretation = getAsrsInterpretation(score)
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>총점</span>
                            <span className="text-2xl font-bold">{score}/24</span>
                          </div>
                          <Progress value={(score / 24) * 100} />
                          <div className={`text-center ${interpretation.color}`}>
                            <p className="font-medium">위험도: {interpretation.level}</p>
                            <p className="text-sm">{interpretation.description}</p>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expectations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>치료 기대 효과 및 목표</CardTitle>
              <CardDescription>
                현재 가장 불편한 점과 치료를 통해 개선하고 싶은 부분을 구체적으로 적어주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="예시: 업무 중 약을 줬는지 안 줬는지 기억이 안 나서 불안합니다. 집중력을 유지해서 실수를 줄이고 싶습니다. 미루는 습관을 고쳐서 업무 효율성을 높이고 싶습니다..."
                value={expectations}
                onChange={(e) => setExpectations(e.target.value)}
                className="min-h-[150px]"
              />
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">목표 설정 팁</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 구체적이고 측정 가능한 목표로 설정</li>
                  <li>• 일상생활, 업무, 대인관계 영역별로 구분</li>
                  <li>• 단기(1-3개월)와 장기(6개월 이상) 목표 구분</li>
                  <li>• 현실적이고 달성 가능한 수준으로 설정</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button size="lg" className="px-8">
          평가 결과 저장
        </Button>
      </div>
    </div>
  )
}
