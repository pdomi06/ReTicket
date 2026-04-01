

import Input from '../../../components/ui/input/Input';
import { useState } from 'react';
import Button from '../../../components/ui/button/Button';
import { useNavigate, createSearchParams } from 'react-router-dom';
import Select from '../../../components/ui/select/Select';

const Sidebar = () => {
    const [searchForm, setForm] = useState({
        name: '',
        venue: '',
        city: '',
        country: '',
        eventDate: '',
        category: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...searchForm, [e.target.name]: e.target.value });
    };


    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params: Record<string, string> = {};

        if (searchForm.name) params.name = searchForm.name;
        if (searchForm.venue) params.venue = searchForm.venue;
        if (searchForm.city) params.city = searchForm.city;
        if (searchForm.country) params.country = searchForm.country;
        if (searchForm.eventDate) {
            params.eventDate = searchForm.eventDate;
            // Include user's timezone offset to ensure date filtering is consistent
            // with their local timezone (e.g., "-05:00" for EST, "+01:00" for CET)
            const offsetMinutes = new Date().getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const offsetMins = Math.abs(offsetMinutes) % 60;
            const sign = offsetMinutes <= 0 ? '+' : '-';
            params.timezone = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
        }
        if (searchForm.category) params.category = searchForm.category;

        navigate({
            pathname: '/browse',
            search: `?${createSearchParams(params)}`
        });
    };

    return (
        <div className="container-fluid mt-4">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <Input label="Event name" name="name" theme="light" size="large" value={searchForm.name} onChange={handleChange} />
                <Input label="Venue" name="venue" theme="light" size="large" value={searchForm.venue} onChange={handleChange} />
                <Input label="City" name="city" theme="light" size="large" value={searchForm.city} onChange={handleChange} />
                <Input label="Country" name="country" theme="light" size="large" value={searchForm.country} onChange={handleChange} />
                <Input type="date" label="Event Date" name="eventDate" theme="light" size="large" value={searchForm.eventDate} onChange={handleChange} />
                <Select label="Category" name="category" theme="light" size="large" value={searchForm.category} onChange={handleChange}>
                    <option value="" disabled>Select Category</option>
                    <option value="">None</option>
                    <option value="cultural">Cultural</option>
                    <option value="music">Music</option>
                    <option value="sport">Sport</option>
                </Select>
                <Button type="submit" text="Search Events" />
            </form>
        </div>
    );
}

export default Sidebar;