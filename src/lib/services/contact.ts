import { logger } from "@/lib/logger";
import type { ContactFormData } from "@/types/contact";

export interface SubmitContactResult {
  success: boolean;
  message: string;
}

/**
 * إرسال نموذج التواصل (مكان واحد للمنطق - لاحقاً يمكن ربطه بـ API أو Supabase)
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<SubmitContactResult> {
  try {
    logger.info("تم استلام نموذج تواصل", {
      feature: "contact",
      action: "submit",
      subject: data.subject,
    });

    // TODO: عند إضافة backend (Supabase/API) استبدل هذا باستدعاء حقيقي
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
    await Promise.resolve();

    return {
      success: true,
      message: "شكراً لتواصلك معنا! سنرد عليك قريباً.",
    };
  } catch (error) {
    logger.error("فشل إرسال نموذج التواصل", error, {
      feature: "contact",
      action: "submit",
    });
    return {
      success: false,
      message: "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.",
    };
  }
}
