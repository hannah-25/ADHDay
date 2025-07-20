"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAssessmentTemplate, submitAssessmentAnswers } from "@/lib/api"
import { AssessmentTemplate, AssessmentAnswer } from "@/types/assessment"
import { useEffect } from "react"

const TEMPLATES = [
  { typeId: 1, label: "ASRS" },
  { typeId: 2, label: "GAD-7" },
  { typeId: 3, label: "PHQ-9" }
]

const tabs = ["description", ...TEMPLATES.map(t => t.label), "expectations"]

export default function SelfAssessment() {
  const [currentTab, setCurrentTab] = useState("description")
  const [description, setDescription] = useState("")
  const [expectations, setExpectations] = useState("")
  const [templates, setTemplates] = useState<{ [key: number]: AssessmentTemplate | null }>({})
  const [answers, setAnswers] = useState<{ [key: number]: AssessmentAnswer[] }>({})
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  const [error, setError] = useState<{ [key: number]: string | null }>({})
  const [submitting, setSubmitting] = useState(false)

  // Fetch template when entering each template tab
  useEffect(() => {
    const templateIdx = TEMPLATES.findIndex(t => t.label === currentTab)
    if (templateIdx !== -1) {
      const { typeId } = TEMPLATES[templateIdx]
      if (!templates[typeId] && !loading[typeId]) {
        setLoading(l => ({ ...l, [typeId]: true }))
        getAssessmentTemplate(typeId)
          .then(res => {
            setTemplates(t => ({ ...t, [typeId]: res.data }))
            setAnswers(a => ({ ...a, [typeId]: res.data.questions.map((q: any) => ({ questionId: q.id, value: -1 })) }))
            setLoading(l => ({ ...l, [typeId]: false }))
          })
          .catch(e => {
            setError(er => ({ ...er, [typeId]: "설문 정보를 불러오지 못했습니다." }))
            setLoading(l => ({ ...l, [typeId]: false }))
          })
      }
    }
  }, [currentTab])

  const handleAnswer = (typeId: number, questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [typeId]: prev[typeId].map(a => a.questionId === questionId ? { ...a, value } : a)
    }))
  }

  const canGoNext = () => {
    if (currentTab === "description") return description.trim().length > 0
    const templateIdx = TEMPLATES.findIndex(t => t.label === currentTab)
    if (templateIdx !== -1) {
      const typeId = TEMPLATES[templateIdx].typeId
      return answers[typeId]?.every(a => a.value >= 0)
    }
    if (currentTab === "expectations") return expectations.trim().length > 0
    return false
  }

  const getNextTab = () => {
    const idx = tabs.indexOf(currentTab)
    return idx < tabs.length - 1 ? tabs[idx + 1] : null
  }
  const getPrevTab = () => {
    const idx = tabs.indexOf(currentTab)
    return idx > 0 ? tabs[idx - 1] : null
  }

  const handleNext = () => {
    if (!canGoNext()) {
      alert("모든 항목을 입력해주세요.")
      return
    }
    const next = getNextTab()
    if (next) setCurrentTab(next)
  }
  const handlePrev = () => {
    const prev = getPrevTab()
    if (prev) setCurrentTab(prev)
  }

  const handleSubmit = async () => {
    if (!canGoNext()) {
      alert("모든 항목을 입력해주세요.")
      return
    }
    setSubmitting(true)
    try {
      // 각 설문 유형별로 별도 제출
      for (const t of TEMPLATES) {
        const typeId = t.typeId
        const typeAnswers = answers[typeId] || []
        console.log('제출 typeId:', typeId, 'answers:', typeAnswers)
        try {
          await submitAssessmentAnswers(typeId, typeAnswers)
        } catch (e) {
          console.error(`설문 제출 실패 (typeId: ${typeId})`, e)
        }
      }
      alert("자가진단 결과가 제출되었습니다!")
      window.location.href = "/"
    } catch (e) {
      alert("제출에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="description">증상 서술</TabsTrigger>
          {TEMPLATES.map(t => (
            <TabsTrigger key={t.typeId} value={t.label}>{t.label}</TabsTrigger>
          ))}
          <TabsTrigger value="expectations">치료 목표</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>나의 ADHD 증상 서술</CardTitle>
              <CardDescription>자신이 경험하는 증상을 자유롭게 기록해주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full border rounded p-2 min-h-[120px]"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {TEMPLATES.map(t => (
          <TabsContent key={t.typeId} value={t.label}>
            <Card>
              <CardHeader>
                <CardTitle>{t.label} 자가진단</CardTitle>
                <CardDescription>아래 문항에 모두 답해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading[t.typeId] && <div>로딩 중...</div>}
                {error[t.typeId] && <div className="text-red-500">{error[t.typeId]}</div>}
                {templates[t.typeId] && templates[t.typeId]!.questions.map((q, idx) => (
                  <div key={q.id} className="mb-6">
                    <div className="font-medium mb-2">{idx + 1}. {q.text}</div>
                    <div className="flex gap-4">
                      {q.options.map(opt => (
                        <label key={opt.value} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`q-${t.typeId}-${q.id}`}
                            value={opt.value}
                            checked={answers[t.typeId]?.find(a => a.questionId === q.id)?.value === opt.value}
                            onChange={() => handleAnswer(t.typeId, q.id, opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="expectations">
          <Card>
            <CardHeader>
              <CardTitle>치료 기대 효과 및 목표</CardTitle>
              <CardDescription>치료를 통해 개선하고 싶은 점을 구체적으로 적어주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full border rounded p-2 min-h-[120px]"
                value={expectations}
                onChange={e => setExpectations(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrev} disabled={!getPrevTab()}>이전</Button>
        {currentTab !== "expectations" ? (
          <Button onClick={handleNext} disabled={!canGoNext()}>다음</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || !canGoNext()}>
            {submitting ? "제출 중..." : "제출하기"}
          </Button>
        )}
      </div>
    </div>
  )
}
