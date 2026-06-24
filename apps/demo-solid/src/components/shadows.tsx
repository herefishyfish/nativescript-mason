import { createSignal } from 'solid-js'
import { BG, MUTED, TEXT, Card, Field, Segmented, Stepper, CodeBlock } from './controls'

const SHADOW_COLORS = [
  { label: 'Black', value: '0,0,0' },
  { label: 'Purple', value: '108,92,231' },
  { label: 'Blue', value: '9,132,227' },
  { label: 'Green', value: '0,184,148' },
  { label: 'Pink', value: '232,67,147' },
]

export default function Shadows() {
  const [offX, setOffX] = createSignal(0)
  const [offY, setOffY] = createSignal(8)
  const [blur, setBlur] = createSignal(24)
  const [radius, setRadius] = createSignal(16)
  const [alpha, setAlpha] = createSignal(35) // percent
  const [rgb, setRgb] = createSignal('108,92,231')

  const shadow = () => `${offX()}px ${offY()}px ${blur()}px rgba(${rgb()},${(alpha() / 100).toFixed(2)})`

  return (
    <>
      <actionbar title="Shadow Builder" />
      <scroll style={{ backgroundColor: BG, padding: 16, overflowY: 'scroll' }}>

        {/* ── Live Preview ── */}
        <Card title="LIVE PREVIEW">
          <div
            style={{
              height: 200,
              backgroundColor: '#f4f6f9',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 150,
                height: 100,
                backgroundColor: 'white',
                borderRadius: `${radius()}px`,
                boxShadow: shadow(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 'bold', color: TEXT }}>Mason</p>
            </div>
          </div>
        </Card>

        {/* ── Controls ── */}
        <Card title="CONTROLS">
          <Field label={`OFFSET X — ${offX()}px`}>
            <Stepper value={offX()} min={-40} max={40} step={2} suffix="px" onChange={setOffX} accent="#e84393" />
          </Field>
          <Field label={`OFFSET Y — ${offY()}px`}>
            <Stepper value={offY()} min={-40} max={40} step={2} suffix="px" onChange={setOffY} accent="#e84393" />
          </Field>
          <Field label={`BLUR — ${blur()}px`}>
            <Stepper value={blur()} min={0} max={64} step={2} suffix="px" onChange={setBlur} accent="#e84393" />
          </Field>
          <Field label={`OPACITY — ${alpha()}%`}>
            <Stepper value={alpha()} min={0} max={100} step={5} suffix="%" onChange={setAlpha} accent="#e84393" />
          </Field>
          <Field label={`BORDER RADIUS — ${radius()}px`}>
            <Stepper value={radius()} min={0} max={50} step={2} suffix="px" onChange={setRadius} accent="#e84393" />
          </Field>
          <Field label="SHADOW COLOR">
            <Segmented value={rgb()} onChange={setRgb} accent="#e84393" options={SHADOW_COLORS} />
          </Field>
        </Card>

        {/* ── Generated CSS ── */}
        <Card title="GENERATED CSS">
          <CodeBlock lines={['box-shadow:', `  ${shadow()};`, `border-radius: ${radius()}px;`]} />
        </Card>

        {/* ── Elevation presets ── */}
        <Card title="ELEVATION PRESETS">
          <p style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Tap to load a Material-style elevation</p>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px 8px' }}>
            {[
              { label: 'Flat', y: 1, b: 3, a: 12 },
              { label: 'Low', y: 4, b: 12, a: 14 },
              { label: 'Medium', y: 8, b: 24, a: 18 },
              { label: 'High', y: 16, b: 40, a: 22 },
              { label: 'Floating', y: 24, b: 64, a: 26 },
            ].map((p) => (
              <div
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 14,
                  paddingRight: 14,
                  borderRadius: '20px',
                  backgroundColor: '#e84393',
                  boxShadow: '0 3px 10px rgba(232,67,147,0.3)',
                }}
                //@ts-ignore on: namespaced events are required by the NS solid renderer
                on:click={() => {
                  setOffX(0)
                  setOffY(p.y)
                  setBlur(p.b)
                  setAlpha(p.a)
                  setRgb('0,0,0')
                }}
              >
                <p style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>{p.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ height: 24 }} />
      </scroll>
    </>
  )
}
