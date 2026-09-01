import { ESTATES_DATA as defaultEstates } from '../data/estatesData';
import { ARTICLES_DATA as defaultArticles } from '../data/guidesData';

// Enhanced Frontmatter & YAML Parser for Decap CMS Markdown files
function parseFrontmatter(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return { data: {}, body: '' };

  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: rawContent.trim() };

  const frontmatterStr = match[1];
  const body = match[2].trim();
  const data = {};

  const lines = frontmatterStr.split(/\r?\n/);
  let currentArrayKey = null;
  let currentObject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = line.search(/\S/);

    // Multiline key: overview: | or overview: >
    if (trimmed.includes(':') && (trimmed.endsWith('|') || trimmed.endsWith('>'))) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      let multilineText = [];
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextIndent = nextLine.search(/\S/);
        if (nextLine.trim() === '') {
          multilineText.push('');
          i++;
          continue;
        }
        if (nextIndent > indent) {
          multilineText.push(nextLine.trim());
          i++;
        } else {
          i--;
          break;
        }
      }
      data[key] = multilineText.join('\n').trim();
      currentArrayKey = null;
      currentObject = null;
      continue;
    }

    // List item start: - key: val or - "string"
    if (trimmed.startsWith('- ')) {
      const itemContent = trimmed.slice(2).trim();

      if (itemContent.includes(':')) {
        // Object in list (e.g. - size: "500 SQM" or - question: "...")
        const colonIdx = itemContent.indexOf(':');
        const k = itemContent.slice(0, colonIdx).trim();
        let v = itemContent.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

        currentObject = { [k]: v };
        if (!Array.isArray(data[currentArrayKey])) {
          data[currentArrayKey] = [];
        }
        data[currentArrayKey].push(currentObject);
      } else {
        // String in list (e.g. - "Perimeter Fencing")
        let strVal = itemContent.replace(/^["']|["']$/g, '');
        if (strVal.startsWith('photo:')) {
          strVal = strVal.replace(/^photo:\s*/, '').replace(/^["']|["']$/g, '');
        }
        if (!Array.isArray(data[currentArrayKey])) {
          data[currentArrayKey] = [];
        }
        data[currentArrayKey].push(strVal);
        currentObject = null;
      }
      continue;
    }

    // Continuation line inside an object in a list (indented key: value)
    if (indent > 2 && currentObject && trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const k = trimmed.slice(0, colonIdx).trim();
      let v = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      currentObject[k] = v;
      continue;
    }

    // Root key-value pair: key: value
    if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      let value = trimmed.slice(colonIdx + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value)) && value !== '') value = Number(value);

      if (value === '') {
        currentArrayKey = key;
        data[key] = [];
        currentObject = null;
      } else {
        currentArrayKey = null;
        currentObject = null;
        data[key] = value;
      }
    }
  }

  return { data, body };
}

