import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import './App.css';
import type { DriveDataInterface, SingleDriveData } from './types/type';
import { createPath } from './utils/createPath';
import { analyzePath } from './utils/analyzePath';
import { axiosInstance } from './utils/axiosInstance';
import { setTheme } from './utils/themeToggle';
import ThemeToggleButton from './components/button/ThemeToggleButton';
import Container from './components/container/Container';
import HardDriveIcon from './components/icons/HardDriveIcon';
import FolderIcon from './components/icons/FolderIcon';
import FileCategoryIcon from './components/fileCategory/FileCategory';
import type { FileCategoriesType } from './utils/fileType';

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>();
  const [filePath, setFilePath] = useState('');

  const {
    data: drives,
    isLoading: isLoadingDrives,
    isError: isErrorDrives,
    error: errorDrives,
  } = useQuery<DriveDataInterface[]>({
    queryKey: ['drive'],
    queryFn: async () => {
      const { data } = await axiosInstance(
        `${import.meta.env.VITE_BASE_URL}/file/local-drive`,
      );
      return data;
    },
  });
  const {
    mutate,
    data: driveData,
    isPending: isPendingDriveData,
    isError: isErrorDriveData,
    error: errorDriveData,
  } = useMutation({
    mutationFn: async (path: string): Promise<SingleDriveData[]> => {
      const { data } = await axiosInstance({
        url: `${import.meta.env.VITE_BASE_URL}/file/get-drive-data`,
        method: 'POST',
        data: { path },
      });

      return data;
    },
  });

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
      const normalizeFilePath = path.startsWith('/') ? path : `/${path}`;
      setFilePath(normalizeFilePath);
      setHistory(prev => [...prev, path]);
    }
  };

  useEffect(() => {
    setTheme();
  }, []);

  console.log(driveData);

  return (
    <main className="bg-white dark:bg-gray-600 py-5 min-h-screen">
      <Container>
        <div className="flex justify-end">
          <ThemeToggleButton />
        </div>

        {isLoadingDrives && (
          <h2 className="text-black dark:text-white">Loading...</h2>
        )}
        {isErrorDrives && <h2>{errorDrives.message}</h2>}
        {drives && (
          <ul>
            {drives?.map(item => {
              return (
                <li key={item.fs + item.available}>
                  <button
                    onClick={() => handleClick(item.mount)}
                    className="cursor-pointer text flex gap-2"
                  >
                    <HardDriveIcon />
                    {item.mount || item.fs}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <hr />
        <h3 className="text">Drive data</h3>
        {isPendingDriveData && <h2 className="text">Loading</h2>}
        {isErrorDriveData && <h2 className="text">{errorDriveData.message}</h2>}
        {driveData && (
          <ul className="ml-5 flex flex-col gap-2">
            {driveData.map(item => {
              const path = createPath({
                name: item.name,
                parentPath: item.parentPath,
              });

              const typePath = analyzePath(path);
              console.log('typePath', typePath.category);

              // setPathType(typePath);

              return (
                <li key={item.parentPath + item.name}>
                  <button
                    onClick={() => handleClick(path)}
                    className="flex gap-2 text cursor-pointer"
                  >
                    {item.isDirectory && <FolderIcon />}
                    {item.isFile && (
                      <FileCategoryIcon
                        category={typePath?.category as FileCategoriesType}
                      />
                    )}
                    {path}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <hr />
        {filePath && fileType === 'video' && (
          <>
            <video
              controls
              crossOrigin="anonymous"
              src={`${import.meta.env.VITE_BASE_URL}/file/stream${filePath}`}
            />
            <a
              href={`${import.meta.env.VITE_BASE_URL}/file/download${filePath}`}
              download
            >
              Download File {filePath}
            </a>
          </>
        )}
        {filePath && fileType === 'audio' && (
          <>
            <audio
              controls
              src={`${import.meta.env.VITE_BASE_URL}/file/stream${filePath}`}
            />
            <a
              href={`${import.meta.env.VITE_BASE_URL}/file/download${filePath}`}
              download
            >
              Download File {filePath}
            </a>
          </>
        )}
        {filePath && fileType === 'image' && (
          <>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/file/stream${filePath}`}
              alt={filePath}
            />
            <a
              href={`${import.meta.env.VITE_BASE_URL}/file/download${filePath}`}
              download
            >
              Download File {filePath}
            </a>
          </>
        )}
        {filePath && fileType === 'document' && (
          //   <iframe src={`${import.meta.env.VITE_BASE_URL}/file${filePath}`} />
          <a
            href={`${import.meta.env.VITE_BASE_URL}/file/download${filePath}`}
            download
          >
            Download File {filePath}
          </a>
        )}
        {/* ДОБАВИТЬ РАБОТУ С ТЕКСОТЫМИ ФАЙЛАМИ (ЛУЧШЕ ЧИТАТЬ НО МОЖНО НА КРАЙНЯК Ы СКАЧИВАТЬ) */}
      </Container>
    </main>
  );
}

export default App;
