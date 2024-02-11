const createPlayer = () => {
    return {
        provideAttackCoordinates() {
            // To be overridden by subclass
        },
    };
};

export { createPlayer };
