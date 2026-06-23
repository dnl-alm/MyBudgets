import type { ReactNode } from 'react'

interface AuthLayoutProps {
  branding: ReactNode
  children: ReactNode
}

export function AuthLayout({ branding, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {branding}
      <main className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </main>
    </div>
  )
}