// 1. Get All Dynamic CMS Estates
export function getCMSEstates() {
  try {
    const modules = import.meta.glob('/public/content/estates/*.md', { query: '?raw', import: 'default', eager: true });
    const cmsEstates = Object.entries(modules).map(([path, content]) => {
      const { data, body } = parseFrontmatter(content);
      const filename = path.split('/').pop().replace(/\.md$/, '');
      const defaultMatch = defaultEstates.find(e => e.id === data.id || e.id === filename) || {};

      const parsedGallery = Array.isArray(data.gallery) && data.gallery.length > 0
        ? data.gallery.map(item => typeof item === 'object' && item?.photo ? item.photo : item)
        : defaultMatch.gallery || [data.image];

      const hasValidPricingGrid = Array.isArray(data.pricingGrid) && 
        data.pricingGrid.length > 0 && 
        typeof data.pricingGrid[0] === 'object' && 
        data.pricingGrid[0]?.size;

      const validPricingGrid = hasValidPricingGrid
        ? data.pricingGrid
        : (data.pricingGrid !== undefined ? [] : (defaultMatch.pricingGrid || null));

      const hasValidFaqs = Array.isArray(data.faqs) && 
        data.faqs.length > 0 && 
        typeof data.faqs[0] === 'object' && 
        (data.faqs[0]?.question || data.faqs[0]?.answer || data.faqs[0]?.text);

      const validFaqs = hasValidFaqs
        ? data.faqs.map(f => ({ question: f.question, answer: f.answer || f.text }))
        : (data.faqs !== undefined ? [] : null);

      const overviewText = (data.overview !== undefined && data.overview !== null && String(data.overview).trim() !== '')
        ? String(data.overview).trim()
        : (body && body.trim() !== '' ? body.trim() : (defaultMatch.overview || ''));

      return {
        id: data.id || filename,
        name: data.name || defaultMatch.name || filename,
        tagline: data.tagline !== undefined ? data.tagline : (defaultMatch.tagline || ''),
        location: data.location || defaultMatch.location || '',
        region: data.region || defaultMatch.region || 'Ibeju-Lekki',
        category: data.category || defaultMatch.category || 'Residential',
        price: data.price || defaultMatch.price || '₦6,000,000 - ₦18,000,000',
        numericPrice: data.numericPrice !== undefined ? data.numericPrice : (defaultMatch.numericPrice || 6000000),
        title: data.title || defaultMatch.title || 'Excision',
        verificationBadge: data.verificationBadge !== undefined ? data.verificationBadge : (defaultMatch.verificationBadge || ''),
        plotSize: data.plotSize || defaultMatch.plotSize || '300 SQM & 500 SQM',
        paymentPlan: data.paymentPlan || defaultMatch.paymentPlan || 'Outright (1-3 Mos), 6 Mos & 12 Mos Plans',
        initialDeposit: data.initialDeposit !== undefined ? data.initialDeposit : (defaultMatch.initialDeposit || ''),
        status: data.status !== undefined ? data.status : (defaultMatch.status || ''),
        featured: data.featured !== undefined ? data.featured : (defaultMatch.featured !== undefined ? defaultMatch.featured : true),
        image: data.image || defaultMatch.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        gallery: parsedGallery,
        pricingGrid: validPricingGrid,
        faqs: validFaqs,
        overview: overviewText,
        infrastructure: Array.isArray(data.infrastructure) ? data.infrastructure : (defaultMatch.infrastructure || [])
      };
    });

    return cmsEstates.length > 0 ? cmsEstates : defaultEstates;
  } catch (err) {
    console.warn('Falling back to default estates:', err);
    return defaultEstates;
  }
}

// 2. Get All Dynamic CMS Articles / Blog Posts
export function getCMSArticles() {
  try {
    const modules = import.meta.glob('/public/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
    const cmsArticles = Object.entries(modules).map(([path, content]) => {
      const { data, body } = parseFrontmatter(content);
      const filename = path.split('/').pop().replace(/\.md$/, '');
      return {
        id: data.id || filename,
        title: data.title || filename,
        category: data.category || 'Land Verification',
        readTime: data.readTime || '5 min read',
        summary: data.summary || '',
        body: (data.body !== undefined && String(data.body).trim() !== '') ? String(data.body).trim() : (body || ''),
        takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
        featuredImage: data.featuredImage || ''
      };
    });

    return cmsArticles.length > 0 ? cmsArticles : defaultArticles;
  } catch (err) {
    console.warn('Falling back to default articles:', err);
    return defaultArticles;
  }
}

// 3. Get All Dynamic CMS Testimonials
export function getCMSTestimonials() {
  try {
    const modules = import.meta.glob('/public/content/testimonials/*.md', { query: '?raw', import: 'default', eager: true });
    const cmsTestimonials = Object.entries(modules).map(([path, content]) => {
      const { data, body } = parseFrontmatter(content);
      const filename = path.split('/').pop().replace(/\.md$/, '');
      return {
        name: data.name || filename,
        role: data.role || 'Property Investor',
        text: data.quote || body || '',
        location: data.location || 'Lagos State',
        image: data.photo || ''
      };
    });

    const defaultTestimonialsList = [
      {
        name: "Dr. Emmanuel Adeleke",
        role: "Diaspora Investor (United Kingdom)",
        text: "Buying land in Lagos from London used to carry immense risk. Iloshe Properties managed everything with legal clarity. The site inspection was detailed, and my plot was allocated on schedule.",
        location: "Zenith Gardens, Magboro",
        image: ""
      },
      {
        name: "Mrs. Blessing Okonkwo",
        role: "Commercial Enterprise CEO",
        text: "What set Iloshe apart was their flexible 12-month payment structure. I didn't have to strain business liquidity. Today I hold verified title documents safely.",
        location: "Garden Of Praise, Eleko Ibeju-Lekki",
        image: ""
      },
      {
        name: "Engr. Tunde Bakare",
        role: "Infrastructure Consultant",
        text: "Their documentation team walked me through verifying land coordinates directly with the Lagos Surveyor General's office. Professionalism at its peak with zero hidden fees.",
        location: "Iloshe's Garden, Abule Pan",
        image: ""
      }
    ];

    return cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonialsList;
  } catch (err) {
    console.warn('Falling back to default testimonials:', err);
    return [];
  }
}
