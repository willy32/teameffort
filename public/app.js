const element = document.getElementById("hide");
element.addEventListener("click", hidebar);

function hidebar() {
    document.getElementById("underbar").style.visibility = "hidden"
}
