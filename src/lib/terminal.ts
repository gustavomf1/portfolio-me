import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { skillGroups } from '@/data/skills';

export type TerminalResult = { lines: string[]; action?: 'clear' | 'close' | 'open-contact' };

const HELP = [
  'Comandos disponíveis:',
  '  help               lista comandos',
  '  about              quem sou',
  '  skills             arsenal por categoria',
  '  projects           missões',
  '  contact            canais de comunicação',
  '  sudo hire gustavo  tente a sorte',
  '  clear | exit',
];

export function runCommand(input: string): TerminalResult {
  const cmd = input.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cmd) return { lines: [] };
  switch (cmd) {
    case 'help': return { lines: HELP };
    case 'about': return { lines: [`${profile.nome}, ${profile.cargo}.`, profile.local, profile.sobre] };
    case 'skills': return { lines: skillGroups.map((g) => `${g.categoria}: ${g.itens.map((i) => i.nome).join(', ')}`) };
    case 'projects': return { lines: projects.map((p) => `- ${p.nome}: ${p.resumo}`) };
    case 'contact': return { lines: [`E-mail: ${profile.email}`, `GitHub: ${profile.github}`, `LinkedIn: ${profile.linkedin}`] };
    case 'sudo hire gustavo':
      return { lines: ['Acesso concedido. O Império aprova esta contratação.', 'Abrindo canal de comunicação...'], action: 'open-contact' };
    case 'clear': return { lines: [], action: 'clear' };
    case 'exit': return { lines: ['Transmissão encerrada.'], action: 'close' };
    default: return { lines: [`Comando não reconhecido: "${cmd}". Digite help.`] };
  }
}
