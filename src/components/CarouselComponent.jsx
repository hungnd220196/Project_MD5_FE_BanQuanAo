import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarouselComponent.css'; // Custom CSS for your carousel
import { fetchAllBanners } from '../redux/slices/bannerSlice';
import { useDispatch, useSelector } from 'react-redux';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: '10px' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: '10px', zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const YourCarouselComponent = () => {

  const { banners } = useSelector((state) => {console.log("state",state); return state.banners});
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchAllBanners());
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  console.log(banners);
  
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {banners.map(item => <div>
          <img src={item.image} alt="Slide 1" />
        </div>)}
      </Slider>
    </div>
  );
};

export default YourCarouselComponent;
