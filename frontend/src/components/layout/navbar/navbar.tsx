import { Link } from 'react-router';

const Navbar = () => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/test">Test</Link>
            <Link to="/scenery">Scenery</Link>
        </nav>
    );
}

export default Navbar;