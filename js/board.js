if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; 
}

async function renderBoard(){
    await init();
}