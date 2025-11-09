Application Architecture: Breaking Down Co-Draw



When we started with the single HTML file, all the logic and styling were mixed together. To build a robust, professional web application, we needed to separate those concerns. This document explains the role of each of the five files in the structure.



**The Three Layers of Co-Draw**



The application is logically split into three primary layers: View (HTML/CSS), Core Logic (Canvas Manager), and Application Orchestration (Main \& Network).



**1. The View Layer (index.html \& style.css)**



This is what the user sees and interacts with.



*index.html (The Skeleton):*



This is the fundamental structure of the page. It contains the main div containers (#app-container), the control panel (#controls-panel), the sidebar (#users-sidebar), and the most important element: the <canvas id="drawing-canvas">.



Crucially, this file links to all the other three JavaScript files (websocket-client.js, canvas-manager.js, main.js) at the bottom of the <body>, ensuring that all the structure is loaded before the scripts try to manipulate it.



*style.css (The Look and Feel):*



This file controls the application's dark mode theme, typography, and responsive layout.

It uses CSS Grid (#app-container) to define the structure: a header on top, the main drawing area next to the sidebar.

It contains specific styling for the UI components (like the blue active button color) and the visual feedback elements (like the remote cursor indicators).



**2. The Core Logic Layer (canvas-manager.js)**



This file is the brain of the drawing functionality. It knows everything about the canvas, but it knows nothing about the UI buttons or network communication.

CanvasManager Class: This JavaScript class encapsulates all the technical details of HTML Canvas drawing.



*What it does:*



Context Management: It gets the 2D drawing context (ctx) from the canvas element.

Resizing: It has a method (resizeCanvas) that runs when the window size changes, ensuring the canvas always fills its parent container.

Event Handling: It listens for mouse events (mousedown, mousemove, mouseup) and touch events, translating those raw coordinates into drawing strokes.

Drawing Strokes: The main logic is in \_startDrawing, \_draw, and \_stopDrawing, which use canvas context properties like lineWidth, strokeStyle, and globalCompositeOperation (used for the eraser effect).

Redrawing: The clearAndRedraw method handles clearing the canvas and iterating through a history of strokes to repaint the entire image. This is vital for undo/redo and synchronization.



**3. The Orchestration Layer (websocket-client.js \& main.js)**



These files act as the glue, connecting the UI controls to the drawing brain, and handling the network interactions.



websocket-client.js (The Network Communicator):

In a final application, this file would manage the actual connection to the server (likely via Socket.io).

Current State: It is a mockup class. It initializes a "user" and pretends to send data using methods like sendStrokeEnd() and sendUndoRequest(), but it just logs the action to the console instead of sending it over the network.

It defines the essential callbacks (like onNewStroke and onHistoryUpdated) that the main.js file uses to process incoming data from other users.



main.js (The Conductor):

This is the application's entry point, running when the page loads. It coordinates everything.

Initialization: It creates new instances of CanvasManager and WebSocketClient.

Wiring: 

It connects the two instances:-



It tells the CanvasManager to use the WebSocketClient's methods (onStrokeEnd, onStrokeUpdate) when a local user draws.

It gives the WebSocketClient's network callbacks to the CanvasManager so that when a stroke comes in from a remote user, the CanvasManager knows to draw it (canvasManager.renderStroke(stroke)).



UI Binding: It attaches event listeners to all the control elements,

When a user clicks a tool button, main.js tells the CanvasManager to setTool().

When the width slider moves, main.js tells the CanvasManager to setWidth().



This separation of duties makes the app easy to debug. If the drawing is broken, we look at canvas-manager.js. If the buttons don't work, we look at main.js. If collaboration breaks, we look at websocket-client.js.

