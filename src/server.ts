import app from './app';

const main = async () => {
    try {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

main();