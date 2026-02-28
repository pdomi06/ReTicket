import { useState } from "react";
import type { IVenueMap } from "../../utils/interfaces";
import Input from "../../components/ui/input/Input";
import style from './Scenery.module.css'
import Button from "../../components/ui/button/Button";
import { defaultIVenueMap } from "../../utils/defaults";

const Scenery = () => {
    const [sceneryParams, setSceneryParams] = useState<IVenueMap>(defaultIVenueMap);
    const [loading, setLoading] = useState(false);

    async function checkExistingScenery(): Promise<boolean> {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`);

            if (!response.ok) {
                console.error('Error checking existing scenery: Non-OK response', response.status, response.statusText);
                return false;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.toLowerCase().includes('application/json')) {
                console.error('Error checking existing scenery: Unexpected content-type', contentType);
                return false;
            }

            const data: unknown = await response.json();

            if (!Array.isArray(data)) {
                console.error('Error checking existing scenery: Response JSON is not an array');
                return false;
            }
            return data.some((venue: IVenueMap) => venue.venue === sceneryParams.venue);
        } catch (error) {
            console.error('Error checking existing scenery:', error);
            return false;
        }
    }

    async function storeVenue(venue: IVenueMap): Promise<{ success: boolean; message: string }> {
        const existing = await checkExistingScenery();
        if(existing) {
            return { success: false, message: 'A scenery with this name already exists. Please choose a different name.' };
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
            return { success: true, message: 'Scenery created successfully!' };
        } catch (error) {
            console.error('Error storing venue:', error);
            return { success: false, message: 'An error occurred while storing the scenery. Please try again.' };
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        if (sceneryParams.venue && sceneryParams.rows && sceneryParams.section && sceneryParams.cols && sceneryParams.rate > 0) {
            try {
                const newVenue: IVenueMap = {
                    venue: sceneryParams.venue,
                    section: sceneryParams.section,
                    rows: String(sceneryParams.rows),
                    cols: String(sceneryParams.cols),
                    rate: sceneryParams.rate
                }
                const result = await storeVenue(newVenue);
                alert(result.message);
                if (result.success) {
                    setSceneryParams(defaultIVenueMap);
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
                        <Input type="text" name="venue" label="Venue" onChange={(e) => setSceneryParams({ ...sceneryParams, venue: e.target.value })} value={sceneryParams.venue || ''} />
                        <Input type="text" name="section" label="Section" onChange={(e) => setSceneryParams({ ...sceneryParams, section: e.target.value })} value={sceneryParams.section || ''} />
                        <Input type="number" name="rows" label="Rows" min={1} onChange={(e) => setSceneryParams({ ...sceneryParams, rows: e.target.value })} value={sceneryParams.rows || ''} />
                        <Input type="number" name="cols" label="Columns" min={1} onChange={(e) => setSceneryParams({ ...sceneryParams, cols: e.target.value })} value={sceneryParams.cols || ''} />
                        <Input type="number" name="rate" label="Rate" min={1} step={0.01} onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) })} value={sceneryParams.rate || ''} />
                        {loading ? <Button type="button" text="Creating Scenery..." disabled={true} /> : <Button type="submit" text="Create Scenery" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Scenery