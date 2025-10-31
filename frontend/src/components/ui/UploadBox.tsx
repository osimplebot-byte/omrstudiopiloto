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
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
      >
        Selecionar arquivo
      </Button>
      <p className="upload-box__hint">Formato suportado: CSV ou Excel</p>
    </div>
  );
};
