import { useEffect, useState } from "react";
import type { IVenueMap } from "../../../utils/interfaces";
import { LuMapPin, LuTrendingUp } from "react-icons/lu";
import styles from "./Venues.module.css";
import Button from "../../../components/ui/button/Button";

export default function Venues() {
  const [venues, setVenues] = useState<IVenueMap[]>([]);
  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`);
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }

    fetchVenues();
  }, []);

  return (
    <div className={`container-fluid mt-4 ${styles.venuesContainer}`}>
      <div className={styles.headerSection}>
        <h1>Venues</h1>
        <div>
          <Button text="+ Add Venue" link="/dashboard/create-venue" />
        </div>
      </div>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th><LuMapPin size={16} className="me-2" />Venue</th>
              <th>Section</th>
              <th className="text-center">Rows</th>
              <th className="text-center">Cols</th>
              <th><LuTrendingUp size={16} className="me-2" />Rate</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No venues found
                </td>
              </tr>
            ) : (
              venues.map((venue) => (
                <tr key={`${venue.venue}-${venue.section}`}>
                  <td>{venue.venue}</td>
                  <td>{venue.section}</td>
                  <td className="text-center">
                    {venue.rows}
                  </td>
                  <td className="text-center">
                    {venue.cols}
                  </td>
                  <td>{venue.rate}x</td>
                  <td className={`text-center ${styles.actionButtons}`}>
                    <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
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
