import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import * as Tabs from '@radix-ui/react-tabs'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import manaboLogo from '../assets/manabo_logo.png'

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

  if (loading) return <p className="text-center text-purple-400 py-8">Loading…</p>
  if (error)   return <p className="text-center text-rose-500 py-4">{error}</p>
  if (!data || data.items.length === 0) return <p className="text-center text-gray-400 py-8">No records.</p>

  const columns = Object.keys(data.items[0])
  const totalPages = Math.ceil(data.total / data.page_size)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400">{data.total} total records</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-purple-50">
              {columns.map(c => (
                <th key={c} className="px-3 py-2 font-semibold text-purple-700 whitespace-nowrap border-b border-purple-100">
                  {c.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(c => (
                  <td key={c} className="px-3 py-2 text-gray-700 whitespace-nowrap border-b border-gray-50">
                    {fmt(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 touch-manipulation"
          >
            ← Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 touch-manipulation"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

function DashboardCards() {
  const [data, setData] = useState<{ learner_count: number; logins_today: number; pass_rate: number; avg_study_min_7d: number } | null>(null)

  useEffect(() => {
    api.admin.dashboard().then(setData).catch(() => {})
  }, [])

  if (!data) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Learners',      value: data.learner_count },
        { label: 'Logins Today',  value: data.logins_today },
        { label: 'Pass Rate',     value: `${data.pass_rate}%` },
        { label: 'Avg Study 7d',  value: `${data.avg_study_min_7d}m` },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-1">
          <span className="text-xl font-bold text-purple-700 tabular-nums">{s.value}</span>
          <span className="text-xs text-gray-500">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

export function AdminPage() {
  const [, setLocation] = useLocation()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<AuditTab>('logins')
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-rose-500 font-semibold">Access denied — admin only.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 px-4 py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="text-sm text-purple-600 font-medium hover:text-purple-800 touch-manipulation
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            ← Practice
          </button>
          <div className="flex items-center gap-2">
            <img src={manaboLogo} alt="Manabo" className="h-7 w-auto object-contain" />
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium touch-manipulation
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            Sign out
          </button>
        </header>

        {/* Overview cards */}
        <DashboardCards />

        {/* Excel import / export */}
        <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">User Management</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white text-sm font-semibold
                hover:bg-purple-600 active:scale-95 transition-transform touch-manipulation
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              Export Users (.xlsx)
            </button>
            <label className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-sm font-semibold
              text-purple-700 hover:border-purple-400 cursor-pointer touch-manipulation
              focus-within:ring-2 focus-within:ring-purple-400 transition-colors">
              Import Users (.xlsx)
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx"
                className="sr-only"
                onChange={handleImport}
              />
            </label>
            {importMsg && (
              <span className="text-xs text-gray-600">{importMsg}</span>
            )}
          </div>
        </section>

        {/* Audit tabs */}
        <section className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Audit Log</h2>
          <Tabs.Root value={activeTab} onValueChange={v => setActiveTab(v as AuditTab)}>
            <Tabs.List className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
              {(['logins', 'sessions', 'tests'] as AuditTab[]).map(t => (
                <Tabs.Trigger
                  key={t}
                  value={t}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize
                    data-[state=active]:bg-white data-[state=active]:shadow-sm
                    data-[state=active]:text-purple-700 text-gray-500
                    transition-all focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-purple-400 touch-manipulation"
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
        </section>

      </div>
    </div>
  )
}
