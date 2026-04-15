import { Helmet } from "react-helmet-async"
import { NavLink } from "react-router"
import { useAuthStore } from "../stores/useAuthStore"
import heroImage from "../assets/hero.png"
import clock from "../assets/clock.png"
import robot from "../assets/robot.png"
import arrowup from "../assets/arrowup.png"
import sam from "../assets/sam.png"
import xie from "../assets/xie.png"
import lu from "../assets/lu.png"
import logo from "../assets/logo.svg"
import {
  Database,
  MousePointerClick,
  Share2,
  ArrowRight,
  Mail,
} from "lucide-react"

const CORE_CAPABILITIES = [
  {
    icon: clock,
    title: "24/7 Digital Concierge",
    description:
      "Act as a tireless business assistant. Automatically handle repetitive inquiries, provide personalized recommendations, reduce user friction, and directly increase conversion rates.",
  },
  {
    icon: robot,
    title: "Your Expert Digital Twin",
    description:
      "Break the limits of static documents. Transform your private data into a highly accurate, interactive help desk that perfectly replicates your professional expertise and tone of voice.",
  },
  {
    icon: arrowup,
    title: "Intent-Driven Engine",
    description:
      "Move beyond passive chatting. Accurately recognize user intent to seamlessly push payment links, booking forms, and other business hooks within the conversation, completing the transaction loop.",
  },
]

const STEPS = [
  {
    icon: Database,
    step: "01",
    title: "Infuse Private Knowledge",
    description:
      "Upload PDF, DOCX, or TXT files. Build your AI's knowledge brain entirely from your private data.",
  },
  {
    icon: MousePointerClick,
    step: "02",
    title: "Set Business Hooks",
    description:
      "Configure trigger actions. Push payment links or booking forms based on user intent.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Easy Distribution",
    description:
      "Deploy instantly. Share your solution seamlessly via standalone web links or custom QR codes.",
  },
]

const USE_CASES = [
  {
    icon: sam,
    title: "Knowledge Creators",
    subtitle: "For Creators",
    description:
      "Build a 24/7 online digital twin to handle fan Q&A and scale your personal brand around the clock.",
  },
  {
    icon: xie,
    title: "SMB Owners",
    subtitle: "For SMB Owners",
    description:
      "Create a tireless product guide that answers repetitive inquiries, reduces transaction friction, and boosts conversion rates.",
  },
  {
    icon: lu,
    title: "Subject Matter Experts",
    subtitle: "For Experts",
    description:
      "Transform massive static documents into a highly accurate interactive help desk, delivering precise answers for your team or clients.",
  },
]

export const IndexPage = () => {

  const user = useAuthStore(state => state.user);

  return (
    <>
      <Helmet><title>Home - NovaAgent</title></Helmet>
      <section className="pt-20 pb-10 md:pt-30 md:pb-20 bg-background-card">

        <div className="mx-0 md:mx-30 bg-background-hero rounded-none md:rounded-4xl grid grid-cols-1 md:grid-cols-9 gap-6 md:gap-10 px-0 md:px-0 md:pl-15 pt-12 md:pt-28 pb-0 md:pb-28 boprder">

          <div className=" flex flex-col justify-center md:col-span-4 px-6 md:px-0">
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-text-main leading-tight">
              <span className="block">Build your AI agent,</span>
              <span>your way.</span>
            </h1>
            <p className="mt-2 text-base md:text-lg text-text-secondary">
              Create your own AI agent in minutes with a custom knowledge base. Zero coding required.
            </p>
            <div className="mt-6 md:mt-10 hidden md:flex items-center gap-4">
              <NavLink
                to={user ? "/dashboard/agent-list" : "/signup"}
                className="inline-flex items-center px-8 py-2.5 text-base font-semibold bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer"
              >
                Get Started
              </NavLink>
            </div>
          </div>

          <div className="md:col-span-5">
            <img src={heroImage} alt="NovaAgent hero" className=" object-cover" />
          </div>

        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-text-main">
            What NovaAgent Can Do
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">
            Transform your expertise into an active, 24/7 interactive experience.
          </p>
          <div className="mt-10 md:mt-16 divide-y divide-border-light">
            {CORE_CAPABILITIES.map((item) => (
              <div
                key={item.title}
                className=" flex items-start md:items-center gap-4 md:gap-12 py-6 md:py-10 first:pt-0 last:pb-0 "
              >
                <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                  <img src={item.icon} alt={item.title} className=" object-cover" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text-main">{item.title}</h3>
                  <p className="mt-1 md:mt-2 text-text-secondary leading-relaxed text-sm md:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className=" bg-background-hero py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-text-main">
            How it Works
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">Train. Trigger. Share. It's that simple.</p>
          <div className="mt-10 md:mt-16 flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-border-light" />
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="flex-1 flex flex-col items-center text-center relative"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-background-card rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-card-soft">
                  <item.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <span className="mt-3 md:mt-4 text-xs font-semibold tracking-widest text-primary uppercase">
                  Step {item.step}
                </span>
                <h3 className="mt-1.5 md:mt-2 text-base md:text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-2 md:mt-3 text-text-secondary leading-relaxed text-sm max-w-60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-text-main">
            Use Cases
          </h2>
          <p className="mt-2 text-center text-text-muted text-base">Built for different needs</p>
          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((item) => (
              <div
                key={item.title}
                className="group bg-background-card rounded-2xl border border-border-light p-6 md:p-8 transition-all duration-200 hover:shadow-card-soft hover:border-primary/20"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-background-hero rounded-xl flex items-center justify-center group-hover:bg-primary-light transition-colors duration-200">
                  <img src={item.icon} alt={item.title} className=" object-cover" />
                </div>
                <span className="mt-4 md:mt-5 block text-xs font-semibold tracking-widest text-primary uppercase">
                  {item.subtitle}
                </span>
                <h3 className="mt-1.5 text-base md:text-lg font-semibold text-text-main">{item.title}</h3>
                <p className="mt-2 md:mt-3 text-text-secondary leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28 bg-background-hero hidden md:block">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-main leading-tight">
            Ready to meet your AI business partner?
          </h2>
          <NavLink
            to="/signup"
            className="mt-8 md:mt-10 inline-flex items-center gap-2 px-8 md:px-10 py-4 text-base font-semibold bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </NavLink>
        </div>
      </section>

      <footer className="border-t border-border-divider py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className=" flex items-center gap-3">
            <img src={logo} alt="NovaAgent logo" className=" w-10 h-10" />
            <span className="font-heading font-bold text-2xl text-text-main">NovaAgent.</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Mail className="w-4 h-4 text-text-secondary" />
            <a href="mailto:jedxie2022@gmail.com" className="text-sm text-text-secondary hover:text-text-main transition-colors duration-200">
              jedxie2022@gmail.com
            </a>
          </div>
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} NovaAgent. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
