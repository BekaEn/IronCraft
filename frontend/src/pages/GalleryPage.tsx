import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useGetGalleryImagesQuery } from '../services/galleryApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const GalleryPage: React.FC = () => {
  const { data: images, isLoading } = useGetGalleryImagesQuery({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && images) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && images) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            ნამუშევრები
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            ჩვენს მიერ შექმნილი ნაკეთობები - მეტალის ხელოვნება რომელიც ქმნის უნიკალურ დიზაინს
          </p>
        </div>

        {/* Gallery Grid */}
        {!images || images.length === 0 ? (
          <div className="glassmorphism-card p-12 text-center">
            <p className="text-blue-200 text-lg">გალერეა მალე შეივსება ჩვენი ნამუშევრებით</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square relative">
                  <img
                    src={`${API_BASE}${image.imagePath}`}
                    alt={image.title || 'ნამუშევარი'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-semibold">{image.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedIndex !== null && images && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <FaTimes size={28} />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
            >
              <FaChevronLeft size={36} />
            </button>

            {/* Image */}
            <div
              className="max-w-[90vw] max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${API_BASE}${images[selectedIndex].imagePath}`}
                alt={images[selectedIndex].title || 'ნამუშევარი'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              {(images[selectedIndex].title || images[selectedIndex].description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  {images[selectedIndex].title && (
                    <h3 className="text-white text-xl font-bold">{images[selectedIndex].title}</h3>
                  )}
                  {images[selectedIndex].description && (
                    <p className="text-white/80 mt-1">{images[selectedIndex].description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <FaChevronRight size={36} />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
