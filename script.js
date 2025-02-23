// Auto-play videos on hover
document.querySelectorAll('.video-hover').forEach(video => {
  video.addEventListener('mouseover', () => video.play());
  video.addEventListener('mouseout', () => {
    video.pause();
    if (video.currentTime < 90) video.currentTime = 0;
  });
});

// Get DOM elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector('.container');

// Toggle between Sign In and Sign Up panels
signUpButton?.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton?.addEventListener('click', () => container.classList.remove('right-panel-active'));

// Sign Up functionality
document.getElementById('signUpForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!username || !email || !password) {
        alert('Please fill all the fields!');
        return;
    }

    if (sessionStorage.getItem(email)) {
        alert('User already exists. Please sign in.');
        container.classList.remove('right-panel-active');
        return;
    }

    sessionStorage.setItem(email, JSON.stringify({ username, email, password }));
    alert('Sign up successful! Please sign in.');
    container.classList.remove('right-panel-active');
});

// Sign In functionality
document.getElementById('signInForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value.trim();

    if (!email || !password) {
        alert('Please enter both email and password!');
        return;
    }

    const storedUser = sessionStorage.getItem(email);
    if (!storedUser) {
        alert('No user found. Please sign up first.');
        container.classList.add('right-panel-active');
        return;
    }

    const user = JSON.parse(storedUser);
    if (password === user.password) {
        alert(`Welcome, ${user.username}!`);
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = 'main.html';
    } else {
        alert('Incorrect email or password!');
    }
});

// Dark Mode Toggle Function
function toggleDarkMode() {
    const darkModeEnabled = document.getElementById("darkmode-toggle").checked;
    
    if (darkModeEnabled) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
    
    // Save the state in localStorage
    localStorage.setItem("darkMode", darkModeEnabled);
}

// Apply dark mode state on page load
document.addEventListener("DOMContentLoaded", () => {
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    
    const darkModeToggle = document.getElementById("darkmode-toggle");
    
    if (darkModeToggle) {
        darkModeToggle.checked = darkModeEnabled;
        if (darkModeEnabled) {
            document.body.classList.add("dark-mode");
        }
    }
});

// Attach event listener to the checkbox
document.getElementById("darkmode-toggle")?.addEventListener("change", toggleDarkMode);



const scrollContainer = document.getElementById("scrollContainer");
const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");

let isDragging = false;
let startX, scrollLeft;


//horizontal scroll functionality
function setupScrollButtons(containerId, leftButtonId, rightButtonId) {
    const scrollContainer = document.getElementById(containerId);
    const scrollLeft = document.getElementById(leftButtonId);
    const scrollRight = document.getElementById(rightButtonId);

    if (!scrollContainer || !scrollLeft || !scrollRight) return;

    function updateButtons() {
        scrollLeft.classList.toggle("hidden", scrollContainer.scrollLeft <= 0);
        scrollRight.classList.toggle(
            "hidden",
            scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth
        );
    }

    // Scroll event to track position
    scrollContainer.addEventListener("scroll", updateButtons);

    scrollLeft.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -400/*Change this to determine how much is scrolled*/, behavior: "smooth" });
    });
    scrollRight.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 400/*Change this to determine how much is scrolled*/, behavior: "smooth" });
    });

    // Drag scrolling functionality
    let isDown = false;
    let startX;
    let scrollLeftStart;

    scrollContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        scrollContainer.classList.add("dragging");
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeftStart = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener("mouseleave", () => {
        isDown = false;
        scrollContainer.classList.remove("dragging");
    });

    scrollContainer.addEventListener("mouseup", () => {
        isDown = false;
        scrollContainer.classList.remove("dragging");
    });

    scrollContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 20; // Change this to determine the speed to animation of scrolling 
        scrollContainer.scrollLeft = scrollLeftStart - walk;
    });

    // Initial check
    updateButtons();
}

// Initialize scrolling for all sections
setupScrollButtons("scrollContainer", "scrollLeft", "scrollRight");
setupScrollButtons("scrollContainer1", "scrollLeft1", "scrollRight1");
setupScrollButtons("scrollContainer2", "scrollLeft2", "scrollRight2");
setupScrollButtons("scrollContainer3", "scrollLeft3", "scrollRight3");
setupScrollButtons("scrollContainer4", "scrollLeft4", "scrollRight4");
setupScrollButtons("scrollContainer5", "scrollLeft5", "scrollRight5");








