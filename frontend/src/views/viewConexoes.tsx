import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { omrLog } from '../utils/logger';

interface TokenEntry {
  name: string;
  createdAt: string;
  lastUsed?: string;
}

const initialTokens: TokenEntry[] = [
  { name: 'Supabase Service Role', createdAt: '2024-10-01', lastUsed: '2024-10-12' },
  { name: 'N8N Pipeline', createdAt: '2024-10-05', lastUsed: '2024-10-15' }
];

const ViewConexoes = () => {
  const [tokens, setTokens] = useState<TokenEntry[]>(initialTokens);

  const regenerate = (token: TokenEntry) => {
    omrLog(`regenerando token ${token.name}`, { context: 'FRONT' });
    setTokens((prev) =>
      prev.map((item) =>
        item.name === token.name ? { ...item, createdAt: new Date().toISOString().slice(0, 10) } : item
      )
    );
  };

  return (
    <div className="view view--conexoes">
      <Card title="Integrações" subtitle="Configure tokens e credenciais de serviço">
        <ul className="token-list">
          {tokens.map((token) => (
            <li key={token.name}>
              <div>
                <strong>{token.name}</strong>
                <span>Criado em: {token.createdAt}</span>
                <span>Último uso: {token.lastUsed ?? 'n/d'}</span>
              </div>
              <Button variant="secondary" onClick={() => regenerate(token)}>
                Regenerar
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Webhooks" subtitle="Aponte seu N8N para os endpoints corretos">
        <dl className="endpoints">
          <div>
            <dt>/api/dados/import</dt>
            <dd>Recebe planilhas para processamento assíncrono.</dd>
          </div>
          <div>
            <dt>/api/chat/send</dt>
            <dd>Encaminha perguntas contextualizadas.</dd>
          </div>
          <div>
            <dt>/api/instancia/status</dt>
            <dd>Consulta o status da instância.</dd>
          </div>
          <div>
            <dt>/api/support/ticket</dt>
            <dd>Abre tickets internos anexando logs [OMR].</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};

export default ViewConexoes;
