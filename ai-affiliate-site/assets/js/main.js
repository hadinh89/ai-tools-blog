/*
 * Determine the dataset.  When loaded from file:// we inject
 * data.js before this script, which attaches `tools` onto the
 * global window.  We avoid ES module imports entirely here to
 * prevent CORS issues.
 */
let tools = (typeof window !== 'undefined' && window.tools) ? window.tools : [];
// Provide a no-op promise so helper functions waiting on tools can use the same interface
const toolsPromise = Promise.resolve();

// Remove debugging overlays used during development.  You can add your
// own window.onerror handler here if you need to capture runtime errors.

/*
 * Helper functions
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

// Badge color classes based on price model
function getBadgeHTML(tool) {
  let label = '';
  let className = '';
  switch (tool.price_model) {
    case 'Freemium':
      label = 'Freemium';
      className = 'badge';
      break;
    case 'Paid':
      label = 'Trả phí';
      className = 'badge';
      break;
    default:
      label = tool.price_model;
      className = 'badge';
  }
  if (tool.trial) {
    label += ' / Trial';
  }
  return `<span class="${className}">${label}</span>`;
}

// Generate affiliate link with default UTM parameters
function buildAffiliateLink(url, source = 'aitoolshub', medium = 'affiliate', campaign = 'ref') {
  if (!url) return '#';
  const hasParams = url.includes('?');
  const delimiter = hasParams ? '&' : '?';
  return `${url}${delimiter}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
}

/* Home page functions */
function renderTopTrending() {
  // If tools have not loaded yet, delay rendering until they are available
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(renderTopTrending);
    }
    return;
  }
  const grid = document.getElementById('trendingGrid');
  if (!grid) return;
  // Sort by rating descending and pick top 8
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
  // If tools have not loaded yet, delay rendering until data is ready
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(renderGoalGrid);
    }
    return;
  }
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
    item.addEventListener('click', () => {
      window.location.href = `categories.html?category=${encodeURIComponent(goal)}`;
    });
    grid.appendChild(item);
  });
}

