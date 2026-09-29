export function buildMailto(to: string, nome: string, email: string, mensagem: string): string {
  const subject = encodeURIComponent(`Contato pelo portfólio: ${nome}`);
  const body = encodeURIComponent(`${mensagem}\n\n${nome} <${email}>`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
