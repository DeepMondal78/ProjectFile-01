/*-----===== WEBPAGE TEXT NO COPY & NO SELECT CAN ANYONE =====-----*/
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

/*-----===== THREE JS ANIMATION  LINK =====-----*/
// import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/*-----===== LODING ANIMATION =====-----*/
const loaderLine = document.querySelector(".loader-line");
const fullWidth = loaderLine.clientWidth || document.body.clientWidth;

// Lock scroll during loading
document.body.style.overflow = "hidden";

// Animate line fill
gsap.to(".line-fill", {
  width: "100%",
  duration: 4,
  ease: "power2.inOut"
});

// Animate cat icon movement
gsap.to(".cat-icon", {
  x: fullWidth,
  duration: 4,
  ease: "power2.inOut",
  delay: 0.4
});

// Percentage counter
let count = { val: 10 };
const percentageEl = document.querySelector(".percentage-text");

gsap.to(count, {
  val: 100,
  duration: 4,
  ease: "power2.inOut",
  onUpdate: () => {
    percentageEl.textContent = Math.round(count.val) + "%";
  },
  onComplete: () => {
    // Step 1: Instantly hide main content before overlay starts
    document.querySelector("main").style.visibility = "hidden";

    // Step 2: Animate overlay from bottom to top (entry)
    gsap.to(".loader-overlay", {
      top: 0,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        // Step 3: Fade out and remove loader
        gsap.to(".loader", {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            document.querySelector(".loader").style.display = "none";

            // Step 4: Animate overlay out of view (exit)
            gsap.to(".loader-overlay", {
              top: "-100%",
              duration: 0.8,
              delay: 0.3,
              ease: "power3.inOut",
              onComplete: () => {
                document.querySelector(".loader-overlay").style.display = "none";

                // Step 5: Show main content + enable scroll
                document.querySelector("main").style.visibility = "visible";
                document.body.style.overflow = "auto";

                // Run your animations + locomotive setup
                initSmoothScrollAndAnimations();
              }
            });
          }
        });
      }
    });
  }
});






/*-----===== CUSTOME CURSOR  ANIMATION =====-----*/
const $bigBall = document.querySelector('.cursor__ball--big');
const $smallBall = document.querySelector('.cursor__ball--small');
const $hoverables = document.querySelectorAll('.hoverable');

// Mouse move
document.body.addEventListener('mousemove', onMouseMove);

// Hover
$hoverables.forEach(el => {
  el.addEventListener('mouseenter', onMouseHover);
  el.addEventListener('mouseleave', onMouseHoverOut);
});

function onMouseMove(e) {
  gsap.to($bigBall, { duration: 0.4, x: e.pageX - 15, y: e.pageY - 15 });
  gsap.to($smallBall, { duration: 0.1, x: e.pageX - 5, y: e.pageY - 7 });
}

function onMouseHover() {
  gsap.to($bigBall, { duration: 0.3, scale: 4 });
}

function onMouseHoverOut() {
  gsap.to($bigBall, { duration: 0.3, scale: 1 });
}





/*-----===== CURSOR RIPPLE ANIMATION =====-----*/
const mouseCursor = document.getElementById("fluid");
const ctx = mouseCursor.getContext("2d");

let width = mouseCursor.width = window.innerWidth;
let height = mouseCursor.height = window.innerHeight;

let mouse = { x: width / 2, y: height / 2 };
let ripples = [];

