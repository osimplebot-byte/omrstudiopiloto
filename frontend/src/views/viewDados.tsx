import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { UploadBox } from '../components/ui/UploadBox';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { useUpload } from '../hooks/useUpload';
import { useMetrics } from '../hooks/useMetrics';
import { useAppStore } from '../store/useAppStore';
import { omrLog } from '../utils/logger';

interface ImportRow extends Record<string, unknown> {
  id: string;
  fileName: string;
  receivedAt: string;
  status: string;
  message?: string;
}

const ViewDados = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const importHistory = useAppStore((state) => state.importHistory);
  const upload = useUpload();
  const metrics = useMetrics();

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleSend = async () => {
    if (!selectedFile) return;
    const payload = { nomeArquivo: selectedFile.name, conteudo: 'base64::placeholder' };
    omrLog(`enviando ${selectedFile.name}`, { context: 'FRONT' });
    upload.mutate({ fileName: selectedFile.name, payload });
    setSelectedFile(null);
  };

  return (
    <div className="view view--dados">
      <Card
        variant="highlight"
        title="Upload de avaliações"
        subtitle="Envie planilhas no formato oficial para atualizar métricas e relatórios."
        actions={
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!selectedFile}
            loading={upload.isPending}
          >
            Enviar importação
          </Button>
        }
      >
        <div className="upload-grid">
          <UploadBox onFile={handleFile} />
          <p className="upload-grid__hint">
            Validamos o schema automaticamente e notificamos o N8N com logs `[OMR:FRONT]` agrupados.
          </p>
          {selectedFile && <span className="upload-grid__file">Selecionado: {selectedFile.name}</span>}
        </div>
      </Card>

      <Card
        variant="muted"
        title="Indicadores rápidos"
        subtitle="Resumo das importações recentes"
      >
        <div className="metrics">
          <div>
            <span>Alunos avaliados</span>
            <strong>{metrics.data?.alunosAvaliados ?? '—'}</strong>
          </div>
          <div>
            <span>Questões processadas</span>
            <strong>{metrics.data?.questoesProcessadas ?? '—'}</strong>
          </div>
          <div>
            <span>Taxa média de acerto</span>
            <strong>{metrics.data ? `${Math.round(metrics.data.taxaAcertoMedia * 100)}%` : '—'}</strong>
          </div>
        </div>
      </Card>

      <Card title="Histórico de importações" subtitle="Últimos processos enviados">
        <DataTable<ImportRow>
          columns={[
            { key: 'fileName', label: 'Arquivo' },
            { key: 'receivedAt', label: 'Recebido em' },
            { key: 'status', label: 'Status' },
            {
              key: 'message',
              label: 'Mensagem',
              render: (value) => (value ? String(value) : '—')
            }
          ]}
          data={importHistory}
          emptyMessage="Nenhuma importação registrada"
        />
      </Card>
    </div>
  );
};

export default ViewDados;
