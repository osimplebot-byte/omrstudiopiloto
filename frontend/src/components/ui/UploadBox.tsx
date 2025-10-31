import { ChangeEvent, useRef } from 'react';
import { Button } from './Button';

interface UploadBoxProps {
  onFile: (file: File) => void;
  accept?: string;
}

export const UploadBox = ({ onFile, accept = '.csv,.xlsx' }: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
  };

  return (
    <div className="upload-box">
      <input ref={inputRef} type="file" accept={accept} hidden onChange={handleSelect} />
      <div className="upload-box__content">
        <strong className="upload-box__title">Faça upload da planilha oficial</strong>
        <p className="upload-box__description">Arraste e solte aqui ou clique para escolher um arquivo .csv ou .xlsx</p>
      </div>
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
        Selecionar arquivo
      </Button>
      <p className="upload-box__hint">Tamanho máximo: 5 MB</p>
    </div>
  );
};
