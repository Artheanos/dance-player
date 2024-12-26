import { ChangeEvent } from 'react'

export const FileInput = ({name, accept, onChange}: {
  name: string,
  accept: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) => (
  <>
    <label htmlFor={name} className="file-upload">
      Choose file
    </label>
    <input id={name} name={name} type="file" accept={accept} onChange={onChange}/>
  </>
)