import style from './Welcome.module.css'
import Card from '../../components/ui/card/Card.tsx';
import Cards from "../../components/ui/cards/Cards.tsx"

import mockPicture from '../../../public/img/mock/music_genre.png';

const Welcome = () => {
    return (
        <main className={`${style['welcome-container']} container`}>
            {/* TODO: Loading cards from api.*/}
            <div className={`${style['upcomming-events-container']} container-fluid my-5`}>
                <h1 className={style['events-title']}>Upcomming Events</h1>
                <h6 className={style['events-subtitle']}>Trending events in the near future</h6>
                <Cards>
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                </Cards>
            </div>
            <div className={`${style['upcomming-events-container']} container-fluid my-5`}>
                <h1 className={style['events-title']}>Upcomming Events</h1>
                <h6 className={style['events-subtitle']}>Trending events in the near future</h6>
                <Cards>
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                    <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture} />
                </Cards>
            </div>
        </main>
    )
}

export default Welcome;
