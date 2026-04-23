import { useState } from 'react'
import { useLocation } from 'wouter'
import manaboLogo from '../assets/manabo_logo.png'

type Script = 'hiragana' | 'katakana'

type Cell = [string, string] | null  // [character, romaji]

const ROW_LABELS = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n']
const COL_LABELS = ['a', 'i', 'u', 'e', 'o']

const HIRAGANA: Cell[][] = [
  [['あ','a'],   ['い','i'],   ['う','u'],   ['え','e'],   ['お','o']  ],
  [['か','ka'],  ['き','ki'],  ['く','ku'],  ['け','ke'],  ['こ','ko'] ],
  [['さ','sa'],  ['し','shi'], ['す','su'],  ['せ','se'],  ['そ','so'] ],
  [['た','ta'],  ['ち','chi'], ['つ','tsu'], ['て','te'],  ['と','to'] ],
  [['な','na'],  ['に','ni'],  ['ぬ','nu'],  ['ね','ne'],  ['の','no'] ],
  [['は','ha'],  ['ひ','hi'],  ['ふ','fu'],  ['へ','he'],  ['ほ','ho'] ],
  [['ま','ma'],  ['み','mi'],  ['む','mu'],  ['め','me'],  ['も','mo'] ],
  [['や','ya'],  null,         ['ゆ','yu'],  null,         ['よ','yo'] ],
  [['ら','ra'],  ['り','ri'],  ['る','ru'],  ['れ','re'],  ['ろ','ro'] ],
  [['わ','wa'],  null,         null,         null,         ['を','wo'] ],
  [['ん','n'],   null,         null,         null,         null        ],
]

const KATAKANA: Cell[][] = [
  [['ア','a'],   ['イ','i'],   ['ウ','u'],   ['エ','e'],   ['オ','o']  ],
  [['カ','ka'],  ['キ','ki'],  ['ク','ku'],  ['ケ','ke'],  ['コ','ko'] ],
  [['サ','sa'],  ['シ','shi'], ['ス','su'],  ['セ','se'],  ['ソ','so'] ],
  [['タ','ta'],  ['チ','chi'], ['ツ','tsu'], ['テ','te'],  ['ト','to'] ],
  [['ナ','na'],  ['ニ','ni'],  ['ヌ','nu'],  ['ネ','ne'],  ['ノ','no'] ],
  [['ハ','ha'],  ['ヒ','hi'],  ['フ','fu'],  ['ヘ','he'],  ['ホ','ho'] ],
  [['マ','ma'],  ['ミ','mi'],  ['ム','mu'],  ['メ','me'],  ['モ','mo'] ],
  [['ヤ','ya'],  null,         ['ユ','yu'],  null,         ['ヨ','yo'] ],
  [['ラ','ra'],  ['リ','ri'],  ['ル','ru'],  ['レ','re'],  ['ロ','ro'] ],
  [['ワ','wa'],  null,         null,         null,         ['ヲ','wo'] ],
  [['ン','n'],   null,         null,         null,         null        ],
]

function KanaGrid({ grid }: { grid: Cell[][] }) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 280 }}>
        {/* Column headers */}
        <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '1.75rem repeat(5, 1fr)' }}>
          <div />
          {COL_LABELS.map(l => (
            <div key={l} className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest py-0.5">
              {l}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1">
          {grid.map((row, ri) => (
            <div key={ri} className="grid gap-1" style={{ gridTemplateColumns: '1.75rem repeat(5, 1fr)' }}>
              {/* Row label */}
              <div className="flex items-center justify-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {ROW_LABELS[ri]}
              </div>

              {/* Cells */}
              {row.map((cell, ci) =>
                cell ? (
                  <div
                    key={ci}
                    className="flex flex-col items-center justify-center rounded-xl py-2 px-1 gap-0.5
                               bg-white border-2 border-slate-100"
                    style={{ borderBottomWidth: 3, borderBottomColor: '#eef1f7' }}
                  >
                    <span className="text-xl font-bold leading-none" style={{ color: '#1e2c5c' }}>
                      {cell[0]}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wide">
                      {cell[1]}
                    </span>
                  </div>
                ) : (
                  <div key={ci} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function KanaChartPage() {
  const [, setLocation] = useLocation()
  const [script, setScript] = useState<Script>('hiragana')

  const grid = script === 'hiragana' ? HIRAGANA : KATAKANA

  return (
    <div className="min-h-screen bg-[#fafbfd]">
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3
                   bg-white/90 border-b-2 border-slate-100"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <img src={manaboLogo} alt="Manabo" className="h-8 w-auto object-contain" />
        <button
          onClick={() => setLocation('/dashboard')}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-widest
                     touch-manipulation focus-visible:outline-none"
        >
          ← Back
        </button>
      </header>

      <div className="w-full max-w-sm mx-auto px-4 py-6 flex flex-col gap-5">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#1e2c5c' }}>Kana Chart</h1>
          <p className="text-sm text-slate-400 font-bold mt-0.5">All 92 characters · gojūon order</p>
        </div>

        {/* Script toggle */}
        <div
          role="group"
          aria-label="Script selection"
          className="flex p-1 gap-1 bg-slate-100 rounded-2xl"
        >
          {(['hiragana', 'katakana'] as Script[]).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setScript(s)}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider
                          transition-all duration-[120ms] touch-manipulation
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
                          ${script === s
                            ? 'bg-white text-navy-700 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                          }`}
            >
              {s === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </button>
          ))}
        </div>

        {/* Script name banner */}
        <div
          className="rounded-2xl px-5 py-4 text-white flex items-baseline gap-3"
          style={{ background: '#1e2c5c', borderBottom: '4px solid #172147' }}
        >
          <span className="text-3xl font-black leading-none">
            {script === 'hiragana' ? 'ひらがな' : 'カタカナ'}
          </span>
          <span className="text-sm font-bold opacity-70">
            {script === 'hiragana' ? 'Hiragana · 46 characters' : 'Katakana · 46 characters'}
          </span>
        </div>

        {/* Grid */}
        <section
          className="bg-white rounded-2xl border-2 border-slate-100 p-4"
          style={{ borderBottomWidth: 4, borderBottomColor: '#eef1f7' }}
        >
          <KanaGrid grid={grid} />
        </section>

        {/* Legend note */}
        <p className="text-xs text-slate-400 font-bold text-center pb-2">
          Romaji shown below each character · blank cells have no kana
        </p>
      </div>
    </div>
  )
}
