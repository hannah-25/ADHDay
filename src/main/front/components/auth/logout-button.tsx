"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export default function LogoutButton({ variant = "outline", size = "default", className }: LogoutButtonProps) {
  const handleLogout = async () => {
    // 로그아웃 로직 구현
    console.log("Logout initiated")

    // 로컬 스토리지 클리어
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // 쿠키 클리어 (실제 구현 시)
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // 로그인 페이지로 리다이렉트
    window.location.href = "/auth/login"
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="w-4 h-4 mr-2" />
      로그아웃
    </Button>
  )
}
