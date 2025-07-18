import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import WhiteLogo from './logo/white-logo.webp';
import Hakkimizda from './footer-images/hakkimizda.webp'
import KariyerImage from './footer-images/kariyer.webp';

function App() {
  const [landingContent, setLandingContent] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/landing/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ağ hatası: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setLandingContent(data))
      .catch(error => setFetchError(error.message));
  }, []);

  if (fetchError) return <div className="error-message">Hata: {fetchError}</div>;
  if (!landingContent) return <LoadingSpinner />;

  return (
    <main>
      <Header title={landingContent.header_title} logoUrl={landingContent.logo} />
      <HeroSlider slides={landingContent.sliders || []} />
      <TopfiytForWho />
      <MarqueeBanner />
      <WhatIsTopfiyt />
      <MarqueeBanner />
      <Features features={landingContent.features || []} />
      <Footer />
    </main>
  );
}

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Yükleniyor...</p>
  </div>
);


const Header = ({ title, logoUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 460);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 80) {
        setIsScrolled(true);
      } else if (scrollTop < 40) {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 460);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'shrink' : ''}`}>
      <div className="container header-container">
        <a href="/" className="logo-link" aria-label={title}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="logo-image" />
          ) : (
            <h1 className="logo">{title}</h1>
          )}
        </a>

        <nav>
          <ul
            id="nav-menu"
            className={`nav-links ${menuOpen ? 'open' : ''}`}
            onClick={closeMenu}
          >
            <li><a href="#topfiyt-for-who">TOPFİYT KİMLER İÇİN ?</a></li>
            <li><a href="#what-is-topfiyt">TOPFİYT'TE NELER VAR ?</a></li>
            <li><a href="mailto:kariyer@topfiyt.com?subject=Kariyer Başvurusu" target="_blank" rel="noopener noreferrer">KARİYER</a></li>


            {isMobile && (
              <>
                <li>
                  <a href="http://www.topfiyt.net/tr/auth/login" className="btn btn-secondary">Giriş Yap</a>
                </li>
                <li>
                  <a href="http://www.topfiyt.net/tr/auth/register" className="btn btn-primary">Kayıt Ol</a>
                </li>
              </>
            )}
          </ul>
        </nav>

        {!isMobile && (
          <div className="button-group">
            <a href="http://www.topfiyt.net/tr/auth/login" className="btn btn-secondary">Giriş Yap</a>
            <a href="http://www.topfiyt.net/tr/auth/register" className="btn btn-primary">Kayıt Ol</a>

            <button
              className={`hamburger ${menuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Menüyü aç/kapat"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              type="button"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        )}

        {isMobile && (
          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menüyü aç/kapat"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            type="button"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        )}
      </div>
    </header>
  );
};

const HeroSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const delay = 5000;

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, delay);
    return () => resetTimeout();
  }, [currentIndex, slides.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  if (!slides.length) {
    return (
      <section className="hero-slider">
        <p style={{ textAlign: 'center', padding: '2rem', color: '#555' }}>
          Henüz gösterilecek slider bulunmamaktadır.
        </p>
      </section>
    );
  }

  return (
    <section className="hero-slider">
      <div
        className="slides"
        style={{ transform: `translateX(${-currentIndex * 100}%)` }}
      >
        {slides.map(({ title, description, image_url }, index) => (
          <div
            className="slide"
            key={index}
            style={{ backgroundImage: `url(${image_url})` }}
            aria-hidden={currentIndex !== index}
          >
            <div className="slide-content">
              <h2>{title}</h2>
              <p>{description}</p>
              <button className="btn btn-secondary" onClick={() => alert('Hemen Başla tıklandı')}>
                Hemen Başla
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide} aria-label="Önceki slide">&#10094;</button>
      <button className="next" onClick={nextSlide} aria-label="Sonraki slide">&#10095;</button>
      <div className="dots">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${currentIndex === idx ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
          ></div>
        ))}
      </div>
    </section>
  );
};

