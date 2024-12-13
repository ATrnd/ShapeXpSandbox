// Example developer usage
async function initGame() {
    // Get initial ShapeXp
    const xp = await window.ShapeXpAPI.getShapeXp();
    console.log('Current ShapeXp:', xp);

    // Listen for changes
    window.ShapeXpAPI.onShapeXpChange((newAmount) => {
        console.log('ShapeXp updated:', newAmount);
    });
}
