import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
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
import { ActionsPage } from "./routes/actions"
import { AppearancePage } from "./routes/appearance"
import { SharePage } from './routes/share'
import { ChatPage } from './routes/chat'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
                <Route path='actions' element={<ActionsPage />} />
                <Route path='appearance' element={<AppearancePage />} />
                <Route path='share' element={<SharePage />} />
              </Route>
            </Route>

            {/* chat page */}
            <Route path='chat/:id' element={<ChatPage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
