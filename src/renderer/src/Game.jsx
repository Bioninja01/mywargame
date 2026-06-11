import { useEffect, useRef} from "react"
import { YellowEngine } from "../../engine/yellowEngine.js"

import { Scene } from "../../engine/Scene.js";
import { TestScene } from "../../warGame/TestScene.js";


export default function Game() {
  const canvasRef = useRef(null);
  const game = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    game.current = new YellowEngine(canvas)
    const testScene = new TestScene()
    game.current.setScene(testScene);
    game.current.start()
  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="game" />
    </>
  )
}
