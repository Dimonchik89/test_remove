import React from 'react';
import AudioIcon from '../icons/AudioIcon';
import VideoIcon from '../icons/VideoIcon';
import ImageIcon from '../icons/ImageIcon';
import DocumentIcon from '../icons/DocumentIcon';
import ArchiveIcon from '../icons/ArchiveIcon';
import type { FileCategoriesType } from '../../utils/fileType';

interface FileCategoryIconProps {
  category: FileCategoriesType;
}

const FileCategoryIcon: React.FC<FileCategoryIconProps> = ({ category }) => {
  return (
    <>
      {category === 'audio' && <AudioIcon />}
      {category === 'archive' && <ArchiveIcon />}
      {category === 'document' && <DocumentIcon />}
      {category === 'image' && <ImageIcon />}
      {category === 'video' && <VideoIcon />}
    </>
  );
};

export default FileCategoryIcon;
