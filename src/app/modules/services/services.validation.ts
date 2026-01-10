import z from 'zod';



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
  body: createServiceSchema.partial(),
});

const ServiceValidation = {
  createValidation,
  updateValidation,
};

export default ServiceValidation;
