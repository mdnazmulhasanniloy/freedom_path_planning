import z from 'zod';

// Create / Update Payload Validation
export const ServiceSchema = z.object({
  serviceName: z
    .string({ error: 'Service Name is required' })
    .min(2, 'Service Name must be at least 2 characters'),

  Title: z
    .string({ error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters'),

  subTitle: z
    .string({ error: 'Sub Title is required' })
    .min(2, 'Sub Title must be at least 2 characters'),

  image: z
    .string({ error: 'Image is required' })
    .url('Image must be a valid URL'),
});

const createValidation = z.object({
  body: ServiceSchema,
});
const updateValidation = z.object({
  body: ServiceSchema,
});

const ServiceValidation = {
  createValidation,
  updateValidation,
};

export default ServiceValidation;
