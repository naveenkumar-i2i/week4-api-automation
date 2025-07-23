import { z } from 'zod';

export const profileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.string(),
  token: z.string().optional(),
});

// Schema for the create response (DummyJSON returns only these fields on add)
export const createProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  stock: z.number(),
});

// Full product schema for GET and UPDATE responses
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
});
