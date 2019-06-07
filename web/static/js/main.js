'use strict'

let pageLinkButtons = Array.from(document.querySelectorAll('.js-smooth-scroll'));
pageLinkButtons.map(button => { 
    button.addEventListener("click", e => {
        const target = e.currentTarget;
        e.preventDefault();
        const targetId = target.hash;
        document.querySelector(targetId).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    })
});

let parent = document.querySelector('.bottom-line-parent');
let bottomLineCells = Array.from(parent.querySelectorAll('.bottom-line-cell'));
document.addEventListener("click", e => {
    const target = e.target;

    if (!target.classList.contains("bottom-line-cell")) return;

    bottomLineCells.map(cell => cell.classList.remove('bottom-line-on'));
    target.classList.add('bottom-line-on');
});

let sectionList = Array.from(document.querySelectorAll('.content-section'));
let sectionObjList = sectionList.map(section => {
    return {
        elem: section,
        height: parseFloat(document.defaultView.getComputedStyle(section, null).height.slice(0, -2))
    }
});

window.addEventListener("scroll", e => {
    sectionObjList.map( section => {
        let sectionTop = Math.round(section.elem.getBoundingClientRect().top);
        let sectionHeight = Math.round(section.height);

        if (sectionTop <= 0 && sectionTop >= -(sectionHeight)) {
            bottomLineCells.map(cell => cell.classList.remove('bottom-line-on'));
            let targetNavCell = bottomLineCells.filter(cell => cell.hash.slice(1) === section.elem.id)[0];
            targetNavCell.classList.add('bottom-line-on');
        }
    });
});