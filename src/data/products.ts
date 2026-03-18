export interface Product {
  id: string;
  name: string;
  category: 'sofas' | 'chairs' | 'tables' | 'beds' | 'storage';
  price: number;
  description: string;
  dimensions: {width: number;depth: number;height: number;};
  materials: string[];
  modelType: string;
  colorVariants: {name: string;color: string;}[];
}

export const products: Product[] = [
{
  id: 'p1',
  name: 'Nordic Comfort Sofa',
  category: 'sofas',
  price: 1299,
  description:
  'A minimalist masterpiece blending deep comfort with clean Scandinavian lines. Features high-resilience foam cushions and a solid oak frame.',
  dimensions: { width: 220, depth: 85, height: 80 },
  materials: ['Oak Wood', 'Premium Fabric'],
  modelType: 'sofa',
  colorVariants: [
  { name: 'Warm Grey', color: '#8a8a8a' },
  { name: 'Oatmeal', color: '#d4cbbd' },
  { name: 'Charcoal', color: '#3b3b3b' }]

},
{
  id: 'p2',
  name: 'Oslo Dining Chair',
  category: 'chairs',
  price: 249,
  description:
  'Elegant and understated, the Oslo chair offers ergonomic support with a gently curved backrest and upholstered seat.',
  dimensions: { width: 45, depth: 45, height: 85 },
  materials: ['Oak Wood', 'Linen Blend'],
  modelType: 'chair',
  colorVariants: [
  { name: 'Beige', color: '#c8b99a' },
  { name: 'Sage Green', color: '#7d8c6e' },
  { name: 'Slate', color: '#5c666e' }]

},
{
  id: 'p3',
  name: 'Fjord Coffee Table',
  category: 'tables',
  price: 449,
  description:
  'A low-profile coffee table featuring a solid wood top and sleek matte black metal legs. Perfect for modern living spaces.',
  dimensions: { width: 120, depth: 60, height: 40 },
  materials: ['Oak Wood', 'Powder-coated Steel'],
  modelType: 'coffeetable',
  colorVariants: [
  { name: 'Natural Oak', color: '#c4a882' },
  { name: 'Walnut Finish', color: '#5c3d2e' },
  { name: 'Black Ash', color: '#2a2a2a' }]

},
{
  id: 'p4',
  name: 'Bergen Dining Table',
  category: 'tables',
  price: 899,
  description:
  'Gather around this spacious dining table. Its robust wooden surface and angled metal legs provide both stability and style.',
  dimensions: { width: 180, depth: 90, height: 75 },
  materials: ['Solid Oak', 'Steel'],
  modelType: 'diningtable',
  colorVariants: [
  { name: 'Natural Oak', color: '#c4a882' },
  { name: 'Dark Walnut', color: '#5c3d2e' }]

},
{
  id: 'p5',
  name: 'Stockholm Armchair',
  category: 'chairs',
  price: 599,
  description:
  'The perfect reading companion. Deep seating, plush armrests, and a sturdy wooden base make this a timeless addition.',
  dimensions: { width: 80, depth: 80, height: 85 },
  materials: ['Wool Blend', 'Oak Wood'],
  modelType: 'armchair',
  colorVariants: [
  { name: 'Light Grey', color: '#a3a3a3' },
  { name: 'Navy Blue', color: '#2c3e50' },
  { name: 'Mustard', color: '#d4af37' }]

},
{
  id: 'p6',
  name: 'Malmö Platform Bed',
  category: 'beds',
  price: 1499,
  description:
  'Transform your bedroom into a sanctuary. Features an upholstered headboard and a low-profile wooden frame.',
  dimensions: { width: 160, depth: 200, height: 110 },
  materials: ['Oak Wood', 'Textured Fabric'],
  modelType: 'bed',
  colorVariants: [
  { name: 'Warm Grey', color: '#8a8a8a' },
  { name: 'Cream', color: '#f5f0eb' }]

},
{
  id: 'p7',
  name: 'Birch Bookshelf',
  category: 'storage',
  price: 399,
  description:
  'Display your library and decor with this open-concept shelving unit. Clean lines and sturdy construction.',
  dimensions: { width: 80, depth: 35, height: 180 },
  materials: ['Oak Veneer'],
  modelType: 'bookshelf',
  colorVariants: [
  { name: 'Natural Oak', color: '#c4a882' },
  { name: 'White Wash', color: '#e6e2d8' }]

},
{
  id: 'p8',
  name: 'Aarhus TV Stand',
  category: 'storage',
  price: 549,
  description:
  'Keep your entertainment area clutter-free. Features open shelving for media devices and concealed storage.',
  dimensions: { width: 150, depth: 40, height: 50 },
  materials: ['Oak Wood', 'Metal'],
  modelType: 'tvstand',
  colorVariants: [
  { name: 'Natural Oak', color: '#c4a882' },
  { name: 'Walnut', color: '#5c3d2e' }]

}];