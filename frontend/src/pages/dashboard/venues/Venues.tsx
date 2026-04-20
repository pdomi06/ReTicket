import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { apiFetch } from '../../../lib/apiFetch';
import { usePageLoading } from '../../../contexts/loading/LoadingContext';
import Input from '../../../components/ui/input/Input';
import Button from '../../../components/ui/button/Button';
import Modal from '../../../components/ui/modal/Modal';
import styles from './Venues.module.css';

interface Venue {
  id: number;
  venue: string;
  section: string;
  rows: number;
  cols: number;
  rate: number;
}

const Venues = () => {
  const trackPageLoading = usePageLoading();
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);

  const [filters, setFilters] = useState({
    venue: '',
    section: '',
    minRate: '',
    maxRate: '',
  });

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Venue>>({});

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAllVenues = useCallback(async () => {
    trackPageLoading(
      (async () => {
        try {
          const response = await apiFetch(`${VITE_API_BASE_URL}/venues`);
          if (!response.ok) throw new Error('Failed to fetch venues');

          const payload = (await response.json()) as Venue[];
          setAllVenues(payload);
        } catch (error) {
          console.error('Error fetching venues:', error);
        }
      })()
    );
  }, [VITE_API_BASE_URL, trackPageLoading]);

  useEffect(() => {
    void fetchAllVenues();
  }, [fetchAllVenues]);

  useEffect(() => {
    let filtered = allVenues;

    if (filters.venue) {
      const query = filters.venue.toLowerCase();
      filtered = filtered.filter((v) => v.venue.toLowerCase().includes(query));
    }

    if (filters.section) {
      const query = filters.section.toLowerCase();
      filtered = filtered.filter((v) => v.section.toLowerCase().includes(query));
    }

    if (filters.minRate) {
      const min = parseFloat(filters.minRate);
      filtered = filtered.filter((v) => v.rate >= min);
    }

    if (filters.maxRate) {
      const max = parseFloat(filters.maxRate);
      filtered = filtered.filter((v) => v.rate <= max);
    }

    setFilteredVenues(filtered);
  }, [allVenues, filters]);

  const handleClearFilters = () => {
    setFilters({
      venue: '',
      section: '',
      minRate: '',
      maxRate: '',
    });
  };

  const handleOpenEdit = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
    setEditFormData({ ...venue });
    setEditModalOpen(true);
  }, []);

  const handleSaveEdit = async () => {
    if (!selectedVenue) return;

    try {
      const response = await apiFetch(`${VITE_API_BASE_URL}/venues/${selectedVenue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error('Failed to update venue');

      const updatedVenues = allVenues.map((v) =>
        v.id === selectedVenue.id ? { ...v, ...editFormData } : v
      );
      setAllVenues(updatedVenues);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };

  const handleDeleteVenue = useCallback(async (targetVenue: Venue | null = selectedVenue) => {
    if (!targetVenue) return;

    try {
      const response = await apiFetch(`${VITE_API_BASE_URL}/venues/${targetVenue.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete venue');

      setAllVenues((previousVenues) => previousVenues.filter((venue) => venue.id !== targetVenue.id));
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  }, [VITE_API_BASE_URL, selectedVenue]);

  const venuesById = useMemo(() => {
    const venuesMap = new Map<number, Venue>();
    filteredVenues.forEach((venue) => {
      venuesMap.set(venue.id, venue);
    });
    return venuesMap;
  }, [filteredVenues]);

  const getVenueIdFromButton = useCallback((button: HTMLButtonElement) => {
    const venueId = Number(button.dataset.venueId);
    return Number.isFinite(venueId) ? venueId : null;
  }, []);

  const getVenueFromButton = useCallback((button: HTMLButtonElement) => {
    const venueId = getVenueIdFromButton(button);
    if (venueId === null) {
      return null;
    }

    return venuesById.get(venueId) ?? null;
  }, [getVenueIdFromButton, venuesById]);

  const handleOpenEditClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const venue = getVenueFromButton(event.currentTarget);
    if (!venue) {
      return;
    }

    handleOpenEdit(venue);
  }, [getVenueFromButton, handleOpenEdit]);

  const handleDeleteVenueClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const venue = getVenueFromButton(event.currentTarget);
    if (!venue) {
      return;
    }

    setSelectedVenue(venue);
    void handleDeleteVenue(venue);
  }, [getVenueFromButton, handleDeleteVenue]);

  const isFiltered = filters.venue || filters.section || filters.minRate || filters.maxRate;

  return (
    <div className={styles.venuesContainer}>
      <div className={styles.headerSection}>
        <h1>Venues</h1>
        <div><Button text="+ Add Venue" link="/dashboard/create-venue" /></div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <div style={{ minWidth: '200px' }}>
            <Input
              type="text"
              label="Filter by venue"
              name="venue"
              value={filters.venue}
              onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
              theme="dark"
              size="medium"
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <Input
              type="text"
              label="Filter by section"
              name="section"
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              theme="dark"
              size="medium"
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <Input
              type="number"
              label="Min Rate"
              name="minRate"
              value={filters.minRate}
              onChange={(e) => setFilters({ ...filters, minRate: e.target.value })}
              theme="dark"
              size="medium"
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <Input
              type="number"
              label="Max Rate"
              name="maxRate"
              value={filters.maxRate}
              onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
              theme="dark"
              size="medium"
            />
          </div>

          {isFiltered && (
            <div>
              <Button
                text="Clear"
                variant="outline"
                onClick={handleClearFilters}
              />
            </div>
          )}
        </div>
        <p className={styles.resultCount}>
          Showing {filteredVenues.length} of {allVenues.length} venues
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Venue</th>
              <th>Section</th>
              <th>Capacity</th>
              <th>Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  {allVenues.length === 0 ? 'No venues found' : 'No venues match your filters'}
                </td>
              </tr>
            ) : (
              filteredVenues.map((venue) => (
                <tr key={venue.id}>
                  <td>
                    <div className={styles.venueCell}>
                      <div>
                        <div className={styles.venueName}>{venue.venue}</div>
                        <div className={styles.venueId}>#{venue.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.sectionCell}>
                    {venue.section}
                  </td>
                  <td className={styles.capacityCell}>
                    <div className={styles.capacityValue}>
                      {venue.rows} × {venue.cols}
                    </div>
                    <div className={styles.capacityTotal}>
                      = {venue.rows * venue.cols} seats
                    </div>
                  </td>
                  <td className={styles.rateCell} style={{
                    color: venue.rate > 1 ? 'var(--color-accent)' : 'var(--color-text-muted)'
                  }}>
                    {venue.rate}x
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.iconButton}
                        data-venue-id={venue.id}
                        onClick={handleOpenEditClick}
                        title="Edit venue"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.iconButton}
                        data-venue-id={venue.id}
                        onClick={handleDeleteVenueClick}
                        title="Delete venue"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Venue"
        size="md"
        confirmText="Save Changes"
        cancelText="Cancel"
        onConfirm={handleSaveEdit}
      >
        {selectedVenue && (
          <div className={styles.editModal}>
            <Input
              type="text"
              label="Venue Name"
              name="venue"
              value={editFormData.venue || ''}
              onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
              theme="dark"
              size="medium"
            />
            <Input
              type="text"
              label="Section"
              name="section"
              value={editFormData.section || ''}
              onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })}
              theme="dark"
              size="medium"
            />
            <Input
              type="number"
              label="Rows"
              name="rows"
              value={editFormData.rows || ''}
              onChange={(e) => setEditFormData({ ...editFormData, rows: parseInt(e.target.value) })}
              theme="dark"
              size="medium"
            />
            <Input
              type="number"
              label="Cols"
              name="cols"
              value={editFormData.cols || ''}
              onChange={(e) => setEditFormData({ ...editFormData, cols: parseInt(e.target.value) })}
              theme="dark"
              size="medium"
            />
            <Input
              type="number"
              label="Rate Multiplier"
              name="rate"
              value={editFormData.rate || ''}
              onChange={(e) => setEditFormData({ ...editFormData, rate: parseFloat(e.target.value) })}
              theme="dark"
              size="medium"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Venues;
