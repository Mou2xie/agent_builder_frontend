import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import { HelmetProvider } from "react-helmet-async"
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// layouts
import { RootLayout } from './layouts/RootLayout'
import { LandingLayout } from './layouts/LandingLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// routes
import { IndexPage } from './routes/index'
import { LoginPage } from './routes/login'
import { SignupPage } from './routes/signup'
import { AgentListPage } from "./routes/agent-list"
import { PersonnelPage } from "./routes/personnel"
import { KnowledgePage } from "./routes/knowledge"
import { RulePage } from "./routes/rule"
import { BehaviorPage } from "./routes/behavior"
import { SharePage } from './routes/share'
import { ChatPage } from './routes/chat'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <BrowserRouter>
        <Routes>

          {/* login/signup page */}
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignupPage />} />

          <Route element={<RootLayout />}>
            {/* langding pages */}
            <Route element={<LandingLayout />}>
              <Route index element={<IndexPage />} />
            </Route>

            {/* dashboard pages */}
            <Route path='dashboard'>
              <Route path='agent-list' element={<AgentListPage />} />
              <Route path='agent/:id' element={<DashboardLayout />} >
                <Route path='personnel' element={<PersonnelPage />} />
                <Route path='knowledge' element={<KnowledgePage />} />
                <Route path='rule' element={<RulePage />} />
                <Route path='behavior' element={<BehaviorPage />} />
                <Route path='share' element={<SharePage />} />
              </Route>
            </Route>

            {/* chat page */}
            <Route path='chat/:id' element={<ChatPage />} />

          </Route>
        </Routes>
      </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>,
)
