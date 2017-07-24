import { renderToStringWithData } from 'react-apollo';
import path from 'path'
import fs from 'fs'


export default async (renderMe) => {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')
  const markup = await renderToStringWithData(renderMe)

  return fs.readFileSync(filePath, 'utf8').replace('{{SSR}}', markup)
}
