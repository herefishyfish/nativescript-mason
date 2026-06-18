import { createSignal } from 'solid-js'
import { BG, MUTED, TEXT, Card, Field, Segmented, Stepper, CodeBlock } from './controls'

const SWATCHES = [
  { label: 'Purple', value: '#6c5ce7' },
  { label: 'Blue', value: '#0984e3' },
  { label: 'Green', value: '#00b894' },
  { label: 'Pink', value: '#e84393' },
  { label: 'Amber', value: '#fdcb6e' },
  { label: 'Coral', value: '#e17055' },
]

const DIRECTIONS = [
  { label: '→', value: 'to right' },
  { label: '↓', value: 'to bottom' },
  { label: '↘', value: '135deg' },
  { label: '↗', value: '45deg' },
]

export default function Backgrounds() {
  const [from, setFrom] = createSignal('#6c5ce7')
  const [to, setTo] = createSignal('#0984e3')
  const [dir, setDir] = createSignal('135deg')
  const [radius, setRadius] = createSignal(16)
  const [solid, setSolid] = createSignal(false)

  const bg = () => (solid() ? from() : `linear-gradient(${dir()}, ${from()}, ${to()})`)

  return (
    <>
      <actionbar title="Gradient Builder" />
      <scroll style={{ backgroundColor: BG, padding: 16, overflowY: 'scroll' }}>

        {/* ── Live Preview ── */}
        <Card title="LIVE PREVIEW">
          <div
            style={{
              height: 180,
              background: bg(),
              borderRadius: `${radius()}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 18,
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
          >
            <p style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
              {solid() ? 'Solid Fill' : 'Gradient'}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
              {solid() ? from() : `${dir()}`}
            </p>
          </div>
        </Card>

        {/* ── Controls ── */}
        <Card title="CONTROLS">
          <Field label="FILL TYPE">
            <Segmented
              value={solid()}
              onChange={setSolid}
              accent="#e17055"
              options={[
                { label: 'Gradient', value: false },
                { label: 'Solid', value: true },
              ]}
            />
          </Field>

          <Field label={solid() ? 'COLOR' : 'FROM COLOR'}>
            <Segmented value={from()} onChange={setFrom} accent="#e17055" options={SWATCHES} />
          </Field>

          {!solid() && (
            <>
              <Field label="TO COLOR">
                <Segmented value={to()} onChange={setTo} accent="#e17055" options={SWATCHES} />
              </Field>
              <Field label="DIRECTION">
                <Segmented value={dir()} onChange={setDir} accent="#e17055" options={DIRECTIONS} />
              </Field>
            </>
          )}

          <Field label={`BORDER RADIUS — ${radius()}px`}>
            <Stepper value={radius()} min={0} max={50} step={2} suffix="px" onChange={setRadius} accent="#e17055" />
          </Field>
        </Card>

        {/* ── Generated CSS ── */}
        <Card title="GENERATED CSS">
          <CodeBlock
            lines={[solid() ? `background: ${from()};` : `background:`, ...(solid() ? [] : [`  ${bg()};`]), `border-radius: ${radius()}px;`]}
          />
        </Card>

        {/* ── Preset gradients ── */}
        <Card title="PRESET GRADIENTS">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 10px' }}>
            {[
              { f: '#667eea', t: '#764ba2', d: '135deg', name: 'Indigo' },
              { f: '#f093fb', t: '#f5576c', d: '135deg', name: 'Sunset' },
              { f: '#0652dd', t: '#1e3799', d: 'to bottom', name: 'Ocean' },
              { f: '#00b894', t: '#fdcb6e', d: 'to right', name: 'Lime' },
              { f: '#e84393', t: '#6c5ce7', d: '135deg', name: 'Berry' },
              { f: '#fdcb6e', t: '#e17055', d: 'to right', name: 'Amber' },
            ].map((g) => (
              <div
                style={{
                  height: 64,
                  background: `linear-gradient(${g.d}, ${g.f}, ${g.t})`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                //@ts-ignore on: namespaced events are required by the NS solid renderer
                on:click={() => {
                  setSolid(false)
                  setFrom(g.f)
                  setTo(g.t)
                  setDir(g.d)
                }}
              >
                <p style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>{g.name}</p>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ height: 24 }} />
      </scroll>
    </>
  )
}
