import { z } from 'zod';

export const AssociatesSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),

  photo: z
    .string({ error: 'Photo URL is required' })
    .url('Photo must be a valid URL'),

  bio: z
    .string({ error: 'Bio is required' })
    .min(5, 'Bio must be at least 5 characters'),
});

const createValidation = z.object({
  body: AssociatesSchema,
});
const updateValidation = z.object({
  body: AssociatesSchema,
});

const AssociatesValidation = {
  createValidation,
  updateValidation,
};

export default AssociatesValidation;
