import { For, Show } from 'solid-js'

export const BG = '#f0f4f8'
export const CARD = 'white'
export const MUTED = '#636e72'
export const TEXT = '#1a1a2e'
export const ACCENT = '#6c5ce7'

export const COLORS = ['#6c5ce7', '#0984e3', '#00b894', '#e84393', '#fdcb6e', '#e17055', '#a29bfe', '#74b9ff']

export function Card(props: { title?: string; children: any }) {
  return (
    <div
      style={{
        backgroundColor: CARD,
        borderRadius: '16px',
        padding: 18,
        marginBottom: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      }}
    >
      <Show when={props.title}>
        <p style={{ fontSize: 11, fontWeight: 'bold', color: MUTED, marginBottom: 14, letterSpacing: 1 }}>
          {props.title}
        </p>
      </Show>
      {props.children}
    </div>
  )
}

export function Field(props: { label: string; children: any }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 10, fontWeight: 'bold', color: MUTED, marginBottom: 8, letterSpacing: 0.5 }}>
        {props.label}
      </p>
      {props.children}
    </div>
  )
}

export function Segmented(props: {
  value: any
  options: readonly { label: string; value: any }[]
  onChange: (v: any) => void
  accent?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '6px 6px' }}>
      <For each={props.options as any}>
        {(opt: any) => (
          <div
            style={{
              paddingTop: 7,
              paddingBottom: 7,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: '18px',
              backgroundColor: props.value === opt.value ? (props.accent ?? ACCENT) : '#eef2f6',
            }}
            //@ts-ignore on: namespaced events are required by the NS solid renderer
            on:click={() => props.onChange(opt.value)}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: props.value === opt.value ? 'white' : MUTED,
              }}
            >
              {opt.label}
            </p>
          </div>
        )}
      </For>
    </div>
  )
}

function RoundBtn(props: { label: string; onTap: () => void; accent?: string; disabled?: boolean }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: '12px',
        backgroundColor: props.disabled ? '#eef2f6' : (props.accent ?? ACCENT),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: props.disabled ? 'none' : `0 3px 8px ${props.accent ?? ACCENT}40`,
      }}
      //@ts-ignore on: namespaced events are required by the NS solid renderer
      on:click={() => {
        if (!props.disabled) props.onTap()
      }}
    >
      <p style={{ fontSize: 20, color: props.disabled ? '#b2bec3' : 'white', fontWeight: 'bold' }}>
        {props.label}
      </p>
    </div>
  )
}

export function Stepper(props: {
  value: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
  accent?: string
}) {
  const step = () => props.step ?? 1
  const min = () => (props.min ?? -Infinity)
  const max = () => (props.max ?? Infinity)
  const dec = () => props.onChange(Math.max(min(), props.value - step()))
  const inc = () => props.onChange(Math.min(max(), props.value + step()))
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px 10px' }}>
      <RoundBtn label="−" onTap={dec} accent={props.accent} disabled={props.value <= min()} />
      <div
        style={{
          minWidth: 64,
          height: 38,
          borderRadius: '10px',
          backgroundColor: '#f4f6f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 'bold', color: TEXT }}>
          {props.value}
          {props.suffix ?? ''}
        </p>
      </div>
      <RoundBtn label="+" onTap={inc} accent={props.accent} disabled={props.value >= max()} />
    </div>
  )
}

export function CodeBlock(props: { lines: string[] }) {
  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '10px',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <For each={props.lines}>
        {(line) => (
          <p
            style={{
              fontSize: 12,
              color: '#a29bfe',
              fontFamily: 'monospace',
              lineHeight: 1.5,
            }}
          >
            {line}
          </p>
        )}
      </For>
    </div>
  )
}
