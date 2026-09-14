import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Alert } from './ui/Alert';
import { apiRequest, ApiError } from '../lib/api';

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'info'; message: string }
  | { type: 'error'; message: string };

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [feedback]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 6000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await apiRequest<{
        message: string;
        data: { id: number; email: string; nouveau: boolean };
      }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.data?.nouveau) {
        setFeedback({ type: 'success', message: response.message });
        setEmail('');
        return;
      }

      setFeedback({ type: 'info', message: response.message });
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { email?: string | string[]; message?: string; detail?: string };

        if (Array.isArray(data?.email) || typeof data?.email === 'string') {
          const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
          setFeedback({ type: 'error', message: emailError || 'Adresse email invalide.' });
          return;
        }

        setFeedback({
          type: 'error',
          message:
            data?.message ||
            data?.detail ||
            `Une erreur est survenue (${err.status}).`,
        });
        return;
      }

      setFeedback({
        type: 'error',
        message: "Impossible de contacter le serveur. Vérifiez votre connexion.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="subscribe_form bg-navy">
      <div className="container-page">
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="w-full text-center md:w-1/2 md:text-left">
            <h4 className="text-2xl font-sans leading-tight text-white">
              Abonnez-vous à nos actualités d’entreprise
            </h4>
            <p className="mt-2 text-sm text-white/70">
              Recevez nos dernières analyses et publications directement dans votre boîte mail.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <form
              className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end"
              onSubmit={handleSubmit}
              noValidate
              aria-live="polite"
            >
              <input
                type="email"
                name="email"
                disabled={isSubmitting}
                className="h-12 w-full rounded border border-white/80 bg-[#0d7d7f] px-4 text-white placeholder-white/80 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 md:w-[420px]"
                placeholder="Entrer votre email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Adresse email"
              />

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="h-12 rounded border border-white bg-[#0d7d7f] px-7 uppercase tracking-wider text-white transition-colors hover:bg-[#2e6061] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Envoi...' : "S'abonner"}
              </button>
            </form>

            {feedback ? (
              <div
                ref={feedbackRef}
                role="status"
                aria-live="assertive"
                className="mt-4 md:max-w-[520px] md:ml-auto"
              >
                <Alert type={feedback.type}>{feedback.message}</Alert>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeForm;
