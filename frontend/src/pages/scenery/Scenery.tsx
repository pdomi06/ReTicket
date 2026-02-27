import { useState } from "react";
import type { ISceneryMap, IVenueMap } from "../../utils/interfaces";
import Input from "../../components/ui/input/Input";
import style from './Scenery.module.css'
import Button from "../../components/ui/button/Button";
import { defaultISceneryMap } from "../../utils/defaults";

const Scenery = () => {
    const [sceneryParams, setSceneryParams] = useState<ISceneryMap>(defaultISceneryMap);
    const [loading, setLoading] = useState(false);

    async function checkExistingScenery(): Promise<boolean> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`)
            const data = await response.json()
            return data.some((venue: ISceneryMap) => venue.venue === sceneryParams.venue);
        } catch (error) {
            console.error('Error checking existing scenery:', error);
            return false;
        }
    }

    async function storeVenue(venue: IVenueMap) {
        if(await checkExistingScenery()) {
            alert('A scenery with this name already exists. Please choose a different name.');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(venue)
            });
            if (!response.ok) {
                throw new Error(`Failed to store venue: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Venue stored successfully:', data);
            alert('Scenery created successfully!');
        } catch (error) {
            console.error('Error storing venue:', error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        if (sceneryParams.venue && sceneryParams.width > 0 && sceneryParams.height > 0 && sceneryParams.rate > 0) {
            try {
                const newScenery = {
                    venue: sceneryParams.venue,
                    width: sceneryParams.width,
                    height: sceneryParams.height,
                    rate: sceneryParams.rate
                }
                for (let row = 1; row <= sceneryParams.height; row++) {
                    for (let col = 1; col <= sceneryParams.width; col++) {
                        const venue: IVenueMap = {
                            venue: newScenery.venue,
                            section: `Section ${row}`,
                            row: String(row),
                            seat: String(col),
                            rate: newScenery.rate
                        }
                        await storeVenue(venue);
                    }
                }
            } catch (error) {
                alert('An error occurred while creating the scenery. Please try again.');
                console.error('Error creating scenery:', error);
            } 
        } else {
            alert('Please fill in all fields with valid values.');
        }
        setLoading(false);
    }

    return (
        <div className="container my-5">
            <form onSubmit={handleSubmit} className={`container w-50`}>
                <div className={`rounded p-4 ${style['scenery-form']}`}>
                    <h1>Scenery Designer</h1>
                    <hr />
                    <div className="d-grid gap-3">
                        <Input type="text" name="venue" label="Venue" onChange={(e) => setSceneryParams({ ...sceneryParams, venue: e.target.value })} />
                        <Input type="number" name="width" label="Width" onChange={(e) => setSceneryParams({ ...sceneryParams, width: Number(e.target.value) })} />
                        <Input type="number" name="height" label="Height" onChange={(e) => setSceneryParams({ ...sceneryParams, height: Number(e.target.value) })} />
                        <Input type="number" name="rate" label="Rate" step={0.01} onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) })} />
                        {loading ? <Button type="button" text="Creating Scenery..." disabled={true} /> : <Button type="submit" text="Create Scenery" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Scenery