const pages = [...document.querySelectorAll('[data-page]')];
const navLinks = [...document.querySelectorAll('[data-route]')];
const menu = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');

function renderRoute() {
  const requested = location.hash.slice(1) || 'home';
  const route = pages.some(page => page.dataset.page === requested) ? requested : 'home';
  pages.forEach(page => {
    const active = page.dataset.page === route;
    page.hidden = !active;
    page.classList.toggle('active', active);
  });
  navLinks.forEach(link => link.toggleAttribute('aria-current', link.dataset.route === route));
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

window.addEventListener('hashchange', renderRoute);
menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
renderRoute();
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filter-chip.active')?.classList.remove('active');
  button.classList.add('active');
  document.querySelectorAll('.work-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
  });
}));

const form = document.querySelector('#contact-form');
const status = form.querySelector('.form-status');
const message = form.elements.message;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validators = {
  name: value => value.trim().length < 2 ? 'Please enter your name (at least 2 characters).' : '',
  email: value => !emailPattern.test(value.trim()) ? 'Enter a valid email address, like alex@example.com.' : '',
  project: value => !value ? 'Choose the kind of project you have in mind.' : '',
  message: value => value.trim().length < 20 ? 'Tell us a little more (at least 20 characters).' : value.length > 1000 ? 'Please keep your message under 1,000 characters.' : '',
  consent: checked => !checked ? 'Please agree so we can get back to you.' : ''
};

function setError(name, error) {
  const field = form.elements[name];
  const errorEl = document.querySelector(`#${name}-error`);
  if (errorEl) errorEl.textContent = error;
  if (field) field.setAttribute('aria-invalid', String(Boolean(error)));
  return !error;
}
function validateField(name) {
  const field = form.elements[name];
  const value = name === 'consent' ? field.checked : field.value;
  return setError(name, validators[name](value));
}

['name', 'email', 'project', 'message', 'consent'].forEach(name => {
  const field = form.elements[name];
  field.addEventListener(name === 'project' || name === 'consent' ? 'change' : 'input', () => {
    validateField(name);
    status.textContent = '';
    status.classList.remove('error');
  });
});
message.addEventListener('input', () => { document.querySelector('#message-count').textContent = `${message.value.length} / 1000`; });

form.addEventListener('submit', async event => {
  event.preventDefault();
  const valid = ['name', 'email', 'project', 'message', 'consent'].map(validateField).every(Boolean);
  if (!valid) {
    status.textContent = 'A couple of details need your attention.';
    status.classList.add('error');
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  const submission = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    company: form.elements.company.value.trim(),
    project: form.elements.project.value,
    message: form.elements.message.value.trim(),
    submittedAt: new Date().toISOString()
  };
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.innerHTML = 'Sending…';
  status.textContent = '';
  status.classList.remove('error');
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(submission)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your message could not be saved.');
    form.reset();
    document.querySelector('#message-count').textContent = '0 / 1000';
    ['name', 'email', 'project', 'message', 'consent'].forEach(name => setError(name, ''));
    status.textContent = 'Thanks for reaching out — your note is safely with us.';
  } catch (error) {
    status.textContent = `${error.message} Please try again in a moment.`;
    status.classList.add('error');
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send your enquiry <span>↗</span>';
  }
});
