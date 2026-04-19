import { useEffect, useState } from "react";
import type { IVenueMap } from "../../../utils/interfaces";
import { LuMapPin, LuTrendingUp } from "react-icons/lu";
import Input from "../../../components/ui/input/Input";
import styles from "./Venues.module.css";
import Button from "../../../components/ui/button/Button";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";

export default function Venues() {
  const [venues, setVenues] = useState<IVenueMap[]>([]);
  const trackPageLoading = usePageLoading();
  const [filters, setFilters] = useState({
    venue: "",
    section: "",
  });

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/venues`);
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }

    const fetchVenuesPromise = fetchVenues();
    void trackPageLoading(fetchVenuesPromise);
  }, [trackPageLoading]);

  const filteredVenues = venues.filter((venue) => {
    const venueMatch = venue.venue
      .toLowerCase()
      .includes(filters.venue.toLowerCase());
    const sectionMatch = venue.section
      .toLowerCase()
      .includes(filters.section.toLowerCase());

    return venueMatch && sectionMatch;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ venue: "", section: "" });
  };

  return (
    <div className={`container-fluid mt-4 ${styles.venuesContainer}`}>
      <div className={styles.headerSection}>
        <h1>Venues</h1>
        <div>
          <Button text="+ Add Venue" link="/dashboard/create-venue" />
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <div>
            <Input
              type="text"
              label="Filter by venue"
              name="venue"
              value={filters.venue}
              onChange={handleFilterChange}
              theme="dark"
              size="medium" />
          </div>
          <div>
            <Input
              type="text"
              label="Filter by section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          {(filters.venue || filters.section) && (
            <div>
              <Button text="Clear" onClick={handleClearFilters} variant="outline" />
            </div>
          )}
        </div>
        <p className={styles.resultCount}>
          Showing {filteredVenues.length} of {venues.length} venues
        </p>
      </div>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>
                <LuMapPin size={16} className="me-2" />
                Venue
              </th>
              <th>Section</th>
              <th className="text-center">Rows</th>
              <th className="text-center">Cols</th>
              <th>
                <LuTrendingUp size={16} className="me-2" />
                Rate
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {venues.length === 0
                    ? "No venues found"
                    : "No venues match your filters"}
                </td>
              </tr>
            ) : (
              filteredVenues.map((venue) => (
                <tr key={venue.id}>
                  <td>{venue.venue}</td>
                  <td>{venue.section}</td>
                  <td className="text-center">{venue.rows}</td>
                  <td className="text-center">{venue.cols}</td>
                  <td>{venue.rate}x</td>
                  <td className={`text-center ${styles.actionButtons}`}>
                    <div className="row">
                      <div className="col-2">
                        <Button text="Edit" link={`/dashboard/edit-venue/${venue.id}`} variant="outline" />
                      </div>
                      <div className="col-2">
                        <Button text="Delete" link={`/dashboard/delete-venue/${venue.id}`} variant="outline" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
