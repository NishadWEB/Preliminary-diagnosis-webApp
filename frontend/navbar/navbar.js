 //nav bar scirt
 const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1185) {
      if (!e.target.closest('nav')) {
        navLinks.classList.remove('show');
        hamburger.classList.remove('active');
      }
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1185) {
        navLinks.classList.remove('show');
        hamburger.classList.remove('active');
      }
    });
  });