
import { BadRequestException, ValidationError } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const formattedErrors: Record<string, string> = {};

  errors.forEach((error) => {
    if (error.constraints) {
      // Taking the first constraint message
      const firstKey = Object.keys(error.constraints)[0];
      formattedErrors[error.property] = error.constraints[firstKey];
    }
  });

  return new BadRequestException({
    message: 'Validation failed',
    errors: formattedErrors,
  });
};
