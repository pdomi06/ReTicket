import style from './Welcome.module.css'
import Card from '../../components/ui/card/Card.tsx';
import Cards from "../../components/ui/cards/Cards.tsx"

import mockPicture from '../../../public/img/mock/music_genre.png';

const Welcome = () => {
    return (
        <main className={`${style['welcome-container']} container`}>
            <Cards>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            <Card title="Brodway" description="Excelentshow" imageUrl={mockPicture}/>
            </Cards>
        </main>
    )
}

export default Welcome;
