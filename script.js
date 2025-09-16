const wallpapers = [
    "https://picsum.photos/seed/beach1/1920/1080.jpg",
    "https://picsum.photos/seed/beach2/1920/1080.jpg",
    "https://picsum.photos/seed/beach3/1920/1080.jpg",
    "https://picsum.photos/seed/beach4/1920/1080.jpg",
    "https://picsum.photos/seed/beach5/1920/1080.jpg",
    "https://picsum.photos/seed/mountain1/1920/1080.jpg"
];

// Added console logging for debugging
console.log("Wallpaper changer initialized with", wallpapers.length, "images");

const container = document.getElementById("wallpaper-container");
let currentIndex = 0;

function changeWallpaper() {
    const wallpaper = document.createElement("div");
    wallpaper.style.backgroundImage = `url(${wallpapers[currentIndex]})`;
    wallpaper.style.backgroundSize = "cover";
    wallpaper.style.backgroundPosition = "center";
    wallpaper.style.width = "100%";
    wallpaper.style.height = "100vh";
    wallpaper.style.position = "absolute";
    wallpaper.style.top = "0";
    wallpaper.style.left = "0";
    wallpaper.style.opacity = "0";
    wallpaper.style.transition = "opacity 1.5s ease-in-out";
    
    container.appendChild(wallpaper);
    
    setTimeout(() => {
        wallpaper.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
        container.innerHTML = "";
        currentIndex = (currentIndex + 1) % wallpapers.length;
        changeWallpaper();
    }, 8000);
}

changeWallpaper();
