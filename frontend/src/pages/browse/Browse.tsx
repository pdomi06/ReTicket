
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

    async function getEvents() {
        const response = await fetch(`http://127.0.0.1:8000/api/events`);
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        getEvents().then((data) => {
            setEvents(data);
        });
    }, []);
    return (
        <main className="row container m-0 p-0">
            <div className={`${"sidebar"} col-lg-3`}>
                <Sidebar />
            </div>
            <div className="col-lg-9">
                <div className="container my-5">
                    {events.length === 0 ? (
                        <p>Loading...</p>
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