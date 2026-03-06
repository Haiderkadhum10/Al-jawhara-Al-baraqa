/**
 * تحقق بسيط من بيانات نموذج التواصل (يمكن استبداله بـ Zod لاحقاً)
 */
export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = "الاسم مطلوب";
  }

  if (!data.email?.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  if (!data.subject?.trim()) {
    errors.subject = "الموضوع مطلوب";
  }

  if (!data.message?.trim()) {
    errors.message = "الرسالة مطلوبة";
  }

  return errors;
}

export function hasValidationErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
