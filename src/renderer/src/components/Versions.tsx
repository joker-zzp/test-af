import { useState } from 'react'

function Versions(): JSX.Element {
  // const [versions] = useState()

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{}</li>
      <li className="chrome-version">Chromium v{}</li>
      <li className="node-version">Node v{}</li>
    </ul>
  )
}

export default Versions
