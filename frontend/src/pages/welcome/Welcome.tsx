import style from './Welcome.module.css'
import Card from '../../components/ui/card/Card.tsx';
import Cards from "../../components/ui/cards/Cards.tsx"

import Features from './features/Features.tsx';
import SearchBar from './searchbar/Searchbar.tsx';
import Carouser from './carouser/Carouser.tsx';
import Reviews from './reviews/Reviews.tsx';
import type { IEvent } from '../../utils/interfaces.ts';
import React from 'react';
import { useLocation } from 'react-router';
import { usePageLoading } from '../../contexts/loading/LoadingContext.tsx';

const Welcome = () => {
    const { pathname } = useLocation();
    const trackPageLoading = usePageLoading();
    const isRootPath = pathname === "/";
    const [mostPopularEvents, setMostPopularEvents] = React.useState<IEvent[]>([]);
    const [lastMinuteDeals, setLastMinuteDeals] = React.useState<IEvent[]>([]);
    const [upcomingEvents, setUpcomingEvents] = React.useState<IEvent[]>([]);
    const [featuredEvents, setFeaturedEvents] = React.useState<IEvent[]>([]);

    const fetchEvents = React.useCallback(async () => {
        console.log('Fetching events for welcome page...');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/landing`);
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.statusText}`);
            }
            const res = await response.json();
            setMostPopularEvents(res.data.mostPopularEvents || []);
            setLastMinuteDeals(res.data.lastMinuteDeals || []);
            setUpcomingEvents(res.data.upcomingEvents || []);
            setFeaturedEvents(res.data.featuredEvents || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, []);

    React.useLayoutEffect(() => {
        const fetchEventsPromise = fetchEvents();

        if (isRootPath) {
            void trackPageLoading(fetchEventsPromise);
            return;
        }

        void fetchEventsPromise;
    }, [fetchEvents, isRootPath, trackPageLoading]);

    return (
        <main className={`${style['welcome-container']}`}>
            <Carouser events={featuredEvents} />
            <SearchBar />
            <div className={`container my-5`}>
                <h1 className={style['events-title']}>Most popular</h1>
                <h6 className={style['events-subtitle']}>Don't miss out on the hottest events</h6>
                <Cards>
                    {mostPopularEvents.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/event?event=${event.id}`} />
                    ))}
                </Cards>
            </div>
            <div className={`container my-5`}>
                <h1 className={style['events-title']}>Last Minute Deals</h1>
                <h6 className={style['events-subtitle']}>Hurry! These deals are expiring soon</h6>
                <Cards maximumcols={2}>
                    {lastMinuteDeals.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/event?event=${event.id}`} />
                    ))}
                </Cards>
            </div>
            <div className={`container my-5`}>
                <h1 className={style['events-title']}>Upcoming Events</h1>
                <h6 className={style['events-subtitle']}>Stay tuned for exciting events coming soon</h6>
                <Cards maximumcols={3}>
                    {upcomingEvents.map((event) => (
                        <Card key={event.id} title={event.name} description={event.description} imageUrl={event.imageUrl} buttonText="View Details" link={`/event?event=${event.id}`} />
                    ))}
                    <Card key={1} category={"test"} price={5000} title={"Test event"} description={"Test description"} imageUrl={"https://picsum.photos/200/300"} buttonText="View Details" />
                    <Card key={2} title={"Test event"} description={"Test descriptionTest descriptionTest descriptionTest descriptionTest descriptionTest descriptionTest description"} imageUrl={"https://picsum.photos/200/300"} buttonText="View Details" />
                </Cards>
            </div>

            <Features />
            <Reviews />
        </main>
    )
}



export default Welcome;
