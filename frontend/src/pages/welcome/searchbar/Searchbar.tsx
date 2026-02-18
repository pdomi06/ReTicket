import Button from '../../../components/ui/button/Button';
import Input from '../../../components/ui/input/Input';

import style from './Searchbar.module.css';

const SearchBar = () => {
    return (
        <div className={`${style.searchbar} justify-content-center my-4`}>
            <hr />
            <form action="/search" method="GET">
                <div className="row g-3 mx-2">
                    <div className={`${style['searchbar-input']} col`}>
                        <Input label="Event or artist name..." name="event" theme="light" size="large" onChange={() => { }} />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input label="City, state, or venue..." name="venue" theme="light" size="large" onChange={() => { }} />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input type='date' label="Select date..." name="date" theme="light" size="large" onChange={() => { }} />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input type='number' label="Max price (Ft)..." name="maxPrice" theme="light" size="large" onChange={() => { }} />
                    </div>
                    <div className={`${style['searchbar-button']} col`}>
                        <Button text="Search" type='submit' />
                    </div>
                </div>
            </form>
            <hr />
        </div>
    )
}

export default SearchBar;