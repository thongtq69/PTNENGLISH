"use client";

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImageUrl: string, position: { x: number, y: number }) => void;
    onCancel: () => void;
    aspect?: number;
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedAreaPercentages, setCroppedAreaPercentages] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((croppedAreaPercent: Area, croppedAreaPx: Area) => {
        setCroppedAreaPercentages(croppedAreaPercent);
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (error) => reject(error));
            img.src = url;
            img.setAttribute('crossOrigin', 'anonymous');
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation: number = 0
    ): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        // Set canvas size to match the cropped area
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Apply rotation if needed
        if (rotation !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Draw the cropped image
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // Return as data URL
        return canvas.toDataURL('image/jpeg', 0.95);
    };

    const handleConfirm = async () => {
        if (!croppedAreaPixels || !croppedAreaPercentages) return;

        setIsProcessing(true);
        try {
            // Generate the actual cropped image
            const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels, rotation);
            
            // Calculate center position for reference
            const x = croppedAreaPercentages.x + croppedAreaPercentages.width / 2;
            const y = croppedAreaPercentages.y + croppedAreaPercentages.height / 2;
            
            onCropComplete(croppedImageUrl, { x, y });
        } catch (error) {
            console.error('Error cropping image:', error);
            alert('Lỗi khi cắt ảnh. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden flex flex-col h-[80vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Crop Image</h3>
                        <p className="text-xs text-slate-500">Drag to adjust the visible area</p>
                    </div>
                    <button type="button" onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="relative flex-1 bg-slate-950">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        rotation={rotation}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        minZoom={0.1}
                        restrictPosition={false}
                    />
                </div>

                <div className="p-8 bg-slate-900 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                <span>Zoom</span>
                                <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ZoomOut size={14} className="text-slate-500" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={0.1}
                                    max={3}
                                    step={0.05}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-primary bg-slate-800 h-1 rounded-full appearance-none"
                                />
                                <ZoomIn size={14} className="text-slate-500" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                <span>Rotation</span>
                                <span>{rotation}°</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RotateCcw size={14} className="text-slate-500" />
                                <input
                                    type="range"
                                    value={rotation}
                                    min={0}
                                    max={360}
                                    step={1}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="flex-1 accent-primary bg-slate-800 h-1 rounded-full appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Check size={18} /> Apply Selection
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
