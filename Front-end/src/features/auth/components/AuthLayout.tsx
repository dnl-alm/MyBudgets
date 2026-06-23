import type { ReactNode } from 'react'

interface AuthLayoutProps {
  branding: ReactNode
  children: ReactNode
}

export function AuthLayout({ branding, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090B] flex p-4 lg:p-6 gap-4 lg:gap-6">
      {branding}
      <main className="flex-1 flex items-start justify-center
                       px-6 pt-20 pb-12 lg:px-12 lg:pt-24
                       bg-[#09090B] rounded-2xl
                       overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </main>
    </div>
  )
}