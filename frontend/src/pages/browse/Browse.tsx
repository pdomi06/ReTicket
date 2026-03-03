import { useEffect, useState } from "react";
import type { IEvent } from "../../utils/interfaces";
import Cards from "../../components/ui/cards/Cards";
import Card from "../../components/ui/card/Card";
import Sidebar from "./sidebar/Sidebar";
import { useSearchParams } from "react-router";

const Browse = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.toString();

    const [events, setEvents] = useState<IEvent[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastCompletedQuery, setLastCompletedQuery] = useState<string | null>(null);

    const isLoading = lastCompletedQuery !== query;

    async function getEvents(q: string, signal?: AbortSignal) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const url = `${apiBaseUrl}/events/search?${q}`;
        console.log(`Fetching events with URL: ${url}`);
        console.log("Search params:", Object.fromEntries(searchParams.entries()));

        const response = await fetch(url, { signal });
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        if (!contentType.includes("application/json")) {
            throw new Error("API did not return JSON. Check your API base URL and backend server.");
        }

        const json = await response.json();
        console.log("API Response:", json);
        return json.data as IEvent[];
    }

    useEffect(() => {
        const controller = new AbortController();

        getEvents(query, controller.signal)
            .then((data) => {
                setEvents(data);
                setError(null);
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Failed to load events";
                setError(message);
            })
            .finally(() => {
                setLastCompletedQuery(query);
            });

        return () => controller.abort();
    }, [query]);

    return (
        <main className="row container m-0 p-0">
            <div className="sidebar col-lg-3">
                <Sidebar />
            </div>
            <div className="col-lg-9">
                <div className="container my-5">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : events.length > 0 ? (
                        <Cards maximumcols={3}>
                            {events.map((event) => (
                                <Card
                                    key={event.id}
                                    title={event.name}
                                    description={event.description}
                                    buttonText="View Details"
                                    link={`/event?event=${event.id}`}
                                    imageUrl={event.imageUrl}
                                />
                            ))}
                        </Cards>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Browse;