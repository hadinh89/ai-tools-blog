/*
 * Home page script extracted from main.js.  This file contains only the
 * functions necessary to render the home page sections (top trending,
 * goal grid, quick compare and guide posts) as well as a few shared
 * helper functions.  It is significantly smaller than the original
 * monolithic main.js which appears to be blocked by certain browsers
 * when loaded from the file:// protocol.  By splitting the code into
 * smaller modules, the scripts run correctly when loaded locally.
 */

// Retrieve the tools array from the global window (populated by data.js)
let tools = (typeof window !== 'undefined' && window.tools) ? window.tools : [];

// Note: Do not redeclare `tools` globally here.  The dataset script
// (data.js) attaches its array to `window.tools` and no longer declares
// a global constant.  We simply copy it into a local variable for
// convenience.  If the dataset hasn't loaded yet, this will be an
// empty array.
tools = (typeof window !== 'undefined' && window.tools) ? window.tools : [];

/* ------------------------------------------------------------------
 * Helper functions
 * These utilities are shared across pages.  Only the functions
 * required by the home page are included here.  If you need other
 * utilities, consider creating additional modules.
 */

// Create star rating HTML based on numeric rating (max 5)
function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('<i class="fa fa-star"></i>');
    } else if (rating >= i - 0.5) {
      stars.push('<i class="fa fa-star-half-alt"></i>');
    } else {
      stars.push('<i class="fa fa-star" style="color:var(--border-color);"></i>');
    }
  }
  return stars.join('');
}

// Map categories to Font Awesome icons (thin line style)
const categoryIconMap = {
  'Viết nội dung': 'fa-pen-nib',
  'Video/Animation': 'fa-film',
  'Ảnh/Design': 'fa-image',
  'Âm thanh/Giọng nói': 'fa-headphones',
  'Lập trình/Copilot': 'fa-code',
  'Data/Analytics': 'fa-chart-bar',
  'Tự động hóa Workflow': 'fa-robot',
  'SEO/Marketing': 'fa-bullhorn',
  'Slides/Tài liệu': 'fa-file-powerpoint',
  'Học tập/Nghiên cứu': 'fa-book-open',
  'Chatbot/Agent': 'fa-comments',
  'Công cụ miễn phí': 'fa-gift',
  'Đa phương thức': 'fa-layer-group'
};

// Generate badge HTML based on price model and trial availability
function getBadgeHTML(tool) {
  let label = '';
  let className = 'badge';
  switch (tool.price_model) {
    case 'Freemium':
      label = 'Freemium';
      break;
    case 'Paid':
      label = 'Trả phí';
      break;
    default:
      label = tool.price_model || '';
  }
  if (tool.trial) {
    label += ' / Trial';
  }
  return `<span class="${className}">${label}</span>`;
}

