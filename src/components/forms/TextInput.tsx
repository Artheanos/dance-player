type Props = {
  name: string
  value: string
  label: string
  setValue: (value: string) => void
  fullWidth?: boolean
}

export const TextInput = ({name, label, value, setValue, fullWidth}: Props) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
      <label htmlFor={name} style={{fontWeight: '600', color: 'var(--color-primary-2)'}}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{boxSizing: 'border-box', width: fullWidth ? '100%' : undefined}}
      />
    </div>
  )
}
