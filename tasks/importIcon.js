import fs from 'fs'

const main = () => {
  const svgSourcePath = process.argv[2]
  const iconName = process.argv[3]

  if (!svgSourcePath) {
    return console.error('No source path provided')
  }
  if (!iconName) {
    return console.error('No icon name provided')
  }

  const svgPathHtml = getSvgPathHtml(svgSourcePath)
  createIconComponent(iconName, svgPathHtml)
}

const getSvgPathHtml = (path) => {
  const pathHtmlRegex = /<path.*\/>/g
  const svgContent = fs.readFileSync(path).toString()
  return svgContent.match(pathHtmlRegex)[0]
}

const createIconComponent = (iconName, pathContent) => {
  const iconComponentName = `${capitalize(iconName)}Icon`

  const contents = `import { SVGProps } from 'react'

export const ${iconComponentName} = ({...props}: SVGProps<SVGSVGElement>) => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    ${pathContent}
  </svg>
)
`

  fs.writeFileSync(`./src/assets/icons/${iconComponentName}.tsx`, contents, 'utf8')
}

const capitalize = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

main()
