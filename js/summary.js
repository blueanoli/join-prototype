if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; 
}

function dashboardGreeting() {
    let now = new Date();
    let hour = now.getHours();
    let greeting, userName; 

    userName = "<span class='greetingUserName'>Team 122</span>";     

    if (hour < 12) {
        greeting = "<span class='greetingTime'>Good morning,</span><br>";
    } else if (hour < 18) {
        greeting = "<span class='greetingTime'>Good afternoon,</span><br>";
    } else {
        greeting = "<span class='greetingTime'>Good evening,</span><br>";
    }

    document.getElementById('greeting').innerHTML = greeting + " " + userName;
}

dashboardGreeting();