var v = null;
    
export function updateSize() {
    v = window.innerWidth;

    if (document.querySelector(".left_navbar").getAttribute("style") === "display: none;" && v > 988) {
        document.querySelector(".left_navbar").style.display = "block";
    }
}