import { createSignal, Index } from 'solid-js'
import { BG, MUTED, COLORS, Card, Field, Segmented, Stepper, CodeBlock } from './controls'

export default function Grid() {
  const [cols, setCols] = createSignal(3)
  const [gap, setGap] = createSignal(8)
  const [count, setCount] = createSignal(6)
  const [flow, setFlow] = createSignal('row')
  const [firstSpan, setFirstSpan] = createSignal(1)

  const template = () => `repeat(${cols()}, 1fr)`

  return (
    <>
      <actionbar title="Grid Playground" />
      <scroll style={{ backgroundColor: BG, padding: 16, overflowY: 'scroll' }}>

        {/* ── Live Preview ── */}
        <Card title="LIVE PREVIEW">
          <div
            style={{
              minHeight: 180,
              backgroundColor: '#1a1a2e',
              borderRadius: '12px',
              padding: 10,
              display: 'grid',
              gridTemplateColumns: template(),
              gridAutoFlow: flow(),
              gap: `${gap()}px ${gap()}px`,
            }}
          >
            <Index each={Array.from({ length: count() })}>
              {(_, i) => (
                <div
                  style={{
                    height: 44,
                    backgroundColor: COLORS[i % COLORS.length],
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gridColumn: i === 0 && firstSpan() > 1 ? `span ${firstSpan()}` : 'auto',
                    boxShadow: `0 3px 10px ${COLORS[i % COLORS.length]}55`,
                  }}
                >
                  <p style={{ fontSize: 13, color: 'white', fontWeight: 'bold' }}>
                    {i === 0 && firstSpan() > 1 ? `span ${firstSpan()}` : i + 1}
                  </p>
                </div>
              )}
            </Index>
          </div>
        </Card>

        {/* ── Controls ── */}
        <Card title="CONTROLS">
          <Field label={`COLUMNS — repeat(${cols()}, 1fr)`}>
            <Stepper value={cols()} min={1} max={5} onChange={setCols} accent="#00b894" />
          </Field>

          <Field label="ITEM COUNT">
            <Stepper value={count()} min={1} max={12} onChange={setCount} accent="#00b894" />
          </Field>

          <Field label={`GAP — ${gap()}px`}>
            <Stepper value={gap()} min={0} max={28} step={2} suffix="px" onChange={setGap} accent="#00b894" />
          </Field>

          <Field label="FIRST ITEM COLUMN SPAN">
            <Segmented
              value={firstSpan()}
              onChange={setFirstSpan}
              accent="#00b894"
              options={[
                { label: 'span 1', value: 1 },
                { label: 'span 2', value: 2 },
                { label: 'span 3', value: 3 },
              ]}
            />
          </Field>

          <Field label="GRID-AUTO-FLOW">
            <Segmented
              value={flow()}
              onChange={setFlow}
              accent="#00b894"
              options={[
                { label: 'row', value: 'row' },
                { label: 'column', value: 'column' },
              ]}
            />
          </Field>
        </Card>

        {/* ── Generated CSS ── */}
        <Card title="GENERATED CSS">
          <CodeBlock
            lines={[
              'display: grid;',
              `grid-template-columns: ${template()};`,
              `grid-auto-flow: ${flow()};`,
              `gap: ${gap()}px;`,
              ...(firstSpan() > 1 ? [`/* item 1 */ grid-column: span ${firstSpan()};`] : []),
            ]}
          />
        </Card>

        {/* ── Named Areas (static reference) ── */}
        <Card title="GRID TEMPLATE AREAS">
          <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>
            "Holy grail" layout via named areas
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 1fr 56px',
              gridTemplateRows: '40px 90px 32px',
              gridTemplateAreas: '"header header header" "nav main aside" "footer footer footer"',
              gap: '4px 4px',
            }}
          >
            {[
              { a: 'header', c: '#6c5ce7', l: 'Header' },
              { a: 'nav', c: '#0984e3', l: 'Nav' },
              { a: 'main', c: '#eef2f6', l: 'Main', dark: true },
              { a: 'aside', c: '#00b894', l: 'Aside' },
              { a: 'footer', c: '#1a1a2e', l: 'Footer' },
            ].map((cell) => (
              <div
                style={{
                  gridArea: cell.a,
                  backgroundColor: cell.c,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ fontSize: 11, color: cell.dark ? MUTED : 'white', fontWeight: 'bold' }}>{cell.l}</p>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ height: 24 }} />
      </scroll>
    </>
  )
}
