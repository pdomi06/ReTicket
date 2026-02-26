import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/button/Button';
import Input from '../../../components/ui/input/Input';
import style from './Searchbar.module.css';
import { useState } from 'react';

const SearchBar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        event: '',
        venue: '',
        date: '',
        maxPrice: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const query = new URLSearchParams(formData).toString();
        navigate(`/search?${query}`);
    };

    return (
        <div className={`${style.searchbar} justify-content-center my-4`}>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row g-3 mx-2">
                    <div className={`${style['searchbar-input']} col`}>
                        <Input 
                            label="Event or artist name..." 
                            name="event" 
                            theme="light" 
                            size="large" 
                            onChange={(e) => setFormData({...formData, event: e.target.value})} 
                        />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input 
                            label="City, state, or venue..." 
                            name="venue" 
                            theme="light" 
                            size="large" 
                            onChange={(e) => setFormData({...formData, venue: e.target.value})} 
                        />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input 
                            type='date' 
                            label="Select date..." 
                            name="date" 
                            theme="light" 
                            size="large" 
                            onChange={(e) => setFormData({...formData, date: e.target.value})} 
                        />
                    </div>
                    <div className={`${style['searchbar-input']} col`}>
                        <Input 
                            type='number' 
                            label="Max price (Ft)..." 
                            name="maxPrice" 
                            theme="light" 
                            size="large" 
                            onChange={(e) => setFormData({...formData, maxPrice: e.target.value})} 
                        />
                    </div>
                    <div className={`${style['searchbar-button']} col`}>
                        <Button text="Search" type='submit' />
                    </div>
                </div>
            </form>
            <hr />
        </div>
    );
};

export default SearchBar;