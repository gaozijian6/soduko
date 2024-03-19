if (true) {
    let btn1s = document.querySelectorAll('#accordion .btn1')
    for (let btn of btn1s) {
        btn.addEventListener('click', function (e) {
            this.lastElementChild.classList.toggle('rotate90')
            for (let btn2 of btn1s) {
                if (btn2 != btn) {
                    btn2.lastElementChild.classList.remove('rotate90')
                }
            }
        }, true)
    }
    document.querySelector('.closebtn').addEventListener('click', function () {
        document.querySelector('.login2').classList.add('myclose')
    })
    document.querySelector('.bi-list').addEventListener('click', () => {
        document.querySelector('.login2').classList.remove('myclose')
    })
}
if (true) {
    let btn1s = document.querySelectorAll('.accordion2 button')
    for (let btn of btn1s) {
        btn.addEventListener('click', function (e) {
            this.lastElementChild.classList.toggle('rotate180')
            for (let btn2 of btn1s) {
                if (btn2 != btn) {
                    btn2.lastElementChild.classList.remove('rotate180')
                }
            }
        }, true)
    }
}


// 对navResearch的监听
if (true) {
    document.querySelector('.navResearch').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgResearch').classList.add('rotate180')
        document.querySelector('.Research').classList.add('navShow')
        document.querySelector('.content1-1').classList.remove('finish')
        document.querySelector('.content1-2').classList.remove('finish')
        document.querySelector('.content1-3').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content1-1').classList.add('navContentShow')
            document.querySelector('.content1-2').classList.add('navContentShow')
            document.querySelector('.content1-3').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.navResearch').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgResearch').classList.remove('rotate180')
        document.querySelector('.Research').classList.remove('navShow')
        document.querySelector('.content1-1').classList.add('finish')
        document.querySelector('.content1-2').classList.add('finish')
        document.querySelector('.content1-3').classList.add('finish')
        document.querySelector('.content1-1').classList.remove('navContentShow')
        document.querySelector('.content1-2').classList.remove('navContentShow')
        document.querySelector('.content1-3').classList.remove('navContentShow')
    })
    document.querySelector('.Research').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgResearch').classList.add('rotate180')
        document.querySelector('.Research').classList.add('navShow')
        document.querySelector('.content1-1').classList.remove('finish')
        document.querySelector('.content1-2').classList.remove('finish')
        document.querySelector('.content1-3').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content1-1').classList.add('navContentShow')
            document.querySelector('.content1-2').classList.add('navContentShow')
            document.querySelector('.content1-3').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.Research').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgResearch').classList.remove('rotate180')
        document.querySelector('.Research').classList.remove('navShow')
        document.querySelector('.content1-1').classList.add('finish')
        document.querySelector('.content1-2').classList.add('finish')
        document.querySelector('.content1-3').classList.add('finish')
        document.querySelector('.content1-1').classList.remove('navContentShow')
        document.querySelector('.content1-2').classList.remove('navContentShow')
        document.querySelector('.content1-3').classList.remove('navContentShow')
    })
}
// 对navProduct的监听
if (true) {
    document.querySelector('.navProduct').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgProduct').classList.add('rotate180')
        document.querySelector('.Product').classList.add('navShow')
        document.querySelector('.content2-1').classList.remove('finish')
        document.querySelector('.content2-2').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content2-1').classList.add('navContentShow')
            document.querySelector('.content2-2').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.navProduct').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgProduct').classList.remove('rotate180')
        document.querySelector('.Product').classList.remove('navShow')
        document.querySelector('.content2-1').classList.add('finish')
        document.querySelector('.content2-2').classList.add('finish')
        document.querySelector('.content2-1').classList.remove('navContentShow')
        document.querySelector('.content2-2').classList.remove('navContentShow')
    })
    document.querySelector('.Product').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgProduct').classList.add('rotate180')
        document.querySelector('.Product').classList.add('navShow')
        document.querySelector('.content2-1').classList.remove('finish')
        document.querySelector('.content2-2').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content2-1').classList.add('navContentShow')
            document.querySelector('.content2-2').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.Product').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgProduct').classList.remove('rotate180')
        document.querySelector('.Product').classList.remove('navShow')
        document.querySelector('.content2-1').classList.add('finish')
        document.querySelector('.content2-2').classList.add('finish')
        document.querySelector('.content2-1').classList.remove('navContentShow')
        document.querySelector('.content2-2').classList.remove('navContentShow')
    })
}

