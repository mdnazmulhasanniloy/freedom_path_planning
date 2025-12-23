import z from 'zod';

export const TestimonialSchema = z.object({
  clientName: z
    .string({ error: 'Client Name is required' })
    .min(2, 'Client Name must be at least 2 characters'),

  designation: z
    .string({ error: 'Designation is required' })
    .min(2, 'Designation must be at least 2 characters'),

  clientPhoto: z
    .string({ error: 'Client Photo URL is required' })
    .url('Client Photo must be a valid URL'),

  description: z
    .string({ error: 'Description is required' })
    .min(5, 'Description must be at least 5 characters'),

  rating: z
    .number({ error: 'Rating is required' })
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot be more than 5'),

  isDeleted: z.boolean().optional(),
});

const createValidation = z.object({
  body: TestimonialSchema,
});
const updateValidation = z.object({
  body: TestimonialSchema,
});

const TestimonialValidation = {
  createValidation,
  updateValidation,
};

export default TestimonialValidation;