// for song functionality 
document.addEventListener("DOMContentLoaded", function () {
    let currentPlayingAudio = null; 
    let currentSoundWave = null; 
    let currentItem = null; 

    const items = document.querySelectorAll(".item"); 

    items.forEach((item) => {
        const soundWave = document.createElement("div");
        soundWave.classList.add("sound-wave");
        item.appendChild(soundWave);

        const audio = item.querySelector("audio"); 

        // Generate bars dynamically
        for (let i = 0; i < 25; i++) 
        {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${Math.random() * 50 + 20}%`;
        bar.style.width = "3px";
        bar.style.left = `${(i + 1) * 9}px`; // Position bars inside the image
        bar.style.animationDelay = `${Math.random() * 1.5}s`;
        soundWave.appendChild(bar);
        }


        // Function to stop the previous song's animation
        function stopPreviousAnimation() 
        {
        if (currentPlayingAudio && currentPlayingAudio !== audio) 
        {
            currentPlayingAudio.pause();
            if(currentPlayingAudio.currentTime<30)
            currentPlayingAudio.currentTime = 0; // Reset audio
        }

        if (currentSoundWave) 
        {
            currentSoundWave.style.opacity = 0; 
        }

        if (currentItem) 
        {
            currentItem.classList.remove("glow-effect"); 
        }
        removeRipple();
        }
    
        // Create Ripple Effect
        function createRipple() 
        {
            let ripple = document.createElement("div");
            ripple.classList.add("ripple");
            item.appendChild(ripple);
        }
        // Rmove Ripple Effect
        function removeRipple() 
        {
            let ripple = document.querySelector(".ripple");
            if (ripple) {
            ripple.remove();
            }
        }

        // Play/Pause Animation Toggle
        item.addEventListener("click", () => 
        {
        if (audio === currentPlayingAudio) 
        {
            if (audio.paused) {
                audio.play();
                soundWave.style.opacity = 1;
                item.classList.add("glow-effect");
                createRipple();
            } else {
                audio.pause();
                soundWave.style.opacity = 0;
                item.classList.remove("glow-effect");
                removeRipple();
            }
        } 
        else 
        {
            
            stopPreviousAnimation();

            audio.play();
            soundWave.style.opacity = 1;
            item.classList.add("glow-effect");
            
            currentPlayingAudio = audio;
            currentSoundWave = soundWave;
            currentItem = item;
            
            createRipple();
        }
        });

        // Stop animation when audio ends
        audio.addEventListener("ended", () => 
        {
        soundWave.style.opacity = 0;
        item.classList.remove("glow-effect");
        removeRipple();
        if (currentPlayingAudio === audio) 
        {
            currentPlayingAudio = null;
            currentSoundWave = null;
            currentItem = null;
        }
        });
    });
});


        //for dark mode button functionality 
// function updateToggleSize() {
//     let dmbutton = document.querySelector(".dmbutton");
//     let label = document.querySelector("label[for='darkmode-toggle']");
    
//     if (dmbutton && label) {
//         let width = dmbutton.offsetWidth;
//         let height = dmbutton.offsetHeight;
        
//         // Adjust label size dynamically based on the dmbutton dimensions
//         label.style.width = width + "px";
//         label.style.height = height + "px";
        
//         // Adjust toggle button movement based on new width
//         let toggleWidth = width * 0.25; // Adjust this factor as needed
//         label.style.borderRadius = height / 2 + "px"; // Keep round edges
//         label.style.boxShadow = "inset 0px 5px 15px rgba(0,0,0,0.4), inset 0px -5px 15px rgba(255,255,255,0.4)";
        
//         // Update the toggle ball inside the switch
//         let toggleBall = document.querySelector("label:after");
//         if (toggleBall) {
//             toggleBall.style.width = toggleWidth + "px";
//             toggleBall.style.height = toggleWidth + "px";
//             toggleBall.style.top = (height * 0.1) + "px"; // Center it vertically
//             toggleBall.style.left = (height * 0.1) + "px";
//         }
//     }
// }

// // Run initially and update on window resize
// window.addEventListener("resize", updateToggleSize);
// document.addEventListener("DOMContentLoaded", updateToggleSize);


        document.getElementById

function song(){window.location.href="Songs.html"}
function video(){window.location.href="Videos.html"}
function contact(){window.location.href="Contact.html"}
function main(){window.location.href="main.html"}

