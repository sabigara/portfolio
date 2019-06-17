'use strict'

const pageLinkButtons = Array.from(document.querySelectorAll('.js-smooth-scroll'));
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

const parent = document.querySelector('.bottom-line-parent');
const bottomLineCells = Array.from(parent.querySelectorAll('.bottom-line-cell'));
document.addEventListener("click", e => {
    const target = e.target;

    if (!target.classList.contains("bottom-line-cell")) return;

    bottomLineCells.map(cell => cell.classList.remove('bottom-line-on'));
    target.classList.add('bottom-line-on');
});

const sectionList = Array.from(document.querySelectorAll('.content-section'));
const sectionObjList = sectionList.map(section => {
    return {
        elem: section,
        height: parseFloat(document.defaultView.getComputedStyle(section, null).height.slice(0, -2))
    }
});

window.addEventListener("scroll", e => {
    sectionObjList.map( section => {
        const sectionTop = Math.round(section.elem.getBoundingClientRect().top);
        const sectionHeight = Math.round(section.height);

        if (sectionTop <= 0 && sectionTop >= -(sectionHeight)) {
            bottomLineCells.map(cell => cell.classList.remove('bottom-line-on'));
            let targetNavCell = bottomLineCells.filter(cell => cell.hash.slice(1) === section.elem.id)[0];
            targetNavCell.classList.add('bottom-line-on');
        }
    });
});

const contactForm = document.querySelector('#contact-form');
contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('input[type="submit"]');
    submitBtn.disabled = true;

    fetch('contact/', {
        method: 'post',
        body: formData
    })
        .then(response => {
            if (isError(response)) {
                return Promise.reject(new Error())
            }
        })
        .catch(error => {
            console.log(error);
        })
        .finally( () => {
            submitBtn.disabled = false;
        })
});

function isError(statusCode) {
    const thirdDigit = statusCode.toString().charAt(0);
    return thirdDigit !== '2';
}

function alertError(response) {
    response.text()
        .then((text) => {
            alert(text);
        })
}