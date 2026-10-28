// O GTM cria o window.dataLayer no layout. Aqui só avisamos o TypeScript que ele existe.

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

// Plano de tracking: nome do evento -> parâmetros que ele carrega.

type Eventos = {
    clique_contato: { canal: string };
    abrir_projeto: { projeto_nome: string };
};

// Publica um evento no dataLayer. Quem decide o que fazer com ele é o GTM.
export function track<E extends keyof Eventos>(event: E, params: Eventos[E]) {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
}