// Build an affiliate link with simple UTM tracking parameters
function buildAffiliateLink(url, source = 'aitoolshub', medium = 'affiliate', campaign = 'ref') {
  if (!url) return '#';
  const hasParams = url.includes('?');
  const delimiter = hasParams ? '&' : '?';
  return `${url}${delimiter}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
}

/* ------------------------------------------------------------------
 * Home page rendering
 */

function renderTopTrending() {
  const grid = document.getElementById('trendingGrid');
  if (!grid || !Array.isArray(tools)) return;
  // Sort by rating descending and pick top 8 tools
  const topTools = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 8);
  grid.innerHTML = '';
  topTools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div class="logo"><i class="fa ${categoryIconMap[tool.category[0]] || 'fa-rocket'}"></i></div>
      <div class="tool-name">${tool.name}</div>
      <div class="tool-desc">${tool.short_desc}</div>
      <div class="stars">${renderStars(tool.rating)}</div>
      <div>${getBadgeHTML(tool)}</div>
      <div class="card-actions">
        <a href="tool.html?slug=${tool.slug}" class="btn btn-secondary">Xem chi tiết</a>
        <a href="${buildAffiliateLink(tool.affiliate_url, 'homepage')}" class="btn btn-primary" target="_blank" rel="noopener">Dùng thử</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderGoalGrid() {
  const grid = document.getElementById('goalGrid');
  if (!grid) return;
  const goals = [
    'Viết nội dung', 'Video/Animation', 'Ảnh/Design', 'Âm thanh/Giọng nói', 'Lập trình/Copilot',
    'Data/Analytics', 'Tự động hóa Workflow', 'SEO/Marketing', 'Slides/Tài liệu',
    'Học tập/Nghiên cứu', 'Chatbot/Agent', 'Công cụ miễn phí'
  ];
  grid.innerHTML = '';
  goals.forEach(goal => {
    const item = document.createElement('div');
    item.className = 'category-item';
    item.innerHTML = `
      <i class="fa ${categoryIconMap[goal] || 'fa-circle'}"></i>
      <span>${goal}</span>
    `;
    // Navigate to categories page with selected goal as query param
    item.addEventListener('click', () => {
      window.location.href = `categories.html?category=${encodeURIComponent(goal)}`;
    });
    grid.appendChild(item);
  });
}

function renderQuickCompare() {
  const table = document.getElementById('quickCompareTable');
  if (!table || !Array.isArray(tools)) return;
  // Pick four tools to show; choose by rating or first items
  const selected = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 4);
  // Build the header row
  let html = '<tr><th>Tiêu chí</th>';
  selected.forEach(tool => {
    html += `<th>${tool.name}</th>`;
  });
  html += '</tr>';
  // Define criteria and property keys on the tool objects
  const criteria = [
    { label: 'Chất lượng đầu ra', key: 'output_quality' },
    { label: 'Tốc độ', key: 'speed' },
    { label: 'Dễ sử dụng', key: 'ease_of_use' },
    { label: 'Giá trị/giá', key: 'price_value' }
  ];
  criteria.forEach(row => {
    html += `<tr><td>${row.label}</td>`;
    selected.forEach(tool => {
      html += `<td>${tool[row.key] || '-'}</td>`;
    });
    html += '</tr>';
  });
  table.innerHTML = html;
}

function renderGuidePosts() {
  const container = document.getElementById('guidePosts');
  if (!container) return;
  // Define simple guide posts manually.  These link to the blog posts
  const guides = [
    {
      title: 'Cách chọn công cụ AI phù hợp',
      desc: 'Những bước cơ bản để chọn công cụ AI đúng nhu cầu và ngân sách.',
      url: 'blog/chon-cong-cu-ai.html'
    },
    {
      title: 'So sánh công cụ video AI',
      desc: 'Đánh giá 5 công cụ video AI phổ biến nhất hiện nay.',
      url: 'blog/review-video-ai.html'
    },
    {
      title: 'Mẹo tối ưu nội dung với AI',
      desc: 'Hướng dẫn sử dụng AI hiệu quả để tạo nội dung hấp dẫn.',
      url: 'blog/tips-toi-uu.html'
    }
  ];
  container.innerHTML = '';
  guides.forEach(post => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <h3 class="blog-card-title"><a href="${post.url}">${post.title}</a></h3>
      <p class="blog-card-desc">${post.desc}</p>
      <a href="${post.url}" class="btn btn-secondary" style="margin-top:0.5rem;">Đọc tiếp</a>
    `;
    container.appendChild(card);
  });
}

// Attach a debug indicator to verify that this script executed.  This will
// display a small label in the bottom-right corner with the number of tools.
function addDebugIndicator() {
  try {
    const indicator = document.createElement('div');
    indicator.innerText = 'JS loaded';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '4px';
    indicator.style.right = '4px';
    indicator.style.backgroundColor = 'red';
    indicator.style.color = 'white';
    indicator.style.padding = '2px 6px';
    indicator.style.fontSize = '10px';
    indicator.style.zIndex = '9999';
    const countDiv = document.createElement('div');
    countDiv.style.position = 'fixed';
    countDiv.style.bottom = '20px';
    countDiv.style.right = '4px';
    countDiv.style.backgroundColor = 'orange';
    countDiv.style.color = 'black';
    countDiv.style.padding = '2px 6px';
    countDiv.style.fontSize = '10px';
    countDiv.style.zIndex = '9998';
    const count = Array.isArray(tools) ? tools.length : 'undefined';
    countDiv.innerText = 'Tools: ' + count;
    document.body.appendChild(indicator);
    document.body.appendChild(countDiv);
  } catch (err) {
    // ignore
  }
}

// Initialise the home page once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Render sections
  renderTopTrending();
  renderGoalGrid();
  renderQuickCompare();
  renderGuidePosts();
  // Debug indicator has been removed for production.  If needed for
  // troubleshooting, uncomment the next line to display a marker:
  // addDebugIndicator();
});

// Handle the search form on the hero section.  When the form is submitted
// we redirect to the categories page with the search query encoded in
// the URL.  Returning false prevents the default form submission.
function goToSearch(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('heroSearch');
  if (!input) return false;
  const query = input.value.trim();
  if (query) {
    window.location.href = `categories.html?search=${encodeURIComponent(query)}`;
  }
  return false;
}