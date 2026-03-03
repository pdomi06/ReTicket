import { createSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/button/Button';
import Input from '../../../components/ui/input/Input';
import style from './Searchbar.module.css';
import { useState } from 'react';

const SearchBar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        venue: '',
        eventDate: '',
        maxPrice: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        
        if (formData.name) params.event = formData.name;
        if (formData.venue) params.venue = formData.venue;
        if (formData.eventDate) params.date = formData.eventDate;
        if (formData.maxPrice) params.maxPrice = formData.maxPrice;
         navigate({
            pathname: '/browse',
            search: `?${createSearchParams(params)}`
        });
    };

    return (
        <div className={`${style.searchbar} justify-content-center my-4`}>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row g-3 mx-2">
                    <div className={`${style['searchbar-input']} col`}>
                        <Input 
                            label="Event or artist name..." 
                            name="name" 
                            theme="light" 
                            size="large" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
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
                            onChange={(e) => setFormData({...formData, eventDate: e.target.value})} 
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