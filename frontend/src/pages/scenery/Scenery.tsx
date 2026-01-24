import { useState } from "react";
import type { ISceneryMap } from "../../utils/interfaces";
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
                <div className={`${style["scenery-input-group"]} ${style.floating}`}>
                    <input type="text" name="name" id="name" placeholder=" " onChange={(e) => setSceneryParams({ ...sceneryParams, name: e.target.value } as ISceneryMap)} />
                    <label htmlFor="name">Name</label>
                </div>
                <div className={`${style["scenery-input-group"]} ${style.floating}`}>
                    <input type="number" name="width" id="width" placeholder=" " onChange={(e) => setSceneryParams({ ...sceneryParams, width: Number(e.target.value) } as ISceneryMap)} />
                    <label htmlFor="width">Width</label>
                </div>
                <div className={`${style["scenery-input-group"]} ${style.floating}`}>
                    <input type="number" name="height" id="height" placeholder=" " onChange={(e) => setSceneryParams({ ...sceneryParams, height: Number(e.target.value) } as ISceneryMap)} />
                    <label htmlFor="height">Height</label>
                </div>
                <div className={`${style["scenery-input-group"]} ${style.floating}`}>
                    <input type="number" name="rate" id="rate" step={0.01} placeholder=" " onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) } as ISceneryMap)} />
                    <label htmlFor="rate">Rate</label>
                </div>
                <button type="submit">Generate Scenery</button>
            </form>
        </div>
    )
}
export default Scenery