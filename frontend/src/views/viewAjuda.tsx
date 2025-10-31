import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { omrLog } from '../utils/logger';

const faqs = [
  {
    question: 'Como preparar o arquivo de upload?',
    answer: 'Utilize o template oficial com abas de alunos, avaliações e respostas.'
  },
  {
    question: 'O que fazer com linhas inválidas?',
    answer: 'Baixe o relatório de inconsistências e corrija diretamente na planilha.'
  },
  {
    question: 'Posso testar sem dados reais?',
    answer: 'Sim, acesse a aba Test-Drive e carregue os datasets de demonstração.'
  }
];

const ViewAjuda = () => {
  const abrirDocs = (url: string) => {
    omrLog(`abrindo recurso de ajuda ${url}`, { context: 'FRONT' });
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="view view--ajuda">
      <Card
        variant="highlight"
        title="Recursos"
        subtitle="Links úteis para acelerar sua operação"
      >
        <div className="actions">
          <Button variant="secondary" onClick={() => abrirDocs('https://docs.omrstudio.dev/base')}>
            Documento Base
          </Button>
          <Button variant="secondary" onClick={() => abrirDocs('mailto:suporte@omrstudio.dev')}>
            Contato suporte
          </Button>
        </div>
      </Card>

      <Card variant="muted" title="FAQ" subtitle="Perguntas frequentes">
        <ul className="faq">
          {faqs.map((item) => (
            <li key={item.question}>
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ViewAjuda;
