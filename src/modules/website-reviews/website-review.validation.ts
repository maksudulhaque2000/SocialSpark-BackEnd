import { z } from 'zod';

export const createWebsiteReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters'),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'Status must be either approved or rejected' }),
  }),
});

export type CreateWebsiteReviewInput = z.infer<typeof createWebsiteReviewSchema>;
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>;
