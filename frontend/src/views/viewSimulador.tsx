import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { omrLog } from '../utils/logger';

interface DemoAluno {
  aluno: string;
  turma: string;
  taxaAcerto: number;
  tempoMedio: number;
}

const demoData: DemoAluno[] = [
  { aluno: 'Ana', turma: '3A', taxaAcerto: 0.82, tempoMedio: 42 },
  { aluno: 'Bruno', turma: '3A', taxaAcerto: 0.74, tempoMedio: 57 },
  { aluno: 'Clara', turma: '3B', taxaAcerto: 0.66, tempoMedio: 50 }
];

const ViewSimulador = () => {
  const [filtro, setFiltro] = useState<'todos' | 'alto' | 'baixo'>('todos');

  const data = useMemo(() => {
    switch (filtro) {
      case 'alto':
        return demoData.filter((item) => item.taxaAcerto >= 0.75);
      case 'baixo':
        return demoData.filter((item) => item.taxaAcerto < 0.75);
      default:
        return demoData;
    }
  }, [filtro]);

  const handleFiltro = (value: 'todos' | 'alto' | 'baixo') => {
    setFiltro(value);
    omrLog(`filtro simulador -> ${value}`, { context: 'FRONT' });
  };

  return (
    <div className="view view--simulador">
      <Card
        title="Test-Drive de dados"
        subtitle="Explore o comportamento da taxa de acerto em cenários fictícios"
        actions={
          <div className="chip-group">
            <Button variant="ghost" onClick={() => handleFiltro('todos')}>
              Todos
            </Button>
            <Button variant="ghost" onClick={() => handleFiltro('alto')}>
              Alto desempenho
            </Button>
            <Button variant="ghost" onClick={() => handleFiltro('baixo')}>
              Abaixo do esperado
            </Button>
          </div>
        }
      >
        <DataTable<DemoAluno>
          columns={[
            { key: 'aluno', label: 'Aluno' },
            { key: 'turma', label: 'Turma' },
            {
              key: 'taxaAcerto',
              label: 'Taxa de acerto',
              render: (value) => `${Math.round((value as number) * 100)}%`
            },
            { key: 'tempoMedio', label: 'Tempo médio (s)' }
          ]}
          data={data}
          emptyMessage="Carregue um dataset de demonstração"
        />
      </Card>
    </div>
  );
};

export default ViewSimulador;
