export function handleFileUpload(event) {

  return new Promise((resolve, reject) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const text = e.target.result;
        const jsonObject = csvToJson(text);
        resolve(jsonObject);
      };
  
      reader.readAsText(file);
    }
    else {
      reject('No file selected');
    }
  })

}

export function csvToJson(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());

  const jsonData = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    const values = line.split(',');
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j].trim();
    }

    jsonData.push(obj);
  }

  return jsonData;
}


export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}