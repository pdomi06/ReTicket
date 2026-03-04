import { useState, type FormEvent } from "react";
import { defaultIEvent } from "../../utils/defaults";
import type { IEvent } from "../../utils/interfaces";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/select/Select";
import { EventCategory } from "../../utils/enums";
import style from "./CreateEvent.module.css";

const CreateEvent = () => {
    const [eventParams, setEventParams] = useState<IEvent>(defaultIEvent);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add your API call here
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <form onSubmit={handleSubmit} className={`container w-50`}>
                <div className={`rounded p-4 ${style['event-form']}`}>
                    <h1>Create Event</h1>
                    <hr />
                    <div className="d-grid gap-3">
                        <Input type="text" name="name" label="Event Name" onChange={(e) => setEventParams({ ...eventParams, name: e.target.value })} value={eventParams.name || ''} />
                        <Input type="text" name="description" label="Description" onChange={(e) => setEventParams({ ...eventParams, description: e.target.value })} value={eventParams.description || ''} />
                        <Input type="text" name="venue" label="Venue" onChange={(e) => setEventParams({ ...eventParams, venue: e.target.value })} value={eventParams.venue || ''} />
                        <Input type="text" name="address" label="Address" onChange={(e) => setEventParams({ ...eventParams, address: e.target.value })} value={eventParams.address || ''} />
                        <Input type="text" name="city" label="City" onChange={(e) => setEventParams({ ...eventParams, city: e.target.value })} value={eventParams.city || ''} />
                        <Input type="text" name="state" label="State" onChange={(e) => setEventParams({ ...eventParams, state: e.target.value })} value={eventParams.state || ''} />
                        <Input type="text" name="country" label="Country" onChange={(e) => setEventParams({ ...eventParams, country: e.target.value })} value={eventParams.country || ''} />
                        <Input type="date" name="eventDate" label="Event Date" onChange={(e) => setEventParams({ ...eventParams, eventDate: e.target.value })} value={eventParams.eventDate || ''} />
                        <Input type="date" name="eventEndDate" label="Event End Date" onChange={(e) => setEventParams({ ...eventParams, eventEndDate: e.target.value })} value={eventParams.eventEndDate || ''} />
                        <Input type="number" name="basePrice" label="Base Price" min={0} step={0.01} onChange={(e) => setEventParams({ ...eventParams, basePrice: Number(e.target.value) })} value={eventParams.basePrice || ''} />
                        <Input type="text" name="imageUrl" label="Image URL" onChange={(e) => setEventParams({ ...eventParams, imageUrl: e.target.value })} value={eventParams.imageUrl || ''} />
                        <Select name="category" label="Category" theme="dark" onChange={(e) => setEventParams({ ...eventParams, category: e.target.value as IEvent['category'] })} value={eventParams.category || ''}>
                            <option value="" disabled>Select Category</option>
                            <option value="">None</option>
                            {Object.values(EventCategory).map((cat: string) => (<option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                       {loading ? <Button type="button" text="Creating Event..." disabled={true} /> : <Button type="submit" text="Create Event" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default CreateEvent;