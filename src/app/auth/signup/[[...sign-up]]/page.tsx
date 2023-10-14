'use client'

import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <SignUp />
    </div>
  )
}
