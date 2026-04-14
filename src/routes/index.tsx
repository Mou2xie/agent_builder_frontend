import { NavLink } from "react-router"
import { useAuthStore } from "../stores/useAuthStore"
import {
  Blocks,
  Ghost,
  Zap,
  Database,
  MousePointerClick,
  Share2,
  PenTool,
  Store,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"

const PAIN_POINTS = [
  {
    icon: Blocks,
    title: "High Technical Friction",
    subtitle: "技术门槛太高",
    description: "无需了解 API 知识，告别复杂的提示词工程。",
  },
  {
    icon: Ghost,
    title: "Hallucination & Generic Tone",
    subtitle: "空洞与幻觉",
    description: "告别机器人式的套话。用你自己的事实和语气为 AI 注入灵魂。",
  },
  {
    icon: Zap,
    title: "The Action Gap",
    subtitle: "缺乏行动力",
    description: "打破被动聊天。主动引导用户，实现具体的业务转化。",
  },
]

const STEPS = [
  {
    icon: Database,
    step: "01",
    title: "Private Knowledge Base",
    subtitle: "注入私有灵魂",
    description:
      "支持上传 PDF、DOCX、CSV 或 TXT 文件。完全基于你的私有数据构建 AI 的知识大脑。",
  },
  {
    icon: MousePointerClick,
    step: "02",
    title: "Intent-Driven Hooks",
    subtitle: "设定业务钩子",
    description:
      "零代码配置触发动作。当用户询问价格或服务时，自动推送支付链接或预订表单。",
  },
  {
    icon: Share2,
    step: "03",
    title: "Easy Distribution",
    subtitle: "一键极简分发",
    description:
      "即刻部署。通过独立网页链接、二维码分享，或以代码片段直接嵌入你的网站。",
  },
]

const USE_CASES = [
  {
    icon: PenTool,
    title: "Knowledge Creators",
    subtitle: "知识创作者",
    description:
      "打造 24/7 在线的「数字分身」，处理粉丝问答，全天候扩展个人品牌。",
  },
  {
    icon: Store,
    title: "SMB Owners",
    subtitle: "中小企业主",
    description:
      "创建不知疲倦的产品向导，解答重复咨询，降低交易摩擦并提升转化率。",
  },
  {
    icon: GraduationCap,
    title: "Subject Matter Experts",
    subtitle: "行业专家",
    description:
      "将海量静态文档转化为高准确度的互动帮助台，为团队或客户提供精准解答。",
  },
]

const ADVANCED_FEATURES = [
  {
    icon: BarChart3,
    title: "Data Dashboard & Insights",
    subtitle: "数据看板与洞察",
    description:
      "自动聚合用户查询并提取核心意图，用真实数据驱动你的运营决策。",
  },
  {
    icon: ShieldCheck,
    title: "Guardrails & Safety",
    subtitle: "安全边界护栏",
    description:
      "设置严格的话术边界与自定义兜底响应，确保品牌内容输出的绝对安全。",
  },
]

export const IndexPage = () => {

  const user = useAuthStore(state => state.user);

  return (
    <>
      <section className="pt-30 pb-20 bg-background-card">
        <div className="mx-30 bg-background-hero rounded-4xl grid grid-cols-9 px-15 py-32">
          <div className="col-span-4">
            <h1 className="font-heading text-4xl font-bold text-text-main leading-tight">
              <span className="block">Build your AI agent,</span>
              <span>your way.</span>
            </h1>
            <p className="mt-2 text-lg text-text-secondary">
              构建你的专属 AI 代理，零代码，全连接。
            </p>
            <div className="mt-10 flex items-center gap-4">
              <NavLink
                to={ user ? "/dashboard/agent-list" : "/signup" }
                className="inline-flex items-center px-8 py-2.5 text-base font-semibold bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer"
              >
                Get Started
              </NavLink>
            </div>
          </div>
          <div className="col-span-5">
            {/* here to put hero image */}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-text-main">
            为什么你需要 Build My Agent？
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">Why You Need Build My Agent</p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((item) => (
              <div
                key={item.title}
                className="bg-background-card shadow-card-soft rounded-xl p-8"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
                <p className="mt-3 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-background-hero py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-text-main">
            How it Works
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">运作机制</p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-background-card shadow-card-soft rounded-xl p-8 relative"
              >
                <span className="text-5xl font-bold text-primary-light absolute top-6 right-8 select-none">
                  {item.step}
                </span>
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
                <p className="mt-3 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-text-main">
            Use Cases
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">应用场景</p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {USE_CASES.map((item) => (
              <div
                key={item.title}
                className="bg-background-card shadow-card-soft rounded-xl p-8"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
                <p className="mt-3 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-hero py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-center text-text-main">
            Advanced Value
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">进阶差异化价值</p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {ADVANCED_FEATURES.map((item) => (
              <div
                key={item.title}
                className="bg-background-card shadow-card-soft rounded-xl p-8"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
                <p className="mt-3 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl font-bold text-text-main leading-tight">
            准备好迎接你的 AI 业务伙伴了吗？
          </h2>
          <p className="mt-2 text-text-muted">Ready to meet your AI business partner?</p>
          <NavLink
            to="/signup"
            className="mt-10 inline-flex items-center gap-2 px-10 py-4 text-base font-semibold bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </NavLink>
        </div>
      </section>

      <footer className="border-t border-border-divider py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading text-lg font-bold text-text-main">BuildMyAgent.</span>
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} BuildMyAgent. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-main transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-text-main transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
