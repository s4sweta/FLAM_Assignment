Co-Draw: A Collaborative Drawing Mockup

Hey! Welcome to the Co-Draw project files. This application is a front-end web client designed to act as a real-time, collaborative drawing canvas.

Right now, the code you have is a fully functional front-end drawing application that is styled beautifully in a dark mode. It also contains the structure and logic hooks needed to connect to a future Node.js server for true real-time collaboration.

**How to Run the App**

Since this project is pure HTML, CSS, and JavaScript (with no server dependency for local drawing), getting started is incredibly easy:
Make sure all the files (index.html, style.css, websocket-client.js, canvas-manager.js, main.js) are in the same folder.
Open index.html in any modern web browser (like Chrome, Firefox, or Safari).

That's it! You should be able to start drawing immediately.

**Features**

Even in this front-end mockup stage, the application provides a complete drawing experience
Freehand Drawing: Use the mouse or touch to draw directly on the canvas.
Brush & Eraser Tools: Easily switch between drawing with the Brush and clearing areas with the Eraser.
Color Control: A color picker allows you to change the stroke color instantly.
Width Control: A slider lets you adjust the brush size from thin lines ($1 \text{px}$) to thick strokes ($50 \text{px}$).
Responsive Canvas: The canvas automatically resizes to fit its container, and the drawing context is preserved.
Collaboration Mockup: The layout includes spaces for the Online Users list and Live Cursor Indicators, showing where other users would be drawing in a real collaborative environment.

**The Collaboration Catch (The "Mockup" Part)**

In the original single file, we included MOCK classes for WebSocketClient. 
This means, You can draw locally, but the strokes aren't saved persistently or shared. When you use the "Undo Global" or "Clear Canvas" buttons, the code pops up a confirmation alert because it needs a running server to actually perform those global actions.
The user list and other cursors are static HTML. The websocket-client.js file is currently a dummy class that just logs what it's trying to send (like stroke data), but it doesn't actually connect to a server.
To make this a true collaborative application, you would replace the logic inside websocket-client.js with a proper Socket.io client implementation that talks to a back-end server.

**Project Structure**

We separated the code into logical files to keep things clean. For a more detailed look at what each file does, check out the ARCHITECTURE.md file!
