import z from 'zod';

// Create / Update Payload Validation
const ServiceSchema = z.object({
  serviceName: z.string().min(2, 'Service name is required'),
  subTitle: z.string().min(2, 'Subtitle is required'),
});

const createServiceSchema = z.object({
  serviceName: z
    .string({ error: 'Service name is required' })
    .min(2, 'Service name must be at least 2 characters'),

  subTitle: z
    .string({ error: 'Subtitle is required' })
    .min(2, 'Subtitle must be at least 2 characters'),

  // what your client gets (optional)
  whatYourClientGets: z
    .object({
      options: z
        .array(
          z.object({
            title: z.string({ error: 'Title is required' }).min(2),
            subTitle: z.string({ error: 'Subtitle is required' }).min(2),
          }),
        )
        .min(1, 'At least one option is required'),
    })
    .optional(),

  // included services (optional)
  includedServices: z
    .array(
      z.object({
        title: z.string({ error: 'Title is required' }).min(2),
        subTitle: z.string({ error: 'Subtitle is required' }).min(2),
      }),
    )
    .optional(),
});

const createValidation = z.object({
  body: createServiceSchema,
});
const updateValidation = z.object({
  body: ServiceSchema,
});

const ServiceValidation = {
  createValidation,
  updateValidation,
};

export default ServiceValidation;
