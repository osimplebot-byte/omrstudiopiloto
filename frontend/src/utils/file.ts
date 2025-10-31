export const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Formato de arquivo inválido.'));
        return;
      }

      const [, base64] = reader.result.split(',');

      if (!base64) {
        reject(new Error('Conteúdo do arquivo indisponível.'));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('Erro ao ler arquivo.'));
    };

    reader.readAsDataURL(file);
  });
