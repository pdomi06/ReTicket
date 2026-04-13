import style from './Welcome.module.css'
import Card from '../../components/ui/card/Card.tsx';
import Cards from "../../components/ui/cards/Cards.tsx"

import Features from './features/Features.tsx';
import SearchBar from './searchbar/Searchbar.tsx';
import Carosuser from './carouser/Carouser.tsx';
import Reviews from './reviews/Reviews.tsx';

const mockPicture = '/img/mock/music_genre.png';

const Welcome = () => {

    return (
        <main className={`${style['welcome-container']}`}>
            <Carosuser />
            <SearchBar />
            {/* TODO: Loading cards from api.*/}
            <div className={`${style['upcomming-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Most popular</h1>
                <h6 className={style['events-subtitle']}>Don't miss out on the hottest events</h6>
                <Cards>
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                </Cards>
            </div>
            <div className={`${style['discounted-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Last Minute Deals</h1>
                <h6 className={style['events-subtitle']}>Hurry! These deals are expiring soon</h6>
                <Cards maximumcols={2}>
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                </Cards>
            </div>
            <div className={`${style['discounted-events-container']} container my-5`}>
                <h1 className={style['events-title']}>Comming Soon</h1>
                <h6 className={style['events-subtitle']}>Stay tuned for exciting events coming soon</h6>
                <Cards maximumcols={3}>
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} buttonText="View Details" link='/brodway' />
                </Cards>
            </div>

            <Reviews />
            <Features />
        </main>
    )
}

export default Welcome;
