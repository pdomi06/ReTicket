import { useState } from "react";
import type { ISceneryMap } from "../../utils";

const Scenery = () => {
    const [sceneryParams, setSceneryParams] = useState<ISceneryMap | null>(null);
    function handleSubmit() {
        console.log(sceneryParams);
    }
    return (
        <div>
            <h1>Scenery Page</h1>
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
                <input type="text" name="name" id="name" onChange={(e) => setSceneryParams({ ...sceneryParams, name: e.target.value } as ISceneryMap)}/>
                <input type="number" name="width" id="width" onChange={(e) => setSceneryParams({ ...sceneryParams, width: Number(e.target.value) } as ISceneryMap)}/>
                <input type="number" name="height" id="height" onChange={(e) => setSceneryParams({ ...sceneryParams, height: Number(e.target.value) } as ISceneryMap)}/>
                <input type="number" name="rate" id="rate" step={0.01} onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) } as ISceneryMap)}/>
                <button type="submit">Generate Scenery</button>
            </form>
        </div>
    )
}
export default Scenery