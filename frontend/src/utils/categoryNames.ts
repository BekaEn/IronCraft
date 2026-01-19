export const categoryNames: { [key: string]: string } = {
  anime: 'ანიმე',
  abstract: 'აბსტრაქტული',
  nature: 'ბუნება',
  custom: 'მორგებული',
  geometric: 'გეომეტრიული',
  portrait: 'პორტრეტი',
  other: 'სხვა',
  animals: 'ცხოველები',
  sport: 'სპორტი',
  wall_clock: 'საკედლე საათები',
};

export const getCategoryDisplayName = (category: string): string => {
  return categoryNames[category] || category;
};
