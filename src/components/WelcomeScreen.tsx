
import React, { useCallback, useState } from 'react';
import { OriginalImage } from '../types.ts';

interface WelcomeScreenProps {
  onImageUpload: (image: OriginalImage) => void;
}

const fileToDataUrl = (file: File): Promise<OriginalImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        dataUrl: reader.result as string,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        try {
            const imageData = await fileToDataUrl(file);
            onImageUpload(imageData);
        } catch (error) {
            console.error("Error reading file:", error);
            alert("Sorry, there was an error loading your image.");
        }
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight" style={{textShadow: '0 0 15px rgba(120, 81, 255, 0.7)'}}>
        AI SỬA ẢNH THÔNG MINH
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
        Chỉnh sửa ảnh chuyên nghiệp bằng sức mạnh của AI. Tải ảnh lên để bắt đầu cuộc hành trình sáng tạo của bạn trong không gian vô tận.
      </p>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative group w-full max-w-xl border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-purple-400'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <svg className="w-16 h-16 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p className="text-gray-400">{isDragging ? 'Release to upload' : 'Kéo và thả ảnh vào đây'}</p>
          <p className="text-gray-500">hoặc</p>
          <label className="cursor-pointer">
            <span className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
              Tải ảnh lên
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
          </label>
        </div>
      </div>
    </div>
  );
};