window.addEventListener("resize", () => {
  width = mouseCursor.width = window.innerWidth;
  height = mouseCursor.height = window.innerHeight;
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  ripples.push({ x: mouse.x, y: mouse.y, radius: 0, alpha: 1 });
});

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < ripples.length; i++) {
    let r = ripples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(138, 175, 178, ${r.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    r.radius += 1.5;
    r.alpha -= 0.015;

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}
animate();









/*-----===== FUNCTION: LocoScroll + GSAP Setup =====-----*/
function initSmoothScrollAndAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("main"),
    smooth: true,
    lerp: 0.07
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("main").style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  animateHeroSection();
  animateScrollSections();
}







/*-----===== HERO SECTION ENTRY ANIMATION =====-----*/
function animateHeroSection() {
  const tl = gsap.timeline();

  tl.from(".textHi h1", {
    y: 100,
    opacity: 0,
    duration: 1.5
  })
    .from(".textHi img", {
      x: -50,
      opacity: 0,
      duration: 1
    }, "-=1")
    .from(".hero-titel h1", {
      y: 80,
      opacity: 0,
      duration: 1.5
    }, "-=0.5")
    .from(".hero-titel p", {
      y: 40,
      opacity: 0,
      duration: 1
    }, "-=0.8")
    .from(".hero-image img", {
      scale: 0.7,
      opacity: 0,
      duration: 1
    }, "-=1");
}

/*-----===== HERO SECTION TEXT OVERLAY ANIMATION =====-----*/
const heading = document.getElementById("text");

const lines = heading.innerHTML.split('<br>');

const spannedLines = lines.map(line => {
  return Array.from(line).map(char => {
    if (char === " " || char === '\u00A0') return `<span class="space">&nbsp;</span>`;
    return `<span>${char}</span>`;
  }).join("");
});

heading.innerHTML = spannedLines.join("<br>");

const spans = heading.querySelectorAll("span:not(.space)");

spans.forEach(span => {
  span.addEventListener("mouseenter", () => {
    span.classList.add("animate");
    setTimeout(() => {
      span.classList.remove("animate");
    }, 600);
  });
});



/*-----===== SCROLLTRIGGER: VIDEO PLAY ANIMATION =====-----*/
function animateScrollSections() {
  ScrollTrigger.matchMedia({

    // ✅ Tablet: 768px - 1024px
    "(min-width: 768px) and (max-width: 1024px)": function () {
      gsap.to(".play-video", {
        scrollTrigger: {
          trigger: ".video",
          scroller: "main",
          start: "top 75%",
          end: "top 25%",
          scrub: 1.5,
          markers: false
        },
        width: "88%",
        minHeight: "60vh",
        ease: "power2.out"
      });
    },

    // ✅ Desktop: 1025px and above
    "(min-width: 1025px)": function () {
      gsap.to(".play-video", {
        scrollTrigger: {
          trigger: ".video",
          scroller: "main",
          start: "top 70%",
          end: "top 20%",
          scrub: 2.5,
          markers: false
        },
        width: "70%",
        minHeight: "70vh",
        ease: "power2.out"
      });
    }

    // ❌ No animation on mobile, so no (max-width: 767px) condition
  });
}








const hoverCircle = document.querySelector('.hoverCircle');
const playVideo = document.querySelector('.play-video');

playVideo.addEventListener('mousemove', (e) => {
  const rect = playVideo.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distX = Math.abs(e.clientX - centerX);
  const distY = Math.abs(e.clientY - centerY);

  const thresholdX = rect.width / 4;
  const thresholdY = rect.height / 2;

  if (distX < thresholdX && distY < thresholdY) {
    hoverCircle.classList.add('show');
  } else {
    hoverCircle.classList.remove('show');
  }
});

playVideo.addEventListener('mouseleave', () => {
  hoverCircle.classList.remove('show');
});




/*-----===== CREATIVE TEXT ANIMATION =====-----*/



/*-----===== CREATIVE HEADING TEXT ANIMATION =====-----*/
const text = document.getElementById("creativeText");
const overlayText = document.querySelector(".overlayText");

text.addEventListener("mouseenter", () => {
  overlayText.style.display = "block";
});

text.addEventListener("mousemove", (e) => {
  const rect = text.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  overlayText.style.clipPath = `circle(100px at ${x}px ${y}px)`;
});

text.addEventListener("mouseleave", () => {
  overlayText.style.clipPath = "circle(0px at 0 0)";
});

/*-----===== CREATIVE HEADING HOVER IMAGE SHOW ANIMATION =====-----*/

const hoverSpan = document.querySelectorAll('.creativeContent-right span');

hoverSpan.forEach(span => {
  const img = span.querySelector('.hoverImage');

  span.addEventListener('mouseenter', () => {
    img.style.opacity = '1';
    img.style.transform = 'translateY(-50%) scale(1.2)';
  });

  span.addEventListener('mouseleave', () => {
    img.style.opacity = '0';
    img.style.transform = 'translateY(-50%) scale(1.2)';
  });
});






/*-----===== RESENT WORK SECTION SCROLL TEXT ANIMATION =====-----*/
gsap.utils.toArray('.textAni').forEach((text, index) => {
  let animate = gsap.timeline({
    scrollTrigger: {
      trigger: text,
      start: 'top 85%',
      end: 'top 30%',
      scrub: 4,
      scroller: 'main',
      markers: false
    }
  });

  animate.fromTo(text, {
    x: index === 0 ? -200 : 200,
    opacity: 0,
    backgroundSize: '0%',
  }, {
    x: 0,
    opacity: 1,
    backgroundSize: '100%',
    duration: 5,
    ease: 'power4.out'
  });
});




/*-----===== CARD SECTION SCROLL ANIMATION =====-----*/
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".card").forEach((card) => {
  const direction = card.dataset.animate === "slide-left" ? -150 : 150;

  gsap.fromTo(
    card,
    {
      opacity: 0,
      x: direction,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1.8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: card,
        scroller: "[data-scroll-container]",
        start: "top 85%",
        end: "top 40%",
        scrub: 1.5,
        // markers: true
      },
    }
  );
});


