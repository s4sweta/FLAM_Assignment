// --- Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const canvasEl = document.getElementById('drawing-canvas');
    const toolsEl = document.getElementById('tools');
    const colorPicker = document.getElementById('color-picker');
    const widthSlider = document.getElementById('width-slider');
    const currentWidthEl = document.getElementById('current-width');
    const undoButton = document.getElementById('undo-button');
    const clearButton = document.getElementById('clear-button');
    const drawingArea = document.getElementById('drawing-area');
    
    let canvasManager;
    let wsClient;
    
    // 1. Initialize Canvas Manager
    // NOTE: CanvasManager class is defined in canvas-manager.js
    canvasManager = new CanvasManager(canvasEl);

    // 2. Initialize WebSocket Client (MOCK)
    // NOTE: WebSocketClient class is defined in websocket-client.js
    const networkCallbacks = {
        onInit: (user, history) => { 
            document.getElementById('user-name').textContent = `${user.name} (You) - MOCKUP MODE`;
            document.getElementById('user-name').style.color = user.color;
            canvasManager.clearAndRedraw(history);
        },
        onNewStroke: (stroke) => { canvasManager.renderStroke(stroke); },
        onHistoryUpdated: (history) => { canvasManager.clearAndRedraw(history); },
        onCursorUpdate: (data) => { /* Mocked */ },
        onUserListUpdate: (users) => { /* Mocked */ }
    };
    wsClient = new WebSocketClient(networkCallbacks);

    // 3. Wire Canvas Manager to WebSocket Client
    canvasManager.onStrokeUpdate = (strokeData) => { wsClient.sendStrokeUpdate(strokeData); };
    canvasManager.onStrokeEnd = (strokeData) => { wsClient.sendStrokeEnd(strokeData); };

    // 4. UI Event Listeners
    toolsEl.addEventListener('click', (e) => {
        const button = e.target.closest('.tool-button');
        if (button) {
            toolsEl.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            canvasManager.setTool(button.dataset.tool);
        }
    });

    colorPicker.addEventListener('change', (e) => { canvasManager.setColor(e.target.value); });
    
    widthSlider.addEventListener('input', (e) => {
        const width = parseInt(e.target.value);
        currentWidthEl.textContent = `${width}px`;
        canvasManager.setWidth(width);
    });
    
    undoButton.addEventListener('click', () => { wsClient.sendUndoRequest(); });
    clearButton.addEventListener('click', () => { 
        if (confirm("MOCKUP WARNING: This button is not functional without the Node.js server. Click OK to see a local clear.")) {
             canvasManager.clearAndRedraw([]); 
        }
    });
    
    drawingArea.addEventListener('mousemove', (e) => {
        if (!drawingArea.throttleTimer) {
            drawingArea.throttleTimer = setTimeout(() => {
                // Mocked: wsClient.sendCursorMove({ x: e.offsetX, y: e.offsetY });
                drawingArea.throttleTimer = null;
            }, 33);
        }
    });
    
    // Set initial width display
    currentWidthEl.textContent = `${widthSlider.value}px`;
});