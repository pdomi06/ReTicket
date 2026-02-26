
import { useEffect, useState } from "react";
//import { useSearchParams } from "react-router-dom";
import type { IEvent } from "../../utils/interfaces";
import Cards from "../../components/ui/cards/Cards";
import Card from "../../components/ui/card/Card";
import Sidebar from "./sidebar/Sidebar";

const Search = () => {
    // TODO: Implement search functionality using URL query parameters
    //const [searchParams] = useSearchParams();
    //const event = searchParams.get("event");
    //const venue = searchParams.get("venue");
    //const date = searchParams.get("date");
    //const maxPrice = searchParams.get("maxPrice");

    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function getEvents() {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/events`);
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        if (!contentType.includes('application/json')) {
            throw new Error('API did not return JSON. Check your API base URL and backend server.');
        }

        const data = await response.json();
        return data as IEvent[];
    }

    useEffect(() => {
        getEvents()
            .then((data) => {
                setEvents(data);
            })
            .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : 'Failed to load events';
                setError(message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    return (
        <main className="row container m-0 p-0">
            <div className={`${"sidebar"} col-lg-3`}>
                <Sidebar />
            </div>
            <div className="col-lg-9">
                <div className="container my-5">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        events.length > 0 ? (
                            <Cards maximumcols={3}>
                                {events.map((event) => (
                                    <Card key={event.id} title={event.name} description={event.description} buttonText="View Details" link={`/event?name=${event.name}`}/>
                                ))}
                            </Cards>
                        ) : (
                            <p>No events found.</p>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}

export default Search;