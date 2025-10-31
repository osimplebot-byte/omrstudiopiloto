import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { UploadBox } from '../components/ui/UploadBox';
import { DataTable } from '../components/ui/DataTable';
import { useUpload } from '../hooks/useUpload';
import { useMetrics } from '../hooks/useMetrics';
import { useAppStore } from '../store/useAppStore';
import { omrLog } from '../utils/logger';

interface ImportRow {
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
      <Card title="Upload de avaliações" subtitle="Envie planilhas no formato oficial">
        <div className="upload-grid">
          <UploadBox onFile={handleFile} />
          <button className="link" type="button" onClick={handleSend} disabled={!selectedFile || upload.isPending}>
            {upload.isPending ? 'Enviando...' : 'Enviar arquivo selecionado'}
          </button>
          {selectedFile && <span className="upload-grid__file">Selecionado: {selectedFile.name}</span>}
        </div>
      </Card>

      <Card title="Indicadores rápidos" subtitle="Resumo das importações recentes">
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
            { key: 'message', label: 'Mensagem', render: (value) => value ?? '—' }
          ]}
          data={importHistory}
          emptyMessage="Nenhuma importação registrada"
        />
      </Card>
    </div>
  );
};

export default ViewDados;
