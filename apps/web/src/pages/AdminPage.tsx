import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import * as Tabs       from '@radix-ui/react-tabs'
import { useAuth }     from '../hooks/useAuth'
import { api }         from '../lib/api'
import manaboLogo      from '../assets/manabo_logo.png'
import leaderboardSvg  from '../assets/leaderboard.svg'
import learnSvg        from '../assets/learn.svg'
import finishSvg       from '../assets/finish.svg'
import questsSvg       from '../assets/quests.svg'
import pointsSvg       from '../assets/points.svg'

type AuditTab = 'logins' | 'sessions' | 'tests'

interface AuditResult {
  total:     number
  page:      number
  page_size: number
  items:     Record<string, unknown>[]
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (typeof v === 'string' && v.includes('T')) {
    const d = new Date(v)
    if (!isNaN(d.getTime())) return d.toLocaleString()
  }
  return String(v)
}

function AuditTable({ tab }: { tab: AuditTab }) {
  const [data,    setData]    = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [page,    setPage]    = useState(1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetcher =
      tab === 'logins'   ? () => api.admin.auditLogins(page) :
      tab === 'sessions' ? () => api.admin.auditSessions(page) :
                           () => api.admin.auditTests(page)
    fetcher()
      .then(d => setData(d))
      .catch(e => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [tab, page])

  useEffect(() => { setPage(1) }, [tab])

  if (loading) return <p className="text-center text-navy-400 py-8 font-bold">Loading…</p>
  if (error)   return <p className="text-center text-rose-500 py-4 font-bold">{error}</p>
  if (!data || data.items.length === 0) return (
    <p className="text-center text-slate-400 py-8 font-bold">No attempts yet — your first one's waiting.</p>
  )

  const columns    = Object.keys(data.items[0])
  const totalPages = Math.ceil(data.total / data.page_size)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-400 font-bold">{data.total} total records</p>
      <div className="overflow-x-auto rounded-xl border-2 border-slate-100">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-navy-50">
              {columns.map(c => (
                <th key={c} className="px-3 py-2.5 font-extrabold text-navy-600 uppercase tracking-widest
                                       whitespace-nowrap border-b-2 border-slate-100 text-[10px]">
                  {c.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, i) => (
              <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-amber-50 transition-colors`}>
                {columns.map(c => (
                  <td key={c} className="px-3 py-2 text-navy-700 whitespace-nowrap font-mono">
                    {fmt(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 touch-manipulation"
          >
            ← Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 touch-manipulation"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

function DashboardCards() {
  const [data, setData] = useState<{
    learner_count: number
    logins_today:  number
    pass_rate:     number
    avg_study_min_7d: number
  } | null>(null)

  useEffect(() => {
    api.admin.dashboard().then(setData).catch(() => {})
  }, [])

  if (!data) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Learners',      value: data.learner_count,         trend: '' },
        { label: 'Logins today',  value: data.logins_today,          trend: '' },
        { label: 'Pass rate',     value: `${data.pass_rate}%`,       trend: '' },
        { label: 'Avg study 7d',  value: `${data.avg_study_min_7d}m`, trend: '' },
      ].map(s => (
        <div key={s.label}
             className="bg-white rounded-2xl border-2 border-slate-100 p-5"
             style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
          <div className="text-3xl font-black text-navy-800 tabular-nums leading-none mt-1">{s.value}</div>
        </div>
      ))}
    </div>
  )
}

const NAV_ITEMS = [
  { icon: leaderboardSvg, label: 'Cohort overview' },
  { icon: learnSvg,       label: 'Learners' },
  { icon: finishSvg,      label: 'Test attempts' },
  { icon: questsSvg,      label: 'Cohorts & IDs' },
  { icon: pointsSvg,      label: 'Exports' },
]

export function AdminPage() {
  const [, setLocation]  = useLocation()
  const { user, logout } = useAuth()
  const [activeTab,  setActiveTab]  = useState<AuditTab>('logins')
  const [activeNav,  setActiveNav]  = useState(0)
  const [importMsg,  setImportMsg]  = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfd]">
        <p className="text-rose-500 font-extrabold">Access denied — admin only.</p>
      </div>
    )
  }

  async function handleExport() {
    const res = await api.admin.exportUsers()
    if (!res.ok) { alert('Export failed'); return }
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'manabo_users.xlsx'; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportMsg('Importing…')
    try {
      const result = await api.admin.importUsers(file)
      setImportMsg(`Created: ${result.created} · Skipped: ${result.skipped}${result.errors.length ? ` · Errors: ${result.errors.length}` : ''}`)
    } catch {
      setImportMsg('Import failed')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-[#eef1f7] flex" style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r-2 border-slate-100 p-5 gap-1">
        <div className="flex items-center gap-3 pb-5 mb-3 border-b-2 border-slate-100">
          <img src={manaboLogo} alt="Manabo" className="h-8 w-auto object-contain" />
          <span className="text-xs font-extrabold text-navy-400 uppercase tracking-widest">Admin</span>
        </div>

        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveNav(i)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-sm font-bold
                        transition-colors duration-[120ms] cursor-pointer text-left w-full
                        ${activeNav === i
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'
                        }`}
          >
            <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
            {item.label}
          </button>
        ))}

        <div className="flex-1" />
        <div className="pt-4 border-t-2 border-slate-100 text-xs text-slate-400 font-bold">
          Signed in as<br />
          <span className="text-navy-600">{user.applicant_id}</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-navy-800">Cohort overview</h1>
            <p className="text-sm text-slate-400 font-bold mt-0.5">
              Batch 16 · July mastery test approaching
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation('/')}
              className="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-navy-600
                         font-extrabold text-xs uppercase tracking-widest
                         hover:bg-slate-50 transition-colors touch-manipulation"
              style={{ borderBottomWidth: 4, borderBottomColor: '#c3cbdc' }}
            >
              ← Practice
            </button>
            <button
              onClick={logout}
              className="text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-widest
                         touch-manipulation"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="p-6 flex flex-col gap-6">

          {/* KPI grid */}
          <DashboardCards />

          {/* User management */}
          <section className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden"
                   style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-slate-100">
              <h3 className="font-extrabold text-navy-800">User management</h3>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-amber-500 text-white font-extrabold text-xs uppercase tracking-widest
                           border-2 border-amber-500 hover:bg-amber-400 touch-manipulation
                           transition-colors"
                style={{ borderBottomWidth: 4, borderBottomColor: '#d97706' }}
              >
                ⬇ Download today's cohort as Excel
              </button>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-3 items-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200
                                bg-white text-navy-600 font-extrabold text-xs uppercase tracking-widest
                                cursor-pointer hover:bg-slate-50 touch-manipulation transition-colors"
                     style={{ borderBottomWidth: 4, borderBottomColor: '#dde3ee' }}>
                ↑ Import users (.xlsx)
                <input ref={fileRef} type="file" accept=".xlsx" className="sr-only" onChange={handleImport} />
              </label>
              {importMsg && (
                <span className="text-xs text-slate-500 font-bold">{importMsg}</span>
              )}
            </div>
          </section>

          {/* Audit log */}
          <section className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden"
                   style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-slate-100">
              <h3 className="font-extrabold text-navy-800">Audit log</h3>
            </div>
            <div className="p-5">
              <Tabs.Root value={activeTab} onValueChange={v => setActiveTab(v as AuditTab)}>
                <Tabs.List className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
                  {(['logins', 'sessions', 'tests'] as AuditTab[]).map(t => (
                    <Tabs.Trigger
                      key={t}
                      value={t}
                      className="flex-1 py-2 text-xs font-extrabold rounded-lg capitalize
                                 data-[state=active]:bg-white data-[state=active]:text-navy-700 data-[state=active]:shadow-sm
                                 text-slate-500 transition-all touch-manipulation
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      {t}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                {(['logins', 'sessions', 'tests'] as AuditTab[]).map(t => (
                  <Tabs.Content key={t} value={t}>
                    <AuditTable tab={t} />
                  </Tabs.Content>
                ))}
              </Tabs.Root>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
