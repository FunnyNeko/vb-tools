// CBETA法語小卡腳本
const generateBtn = document.getElementById('generateBtn');
const canvas = document.getElementById('quoteCanvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('downloadLink');

// 直接在前端內建法語內容，不需後端
const jingList = [
  "水滴雖微  漸盈大器  凡福充滿  從纖纖積 —— CBETA 2024.R2, T04, no. 210, p. 565a5-6",
  "《大方廣佛華嚴經》卷6〈7 淨行品〉：「諷誦經典，當願眾生，得總持門，攝一切法。」(CBETA 2024.R2, T09, no. 278, p. 432b26-27)",
  "《別譯雜阿含經》卷4：「譬如蓮華新敷榮，光映泉池香遍至，佛亦如日處虛空，光明周普照世界。」(CBETA 2024.R2, T02, no. 100, p. 399c20-21)",
  "《別譯雜阿含經》卷3：「譬如豐資糧，安樂越險道，修福者亦爾，安隱至善處。」(CBETA 2024.R2, T02, no. 100, p. 394c15-16)",
  "《大寶積經》卷50〈11 般若波羅蜜多品〉：「多聞解了法，多聞不造惡，多聞捨無義，多聞得涅槃。」(CBETA 2024.R2, T11, no. 310, p. 296c23-24)",
  "《佛所行讚》卷5〈23 神力住壽品〉：「如來善方便，隨病而略說，譬如世良醫，隨病而投藥。」(CBETA 2024.R2, T04, no. 192, p. 43b27-28)",
  "《大般涅槃經》卷2：「布施者獲福，  慈心者無怨， 為善者消惡，  離欲者無惱。」(CBETA 2024.R2, T01, no. 7, p. 198c27-28)",
  "《頂生王因緣經》卷6：「此世及於他世中，由脩福故生歡喜。」(CBETA 2024.R2, T03, no. 165, p. 405c7)",
  "《四分律》卷31：「所為布施者，必獲其利義；若為樂故施，後必得安樂。」(CBETA 2024.R2, T22, no. 1428, p. 782a8-9)",
  "《金剛三昧經》卷1〈1 序品〉：「一味之法潤，普充於一切，如彼一雨潤，皆長菩提[7]芽。」(CBETA 2024.R2, T09, no. 273, p. 366a26-27)[7] 芽【大】，牙【宋】【宮】　"
];
drawRandomCard();

function randomPastelColor() {
  // 生成一個隨機淡色
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 70%, 90%)`;
  return pastel;
}

function drawGradientBackground(ctx, width, height) {
  // 兩個隨機淡色
  const color1 = randomPastelColor();
  const color2 = randomPastelColor();
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}


function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n];
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  // 如果 x, y 為 -9999，僅計算不繪製
  if (!(x === -9999 && y === -9999)) {
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineHeight);
    }
  }
  return lines.length;
}

function drawCard(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGradientBackground(ctx, canvas.width, canvas.height);

  // 內容字體
  ctx.font = 'bold 44px Noto Serif TC, PingFang TC, 微軟正黑體, serif';
  ctx.fillStyle = '#6b4f4f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // padding 40px
  const padding = 40;
  const maxTextWidth = canvas.width - padding * 2;
  const lineHeight = 64;

  ctx.globalAlpha = 1;
  ctx.shadowColor = 'rgba(200,200,200,0.2)';
  ctx.shadowBlur = 5;

  // 每一行 jing.txt 就是一張卡片，內容自動換行
  const line = text.trim();
  const fontSize = 44;
  ctx.font = `bold ${fontSize}px Noto Serif TC, PingFang TC, 微軟正黑體, serif`;
  const maxWidth = canvas.width - 80;
  let current = '';
  let lines = [];
  for (let i = 0; i < line.length; i++) {
    const test = current + line[i];
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = line[i];
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  // 垂直置中
  const cardLineHeight = 64;
  const totalHeight = lines.length * cardLineHeight;
  let y = (canvas.height - totalHeight) / 2 + cardLineHeight / 2;
  for (let l of lines) {
    ctx.fillText(l, canvas.width / 2, y);
    y += cardLineHeight;
  }


  // 標題
  ctx.font = '28px Noto Serif TC, PingFang TC, 微軟正黑體, serif';
  ctx.globalAlpha = 0.7;
  ctx.shadowBlur = 0;
  ctx.fillText('CBETA', canvas.width / 2, 80);
}

function drawRandomCard() {
  if (jingList.length === 0) return;
  const idx = Math.floor(Math.random() * jingList.length);
  drawCard(jingList[idx]);
}


generateBtn.addEventListener('click', () => {
  drawRandomCard();
  // 顯示下載連結
  const dataURL = canvas.toDataURL('image/png');
  downloadLink.href = dataURL;
  downloadLink.download = 'cbeta-card.png';
  downloadLink.style.display = 'inline';
  downloadLink.textContent = '下載圖片';
});

// 預設畫面
window.onload = () => {
  if (jingList.length > 0) {
    drawRandomCard();
  }
};
