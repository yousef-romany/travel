import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="loader text-primary"></div>
                <p className="text-muted-foreground animate-pulse font-medium">Preparing your journey...</p>
            </div>
        </div>
    );
};

export default GlobalLoader;
