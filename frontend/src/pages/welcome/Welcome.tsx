const Welcome = () => {
    return (
        <main>
            <header id="carouser" className="container-fluid my-2">
                <div id="carouselExample" className="carousel slide">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"
                            aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    {/* Carousel items start */}
                    <div className="carousel-inner">

                        <div className="carousel-item active">
                            <img src="../webpages/img/music_genre.png" className="d-block w-100" alt="Live music concerts and performances" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Discover Live Music</h5>
                                <p>Experience the best concerts and live performances in your area.</p>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <img src="../webpages/img/cultural_genre.png" className="d-block w-100" alt="Cultural events and exhibitions" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Cultural Events</h5>
                                <p>Explore theater, art exhibitions, and cultural performances.</p>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <img src="../webpages/img/music_genre.png" className="d-block w-100" alt="Festival and outdoor events" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Festivals & More</h5>
                                <p>Find unique festivals and special events happening near you.</p>
                            </div>
                        </div>
                    </div>
                    {/* Carousel items end */}
                    {/* Arrow buttons start */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    {/* Arrow buttons end */}
                </div>
            </header>
            <section id="searchBar" className="container-fluid my-3 py-3">
                <form className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 justify-content-center g-2">
                    {/* Input Start */}
                    <div className="col search-input-wrapper">
                        <div className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <input type="text" className="form-control" id="nameInput" placeholder="Event or artist name..." list="nameSuggestions" />
                        <datalist id="nameSuggestions">
                            <option value="Concert A">2025-01-21</option>
                            <option value="Festival B">2025-01-21</option>
                            <option value="Festival A">2025-01-21</option>
                            <option value="Play C">2025-01-21</option>
                            <option value="Artist D">2025-01-21</option>
                        </datalist>
                    </div>
                    {/* Input End */}
                    {/* Input Start */}
                    <div className="col search-input-wrapper">
                        <div className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <input type="text" className="form-control" id="locationInput" placeholder="City, state, or venue..." list="locationSuggestions" />
                        <datalist id="locationSuggestions">
                            <option value="New York">NY, USA</option>
                            <option value="Los Angeles">CA, USA</option>
                            <option value="Chicago">IL, USA</option>
                            <option value="Houston">TX, USA</option>
                            <option value="Miami">FL, USA</option>
                        </datalist>
                    </div>
                    {/* Input End */}
                    {/* Input Start */}
                    <div className="col search-input-wrapper">
                        <div className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <path d="M16 2v4M8 2v4M3 10h18"></path>
                            </svg>
                        </div>
                        <input type="date" className="form-control" id="dateInput" placeholder="Select date..." />
                    </div>
                    {/* Input End */}
                    {/* Input Start */}
                    <div className="col search-input-wrapper">
                        <div className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                        <input type="number" className="form-control" id="maxPriceInput" placeholder="Max price (Ft)..." />
                    </div>
                    {/* Input End */}
                    {/* Button Start */}
                    <div className="col">
                        <button type="button" className="btn btn-dark w-100" style={{ height: '48px', fontWeight: '600', letterSpacing: '0.5px', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Search</button>
                    </div>
                    {/* Button End */}
                </form>
            </section>

            <section id="cards" className="container-fluid py-5">
                <h2 className="text-center mb-5">Browse by Category</h2>
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 justify-content-center g-5">
                        {/* Card Start */}
                        <div className="col">
                            <div className="card bg-dark h-100">
                                <div className="card-badge">🎵 Music</div>
                                <img src="./img/music_genre.png" className="card-img-top" alt="Live music concerts and performances" />
                                <div className="card-img-overlay">
                                    <div className="card-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path d="M9 18V5l12-2v13"></path>
                                            <circle cx="6" cy="18" r="3"></circle>
                                            <circle cx="18" cy="16" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div className="d-flex flex-column justify-content-end h-100">
                                        <h3 className="card-title text-light">Music</h3>
                                        <a href="#" className="btn btn-dark">Browse</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card End */}
                        {/* Card Start */}
                        <div className="col">
                            <div className="card bg-dark h-100">
                                <div className="card-badge">🎭 Culture</div>
                                <img src="./img/cultural_genre.png" className="card-img-top" alt="Cultural events and theatrical performances" />
                                <div className="card-img-overlay">
                                    <div className="card-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path d="M6 4h12v8c0 1-1 2-2 2H8c-1 0-2-1-2-2V4z"></path>
                                            <path d="M8 16v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2"></path>
                                            <circle cx="12" cy="8" r="1.5"></circle>
                                        </svg>
                                    </div>
                                    <div className="d-flex flex-column justify-content-end h-100">
                                        <h3 className="card-title text-light">Cultural</h3>
                                        <a href="#" className="btn btn-dark">Browse</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card End */}
                        {/* Card Start */}
                        <div className="col">
                            <div className="card bg-dark h-100">
                                <div className="card-badge">🏆 Sports</div>
                                <img src="./img/music_genre.png" className="card-img-top" alt="Sports events and competitions" />
                                <div className="card-img-overlay">
                                    <div className="card-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <circle cx="12" cy="12" r="9"></circle>
                                            <path d="M12 7v5l3.5 2"></path>
                                        </svg>
                                    </div>
                                    <div className="d-flex flex-column justify-content-end h-100">
                                        <h3 className="card-title text-light">Sports</h3>
                                        <a href="#" className="btn btn-dark">Browse</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card End */}
                        {/* Card Start */}
                        <div className="col">
                            <div className="card bg-dark h-100">
                                <div className="card-badge">😂 Comedy</div>
                                <img src="./img/cultural_genre.png" className="card-img-top" alt="Comedy shows and stand-up performances" />
                                <div className="card-img-overlay">
                                    <div className="card-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <circle cx="8" cy="9" r="1.5"></circle>
                                            <circle cx="16" cy="9" r="1.5"></circle>
                                            <path d="M8 15a4 4 0 0 0 8 0"></path>
                                        </svg>
                                    </div>
                                    <div className="d-flex flex-column justify-content-end h-100">
                                        <h3 className="card-title text-light">Comedy</h3>
                                        <a href="#" className="btn btn-dark">Browse</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card End */}
                    </div>
                </div>
            </section>

            <section id="trending" className="container-fluid py-5">
                <h2 className="text-center mb-5">Trending Events</h2>
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div className="col">
                            <div className="trending-card">
                                <div className="trending-badge">🔥 Hot</div>
                                <img src="./img/music_genre.png" alt="Trending event 1" />
                                    <div className="trending-content">
                                        <h4>Summer Music Festival</h4>
                                        <p>July 15, 2025 • 8000+ tickets sold</p>
                                        <div className="event-stats">
                                            <span className="stat">⭐ 4.8/5</span>
                                            <span className="stat">📍 New York</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="trending-card">
                                <div className="trending-badge">🔥 Hot</div>
                                <img src="./img/cultural_genre.png" alt="Trending event 2" />
                                    <div className="trending-content">
                                        <h4>Broadway Theatre Night</h4>
                                        <p>Aug 22, 2025 • 5400+ tickets sold</p>
                                        <div className="event-stats">
                                            <span className="stat">⭐ 4.9/5</span>
                                            <span className="stat">📍 NYC</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="trending-card">
                                <div className="trending-badge">⚡ New</div>
                                <img src="./img/music_genre.png" alt="Trending event 3" />
                                    <div className="trending-content">
                                        <h4>Jazz Night Experience</h4>
                                        <p>Sep 10, 2025 • 1200+ tickets sold</p>
                                        <div className="event-stats">
                                            <span className="stat">⭐ 4.7/5</span>
                                            <span className="stat">📍 Miami</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="container-fluid py-5">
                <h2 className="text-center mb-5">Why Choose ReTicket?</h2>
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <h4>Safe & Secure</h4>
                            <p>Protect yourself from scams with our verified marketplace and secure payment system.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h4>Easy Communication</h4>
                            <p>Connect directly with sellers and buyers with our integrated messaging system.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
                                </svg>
                            </div>
                            <h4>Community Verified</h4>
                            <p>Browse ratings and reviews from real users to make confident decisions.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                    <polyline points="13 2 13 9 20 9"></polyline>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                    <line x1="9" y1="19" x2="15" y2="19"></line>
                                </svg>
                            </div>
                            <h4>Simple & Fast</h4>
                            <p>List your tickets in minutes and start selling. No hidden fees or complications.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="start-selling" className="container-fluid my-5 py-5 text-center">
                <h2>Want to start selling tickets?</h2>
                <a href="#" className="btn btn-dark btn-lg mt-3">Get Started</a>
            </section>
        </main>
    )
}

export default Welcome;
