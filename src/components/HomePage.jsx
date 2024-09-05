import React from 'react'
import Navbar from "./HomePage/Navbar"
import Footer from "./HomePage/Footer"
import HeroSection from './HomePage/HeroSection'
import Workflow from './HomePage/Workflow'
import Testimonials from './HomePage/Testimonials'
import Pricing from './HomePage/Pricing'
import FeatureSection from './HomePage/FeatureSection'


const HomePage = () => {
  return (
       <>
        <Navbar />
        
        <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <Pricing />
        <Testimonials />
        <Footer />
        </div>
        </>
  )
}

export default HomePage
