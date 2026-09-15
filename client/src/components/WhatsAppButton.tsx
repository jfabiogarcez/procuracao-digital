import { MessageCircle } from "lucide-react";

type WhatsAppButtonProps = {
  ariaLabel?: string;
  message?: string;
};

export default function WhatsAppButton({
  ariaLabel = "Contato via WhatsApp",
  message = "Olá! Gostaria de mais informações sobre os serviços jurídicos.",
}: WhatsAppButtonProps) {
  const whatsappNumber = "5511947219180";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      aria-label={ariaLabel}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
