import { createSignal, Index } from 'solid-js'
import { BG, CARD, MUTED, TEXT, ACCENT, COLORS, Card, Field, Segmented, Stepper, CodeBlock } from './controls'

export default function Flexbox() {
  const [direction, setDirection] = createSignal<'row' | 'column' | 'row-reverse' | 'column-reverse'>('row')
  const [justify, setJustify] = createSignal<'normal' |'flex-start' | 'flex-end' | 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start')
  const [align, setAlign] = createSignal<'stretch' | 'flex-start' | 'center' | 'flex-end'>('stretch')
  const [wrap, setWrap] = createSignal<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap')
  const [gap, setGap] = createSignal(8)
  const [count, setCount] = createSignal(4)

  return (
    <>
      <actionbar title="Flexbox Playground" />
      <scroll style={{ backgroundColor: BG, padding: 16, overflowY: 'scroll' }}>

        {/* ── Live Preview ── */}
        <Card title="LIVE PREVIEW">
          <div
            style={{
              minHeight: 180,
              backgroundColor: '#1a1a2e',
              borderRadius: '12px',
              padding: 10,
              display: 'flex',
              flexDirection: direction(),
              justifyContent: justify() as never,
              alignItems: align(),
              flexWrap: wrap(),
              gap: `${gap()}px ${gap()}px`,
            }}
          >
            <Index each={Array.from({ length: count() })}>
              {(_, i) => (
                <div
                  style={{
                    width: 48,
                    height: 36 + (i % 3) * 16,
                    backgroundColor: COLORS[i % COLORS.length],
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 3px 10px ${COLORS[i % COLORS.length]}55`,
                  }}
                >
                  <p style={{ fontSize: 13, color: 'white', fontWeight: 'bold' }}>{i + 1}</p>
                </div>
              )}
            </Index>
          </div>
        </Card>

        {/* ── Controls ── */}
        <Card title="CONTROLS">
          <Field label="ITEM COUNT">
            <Stepper value={count()} min={1} max={20} onChange={setCount} />
          </Field>

          <Field label="FLEX-DIRECTION">
            <Segmented
              value={direction()}
              onChange={setDirection}
              options={[
                { label: 'row', value: 'row' },
                { label: 'column', value: 'column' },
                { label: 'row-reverse', value: 'row-reverse' },
                { label: 'column-reverse', value: 'column-reverse' },
              ]}
            />
          </Field>

          <Field label="JUSTIFY-CONTENT (main axis)">
            <Segmented
              value={justify()}
              onChange={setJustify}
              options={[
                { label: 'start', value: 'flex-start' },
                { label: 'center', value: 'center' },
                { label: 'end', value: 'flex-end' },
                { label: 'between', value: 'space-between' },
                { label: 'around', value: 'space-around' },
                { label: 'evenly', value: 'space-evenly' },
              ]}
            />
          </Field>

          <Field label="ALIGN-ITEMS (cross axis)">
            <Segmented
              value={align()}
              onChange={setAlign}
              options={[
                { label: 'stretch', value: 'stretch' },
                { label: 'start', value: 'flex-start' },
                { label: 'center', value: 'center' },
                { label: 'end', value: 'flex-end' },
              ]}
            />
          </Field>

          <Field label="FLEX-WRAP">
            <Segmented
              value={wrap()}
              onChange={setWrap}
              options={[
                { label: 'nowrap', value: 'nowrap' },
                { label: 'wrap', value: 'wrap' },
                { label: 'wrap-reverse', value: 'wrap-reverse' },
              ]}
            />
          </Field>

          <Field label={`GAP — ${gap()}px`}>
            <Stepper value={gap()} min={0} max={32} step={2} suffix="px" onChange={setGap} />
          </Field>
        </Card>

        {/* ── Generated CSS ── */}
        <Card title="GENERATED CSS">
          <CodeBlock
            lines={[
              'display: flex;',
              `flex-direction: ${direction()};`,
              `justify-content: ${justify()};`,
              `align-items: ${align()};`,
              `flex-wrap: ${wrap()};`,
              `gap: ${gap()}px;`,
            ]}
          />
        </Card>

        <div style={{ height: 24 }} />
      </scroll>
    </>
  )
}
