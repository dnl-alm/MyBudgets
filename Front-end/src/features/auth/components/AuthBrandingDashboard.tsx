import { Link } from 'react-router-dom'
import { Shield, Home, ShoppingCart, Car, Sparkles, MoreHorizontal, Eye } from 'lucide-react'

export function AuthBrandingDashboard() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[480px] xl:w-[520px]
                      bg-gradient-to-b from-[#1A0F2E] via-[#0F0820] to-[#0B0B12]
                      rounded-2xl min-h-full
                      relative overflow-hidden p-8 xl:p-10
                      max-h-[calc(100vh-3rem)]
                      overflow-y-auto">

      {/* Glow ambiente */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px]
                      bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link to="/" className="relative flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]
                        flex items-center justify-center
                        shadow-[0_2px_8px_rgba(124,58,237,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M3 12V4l5 6 5-6v8" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold text-[#F4F4F5] tracking-tight">
          MyBudgets
        </span>
      </Link>

      {/* Headline */}
      <div className="relative mb-8">
        <h2 className="text-[38px] xl:text-[42px] font-bold text-[#F4F4F5]
                       tracking-tight leading-[1.05]">
          Organize suas<br />
          <span className="text-[#A78BFA]">finanças.</span><br />
          Conquiste seus<br />
          <span className="text-[#A78BFA]">objetivos.</span>
        </h2>
        <p className="text-[13px] text-[#A1A1AA] mt-4 leading-relaxed">
          Acompanhe seus gastos, crie orçamentos<br />
          e tenha controle total do seu dinheiro.
        </p>
      </div>

      {/* Card hero — saldo */}
      <div className="relative bg-[#13131A]/80 backdrop-blur-sm border border-[#1F1F26]
                      rounded-xl p-4 mb-3
                      shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] text-[#A1A1AA] font-medium">Saldo disponível</span>
          <Eye size={11} className="text-[#52525B]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[22px] font-bold text-[#F4F4F5] tracking-tight">
            R$ 4.850,00
          </span>
          <span className="text-[10px] text-[#4ADE80] bg-[#4ADE80]/10
                           px-1.5 py-0.5 rounded font-semibold">
            +12,5%
          </span>
        </div>

        {/* Mini gráfico */}
        <svg className="w-full mt-2" height="40" viewBox="0 0 280 40" fill="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 32 Q35 28 70 26 T140 18 T210 12 T280 4"
            stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          <path
            d="M0 32 Q35 28 70 26 T140 18 T210 12 T280 4 L280 40 L0 40 Z"
            fill="url(#lineGrad)"
          />
          <circle cx="280" cy="4" r="2.5" fill="#A78BFA" />
          <circle cx="280" cy="4" r="5" fill="#A78BFA" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Card orçamento */}
      <div className="relative bg-[#13131A]/80 backdrop-blur-sm border border-[#1F1F26]
                      rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[#A1A1AA] font-medium">Orçamento do mês</span>
          <span className="text-[10px] text-[#A78BFA] font-semibold">80% utilizado</span>
        </div>
        <div className="h-1.5 bg-[#1F1F26] rounded-full overflow-hidden mb-1.5">
          <div className="h-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] rounded-full"
               style={{ width: '80%' }} />
        </div>
        <div className="text-[11px] text-[#71717A]">
          R$ 2.400,00 de R$ 3.000,00
        </div>
      </div>

      {/* Card de categorias — mb-auto empurra o selo para o rodapé */}
      <div className="relative bg-[#13131A]/80 backdrop-blur-sm border border-[#1F1F26]
                      rounded-xl p-4 mb-auto">
        <div className="text-[11px] text-[#A1A1AA] font-medium mb-3">Categorias</div>
        <div className="space-y-2">
          <CategoryRow icon={<Home size={11} />}           color="#A78BFA" label="Moradia"     percent="30%" value="R$ 900,00" />
          <CategoryRow icon={<ShoppingCart size={11} />}   color="#4ADE80" label="Alimentação" percent="25%" value="R$ 750,00" />
          <CategoryRow icon={<Car size={11} />}            color="#FB923C" label="Transporte"  percent="15%" value="R$ 450,00" />
          <CategoryRow icon={<Sparkles size={11} />}       color="#60A5FA" label="Lazer"       percent="10%" value="R$ 300,00" />
          <CategoryRow icon={<MoreHorizontal size={11} />} color="#71717A" label="Outros"      percent="20%" value="R$ 600,00" />
        </div>
      </div>

      {/* Selo de confiança — ancorado no rodapé pelo mb-auto acima */}
      <div className="relative flex items-start gap-3 mt-6 pt-6 border-t border-[#1F1F26]">
        <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20
                        flex items-center justify-center shrink-0">
          <Shield size={15} className="text-[#A78BFA]" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#F4F4F5]">
            Seus dados estão <span className="text-[#A78BFA]">protegidos</span>
          </div>
          <div className="text-[11px] text-[#71717A] mt-0.5 leading-relaxed">
            Utilizamos criptografia de ponta a ponta para<br />
            manter suas informações seguras.
          </div>
        </div>
      </div>

    </aside>
  )
}

interface CategoryRowProps {
  icon: React.ReactNode
  color: string
  label: string
  percent: string
  value: string
}

function CategoryRow({ icon, color, label, percent, value }: CategoryRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
           style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <span className="text-[11px] text-[#E4E4E7] flex-1">{label}</span>
      <span className="text-[10px] text-[#71717A] tabular-nums">{percent}</span>
      <span className="text-[11px] text-[#A1A1AA] font-medium tabular-nums w-[68px] text-right">
        {value}
      </span>
    </div>
  )
}