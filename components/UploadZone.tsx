
import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone'; // Removed unused dependency

// Retrying: I'll use standard input + drag/drop logic without extra lib for now to be safe, or just standard file input styling.
// Let's go with a custom implementation using standard HTML5 Drag & Drop API.

import { Upload, X, FileAudio, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

interface UploadZoneProps {
    onUploadComplete: (url: string, file: File) => void;
    bucketName?: string;
    folderPath?: string;
    accept?: string;
    label?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
    onUploadComplete,
    bucketName = 'beats',
    folderPath = '',
    accept = 'audio/*',
    label = 'Drag & drop or click to upload'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const uploadFile = async (file: File) => {
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setProgress(0);

        try {
            // Create a unique file path
            // Create a unique file path but preserve original name
            const fileExt = file.name.split('.').pop();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${Date.now()}_${sanitizedName}`;
            const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setSuccess(true);
            onUploadComplete(publicUrl, file);

        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 text-center group
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900'}
          ${error ? 'border-red-500/50' : ''}
          ${success ? 'border-emerald-500/50' : ''}
        `}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept={accept}
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                    {isUploading ? (
                        <div className="animate-spin text-indigo-500 p-4">
                            <Loader2 size={32} />
                        </div>
                    ) : success ? (
                        <div className="text-emerald-500 p-4 animate-in zoom-in">
                            <CheckCircle size={32} />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 p-4 animate-in zoom-in">
                            <AlertCircle size={32} />
                        </div>
                    ) : (
                        <div className={`p-4 rounded-full bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors`}>
                            <Upload size={32} />
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-white font-bold text-sm">
                            {isUploading ? 'Uploading...' : success ? 'Upload Complete' : label}
                        </p>
                        <p className="text-slate-500 text-xs text-xs">
                            {error ? error : isUploading ? 'Please wait' : 'Supports WAV, MP3, ZIP'}
                        </p>
                    </div>
                </div>

                {/* Progress Bar (Simulated since generic upload doesn't emit progress easily without XHR/Axios or TUS, but simple enough for Supabase client usually awaits. Could add TUS later for real progress) */}
                {/* Note: supabase-js 'upload' is a promise. Real progress requires XMLHttpRequest wrapper or just simplified 'loading' state shown above. */}
            </div>
        </div>
    );
};

export default UploadZone;