// 对navStudios的监听
if (true) {
    document.querySelector('.navStudios').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgStudios').classList.add('rotate180')
        document.querySelector('.Studios').classList.add('navShow')
        document.querySelector('.content3-1').classList.remove('finish')
        document.querySelector('.content3-2').classList.remove('finish')
        document.querySelector('.content3-3').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content3-1').classList.add('navContentShow')
            document.querySelector('.content3-2').classList.add('navContentShow')
            document.querySelector('.content3-3').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.navStudios').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgStudios').classList.remove('rotate180')
        document.querySelector('.Studios').classList.remove('navShow')
        document.querySelector('.content3-1').classList.add('finish')
        document.querySelector('.content3-2').classList.add('finish')
        document.querySelector('.content3-3').classList.add('finish')
        document.querySelector('.content3-1').classList.remove('navContentShow')
        document.querySelector('.content3-2').classList.remove('navContentShow')
        document.querySelector('.content3-3').classList.remove('navContentShow')
    })
    document.querySelector('.Studios').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgStudios').classList.add('rotate180')
        document.querySelector('.Studios').classList.add('navShow')
        document.querySelector('.content3-1').classList.remove('finish')
        document.querySelector('.content3-2').classList.remove('finish')
        document.querySelector('.content3-3').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content3-1').classList.add('navContentShow')
            document.querySelector('.content3-2').classList.add('navContentShow')
            document.querySelector('.content3-3').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.Studios').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgStudios').classList.remove('rotate180')
        document.querySelector('.Studios').classList.remove('navShow')
        document.querySelector('.content3-1').classList.add('finish')
        document.querySelector('.content3-2').classList.add('finish')
        document.querySelector('.content3-3').classList.add('finish')
        document.querySelector('.content3-1').classList.remove('navContentShow')
        document.querySelector('.content3-2').classList.remove('navContentShow')
        document.querySelector('.content3-3').classList.remove('navContentShow')
    })
}

