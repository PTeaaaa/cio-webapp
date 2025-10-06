"use client";
import FullScreenModal from "@/components/example/ModalExample/FullScreenModal";
import DefaultModal from "@/components/example/ModalExample/DefaultModal";
import FormInModal from "@/components/example/ModalExample/FormInModal";
import ModalBasedAlerts from "@/components/example/ModalExample/ModalBasedAlerts";
import VerticallyCenteredModal from "@/components/example/ModalExample/VerticallyCenteredModal";
import { useState } from 'react';
import TimeLimitModal from "@/components/ui/modal/TimeLimitModal";

export default function TestLoadingPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentVariant, setCurrentVariant] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [currentPosition, setCurrentPosition] = useState<'top' | 'bottom'>('top');

    return (
        <div className="flex flex-col gap-10 p-10">
            <div className="flex flex-col">
                <DefaultModal />
                <FormInModal />
                <VerticallyCenteredModal />
                <ModalBasedAlerts />
                <FullScreenModal />
            </div>
            <div className="flex flex-col">
                <h2 className="text-xl font-bold mb-4">TimeLimitModal Test</h2>
                <div className="flex gap-2 mb-4">
                    <button onClick={() => { setCurrentVariant('success'); setIsOpen(true); }} className="px-4 py-2 bg-green-500 text-white rounded">Success</button>
                    <button onClick={() => { setCurrentVariant('error'); setIsOpen(true); }} className="px-4 py-2 bg-red-500 text-white rounded">Error</button>
                    <button onClick={() => { setCurrentVariant('warning'); setIsOpen(true); }} className="px-4 py-2 bg-yellow-500 text-white rounded">Warning</button>
                    <button onClick={() => { setCurrentVariant('info'); setIsOpen(true); }} className="px-4 py-2 bg-blue-500 text-white rounded">Info</button>
                </div>
                <div className="flex gap-2 mb-4">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="position" value="top" checked={currentPosition === 'top'} onChange={() => setCurrentPosition('top')} />
                        Top
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="position" value="bottom" checked={currentPosition === 'bottom'} onChange={() => setCurrentPosition('bottom')} />
                        Bottom
                    </label>
                </div>
                <TimeLimitModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant={currentVariant}
                    position={currentPosition}
                    title={`Test ${currentVariant} modal`}
                    message="This is a test message for the modal."
                />
            </div>
        </div>
    );
}