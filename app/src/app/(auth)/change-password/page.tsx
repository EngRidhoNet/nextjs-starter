"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500 text-sm">
          <p>Password change is coming soon.</p>
          <p className="mt-4">
            <Link href="/dashboard" className="text-indigo-600 hover:underline font-medium">
              Back to Dashboard
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
