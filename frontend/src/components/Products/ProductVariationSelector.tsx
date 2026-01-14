import React, { useState, useEffect } from 'react';
import type { ProductVariation } from '../../services/variationsApi';

interface ProductVariationSelectorProps {
  variations: ProductVariation[];
  onVariationSelect: (variation: ProductVariation | null) => void;
}

const ProductVariationSelector: React.FC<ProductVariationSelectorProps> = ({
  variations,
  onVariationSelect,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Color mapping for display
  const colorMap: Record<string, { name: string; hex: string }> = {
    black: { name: 'შავი', hex: '#000000' },
    white: { name: 'თეთრი', hex: '#FFFFFF' },
    yellow: { name: 'ყვითელი', hex: '#FFD700' },
    green: { name: 'მწვანე', hex: '#22C55E' },
    red: { name: 'წითელი', hex: '#EF4444' },
    blue: { name: 'ლურჯი', hex: '#3B82F6' },
    orange: { name: 'ნარინჯისფერი', hex: '#F97316' },
    pink: { name: 'ვარდისფერი', hex: '#EC4899' },
    purple: { name: 'იისფერი', hex: '#A855F7' },
    gray: { name: 'ნაცრისფერი', hex: '#6B7280' },
    brown: { name: 'ყავისფერი', hex: '#92400E' },
    gold: { name: 'ოქროსფერი', hex: '#D4AF37' },
  };

  // Size mapping for display
  const sizeMap: Record<string, string> = {
    '40x60': '40x60 სმ',
    '60x80': '60x80 სმ',
    '80x120': '80x120 სმ',
    '100x140': '100x140 სმ',
    '120x160': '120x160 სმ',
    '150x200': '150x200 სმ',
  };

  // Get unique colors and sizes from variations
  const availableColors = [...new Set(variations.map(v => v.color))];
  const availableSizes = [...new Set(variations.map(v => v.size))];

  // Auto-select first options if available (only on initial mount)
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Update selected variation when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variation = variations.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      onVariationSelect(variation || null);
    }
  }, [selectedColor, selectedSize, variations, onVariationSelect]);

  if (variations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Color Selector - Hidden on mobile */}
      {availableColors.length > 0 && (
        <div className="hidden md:block glassmorphism-card p-4 md:p-6">
          <h3 className="text-white font-bold text-lg mb-4">🎨 აირჩიეთ ფერი</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const colorInfo = colorMap[color] || { name: color, hex: '#999999' };
              const isSelected = selectedColor === color;
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={colorInfo.name}
                  className={`relative p-1 rounded-full transition-all ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: colorInfo.hex }}
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-cyan-400 text-white rounded-full p-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <div className="glassmorphism-card p-3 md:p-6">
          <h3 className="text-white font-bold text-base mb-2">📏 აირჩიეთ ზომა</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableSizes.map((size) => {
              const sizeLabel = sizeMap[size] || size;
              const isSelected = selectedSize === size;
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`relative p-2.5 rounded-lg font-semibold text-sm transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 scale-105'
                      : 'bg-white/5 border-2 border-white/20 text-white hover:border-white/40'
                  }`}
                >
                  {sizeLabel}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-cyan-400 text-white rounded-full p-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariationSelector;
