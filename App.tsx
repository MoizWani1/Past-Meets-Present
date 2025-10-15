
import React, { useState } from 'react';
import PhotoUploadCard from './components/PhotoUploadCard';
import BackgroundParticles from './components/BackgroundParticles';
import { generateReconnectedImage } from './services/geminiService';
import type { UploadedPhoto } from './types';

const Header: React.FC = () => (
    <header className="text-center py-8 z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900/90 tracking-tight">Past Meets Present</h1>
        <p className="mt-4 text-lg text-amber-900/70 max-w-2xl mx-auto">
            Upload a photo from your childhood and one from today. Let AI create a timeless moment of you meeting your younger self.
        </p>
    </header>
);

const ReconnectButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="z-10 mt-12 px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
    >
        ✨ Reconnect Your Past ✨
    </button>
);

const Loader: React.FC = () => (
    <div className="z-10 text-center my-12 transition-opacity duration-500">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        </div>
        <p className="mt-4 text-amber-900/80 text-lg">Reconnecting moments... this can take a minute.</p>
    </div>
);

const GeneratedImage: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
    <div className="z-10 mt-8 mb-12 animate-fadeIn relative">
        <div className="absolute inset-0 rounded-3xl animate-glow mix-blend-soft-light"></div>
        <img
            src={imageUrl}
            alt="Generated reunion of past and present self"
            className="rounded-3xl shadow-2xl relative w-full max-w-lg"
            style={{ aspectRatio: '4 / 5' }}
        />
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="z-10 my-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
        <p className="font-bold">An Error Occurred</p>
        <p>{message}</p>
    </div>
);

const Footer: React.FC = () => (
    <footer className="text-center py-6 text-sm text-amber-900/50 z-10">
        <p>Developed with ❤️ by Moeez Nabi Wani.</p>
    </footer>
);


const App: React.FC = () => {
    const [childhoodPhoto, setChildhoodPhoto] = useState<UploadedPhoto | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState<UploadedPhoto | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleReconnect = async () => {
        if (!childhoodPhoto || !currentPhoto) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateReconnectedImage(childhoodPhoto.dataUrl, currentPhoto.dataUrl);
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 relative overflow-x-hidden">
            <BackgroundParticles />
            <div className="w-full flex flex-col items-center">
                <Header />

                {!generatedImage && (
                    <main className="z-10 w-full flex flex-col items-center mt-4 transition-opacity duration-700">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <PhotoUploadCard label="Upload Childhood Photo" onImageUpload={setChildhoodPhoto} photo={childhoodPhoto} />
                            <PhotoUploadCard label="Upload Current Photo" onImageUpload={setCurrentPhoto} photo={currentPhoto} />
                        </div>

                        {!isLoading && (
                            <ReconnectButton onClick={handleReconnect} disabled={!childhoodPhoto || !currentPhoto} />
                        )}
                    </main>
                )}
                
                {isLoading && <Loader />}
                {error && <ErrorDisplay message={error} />}
                {generatedImage && <GeneratedImage imageUrl={generatedImage} />}
                
                {generatedImage && (
                    <button
                        onClick={() => {
                            setGeneratedImage(null);
                            setChildhoodPhoto(null);
                            setCurrentPhoto(null);
                            setError(null);
                        }}
                        className="z-10 mb-8 px-8 py-3 bg-white/80 text-amber-800 font-semibold rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-105"
                    >
                        Create Another One
                    </button>
                )}

            </div>
            <Footer />
        </div>
    );
};

export default App;
