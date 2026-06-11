import Game from "./Game"

export default function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Game/>
    </>
  )
}
