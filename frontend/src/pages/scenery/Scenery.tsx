import { useState } from "react";
import type { ISceneryMap } from "../../utils/interfaces";
import Input from "../../components/ui/input/Input";
import style from './Scenery.module.css'

const Scenery = () => {
    const [sceneryParams, setSceneryParams] = useState<ISceneryMap | null>(null);
    function handleSubmit() {
        console.log(sceneryParams);
    }
    return (
        <div className={style["scenery-main-div"]}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={style["scenery-form"]}>
                <h1>Scenery Designer</h1>
                <hr />
                <Input type="text" name="name" label="Name" onChange={(e) => setSceneryParams({ ...sceneryParams, name: e.target.value } as ISceneryMap)} />
                <Input type="number" name="width" label="Width" onChange={(e) => setSceneryParams({ ...sceneryParams, width: Number(e.target.value) } as ISceneryMap)} />
                <Input type="number" name="height" label="Height" onChange={(e) => setSceneryParams({ ...sceneryParams, height: Number(e.target.value) } as ISceneryMap)} />
                <Input type="number" name="rate" label="Rate" step={0.01} onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) } as ISceneryMap)} />
                <button type="submit">Generate Scenery</button>
            </form>
        </div>
    )
}
export default Scenery