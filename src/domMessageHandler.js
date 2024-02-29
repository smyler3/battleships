const createDOMMessageHandler = () => {
    // Create message banner
    // const modal = document.createElement("div");
    // modal.classList.add("modal");
    const messageBanner = document.createElement("div");
    messageBanner.classList.add("message-banner");
    // modal.appendChild(messageBanner);
    document.querySelector("body").prepend(messageBanner);

    return {
        displayCurrentTurn(playerTurn = true) {
            messageBanner.textContent = playerTurn
                ? "Your turn! Make an attack"
                : `Opponent Turn! Making an attack`;
        },

        displayAttackResult(hit) {
            messageBanner.textContent = hit ? "Ship hit!" : "Shot missed!";
        },

        displayWinner(name) {
            messageBanner.textContent = `Victory for ${name}!`;
        },
    };
};

export { createDOMMessageHandler };
