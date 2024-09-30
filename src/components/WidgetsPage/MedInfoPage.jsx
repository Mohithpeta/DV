import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Menu, X } from 'lucide-react'

const MedInfoVideos = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [videos, setVideos] = useState([])
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [page, setPage] = useState(1) // Pagination state
  const [hasMore, setHasMore] = useState(true) // State to track if there are more videos to load
  const [noResults, setNoResults] = useState(false) // State for handling no results found
  const drawerRef = useRef(null)

  // Sample video data (fallback)
  const sampleVideos = [
    { src: 'https://www.youtube.com/watch?v=aY-XAXa_az8', thumbnail: 'https://img.youtube.com/vi/aY-XAXa_az8/hqdefault.jpg', description: 'Postpartum HyperTension' },
    { src: 'https://www.youtube.com/watch?v=BNANySYpfIg', thumbnail: 'https://img.youtube.com/vi/BNANySYpfIg/hqdefault.jpg', description: 'Postpartum HyperTension | UPMC Podcast' },
    { src: 'https://www.youtube.com/watch?v=3wXjoQbus2U', thumbnail: 'https://img.youtube.com/vi/3wXjoQbus2U/hqdefault.jpg', description: 'Causes of postpartum hypertension' },
    { src: 'https://www.youtube.com/watch?v=94YnsT9g19c', thumbnail: 'https://img.youtube.com/vi/94YnsT9g19c/hqdefault.jpg', description: 'Causes of blood pressure changes post delivery' },
    { src: 'https://www.youtube.com/watch?v=AXLEmib2ZrY', thumbnail: 'https://img.youtube.com/vi/AXLEmib2ZrY/hqdefault.jpg', description: 'Will Blood Pressure return to normal after delivery?' },
    { src: 'https://www.youtube.com/watch?v=wa3P552cQs8', thumbnail: 'https://img.youtube.com/vi/wa3P552cQs8/hqdefault.jpg', description: 'Postpartum Preeclampsia' }
  ]

  useEffect(() => {
    if (!searchTerm) {
      fetchVideos(page)
    } else {
      fetchSearchedVideos(searchTerm)
    }
  }, [page, searchTerm])

  // Fetch video metadata from backend (for pagination)
  const fetchVideos = (page) => {
    fetch(`https://your-backend-api/videos?page=${page}`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          setHasMore(false) // If no more videos, stop further fetching
        } else {
          setVideos(prevVideos => [...prevVideos, ...data])
        }
      })
      .catch(error => console.error('Error fetching videos:', error))
  }

  // Fetch videos based on search term from the backend
  const fetchSearchedVideos = (searchTerm) => {
    fetch(`https://your-backend-api/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          setNoResults(true) // Set no results found state
          setVideos([]) // Clear current videos
        } else {
          setNoResults(false) // Reset no results state
          setVideos(data) // Replace current videos with search results
        }
      })
      .catch(error => console.error('Error fetching searched videos:', error))
  }

  // Combine sample videos and fetched videos if no search term is entered
  const allVideos = searchTerm ? videos : [...sampleVideos, ...videos]

  // Toggle navbar for mobile view
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  // Close navbar when clicking outside of the drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setMobileDrawerOpen(false)
      }
    }

    if (mobileDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileDrawerOpen])

  // Load more videos when "Load More" button is clicked
  const loadMoreVideos = () => {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <StyledContainer>
      {/* Search Bar */}
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search topics...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Navbar */}
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='navbar-logo'>MedInfo</div>
          <ul className='navbar-links'>
            <li><a href='#home'>Home</a></li>
            <li><a href='#about'>About</a></li>
            <li><a href='#services'>Services</a></li>
            <li><a href='#contact'>Contact</a></li>
          </ul>
          <button className='navbar-toggle' onClick={toggleNavbar}>
            {mobileDrawerOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileDrawerOpen && (
          <div ref={drawerRef} className='mobile-drawer'>
            <ul>
              <li><a href='#home' onClick={toggleNavbar}>Home</a></li>
              <li><a href='#about' onClick={toggleNavbar}>About</a></li>
              <li><a href='#services' onClick={toggleNavbar}>Services</a></li>
              <li><a href='#contact' onClick={toggleNavbar}>Contact</a></li>
            </ul>
          </div>
        )}
      </nav>

      {/* Video Grid */}
      <div className='grid-container'>
        {allVideos.length > 0 ? (
          allVideos.map((video, index) => (
            <div key={index} className='grid-item'>
              <div className='video-container'>
                <a href={video.src} target='_blank' rel='noopener noreferrer'>
                  <img src={video.thumbnail} alt={`Thumbnail for ${video.description}`} className='thumbnail' />
                </a>
              </div>
              <p className='description'>{video.description}</p>
            </div>
          ))
        ) : (
          noResults && <p className='no-results'>Topic not found.</p>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !searchTerm && (
        <div className='load-more'>
          <button onClick={loadMoreVideos}>Load More</button>
        </div>
      )}
    </StyledContainer>
  )
}

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
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  }

  .grid-item {
    text-align: center;
  }

  .video-container {
    position: relative;
  }

  .thumbnail {
    width: 100%;
    height: auto;
    border-radius: 5px;
    transition: transform 0.3s;
  }

  .thumbnail:hover {
    transform: scale(1.05);
  }

  .description {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
  }

  .load-more {
    text-align: center;
    margin: 20px 0;
  }

  .load-more button {
    padding: 10px 20px;
    background-color: #93bff6;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }

  .no-results {
    text-align: center;
    font-size: 1.2rem;
    color: #ff0000;
  }

  @media (max-width: 768px) {
    .navbar-links {
      display: none;
    }

    .navbar-toggle {
      display: block;
    }

    .grid-container {
      grid-template-columns: repeat(2, 1fr);
    }

    .search-bar input {
      width: 80%;
    }
  }

  @media (max-width: 480px) {
    .grid-container {
      grid-template-columns: 1fr;
    }
  }
`

export default MedInfoVideos