function renderQuickCompare() {
  // Ensure tools are loaded. If not, wait and retry.
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(renderQuickCompare);
    }
    return;
  }
  const table = document.getElementById('quickCompareTable');
  if (!table) return;
  // Define 4 tools for quick compare
  const slugs = ['notion-ai', 'capcut-ai', 'canva-magic-studio', 'openai-api'];
  const selected = slugs.map(slug => tools.find(t => t.slug === slug)).filter(Boolean);
  const headers = ['Tiêu chí', ...selected.map(t => t.name)];
  const rows = [];
  // Define criteria and extractor functions
  rows.push(['Giá (USD/tháng)', ...selected.map(t => t.price_from.toString())]);
  rows.push(['Loại', ...selected.map(t => t.type.join(', '))]);
  rows.push(['Đánh giá', ...selected.map(t => renderStars(t.rating))]);
  rows.push(['Tính năng chính', ...selected.map(t => t.features.slice(0, 2).join(', '))]);
  table.innerHTML = '';
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.innerHTML = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.innerHTML = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function renderGuidePosts() {
  const container = document.getElementById('guidePosts');
  if (!container) return;
  container.innerHTML = '';
  // Predefined posts with slug, title, snippet
  const posts = [
    {
      href: 'blog/chon-cong-cu-ai.html',
      title: 'Cách chọn công cụ AI phù hợp cho người mới',
      snippet: 'Hướng dẫn từng bước để bạn xác định nhu cầu và tìm công cụ AI phù hợp.'
    },
    {
      href: 'blog/review-video-ai.html',
      title: 'Review 5 công cụ video AI tốt nhất 2025',
      snippet: 'So sánh nhanh các công cụ video AI giúp bạn lựa chọn dễ dàng.'
    },
    {
      href: 'blog/tips-toi-uu.html',
      title: 'Mẹo tối ưu hóa nội dung bằng AI',
      snippet: 'Một số bí kíp giúp bạn khai thác tối đa sức mạnh của AI để tạo nội dung.'
    }
  ];
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <img src="assets/images/hero.jpg" alt="${post.title}">
      <div class="blog-content">
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-snippet">${post.snippet}</p>
        <a class="read-more" href="${post.href}">Đọc tiếp <i class="fa fa-arrow-right"></i></a>
      </div>
    `;
    container.appendChild(card);
  });
}

/* Categories page functions */
function initCategoriesPage() {
  // Ensure dataset is ready before building filters
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(initCategoriesPage);
    }
    return;
  }
  const filterContainer = document.getElementById('filterContainer');
  const resultsContainer = document.getElementById('toolList');
  const searchInput = document.getElementById('categorySearch');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');
  if (!filterContainer || !resultsContainer) return;
  // Build filter groups
  const groups = [];
  // Nhu cầu categories
  const categories = [
    'Viết nội dung', 'Video/Animation', 'Ảnh/Design', 'Âm thanh/Giọng nói',
    'Lập trình/Copilot', 'Data/Analytics', 'Tự động hóa Workflow', 'SEO/Marketing',
    'Slides/Tài liệu', 'Học tập/Nghiên cứu', 'Chatbot/Agent', 'Đa phương thức', 'Công cụ miễn phí'
  ];
  groups.push({ title: 'Nhu cầu', key: 'category', options: categories });
  // Loại sản phẩm
  const types = Array.from(new Set(tools.flatMap(t => t.type)));
  groups.push({ title: 'Loại sản phẩm', key: 'type', options: types });
  // Giá (price_model)
  const priceModels = Array.from(new Set(tools.map(t => t.price_model)));
  groups.push({ title: 'Loại giá', key: 'price_model', options: priceModels });
  // Mức giá
  const priceRanges = [
    { label: '< $10', value: '<10' },
    { label: '$10–$29', value: '10-29' },
    { label: '$30–$99', value: '30-99' },
    { label: '$100+', value: '100+' }
  ];
  groups.push({ title: 'Mức giá', key: 'price_range', options: priceRanges });
  // Khả năng (tags)
  const abilities = [
    { label: 'Text', value: 'text' },
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Audio', value: 'audio' },
    { label: 'Code', value: 'code' },
    { label: 'Data', value: 'data' },
    { label: 'Automation', value: 'automation' },
    { label: 'Multimodal', value: 'multimodal' }
  ];
  groups.push({ title: 'Khả năng', key: 'ability', options: abilities });
  // Độ dễ dùng
  const skillLevels = ['Người mới', 'Trung cấp', 'Chuyên sâu'];
  groups.push({ title: 'Độ dễ dùng', key: 'skill_level', options: skillLevels });
  // Ưu đãi
  const deals = [
    { label: 'Free trial', value: 'trial' },
    { label: 'Mã giảm giá', value: 'coupons' }
    // Lifetime deal could be added when dataset supports
  ];
  groups.push({ title: 'Ưu đãi', key: 'deals', options: deals });
  // Ngôn ngữ hỗ trợ
  const languages = Array.from(new Set(tools.flatMap(t => t.languages)));
  groups.push({ title: 'Ngôn ngữ hỗ trợ', key: 'language', options: languages });

  // Render filter options
  groups.forEach(group => {
    const div = document.createElement('div');
    div.className = 'filter-group';
    const label = document.createElement('label');
    label.textContent = group.title;
    div.appendChild(label);
    if (group.key === 'price_range' || group.key === 'ability' || group.key === 'deals') {
      group.options.forEach(opt => {
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-option';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = typeof opt === 'string' ? opt : opt.value;
        input.dataset.group = group.key;
        wrapper.appendChild(input);
        const span = document.createElement('span');
        span.textContent = typeof opt === 'string' ? opt : opt.label;
        wrapper.appendChild(span);
        div.appendChild(wrapper);
      });
    } else {
      group.options.forEach(opt => {
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-option';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = opt;
        input.dataset.group = group.key;
        wrapper.appendChild(input);
        const span = document.createElement('span');
        span.textContent = opt;
        wrapper.appendChild(span);
        div.appendChild(wrapper);
      });
    }
    filterContainer.appendChild(div);
  });

  // Parse query params for preselected filters and search
  const params = new URLSearchParams(window.location.search);
  const presetCategory = params.get('category');
  const searchQueryParam = params.get('search');
  if (presetCategory) {
    // check the category checkbox
    const categoryInputs = filterContainer.querySelectorAll('input[data-group="category"]');
    categoryInputs.forEach(input => {
      if (input.value === presetCategory) input.checked = true;
    });
  }
  if (searchQueryParam) {
    searchInput.value = decodeURIComponent(searchQueryParam);
  }

  function applyFilters() {
    let filtered = [...tools];
    // Search filter
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.short_desc.toLowerCase().includes(query) ||
        t.category.some(c => c.toLowerCase().includes(query)) ||
        (t.tags && t.tags.some(tag => tag.includes(query)))
      );
    }
    // Collect selected filters
    const selected = {};
    filterContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
      const group = checkbox.dataset.group;
      if (!selected[group]) selected[group] = [];
      selected[group].push(checkbox.value);
    });
    // Apply category filter
    if (selected.category && selected.category.length) {
      filtered = filtered.filter(t => selected.category.some(cat => t.category.includes(cat)));
    }
    // Type filter
    if (selected.type && selected.type.length) {
      filtered = filtered.filter(t => selected.type.some(tp => t.type.includes(tp)));
    }
    // price_model filter
    if (selected.price_model && selected.price_model.length) {
      filtered = filtered.filter(t => selected.price_model.includes(t.price_model));
    }
    // price_range filter
    if (selected.price_range && selected.price_range.length) {
      filtered = filtered.filter(t => {
        return selected.price_range.some(range => {
          const price = t.price_from || 0;
          switch (range) {
            case '<10':
              return price < 10;
            case '10-29':
              return price >= 10 && price <= 29;
            case '30-99':
              return price >= 30 && price <= 99;
            case '100+':
              return price >= 100;
            default:
              return true;
          }
        });
      });
    }
    // ability filter
    if (selected.ability && selected.ability.length) {
      filtered = filtered.filter(t => selected.ability.some(ab => t.tags && t.tags.includes(ab)));
    }
    // skill_level filter
    if (selected.skill_level && selected.skill_level.length) {
      filtered = filtered.filter(t => selected.skill_level.includes(t.skill_level));
    }
    // deals filter
    if (selected.deals && selected.deals.length) {
      filtered = filtered.filter(t => {
        let keep = true;
        if (selected.deals.includes('trial')) {
          keep = keep && t.trial;
        }
        if (selected.deals.includes('coupons')) {
          keep = keep && t.coupons && t.coupons.length > 0;
        }
        return keep;
      });
    }
    // language filter
    if (selected.language && selected.language.length) {
      filtered = filtered.filter(t => selected.language.some(lang => t.languages.includes(lang)));
    }
    // Sorting
    const sortVal = sortSelect.value;
    if (sortVal === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'priceAsc') {
      filtered.sort((a, b) => (a.price_from || 0) - (b.price_from || 0));
    } else if (sortVal === 'newest') {
      // maintain original order (assuming dataset order is latest first)
    } else {
      // Popular sort by rating for now
      filtered.sort((a, b) => b.rating - a.rating);
    }
    // Render results
    resultsCount.textContent = `${filtered.length} công cụ phù hợp`;
    resultsContainer.innerHTML = '';
    if (filtered.length === 0) {
      resultsContainer.innerHTML = '<p>Không tìm thấy công cụ phù hợp.</p>';
      return;
    }
    filtered.forEach(tool => {
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
          <a href="${buildAffiliateLink(tool.affiliate_url, 'listing')}" class="btn btn-primary" target="_blank" rel="noopener">Đi liên kết</a>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }
  // Attach listeners
  filterContainer.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', () => {
    // Debounce quick filter
    clearTimeout(window._searchDebounce);
    window._searchDebounce = setTimeout(applyFilters, 200);
  });
  sortSelect.addEventListener('change', applyFilters);
  // Initial render
  applyFilters();
}

/* Tool detail page */
function initToolPage() {
  // Wait until dataset is ready
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(initToolPage);
    }
    return;
  }
  const container = document.getElementById('toolDetail');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) {
    container.innerHTML = '<p>Không tìm thấy công cụ.</p>';
    return;
  }
  const tool = tools.find(t => t.slug === slug);
  if (!tool) {
    container.innerHTML = '<p>Không tìm thấy công cụ.</p>';
    return;
  }
  // Update page title
  document.title = `${tool.name} - AI Tools Hub`;
  // Render content
  const headerHTML = `
    <div class="tool-header">
      <div class="tool-logo"><i class="fa ${categoryIconMap[tool.category[0]] || 'fa-rocket'}"></i></div>
      <div class="tool-name">${tool.name}</div>
      ${getBadgeHTML(tool)}
    </div>
    <div class="stars" style="margin-bottom:0.5rem;">${renderStars(tool.rating)}</div>
    <div class="summary">${tool.short_desc}</div>
  `;
  // Pros & cons
  const pros = tool.strengths || [];
  const cons = tool.weaknesses || [];
  const prosConsHTML = `
    <div class="pros-cons">
      <div class="pros">
        <h4>Ưu điểm</h4>
        <ul>${pros.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="cons">
        <h4>Nhược điểm</h4>
        <ul>${cons.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>
  `;
  // Pricing table (simple)
  const pricingHTML = `
    <h4>Bảng giá</h4>
    <table class="pricing-table">
      <thead>
        <tr><th>Gói</th><th>Giá từ (USD/tháng)</th><th>Ghi chú</th></tr>
      </thead>
      <tbody>
        ${tool.price_model === 'Freemium' ? `<tr><td>Free</td><td>0</td><td>Giới hạn tính năng</td></tr>` : ''}
        <tr><td>${tool.price_model === 'Paid' ? 'Pro' : tool.price_model}</td><td>${tool.price_from || 0}</td><td>${tool.price_model === 'Freemium' ? 'Gói nâng cao' : 'Gói trả phí'}</td></tr>
      </tbody>
    </table>
  `;
  // Features list
  const featuresHTML = `
    <h4>Tính năng chính</h4>
    <div class="features-list">
      ${tool.features.map(feat => `<div class="feature"><i class="fa fa-check-circle"></i><div>${feat}</div></div>`).join('')}
    </div>
  `;
  // Scenarios based on categories
  function generateScenarios(tool) {
    const scenarios = [];
    if (tool.category.includes('Viết nội dung')) {
      scenarios.push({ title: 'Viết blog & email', desc: 'Sử dụng để tạo bài blog, email marketing và bản tin.' });
      scenarios.push({ title: 'Tổng hợp tài liệu', desc: 'Tóm tắt và tổ chức tài liệu nghiên cứu, báo cáo.' });
    }
    if (tool.category.includes('Video/Animation')) {
      scenarios.push({ title: 'Tạo video quảng cáo', desc: 'Tạo video ngắn để quảng bá sản phẩm trên mạng xã hội.' });
      scenarios.push({ title: 'Biên tập vlog', desc: 'Dễ dàng chỉnh sửa video vlog cá nhân với hiệu ứng AI.' });
    }
    if (tool.category.includes('Ảnh/Design')) {
      scenarios.push({ title: 'Thiết kế poster', desc: 'Thiết kế poster sự kiện hoặc sản phẩm nhanh chóng.' });
      scenarios.push({ title: 'Minh họa blog', desc: 'Tạo hình minh họa độc đáo cho bài viết.' });
    }
    if (tool.category.includes('Âm thanh/Giọng nói')) {
      scenarios.push({ title: 'Thu âm podcast', desc: 'Tạo giọng nói tự nhiên cho podcast và video.' });
      scenarios.push({ title: 'Thuyết minh video', desc: 'Chuyển văn bản thành giọng thuyết minh chất lượng cao.' });
    }
    if (tool.category.includes('Lập trình/Copilot')) {
      scenarios.push({ title: 'Viết mã', desc: 'Tăng tốc quá trình viết mã và nhận đề xuất thông minh.' });
      scenarios.push({ title: 'Gỡ lỗi', desc: 'Phân tích và giải thích lỗi trong code.' });
    }
    if (tool.category.includes('Tự động hóa Workflow')) {
      scenarios.push({ title: 'Kết nối ứng dụng', desc: 'Tự động hóa quy trình giữa các ứng dụng web phổ biến.' });
      scenarios.push({ title: 'Tối ưu quy trình', desc: 'Giảm thời gian lặp lại bằng các workflow thông minh.' });
    }
    if (tool.category.includes('SEO/Marketing')) {
      scenarios.push({ title: 'Lên kế hoạch nội dung', desc: 'Phân tích từ khóa và lập kế hoạch bài viết.' });
      scenarios.push({ title: 'Tạo nội dung quảng cáo', desc: 'Sinh ra nội dung quảng cáo thu hút khách hàng.' });
    }
    if (scenarios.length === 0) {
      scenarios.push({ title: 'Ứng dụng đa dạng', desc: 'Công cụ này có nhiều ứng dụng tùy vào cách bạn sáng tạo.' });
    }
    return scenarios;
  }
  const scenarios = generateScenarios(tool);
  const scenariosHTML = `
    <h4>Trường hợp sử dụng thực tế</h4>
    <div class="scenarios">
      ${scenarios.map(s => `<div class="scenario"><h5>${s.title}</h5><p>${s.desc}</p></div>`).join('')}
    </div>
  `;
  // Competitor comparison quick
  let competitorHTML = '';
  if (tool.competitors && tool.competitors.length) {
    const comps = tool.competitors.slice(0, 2).map(name => tools.find(t => t.name === name || t.slug === name)).filter(Boolean);
    if (comps.length) {
      competitorHTML += '<h4>So sánh nhanh với đối thủ</h4><table class="compare-table"><thead><tr><th>Tiêu chí</th>';
      competitorHTML += `<th>${tool.name}</th>`;
      comps.forEach(c => {
        competitorHTML += `<th>${c.name}</th>`;
      });
      competitorHTML += '</tr></thead><tbody>';
      const criteria = [
        { name: 'Đánh giá', prop: 'rating' },
        { name: 'Giá từ ($)', prop: 'price_from' },
        { name: 'Độ dễ dùng', prop: 'ease_of_use' }
      ];
      criteria.forEach(cr => {
        competitorHTML += `<tr><td>${cr.name}</td><td>${cr.prop === 'rating' ? renderStars(tool[cr.prop]) : tool[cr.prop]}</td>`;
        comps.forEach(c => {
          const val = cr.prop === 'rating' ? renderStars(c[cr.prop]) : c[cr.prop];
          competitorHTML += `<td>${val}</td>`;
        });
        competitorHTML += '</tr>';
      });
      competitorHTML += '</tbody></table>';
    }
  }
  // FAQs
  const faqItems = [];
  faqItems.push({ q: 'Công cụ này có miễn phí không?', a: tool.price_model === 'Freemium' || tool.price_model === 'Free' ? 'Có phiên bản miễn phí với tính năng giới hạn.' : 'Đây là công cụ trả phí. Bạn cần mua gói để sử dụng.' });
  faqItems.push({ q: 'Công cụ phù hợp với ai?', a: tool.recommended_for || 'Phù hợp cho nhiều đối tượng.' });
  faqItems.push({ q: 'Hỗ trợ tiếng Việt?', a: tool.languages && tool.languages.includes('Vi') ? 'Có hỗ trợ tiếng Việt.' : 'Chưa hỗ trợ tiếng Việt.' });
  faqItems.push({ q: 'Có bản dùng thử không?', a: tool.trial ? 'Có bản dùng thử.' : 'Hiện chưa có bản dùng thử.' });
  faqItems.push({ q: 'Cách hủy đăng ký?', a: 'Bạn có thể hủy trực tiếp trên trang tài khoản của nhà cung cấp.' });
  const faqHTML = `
    <div class="faq">
      <h4>Câu hỏi thường gặp</h4>
      ${faqItems.map(item => `<div class="faq-item"><h5>${item.q}</h5><p>${item.a}</p></div>`).join('')}
    </div>
  `;
  // Compose final content
  container.innerHTML = headerHTML + prosConsHTML + pricingHTML + featuresHTML + scenariosHTML + competitorHTML + faqHTML;
  // Sticky CTA
  const sticky = document.getElementById('stickyCta');
  if (sticky) {
    let ctaText = '';
    if (tool.trial) {
      ctaText = 'Dùng thử miễn phí';
    } else if (tool.price_model === 'Freemium') {
      ctaText = 'Dùng bản miễn phí';
    } else {
      ctaText = 'Nhận ưu đãi hôm nay';
    }
    sticky.innerHTML = `<a href="${buildAffiliateLink(tool.affiliate_url, 'detail')}" class="btn btn-primary">${ctaText}</a>`;
  }
  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: tool.short_desc,
    image: '',
    url: window.location.href,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: tool.price_from || 0,
      availability: 'https://schema.org/InStock',
      url: buildAffiliateLink(tool.affiliate_url, 'schema')
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: Math.round(tool.rating * 20)
    }
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify([schema, faqSchema]);
  document.head.appendChild(script);
}

/* Recommended page */
function initRecommendedPage() {
  // Wait until tools are loaded before rendering picks
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(initRecommendedPage);
    }
    return;
  }
  const beginnerEl = document.getElementById('picks-beginner');
  const creatorEl = document.getElementById('picks-creator');
  const businessEl = document.getElementById('picks-business');
  if (!beginnerEl) return;
  // Define picks
  const picks = {
    beginner: [
      { slug: 'notion-ai', reason: 'Giao diện thân thiện, hỗ trợ viết và tổng hợp tài liệu.' },
      { slug: 'capcut-ai', reason: 'Biên tập video dễ dàng cho người mới.' },
      { slug: 'canva-magic-studio', reason: 'Thiết kế ảnh và slide nhanh chóng.' },
      { slug: 'copy-ai', reason: 'Viết nội dung marketing tiện lợi.' },
      { slug: 'tome', reason: 'Tạo slide tự động cho bài trình bày.' }
    ],
    creator: [
      { slug: 'canva-magic-studio', reason: 'Kho mẫu phong phú và công cụ AI hỗ trợ.' },
      { slug: 'capcut-ai', reason: 'Hiệu ứng video độc đáo cho mạng xã hội.' },
      { slug: 'synthesia', reason: 'Tạo video avatar chuyên nghiệp.' },
      { slug: 'heygen', reason: 'Avatar trẻ trung và tùy chỉnh.' },
      { slug: 'jasper', reason: 'Hỗ trợ viết nội dung dài và tối ưu SEO.' }
    ],
    business: [
      { slug: 'openai-api', reason: 'API mạnh mẽ để xây dựng ứng dụng AI.' },
      { slug: 'claude', reason: 'Chatbot hỗ trợ nghiên cứu hiệu quả.' },
      { slug: 'zapier-ai', reason: 'Tự động hóa workflow giữa các ứng dụng.' },
      { slug: 'replit-ghostwriter', reason: 'Trợ lý lập trình trong IDE.' },
      { slug: 'elevenlabs', reason: 'Giọng nói tự nhiên cho sản phẩm.' }
    ]
  };
  function renderPick(list, container) {
    container.innerHTML = '';
    list.forEach(item => {
      const tool = tools.find(t => t.slug === item.slug);
      if (!tool) return;
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.innerHTML = `
        <div class="logo"><i class="fa ${categoryIconMap[tool.category[0]] || 'fa-rocket'}"></i></div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${item.reason}</div>
        <div class="stars">${renderStars(tool.rating)}</div>
        <div>${getBadgeHTML(tool)}</div>
        <div class="card-actions">
          <a href="tool.html?slug=${tool.slug}" class="btn btn-secondary">Xem chi tiết</a>
          <a href="${buildAffiliateLink(tool.affiliate_url, 'picks')}" class="btn btn-primary" target="_blank" rel="noopener">Dùng thử</a>
        </div>
      `;
      container.appendChild(card);
    });
  }
  renderPick(picks.beginner, beginnerEl);
  renderPick(picks.creator, creatorEl);
  renderPick(picks.business, businessEl);
}

/* Compare page */
function initComparePage() {
  // Ensure dataset is ready; otherwise wait and retry
  if (!tools) {
    if (typeof toolsPromise !== 'undefined' && toolsPromise) {
      toolsPromise.then(initComparePage);
    }
    return;
  }
  const selectorsContainer = document.getElementById('compareSelectors');
  const addBtn = document.getElementById('addToolBtn');
  const table = document.getElementById('comparisonTable');
  const wizardForm = document.getElementById('wizardForm');
  const wizardResult = document.getElementById('wizardResult');
  if (!selectorsContainer || !table) return;
  let selectCount = 0;
  function createSelect() {
    selectCount++;
    const select = document.createElement('select');
    select.name = 'tool' + selectCount;
    select.style.minWidth = '200px';
    select.innerHTML = '<option value="">Chọn công cụ</option>' +
      tools.map(t => `<option value="${t.slug}">${t.name}</option>`).join('');
    select.addEventListener('change', updateComparison);
    selectorsContainer.appendChild(select);
    return select;
  }
  function updateComparison() {
    const selectedSlugs = Array.from(selectorsContainer.querySelectorAll('select'))
      .map(sel => sel.value)
      .filter(Boolean);
    renderComparisonTable(selectedSlugs);
  }
  function renderComparisonTable(slugs) {
    if (slugs.length < 2) {
      table.innerHTML = '<tbody><tr><td>Vui lòng chọn ít nhất hai công cụ để so sánh.</td></tr></tbody>';
      return;
    }
    const selected = slugs.map(s => tools.find(t => t.slug === s)).filter(Boolean);
    const headers = ['Tiêu chí', ...selected.map(t => t.name)];
    const criteria = [
      { name: 'Tính năng chính', extract: t => t.features.slice(0, 3).join(', ') },
      { name: 'Chất lượng output', extract: t => renderStars(t.output_quality) },
      { name: 'Tốc độ', extract: t => renderStars(t.speed) },
      { name: 'Độ dễ dùng', extract: t => renderStars(t.ease_of_use) },
      { name: 'Giá trị', extract: t => renderStars(t.price_value) },
      { name: 'Tích hợp', extract: t => renderStars(t.integrations_score) },
      { name: 'Hỗ trợ', extract: t => renderStars(t.support) },
      { name: 'Bảo mật & Quyền riêng tư', extract: t => renderStars((t.security + t.privacy) / 2) },
      { name: 'Phù hợp đối tượng', extract: t => t.recommended_for }
    ];
    table.innerHTML = '';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.innerHTML = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    criteria.forEach(cr => {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = cr.name;
      tr.appendChild(tdName);
      selected.forEach(t => {
        const td = document.createElement('td');
        td.innerHTML = cr.extract(t);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }
  // Initialize with two selects
  createSelect();
  createSelect();
  updateComparison();
  addBtn.addEventListener('click', () => {
    if (selectCount < 4) {
      createSelect();
    }
    if (selectCount >= 4) {
      addBtn.style.display = 'none';
    }
  });
  // Wizard suggestions
  if (wizardForm) {
    wizardForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(wizardForm);
      const goal = formData.get('goal');
      const skill = formData.get('skill');
      const budget = formData.get('budget');
      const language = formData.get('language');
      if (!goal || !skill || !budget || !language) return;
      // convert skill to numeric
      const skillMap = { 'Người mới': 1, 'Trung cấp': 2, 'Chuyên sâu': 3 };
      const maxSkill = skillMap[skill];
      const candidates = tools.filter(t => {
        const skillValue = skillMap[t.skill_level] || 1;
        // match goal
        const matchesGoal = t.category.includes(goal);
        // match skill
        const matchesSkill = skillValue <= maxSkill;
        // match budget
        const price = t.price_from || 0;
        let matchesBudget = true;
        if (budget === '0') matchesBudget = price === 0;
        else if (budget === '10') matchesBudget = price < 10;
        else if (budget === '30') matchesBudget = price >= 10 && price < 30;
        else if (budget === '100') matchesBudget = price >= 30 && price < 100;
        else if (budget === '101') matchesBudget = price >= 100;
        // match language
        const matchesLang = t.languages.includes(language);
        return matchesGoal && matchesSkill && matchesBudget && matchesLang;
      });
      const top = candidates.sort((a, b) => b.rating - a.rating).slice(0, 3);
      wizardResult.innerHTML = '';
      if (top.length === 0) {
        wizardResult.innerHTML = '<p>Không tìm thấy công cụ phù hợp với yêu cầu của bạn.</p>';
      } else {
        top.forEach(t => {
          const card = document.createElement('div');
          card.className = 'tool-card';
          card.innerHTML = `
            <div class="logo"><i class="fa ${categoryIconMap[t.category[0]] || 'fa-rocket'}"></i></div>
            <div class="tool-name">${t.name}</div>
            <div class="tool-desc">${t.short_desc}</div>
            <div class="stars">${renderStars(t.rating)}</div>
            <div>${getBadgeHTML(t)}</div>
            <div class="card-actions">
              <a href="tool.html?slug=${t.slug}" class="btn btn-secondary">Xem chi tiết</a>
              <a href="${buildAffiliateLink(t.affiliate_url, 'wizard')}" class="btn btn-primary" target="_blank" rel="noopener">Dùng thử</a>
            </div>
          `;
          wizardResult.appendChild(card);
        });
      }
    });
  }
}

/* Blog TOC */
function generateToc() {
  const tocList = document.getElementById('tocList');
  const content = document.getElementById('articleContent');
  if (!tocList || !content) return;
  tocList.innerHTML = '';
  const headings = content.querySelectorAll('h2, h3');
  headings.forEach((heading, index) => {
    const id = 'heading-' + index;
    heading.id = id;
    const li = document.createElement('li');
    li.style.marginLeft = heading.tagName === 'H3' ? '1rem' : '0';
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = heading.textContent;
    a.style.color = 'var(--accent)';
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

/* Suggest & contact forms */
function initForms() {
  const suggestForm = document.getElementById('suggestForm');
  const suggestStatus = document.getElementById('suggestStatus');
  if (suggestForm) {
    suggestForm.addEventListener('submit', e => {
      e.preventDefault();
      suggestStatus.textContent = 'Cảm ơn bạn đã gửi góp ý!';
      suggestForm.reset();
    });
  }
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactStatus.textContent = 'Cảm ơn bạn đã liên hệ!';
      contactForm.reset();
    });
  }
}

/* Search from home page */
function goToSearch(event) {
  event.preventDefault();
  const input = document.getElementById('heroSearch');
  if (input && input.value.trim()) {
    window.location.href = `categories.html?search=${encodeURIComponent(input.value.trim())}`;
  }
  return false;
}

window.goToSearch = goToSearch;

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderTopTrending();
  renderGoalGrid();
  renderQuickCompare();
  renderGuidePosts();
  initCategoriesPage();
  initToolPage();
  initRecommendedPage();
  initComparePage();
  generateToc();
  initForms();
});