const TopfiytForWho = () => {
  const [items, setItems] = React.useState({ bireysel: [], kurumsal: [] });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeIndexBireysel, setActiveIndexBireysel] = React.useState(0);
  const [activeIndexKurumsal, setActiveIndexKurumsal] = React.useState(0);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/topfiytforwho/')
      .then(res => {
        if (!res.ok) throw new Error('Veri alınamadı');
        return res.json();
      })
      .then(data => {
        const bireyselItems = data.filter(item => item.category === "bireysel");
        const kurumsalItems = data.filter(item => item.category === "kurumsal");
        setItems({ bireysel: bireyselItems, kurumsal: kurumsalItems });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleIndexBireysel = (index) => {
    setActiveIndexBireysel(activeIndexBireysel === index ? null : index);
  };

  const toggleIndexKurumsal = (index) => {
    setActiveIndexKurumsal(activeIndexKurumsal === index ? null : index);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <section id="topfiyt-for-who" className="what-is-topfiyt">
      <div className="container">
        <h3>Topfiyt Kimler İçin?</h3>
        
        <div className="topfiyt-for-who-wrapper">
          {/* Bireysel */}
          <div className="topfiyt-column">
            <h4 className='bireyselTitle'>BİREYSEL</h4>
            <div className="accordion">
              {items.bireysel.map((item, index) => (
                <div key={item.id} className="accordion-item">
                  <button
                    className={`accordion-title ${activeIndexBireysel === index ? "active" : ""}`}
                    onClick={() => toggleIndexBireysel(index)}
                    aria-expanded={activeIndexBireysel === index}
                    aria-controls={`bireysel-section${index}`}
                    id={`bireysel-accordion${index}`}
                  >
                    {item.title}
                  </button>
                  <div
                    id={`bireysel-section${index}`}
                    role="region"
                    aria-labelledby={`bireysel-accordion${index}`}
                    className={`accordion-content ${activeIndexBireysel === index ? "open" : ""}`}
                  >
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kurumsal */}
          <div className="topfiyt-column">
            <h4 className='firmalarTitle'>FİRMALAR</h4>
            <div className="accordion">
              {items.kurumsal.map((item, index) => (
                <div key={item.id} className="accordion-item">
                  <button
                    className={`accordion-title ${activeIndexKurumsal === index ? "active" : ""}`}
                    onClick={() => toggleIndexKurumsal(index)}
                    aria-expanded={activeIndexKurumsal === index}
                    aria-controls={`kurumsal-section${index}`}
                    id={`kurumsal-accordion${index}`}
                  >
                    {item.title}
                  </button>
                  <div
                    id={`kurumsal-section${index}`}
                    role="region"
                    aria-labelledby={`kurumsal-accordion${index}`}
                    className={`accordion-content ${activeIndexKurumsal === index ? "open" : ""}`}
                  >
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </section>
    
  );
};
const MarqueeBanner = () => {
  const ads = [
    "👤 İş Arayanlar",
  "🏭 Endüstri Platformu",
  "🎬 Yapımcılara Ulaşın",
  "🎭 Oyunculuk Fırsatları",
  "🎥 Kiralık Ekipmanlar",
  "🌍 Topfiyt Tüm Dünya'da",
  "📊 Veri Analizi",
  "💬 Mesajlaşma",
  "🎫 Cast Ajansları",
  "🏢 Mekan İlanları",
  "🧑‍💼 Eleman Arayanlar"
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content">
        {ads.map((ad, index) => (
          <span key={index}>
            {ad} &nbsp;&nbsp;|&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};
const WhatIsTopfiyt = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/whatistopfiyt/')
      .then(res => {
        if (!res.ok) throw new Error('Veri alınamadı');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleIndex = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <section id="what-is-topfiyt" className="what-is-topfiyt">
      <div className="container">
        <h3>Topfiyt'te Neler Var?</h3>
        <div className="accordion">
          {items.map((item, index) => (
            <div key={item.id} className="accordion-item">
              <button 
                className={`accordion-title ${activeIndex === index ? "active" : ""}`}
                onClick={() => toggleIndex(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`section${index}`}
                id={`accordion${index}`}
              >
                {item.title}
              </button>
              <div
                id={`section${index}`}
                role="region"
                aria-labelledby={`accordion${index}`}
                className={`accordion-content ${activeIndex === index ? "open" : ""}`}
              >
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = ({ features }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleFeatures = showAll ? features : features.slice(0, 6);

  return (
    <section id="features" className="features">
      <div className="container">
        <h3>Özelliklerimiz</h3>
        <div className="features-grid">
          {visibleFeatures.map(feature => (
            <article
              className="feature-card"
              key={feature.id}
              tabIndex="0"
              aria-label={`Özellik: ${feature.title}`}
            >
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>

        {/* Eğer 6'dan fazla varsa buton göster */}
        {features.length > 6 && (
          <div className="show-more-wrapper" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Daha Az Göster" : "Daha Fazlası"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/footer/")
      .then((res) => {
        if (!res.ok) throw new Error("Footer verisi alınamadı");
        return res.json();
      })
      .then(setFooterData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Hata: {error}</p>;
  if (!footerData) return <p>Yükleniyor...</p>;

  return (
    <footer>
      <div className="footer-logo">
        {footerData.logo ? (
          <img src={WhiteLogo}
          //{footerData.logo} logoyu admin panelden yüklenemedi normal olarak eklendi.. daha sonra kontrol edilecek..
          alt="TopFiyt Logo" />
        ) : (
          <img src="default-logo.png" alt="TopFiyt Default Logo" />
        )}
        
      </div>

      <div className="footer-divider"></div>

      <div className="footer-container">
        <div>
          <h3 className="footer-title">{footerData.topfiyt_for_who_title}</h3>
          <ul className="footer-list">
            {footerData.for_who_items.map((item, index) => (
              <li key={index} className="main">{item.content}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-title">{footerData.topfiyt_features_title}</h3>
          <ul className="footer-list">
            {footerData.feature_items.map((item, index) => (
              <li key={index} className="main">{item.content}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Hakkımızda</h3>
          <div className='footerHakkimizda-img'>
            <Link to="/hakkimizda">
            <img src={Hakkimizda}></img>
          </Link>
          </div>
            <h3 className="footer-title">Kariyer</h3>
            <div className='footerKariyer-img'>
            <a 
              href="mailto:kariyer@topfiyt.com?subject=Kariyer Başvurusu" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src={KariyerImage} alt="Kariyer" />
            </a>
          </div>
          

          <div className="footer-contact">
            <div className="line"><FaMapMarkerAlt className="icon" /> {footerData.contact_address}</div>
            <div className="line"><FaPhone className="icon" /> {footerData.contact_phone}</div>
            <div className="line"><FaEnvelope className="icon" /> {footerData.contact_email}</div>
          </div>

          <div className="footer-socials">
            {footerData.facebook_url && (
              <a href={footerData.facebook_url}><FaFacebookF /></a>
            )}
            {footerData.linkedin_url && (
              <a href={footerData.linkedin_url}><FaLinkedinIn /></a>
            )}
            {footerData.instagram_url && (
              <a href={footerData.instagram_url}><FaInstagram /></a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        {footerData.copyright_text}
      </div>
    </footer>
  );
};
export default App;