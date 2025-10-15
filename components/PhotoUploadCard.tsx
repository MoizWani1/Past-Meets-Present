
import React, { useRef, useState } from 'react';
import type { UploadedPhoto } from '../types';

interface PhotoUploadCardProps {
    label: string;
    onImageUpload: (photo: UploadedPhoto | null) => void;
    photo: UploadedPhoto | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({ label, onImageUpload, photo }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload({ dataUrl: reader.result as string, file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onImageUpload(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const triggerFileSelect = () => inputRef.current?.click();

    return (
        <div 
            className="w-full sm:w-80 h-96 bg-white/50 backdrop-blur-sm border-2 border-dashed border-amber-600/30 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center p-4 transition-all duration-300 hover:border-amber-600 hover:bg-white/70 relative overflow-hidden group"
            onClick={triggerFileSelect}
            onDragEnter={() => setIsHovering(true)}
            onDragLeave={() => setIsHovering(false)}
            onDrop={() => setIsHovering(false)}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="sr-only"
                onChange={handleFileChange}
            />
            {photo ? (
                <>
                    <img src={photo.dataUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <button 
                        onClick={handleClear} 
                        className="absolute top-3 right-3 z-20 bg-white/80 text-black rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                        title="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </>
            ) : (
                <>
                    <UploadIcon />
                    <h3 className="text-xl text-amber-900/80 font-semibold">{label}</h3>
                    <p className="text-sm text-amber-900/60 mt-1">Click or drag a photo here</p>
                </>
            )}
             <div className={`absolute inset-0 bg-amber-500/10 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
    );
};

export default PhotoUploadCard;
