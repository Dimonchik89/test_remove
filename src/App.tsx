import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './App.css';
import type { DriveDataInterface, SingleDriveData } from './types/type';
import { createPath } from './utils/createPath';
import { analyzePath } from './utils/analyzePath';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>();
  const [filePath, setFilePath] = useState('');

  const { data, isLoading, isError, error } = useQuery<DriveDataInterface[]>({
    queryKey: ['drive'],
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_BASE_URL}/file/local-drive`,
      );
      return data;
    },
  });
  const {
    mutate,
    data: mutateData,
    isPending,
    isError: isMutateError,
    error: mutateError,
  } = useMutation({
    mutationFn: async (path: string): Promise<SingleDriveData[]> => {
      const { data } = await axios({
        url: `${import.meta.env.VITE_BASE_URL}/file/get-drive-data`,
        method: 'POST',
        data: { path },
      });

      return data;
    },
  });

  console.log(history, isPending, isMutateError, mutateError);

  //   const {
  //     mutate: fileMutate,
  //     data: fileData,
  //     isPending: isFilePending,
  //     isError: isFileError,
  //     error: fileError,
  //   } = useMutation({
  //     mutationFn: async (path: string) => {
  //       const data = await axios(
  //         `${import.meta.env.VITE_BASE_URL}/file/content/${path}`,
  //       );
  //       return data;
  //     },
  //   });

  const handleClick = async (path: string) => {
    const typePath = analyzePath(path);
    setFileType(typePath.category);

    if (typePath.isDirectory) {
      await mutate(path);
      setHistory(prev => [...prev, path]);
    } else if (typePath.isFile) {
      setFilePath(path);
      setHistory(prev => [...prev, path]);
    }
  };

  return (
    <>
      {isLoading && <h2>Loading...</h2>}
      {isError && <h2>{error.message}</h2>}
      {data && (
        <ul>
          {data?.map(item => {
            return (
              <li key={item.fs + item.available}>
                <button onClick={() => handleClick(item.mount)}>
                  {item.mount || item.fs}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <hr />
      <h3>Drive data</h3>
      {mutateData && (
        <ul>
          {mutateData.map(item => {
            const path = createPath({
              name: item.name,
              parentPath: item.parentPath,
            });

            const typePath = analyzePath(path);
            console.log('typePath.isDirectory', typePath.isDirectory);
            console.log('typePath.isFile', typePath.isFile);

            // setPathType(typePath);

            return (
              <li key={item.parentPath + item.name}>
                <button onClick={() => handleClick(path)}>{path}</button>
              </li>
            );
          })}
        </ul>
      )}
      <hr />
      {filePath && fileType === 'video' && (
        <video
          controls
          src={`${import.meta.env.VITE_BASE_URL}/file${filePath}`}
        />
      )}
      {filePath && fileType === 'audio' && (
        <audio
          controls
          src={`${import.meta.env.VITE_BASE_URL}/file${filePath}`}
        />
      )}
      {filePath && fileType === 'image' && (
        <img
          src={`${import.meta.env.VITE_BASE_URL}/file${filePath}`}
          alt={filePath}
        />
      )}
      {filePath && fileType === 'document' && (
        <iframe src={`${import.meta.env.VITE_BASE_URL}/file${filePath}`} />
      )}
      {/* ДОБАВИТЬ РАБОТУ С ТЕКСОТЫМИ ФАЙЛАМИ (ЛУЧШЕ ЧИТАТЬ НО МОЖНО НА КРАЙНЯК Ы СКАЧИВАТЬ) */}
    </>
  );
}

export default App;
