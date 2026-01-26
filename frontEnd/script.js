const textInput = document.getElementById('textInput');
const suggestionsDiv = document.getElementById('suggestions');
const binGroupDiv = document.getElementById('binGroup');
const binImageDiv = document.getElementById('binImage');
const sendBtn = document.getElementById('sendBtn');


textInput.addEventListener('input', async () => {
  const query = textInput.value.trim();
  suggestionsDiv.innerHTML = '';
  binGroupDiv.innerHTML = '';
  binImageDiv.innerHTML = '';

  if (!query) return;

  try {
    const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
    const suggestions = await res.json();

    suggestions.forEach(suggestion => {
      const div = document.createElement('div');
      div.classList.add('suggestion');
      div.textContent = suggestion.address;

    
      div.addEventListener('click', () => {
        textInput.value = suggestion.address;

        const month = getCurrentMonth();
        binGroupDiv.textContent = `Bin Group: ${suggestion.binGroup} (${month})`;

    
        binImageDiv.innerHTML = '';
        const img = document.createElement('img');
        img.src = getBinImagePath(suggestion.binGroup);
        img.alt = `Group ${suggestion.binGroup} - ${month}`;
        img.classList.add('binImage');

        img.onerror = () => {
          console.error('Image not found:', img.src);
          img.src = '/images/fallback.png';
        };

        binImageDiv.appendChild(img);
        suggestionsDiv.innerHTML = '';
      });

      suggestionsDiv.appendChild(div);
    });

  } catch (err) {
    console.error('Error fetching suggestions:', err);
  }
});

div.addEventListener('click', () => {
  textInput.value = suggestion.address;
  const month = getCurrentMonth();
  binGroupDiv.textContent = `Bin Group: ${suggestion.binGroup} (${month})`;


  binImageDiv.innerHTML = '';

  const img = document.createElement('img');
  img.src = getBinImagePath(suggestion.binGroup);
  img.alt = `Group ${suggestion.binGroup} - ${month}`;
  img.classList.add('binImage');


  img.onerror = () => {
    console.error('Image not found:', img.src);
    img.src = '/images/fallback.png';
  };

  binImageDiv.appendChild(img);
});



function getCurrentMonth() {
  const month = new Date().toLocaleString('default', { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1); // e.g., "March"
}


function getBinImagePath(binGroup) {
  const month = getCurrentMonth();
  const folder = binGroup === '1' || binGroup === 1
    ? 'group1Cal'
    : 'group2Cal';

  
  return `/images/${folder}/${month}.jpg`;
}


