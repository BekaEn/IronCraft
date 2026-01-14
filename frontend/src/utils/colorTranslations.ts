// Color translations from English to Georgian
export const colorToGeorgian: Record<string, string> = {
  // Basic colors
  'black': 'შავი',
  'white': 'თეთრი',
  'red': 'წითელი',
  'blue': 'ლურჯი',
  'green': 'მწვანე',
  'yellow': 'ყვითელი',
  'orange': 'ნარინჯისფერი',
  'purple': 'იისფერი',
  'pink': 'ვარდისფერი',
  'brown': 'ყავისფერი',
  'gray': 'ნაცრისფერი',
  'grey': 'ნაცრისფერი',
  'gold': 'ოქროსფერი',
  'silver': 'ვერცხლისფერი',
  
  // Additional colors
  'navy': 'მუქი ლურჯი',
  'cyan': 'ციანი',
  'magenta': 'მაგენტა',
  'lime': 'ღია მწვანე',
  'beige': 'ბეჟი',
  'turquoise': 'ფირუზისფერი',
};

export const translateColor = (color: string): string => {
  const lowerColor = color.toLowerCase();
  return colorToGeorgian[lowerColor] || color;
};
