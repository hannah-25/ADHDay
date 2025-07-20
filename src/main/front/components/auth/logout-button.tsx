"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/api"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function LogoutButton({ variant = "outline", size = "default", className }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await logout()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
    } finally {
      // 로컬 스토리지 클리어
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      // 로그인 페이지로 리다이렉트
      window.location.href = "/auth/login"
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="w-4 h-4 mr-2" />
      로그아웃
    </Button>
  )
}
