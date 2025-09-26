import { setupWorker } from 'msw/browser';
import { makeHandlers } from './handlers';

export const worker = setupWorker(...makeHandlers('success'));

export function setMockMode(mode: 'success' | '500' | 'network') {
    console.log(`🔄 MSW: Switching to mode: ${mode}`);
    const newHandlers = makeHandlers(mode);
    worker.resetHandlers(...newHandlers);
    console.log(`✅ MSW: Mode switched to ${mode} with ${newHandlers.length} handlers`);
}