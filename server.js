const { createApp } = require('./src/app');

const PORT = process.env.PORT || 3000;

function start() {
    try {
        const app = createApp();
        app.listen(PORT, () => {
            console.log(`Ethiopian Orthodox Bible API listening at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();
