document.addEventListener("DOMContentLoaded", () => {
  fetchPrayerTimes();
});

// 🕌 Fetch prayer times based on user location
function fetchPrayerTimes() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const apiURL = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`;

        fetch(apiURL)
          .then(response => response.json())
          .then(data => {
            const timings = data.data.timings;
            const prayerDisplay = document.getElementById("prayer-times-display");

            prayerDisplay.innerHTML = `
              <ul>
                <li><strong>Fajr:</strong> ${timings.Fajr}</li>
                <li><strong>Dhuhr:</strong> ${timings.Dhuhr}</li>
                <li><strong>Asr:</strong> ${timings.Asr}</li>
                <li><strong>Maghrib:</strong> ${timings.Maghrib}</li>
                <li><strong>Isha:</strong> ${timings.Isha}</li>
              </ul>
            `;
          })
          .catch(error => {
            console.error("Error fetching prayer times:", error);
            document.getElementById("prayer-times-display").textContent = "Unable to fetch prayer times.";
          });
      },
      error => {
        document.getElementById("prayer-times-display").textContent =
          "Location access denied. Cannot load prayer times.";
      }
    );
  } else {
    document.getElementById("prayer-times-display").textContent =
      "Geolocation not supported in your browser.";
  }
}
// Add ripple effect to buttons and links
document.querySelectorAll('button, a').forEach(el => {
  el.classList.add('ripple-effect');
  el.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    circle.classList.add('ripple');

    const rect = el.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;

    this.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  });
});
// Ramadan floating icons effect
function createFloatingIcons() {
  const container = document.createElement('div');
  container.classList.add('ramadan-floating');
  document.body.appendChild(container);

  const icons = ['🌙', '⭐️', '✨'];
  
  for (let i = 0; i < 25; i++) {
    const icon = document.createElement('div');
    icon.classList.add('floating-icon');
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
    
    icon.style.left = `${Math.random() * 100}%`;
    icon.style.animationDuration = `${8 + Math.random() * 5}s`;
    icon.style.fontSize = `${14 + Math.random() * 20}px`;
    icon.style.top = `${Math.random() * 100}vh`;

    container.appendChild(icon);
  }
}

createFloatingIcons();
function createFloatingVerse() {
  const verse = document.createElement('div');
  verse.classList.add('floating-verse');
  verse.innerText = "Indeed, in the remembrance of Allah do hearts find rest. (13:28)";
  document.body.appendChild(verse);

  setTimeout(() => verse.remove(), 15000); // Remove after animation
}

// call periodically
setInterval(createFloatingVerse, 20000);
async function fetchPrayerTimesAndStartCountdown() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const timings = data.data.timings;

      const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const now = new Date();
      let nextPrayer = null;
      let nextPrayerTime = null;

      for (let name of prayerOrder) {
        const timeStr = timings[name];
        const [hour, minute] = timeStr.split(":");
        const prayerTime = new Date(now);
        prayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

        if (prayerTime > now) {
          nextPrayer = name;
          nextPrayerTime = prayerTime;
          break;
        }
      }

      // If all today's prayers are over, next is Fajr of tomorrow
      if (!nextPrayer) {
        nextPrayer = "Fajr";
        nextPrayerTime = new Date(now);
        nextPrayerTime.setDate(now.getDate() + 1);
        const [hour, minute] = timings["Fajr"].split(":");
        nextPrayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
      }

      document.getElementById("nextPrayerName").textContent = nextPrayer;

      // Countdown Timer
      setInterval(() => {
        const now = new Date();
        const diff = nextPrayerTime - now;
        if (diff <= 0) return;

        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

        document.getElementById("countdown").textContent = `${hours}:${minutes}:${seconds}`;
      }, 1000);

    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  });
}

fetchPrayerTimesAndStartCountdown();
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (e) => {
    const icon = document.createElement('div');
    icon.classList.add('floating-icon');

    // Randomly choose crescent or star
    const symbols = ['🌙', '⭐️'];
    icon.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    // Position at cursor
    icon.style.left = `${e.clientX}px`;
    icon.style.top = `${e.clientY}px`;

    document.body.appendChild(icon);

    // Remove after animation
    setTimeout(() => {
      icon.remove();
    }, 1000);
  });
});
// Highlight active page
const path = window.location.pathname;

if (path.includes('index.html') || path === '/' || path === '/NoorTime/') {
  document.getElementById('home-btn')?.classList.add('active');
} else if (path.includes('duas.html')) {
  document.getElementById('duas-btn')?.classList.add('active');
} else if (path.includes('articles.html')) {
  document.getElementById('articles-btn')?.classList.add('active');
}
// Search for Duas
const searchDuas = document.getElementById('search-duas');
if (searchDuas) {
  searchDuas.addEventListener('input', function () {
    const filter = searchDuas.value.toLowerCase();
    const duas = document.querySelectorAll('.dua-item');

    duas.forEach(dua => {
      const text = dua.textContent.toLowerCase();
      dua.style.display = text.includes(filter) ? 'block' : 'none';
    });
  });
}

// Article Search Functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-articles");
  const articleSections = document.querySelectorAll(".article-list section");

  searchInput?.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    articleSections.forEach(section => {
      const text = section.textContent.toLowerCase();
      section.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const countDisplay = document.getElementById("tasbeeh-count");
  const incrementBtn = document.getElementById("increment-btn");
  const resetBtn = document.getElementById("reset-btn");

  let count = 0;

  incrementBtn.addEventListener("click", () => {
    count++;
    countDisplay.textContent = count;
  });

  resetBtn.addEventListener("click", () => {
    count = 0;
    countDisplay.textContent = count;
  });
});
// scripts/main.js or at the end of existing script
const ayahs = [
  {
    text: "Indeed, Allah is with those who fear Him and those who are doers of good.",
    reference: "Surah An-Nahl (16:128)"
  },
  {
    text: "And whoever puts their trust in Allah – then He alone is sufficient for them.",
    reference: "Surah At-Talaq (65:3)"
  },
  {
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    reference: "Surah Ar-Ra’d (13:28)"
  },
  {
    text: "So remember Me; I will remember you.",
    reference: "Surah Al-Baqarah (2:152)"
  },
  {
    text: "And He found you lost and guided [you].",
    reference: "Surah Ad-Duhaa (93:7)"
  }
  
];

// Display random Ayah
function displayRandomAyah() {
  const randomIndex = Math.floor(Math.random() * ayahs.length);
  const ayah = ayahs[randomIndex];
  document.getElementById('ayah-text').textContent = `"${ayah.text}"`;
  document.getElementById('ayah-ref').textContent = ayah.reference;
}

// Trigger on load
document.addEventListener("DOMContentLoaded", displayRandomAyah);
const extraDuas = [
  "اللهم اجعلني من التوابين واجعلني من المتطهرين",
  "اللهم ثبتني عند السؤال",
  "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
  "يا مقلب القلوب ثبت قلبي على دينك",
  "اللهم إنك عفو تحب العفو فاعف عني"
];

function generateRandomDua() {
  const index = Math.floor(Math.random() * extraDuas.length);
  document.getElementById('random-dua').textContent = extraDuas[index];
}

