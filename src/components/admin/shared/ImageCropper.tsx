"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
    aspect?: number;
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: any) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: any, pixels: any) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: any,
        rotation = 0
    ): Promise<Blob | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        const rotRad = (rotation * Math.PI) / 180;
        const { width: bWidth, height: bHeight } = {
            width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
            height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
        };

        canvas.width = bWidth;
        canvas.height = bHeight;

        ctx.translate(bWidth / 2, bHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);

        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        );

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(data, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((file) => {
                resolve(file);
            }, 'image/jpeg');
        });
    };

    const handleConfirm = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
            if (croppedBlob) {
                onCropComplete(croppedBlob);
            }
        } catch (e) {
            console.error(e);
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
                    <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
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
                                    min={0.5}
                                    max={3}
                                    step={0.1}
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
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Check size={18} /> Apply Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