// 对navProduct的监听
if (true) {
    document.querySelector('.navCompany').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgCompany').classList.add('rotate180')
        document.querySelector('.Company').classList.add('navShow')
        document.querySelector('.content4-1').classList.remove('finish')
        document.querySelector('.content4-2').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content4-1').classList.add('navContentShow')
            document.querySelector('.content4-2').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.navCompany').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgCompany').classList.remove('rotate180')
        document.querySelector('.Company').classList.remove('navShow')
        document.querySelector('.content4-1').classList.add('finish')
        document.querySelector('.content4-2').classList.add('finish')
        document.querySelector('.content4-1').classList.remove('navContentShow')
        document.querySelector('.content4-2').classList.remove('navContentShow')
    })
    document.querySelector('.Company').addEventListener('mouseover', () => {
        document.querySelector('.mask').classList.add('blur')
        document.querySelector('.svgCompany').classList.add('rotate180')
        document.querySelector('.Company').classList.add('navShow')
        document.querySelector('.content4-1').classList.remove('finish')
        document.querySelector('.content4-2').classList.remove('finish')
        setTimeout(() => {
            document.querySelector('.content4-1').classList.add('navContentShow')
            document.querySelector('.content4-2').classList.add('navContentShow')
        }, 0);
    })
    document.querySelector('.Company').addEventListener('mouseleave', () => {
        document.querySelector('.mask').classList.remove('blur')
        document.querySelector('.svgCompany').classList.remove('rotate180')
        document.querySelector('.Company').classList.remove('navShow')
        document.querySelector('.content4-1').classList.add('finish')
        document.querySelector('.content4-2').classList.add('finish')
        document.querySelector('.content4-1').classList.remove('navContentShow')
        document.querySelector('.content4-2').classList.remove('navContentShow')
    })
}
// Product内的video替换
if (true) {
    let video = document.querySelector('.Product video')
    let videos = []
    let posters = []
    videos.push('./img/gen2-preview.webm')
    videos.push('./img/gen-1-watermark.mp4')
    videos.push('./img/RW_Web_GlobalNav_T2I-v1.mp4')
    videos.push('./img/RW_Web_GlobalNav_I2I.webm')
    videos.push('./img/tool-infinite-image-v4.webm')
    videos.push('./img/tool-inpainting.mp4')
    videos.push('./img/tool-frame-interpolation-v1.mp4')
    videos.push('./img/tool-ai-training.mp4')
    videos.push('./img/subway_generated.mp4')
    videos.push('./img/gen2_short_header.webm')
    videos.push('./img/runway-mobile-cut.mp4')
    videos.push('./img/RW_Web_GlobalNav_FootagePack.mp4')
    posters.push('./img/homepage/gen2-preview-poster.webp')
    posters.push('./img/poster-gen-1-watermark.webp')
    posters.push('./img/RW_Web_GlobalNav_T2I-v1.jpg')
    posters.push('./img/RW_Web_GlobalNav_I2I.jpg')
    posters.push('./img/poster-tool-infinite-image-v4.webp')
    posters.push('./img/poster-tool-inpainting.jpg')
    posters.push('./img/poster-tool-frame-interpolation-v1.png')
    posters.push('./img/poster-tool-ai-training.webp')
    posters.push('./img/subway_generated_poster.png')
    posters.push('./img/gen2_short_header-poster.jpg')
    posters.push('./img/runway-mobile-cut-poster.png')
    posters.push('./img/RW_Web_GlobalNav_FootagePack.jpg')
    let doms_a = document.querySelectorAll('.Product .a')
    for (let i = 0; i < doms_a.length; i++) {
        doms_a[i].addEventListener('mouseover', (e) => {
            e.stopPropagation()
            video.style.transition = ''
            video.style.opacity = 0
            video.poster = posters[i]
            video.src = videos[i]
            setTimeout(() => {
                video.style.transition = 'all 1s'
                video.style.opacity = 1
            }, 0);
        })
        doms_a[i].addEventListener('mouseleave', (e) => {
            video.style.transition = ''
            video.style.opacity = 0
            video.poster = "./img/mmb-birds-poster.webp"
            video.src = "./img/mmb-birds.webm"
            setTimeout(() => {
                video.style.transition = 'all 1s'
                video.style.opacity = 1
            }, 0);
        })
    }
}
// 滑动按钮与费用更改
if (true) {
    document.querySelector('.monthly').addEventListener('click', () => {
        document.querySelector('.monthly').style.color = 'white'
        document.querySelector('.annual .span1').style.color = 'black'
        document.querySelector('.annual .span2').style.color = 'rgb(71,63,244)'
        document.querySelector('.animate').style.transform = 'translateX(0)'

        document.querySelector('.fare1').innerHTML = '$15'
        document.querySelector('.fare2').innerHTML = '$35'
        document.querySelector('.fare3').innerHTML = '$95'
        document.querySelector('.p1').innerHTML = 'max. 5 users per workspace billed monthly'
        document.querySelector('.p2').innerHTML = 'max. 10 users per workspace billed monthly'
        document.querySelector('.p3').innerHTML = 'max. 10 users per workspace billed monthly'
    })
    document.querySelector('.annual').addEventListener('click', () => {
        document.querySelector('.monthly').style.color = 'black'
        document.querySelector('.annual .span1').style.color = 'white'
        document.querySelector('.annual .span2').style.color = 'rgb(153,210,23)'
        document.querySelector('.animate').style.transform = 'translateX(97.5%)'

        document.querySelector('.fare1').innerHTML = '$12'
        document.querySelector('.fare2').innerHTML = '$28'
        document.querySelector('.fare3').innerHTML = '$76'
        document.querySelector('.p1').innerHTML = 'max. 5 users per workspace billed annually as $144'
        document.querySelector('.p2').innerHTML = 'max. 10 users per workspace billed annually as $336'
        document.querySelector('.p3').innerHTML = 'max. 10 users per workspace billed annually as $912'
    })
}

