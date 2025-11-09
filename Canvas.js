class CanvasManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.currentTool = 'brush';
        this.currentColor = '#1E88E5';
        this.currentWidth = 5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
        this.localStroke = null;
        this.onStrokeUpdate = null; // To be set by main.js
        this.onStrokeEnd = null;     // To be set by main.js
        this._setupEventListeners();
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    _setupEventListeners() {
        ['mousedown', 'touchstart'].forEach(e => this.canvas.addEventListener(e, (evt) => {
            this._startDrawing(evt.touches ? evt.touches[0] : evt);
        }));
        ['mousemove', 'touchmove'].forEach(e => this.canvas.addEventListener(e, (evt) => {
            evt.preventDefault();
            this._draw(evt.touches ? evt.touches[0] : evt);
        }));
        ['mouseup', 'mouseout', 'touchend'].forEach(e => this.canvas.addEventListener(e, this._stopDrawing.bind(this)));
    }

    _startDrawing(e) {
        if (this.localStroke) return;
        this.localStroke = {
            tool: this.currentTool,
            color: this.currentTool === 'eraser' ? 'white' : this.currentColor,
            width: this.currentWidth,
            points: [[e.offsetX, e.offsetY]]
        };
        this.ctx.strokeStyle = this.localStroke.color;
        this.ctx.lineWidth = this.localStroke.width;
        this.ctx.globalCompositeOperation = this.localStroke.tool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    }
    
    _throttleTimer = null;
    THROTTLE_RATE = 50;

    _draw(e) {
        if (!this.localStroke) return;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
        this.localStroke.points.push([e.offsetX, e.offsetY]);

        if (this.onStrokeUpdate && !this._throttleTimer) {
            this._throttleTimer = setTimeout(() => {
                this.onStrokeUpdate(this.localStroke);
                this._throttleTimer = null;
            }, this.THROTTLE_RATE);
        }
    }

    _stopDrawing() {
        if (!this.localStroke) return;
        if (this.onStrokeEnd) {
            this.onStrokeEnd(this.localStroke);
        }
        this.localStroke = null;
        this.ctx.globalCompositeOperation = 'source-over';
    }

    // Function to draw a stroke from history or a remote user
    renderStroke(stroke) {
        if (stroke.points.length < 1) return;
        const { points, color, width, tool } = stroke;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.beginPath();
        const [startX, startY] = points[0];
        this.ctx.moveTo(startX, startY);
        for (let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.globalCompositeOperation = 'source-over'; // Reset for future strokes
    }
    
    clearAndRedraw(history = []) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        history.forEach(stroke => this.renderStroke(stroke));
    }
    
    setTool(tool) { this.currentTool = tool; }
    setColor(color) { this.currentColor = color; }
    setWidth(width) { this.currentWidth = width; }
}