/*-----===== ALL THE CARD SECTION UNDER TEXT HOVER ANIMATION =====-----*/
gsap.registerPlugin(SplitText);

let isComplete = true;

const split = new SplitText("#title-a", { type: "chars" });
const splitb = new SplitText("#title-aa", { type: "chars" });

const tl = gsap.timeline({
  paused: true,
  onComplete: () => isComplete = true,
});

tl.fromTo(
  split.chars,
  { y: 0 },
  { y: -100, duration: 0.5, stagger: 0.05 }
);

tl.fromTo(
  splitb.chars,
  { y: 8 },
  { y: -100, duration: 0.5, stagger: 0.05 },
  "<"
);

const cardHeading = document.querySelector("#card1");
cardHeading.addEventListener("mouseenter", () => {
  if (!isComplete) return;
  isComplete = false;
  tl.restart();
});

const split2 = new SplitText("#title-b", { type: "chars" });
const splitb2 = new SplitText("#title-bb", { type: "chars" });
const tl2 = gsap.timeline({
  paused: true,
  onComplete: () => isComplete = true,
});

tl2.fromTo(
  split2.chars,
  { y: 0 },
  { y: -100, duration: 0.5, stagger: 0.05 }
);

tl2.fromTo(
  splitb2.chars,
  { y: 8 },
  { y: -100, duration: 0.5, stagger: 0.05 },
  "<"
);

const cardHeading2 = document.querySelector("#card2");
cardHeading2.addEventListener("mouseenter", () => {
  if (!isComplete) return;
  isComplete = false;
  tl2.restart();
});

const split3 = new SplitText("#title-c", { type: "chars" });
const splitb3 = new SplitText("#title-cc", { type: "chars" });
const tl3 = gsap.timeline({
  paused: true,
  onComplete: () => isComplete = true,
});

tl3.fromTo(
  split3.chars,
  { y: 0 },
  { y: -100, duration: 0.5, stagger: 0.05 }
);

tl3.fromTo(
  splitb3.chars,
  { y: 8 },
  { y: -100, duration: 0.5, stagger: 0.05 },
  "<"
);

const cardHeading3 = document.querySelector("#card3");
cardHeading3.addEventListener("mouseenter", () => {
  if (!isComplete) return;
  isComplete = false;
  tl3.restart();
});

const split4 = new SplitText("#title-d", { type: "chars" });
const splitb4 = new SplitText("#title-dd", { type: "chars" });
const tl4 = gsap.timeline({
  paused: true,
  onComplete: () => isComplete = true,
});

tl4.fromTo(
  split4.chars,
  { y: 0 },
  { y: -100, duration: 0.5, stagger: 0.05 }
);

tl4.fromTo(
  splitb4.chars,
  { y: 8 },
  { y: -100, duration: 0.5, stagger: 0.05 },
  "<"
);

const cardHeading4 = document.querySelector("#card4");
cardHeading4.addEventListener("mouseenter", () => {
  if (!isComplete) return;
  isComplete = false;
  tl4.restart();
});





/*-----===== PARTNER LOVE SECTION REVIEW CARD MOUSE SLIDE ANIMATION =====-----*/
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".reviewCard");
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast factor
    slider.scrollLeft = scrollLeft - walk;
  });
});



/*-----===== PINTEXT SCROLL ANIMATION =====-----*/

gsap.registerPlugin(ScrollTrigger);

const leftImgs = document.querySelectorAll(".leftSideImg div");
const rightImgs = document.querySelectorAll(".rightSideImg div");

// Animate Left Side Images
leftImgs.forEach((img) => {
  gsap.fromTo(
    img,
    {
      x: 0,
      rotate: 0,
      opacity: 1,
    },
    {
      x: -400,
      rotate: -10,
      opacity: 1,
      scrollTrigger: {
        trigger: img,
        scroller: "[data-scroll-container]",
        start: "top 90%",
        end: "top 60%",
        scrub: 4,
      },
    }
  );
});

// Animate Right Side Images
rightImgs.forEach((img) => {
  gsap.fromTo(
    img,
    {
      x: 0,
      rotate: 0,
      opacity: 1,
    },
    {
      x: 400,
      rotate: 10,
      opacity: 1,
      scrollTrigger: {
        trigger: img,
        scroller: "[data-scroll-container]",
        start: "top 90%",
        end: "top 60%",
        scrub: 4,
      },
    }
  );
});
