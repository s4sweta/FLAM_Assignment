class WebSocketClient {
    constructor(callbacks) {
        console.warn("MOCKUP MODE: WebSocket Client initialized. No connection to server.");
        // Provide fake initial data for the canvas to draw
        callbacks.onInit({ id: 'mock-local-1', color: '#E53935', name: 'User 1' }, []);
    }
    sendStrokeUpdate(strokeData) { /* Mocked */ }
    sendStrokeEnd(strokeData) { console.log('Mocked Stroke Sent:', strokeData); }
    sendUndoRequest() { alert('MOCK: Global Undo Requested (not functional without server).'); }
    sendCursorMove(position) { /* Mocked */ }
}

// Utility functions that might typically be in a separate file, but are included here for simplicity
window.utils = {
    createCursorElement: (userId, userName, color) => { /* Mocked */ return document.createElement('div'); },
    updateCursorPosition: (element, x, y) => { /* Mocked */ }
};