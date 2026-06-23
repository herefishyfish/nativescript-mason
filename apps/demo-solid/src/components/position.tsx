import { createSignal, For } from 'solid-js'
import { BG, MUTED, COLORS, Card, Field, Segmented, Stepper, CodeBlock } from './controls'

// position: absolute test harness — exercises the absolute-positioning paths on
// both platforms: top/left/right/bottom insets, inset:0 stretch, margin-auto
// centering, percentage insets, corner pinning, badge overlays and z-stacking.
export default function Position() {
  const [posKind, setPosKind] = createSignal<'absolute' | 'relative'>('absolute')
  const [top, setTop] = createSignal(20)
  const [left, setLeft] = createSignal(20)

  return (
    <>
      <actionbar title="Position Playground" />
      <scroll style={{ backgroundColor: BG, padding: 16, overflowY: 'scroll' }}>
        {/* ── 1. Interactive playground ── */}
        <Card title="LIVE PREVIEW">
          <div
            style={{
              position: 'relative',
              height: 200,
              backgroundColor: '#1a1a2e',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Reference grid lines so the offset is readable */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />

            {/* The box under test */}
            <div
              style={{
                position: posKind(),
                top: top(),
                left: left(),
                width: 80,
                height: 80,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6c5ce7, #0984e3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(108,92,231,0.5)',
              }}
            >
              <p style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>box</p>
            </div>

            {/* A sibling in normal flow — shows that an absolute box is taken out
                of flow (sibling sits at origin regardless of the box). */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>flow</p>
            </div>
          </div>
        </Card>

        <Card title="CONTROLS">
          <Field label="POSITION">
            <Segmented
              value={posKind()}
              onChange={setPosKind}
              options={[
                { label: 'absolute', value: 'absolute' },
                { label: 'relative', value: 'relative' },
              ]}
            />
          </Field>
          <Field label={`TOP — ${top()}px`}>
            <Stepper value={top()} min={0} max={120} step={5} suffix="px" onChange={setTop} />
          </Field>
          <Field label={`LEFT — ${left()}px`}>
            <Stepper value={left()} min={0} max={250} step={5} suffix="px" onChange={setLeft} />
          </Field>
        </Card>

        <Card title="GENERATED CSS">
          <CodeBlock
            lines={[`position: ${posKind()};`, `top: ${top()}px;`, `left: ${left()}px;`]}
          />
        </Card>

        {/* ── 2. Four corners ── */}
        <Card title="FOUR CORNERS (top/left/right/bottom)">
          <div style={{ position: 'relative', height: 150, backgroundColor: '#eef2f6', borderRadius: '12px' }}>
            <Corner style={{ top: 8, left: 8 }} color="#e84393" label="TL" />
            <Corner style={{ top: 8, right: 8 }} color="#0984e3" label="TR" />
            <Corner style={{ bottom: 8, left: 8 }} color="#00b894" label="BL" />
            <Corner style={{ bottom: 8, right: 8 }} color="#fdcb6e" label="BR" />
          </div>
        </Card>

        {/* ── 3. inset:0 stretch ── */}
        <Card title="STRETCH — top/right/bottom/left = 0">
          <div style={{ position: 'relative', height: 120, backgroundColor: '#eef2f6', borderRadius: '12px', padding: 12 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                margin: 12,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontSize: 13, color: 'white', fontWeight: 'bold' }}>fills parent (inset 0 + margin)</p>
            </div>
          </div>
        </Card>

        {/* ── 4. margin:auto centering ── */}
        <Card title="CENTER — inset 0 + margin auto">
          <div style={{ position: 'relative', height: 150, backgroundColor: '#eef2f6', borderRadius: '12px' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 90,
                height: 90,
                borderRadius: '14px',
                backgroundColor: '#6c5ce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(108,92,231,0.4)',
              }}
            >
              <p style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>centered</p>
            </div>
          </div>
        </Card>

        {/* ── 5. percentage insets ── */}
        <Card title="PERCENTAGE INSETS — top/left 50%">
          <div style={{ position: 'relative', height: 150, backgroundColor: '#eef2f6', borderRadius: '12px' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 70,
                height: 70,
                borderRadius: '10px',
                backgroundColor: '#00b894',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontSize: 11, color: 'white', fontWeight: 'bold' }}>50% / 50%</p>
            </div>
            <p style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: MUTED }}>
              top-left of box at center
            </p>
          </div>
        </Card>

        {/* ── 6. badge overlay (real-world use) ── */}
        <Card title="BADGE OVERLAY">
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px 12px' }}>
            <For each={[{ c: '#6c5ce7', n: '3' }, { c: '#0984e3', n: '12' }, { c: '#e84393', n: '99+' }]}>
              {(item) => (
                <div style={{ position: 'relative', width: 72, height: 72 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '16px',
                      backgroundColor: item.c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <p style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Aa</p>
                  </div>
                  {/* badge pinned to the top-right, pulled slightly outside */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      minWidth: 24,
                      height: 24,
                      paddingLeft: 6,
                      paddingRight: 6,
                      borderRadius: '12px',
                      backgroundColor: '#ff3b30',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255,59,48,0.5)',
                    }}
                  >
                    <p style={{ fontSize: 11, color: 'white', fontWeight: 'bold' }}>{item.n}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Card>

        {/* ── 7. z-stacking — later DOM paints on top ── */}
        <Card title="Z-STACKING (later sibling on top)">
          <div style={{ position: 'relative', height: 120 }}>
            <For each={[0, 1, 2, 3]}>
              {(i) => (
                <div
                  style={{
                    position: 'absolute',
                    top: i * 16,
                    left: i * 40,
                    width: 90,
                    height: 90,
                    borderRadius: '12px',
                    backgroundColor: COLORS[i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                  }}
                >
                  <p style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{i + 1}</p>
                </div>
              )}
            </For>
          </div>
        </Card>

        <div style={{ height: 24 }} />
      </scroll>
    </>
  )
}

function Corner(props: { style: any; color: string; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...props.style,
        width: 48,
        height: 48,
        borderRadius: '10px',
        backgroundColor: props.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 12px ${props.color}66`,
      }}
    >
      <p style={{ fontSize: 13, color: 'white', fontWeight: 'bold' }}>{props.label}</p>
    </div>
  )
}
