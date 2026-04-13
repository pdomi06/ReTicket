import style from './Welcome.module.css'
import Card from '../../components/ui/card/Card.tsx';
import Cards from "../../components/ui/cards/Cards.tsx"

import Features from './features/Features.tsx';
import SearchBar from './searchbar/Searchbar.tsx';
import Carosuser from './carouser/Carouser.tsx';
import Reviews from './reviews/Reviews.tsx';
import type { IEvent } from '../../utils/interfaces.ts';
import React from 'react';

const Welcome = () => {
    const [mostPopularEvents, setMostPopularEvents] = React.useState<IEvent[]>([]);
    const [lastMinuteDeals, setLastMinuteDeals] = React.useState<IEvent[]>([]);
    const [upcomingEvents, setUpcomingEvents] = React.useState<IEvent[]>([]);

    React.useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/landing`);
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.statusText}`);
            }
            const data = await response.json();
            setMostPopularEvents(data.mostPopularEvents || []);
            setLastMinuteDeals(data.lastMinuteDeals || []);
            setUpcomingEvents(data.upcomingEvents || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }

    }

    return (
        <main className={`${style['welcome-container']}`}>
            <Carosuser />
            <SearchBar />
            <div className={`${style['upcomming-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Most popular</h1>
                <h6 className={style['events-subtitle']}>Don't miss out on the hottest events</h6>
                <Cards>
                    {mostPopularEvents.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/events/${event.id}`} />
                    ))}
                </Cards>
            </div>
            <div className={`${style['discounted-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Last Minute Deals</h1>
                <h6 className={style['events-subtitle']}>Hurry! These deals are expiring soon</h6>
                <Cards maximumcols={2}>
                    {lastMinuteDeals.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/events/${event.id}`} />
                    ))}
                </Cards>
            </div>
            <div className={`${style['discounted-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Upcoming Events</h1>
                <h6 className={style['events-subtitle']}>Stay tuned for exciting events coming soon</h6>
                <Cards maximumcols={3}>
                    {upcomingEvents.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/events/${event.id}`} />
                    ))}
                </Cards>
            </div>

            <Reviews />
            <Features />
        </main>
    )
}



export default Welcome;
