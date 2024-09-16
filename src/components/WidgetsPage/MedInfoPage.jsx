import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';

const MedInfoVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const drawerRef = useRef(null); // Reference for mobile drawer

  // Sample video data
  const sampleVideos = [
    { src: 'https://www.youtube.com/watch?v=aY-XAXa_az8', thumbnail: 'https://img.youtube.com/vi/aY-XAXa_az8/hqdefault.jpg', description: 'Postpartum HyperTension' },
    { src: 'https://www.youtube.com/watch?v=BNANySYpfIg', thumbnail: 'https://img.youtube.com/vi/BNANySYpfIg/hqdefault.jpg', description: 'Postpartum HyperTension | UPMC Podcast' },
    { src: 'https://www.youtube.com/watch?v=3wXjoQbus2U', thumbnail: 'https://img.youtube.com/vi/3wXjoQbus2U/hqdefault.jpg', description: 'Causes of postpartum hypertension' },
    { src: 'https://www.youtube.com/watch?v=94YnsT9g19c', thumbnail: 'https://img.youtube.com/vi/94YnsT9g19c/hqdefault.jpg', description: 'Causes of blood pressure changes post delivery' },
    { src: 'https://www.youtube.com/watch?v=AXLEmib2ZrY', thumbnail: 'https://img.youtube.com/vi/AXLEmib2ZrY/hqdefault.jpg', description: 'Will Blood Pressure return to normal after delivery?' },
    { src: 'https://www.youtube.com/watch?v=wa3P552cQs8', thumbnail: 'https://img.youtube.com/vi/wa3P552cQs8/hqdefault.jpg', description: 'Postpartum Preeclampsia' },
  ];

  useEffect(() => {
    // Fetch video metadata from backend
    fetch('https://your-backend-api/videos')
      .then(response => response.json())
      .then(data => {
        setVideos(data);
      })
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  // Combine sample videos and fetched videos
  const allVideos = [...sampleVideos, ...videos];

  // Filter videos based on search term
  const filteredVideos = allVideos.filter(video =>
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle navbar for mobile view
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Close navbar when clicking outside of the drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setMobileDrawerOpen(false); // Close the drawer when clicking outside
      }
    };

    if (mobileDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileDrawerOpen]);

  return (
    <StyledContainer>
 

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
     {/* Navbar */}
     <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">MedInfo</div>
          <ul className="navbar-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button className="navbar-toggle" onClick={toggleNavbar}>
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileDrawerOpen && (
          <div ref={drawerRef} className="mobile-drawer">
            <ul>
              <li><a href="#home" onClick={toggleNavbar}>Home</a></li>
              <li><a href="#about" onClick={toggleNavbar}>About</a></li>
              <li><a href="#services" onClick={toggleNavbar}>Services</a></li>
              <li><a href="#contact" onClick={toggleNavbar}>Contact</a></li>
            </ul>
          </div>
        )}
      </nav>
      {/* Video Grid */}
      <div className="grid-container">
        {filteredVideos.map((video, index) => (
          <div key={index} className="grid-item">
            <div className="video-container">
              <a href={video.src} target="_blank" rel="noopener noreferrer">
                <img src={video.thumbnail} alt={`Thumbnail for ${video.description}`} className="thumbnail" />
              </a>
            </div>
            <p className="description">{video.description}</p>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
  }

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .navbar-links {
    display: flex;
    gap: 15px;
  }

  .navbar-links li {
    list-style: none;
  }

  .navbar-links a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
  }

  .navbar-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
  }

  .mobile-drawer {
    position: fixed;
    top: 60px;
    right: 0;
    width: 100%;
    background-color: #f8f9fa;
    padding: 20px;
    text-align: center;
  }

  .mobile-drawer ul {
    list-style: none;
    padding: 0;
  }

  .mobile-drawer li {
    margin: 10px 0;
  }

  .mobile-drawer a {
    text-decoration: none;
    color: #333;
    font-size: 1.2rem;
  }

  .search-bar {
    margin: 20px auto;
    text-align: center;
  }

  .search-bar input {
    width: 50%;
    padding: 10px;
    font-size: 1rem;
    border: 2px solid #93bff6;
    border-radius: 5px;
    outline: none;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .grid-item {
    text-align: center;
  }

  .thumbnail {
    width: 100%;
    max-width: 450px;
    border-radius: 8px;
  }

  .description {
    margin-top: 10px;
    font-size: 1rem;
    color: #333;
  }

  @media (max-width: 768px) {
    .navbar-links {
      display: none;
    }

    .navbar-toggle {
      display: block;
    }

    .grid-container {
      grid-template-columns: 1fr;
    }

    .search-bar input {
      width: 80%;
    }
  }
`;

export default MedInfoVideos;
