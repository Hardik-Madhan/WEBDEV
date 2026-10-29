const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const dataFile = path.join(dataDir, 'messages.json');
const port = Number(process.env.PORT) || 3000;
const mimeTypes = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};

async function saveSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Please send a valid form submission.');
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const project = typeof input.project === 'string' ? input.project.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (name.length < 2 || name.length > 100) throw new Error('Please enter a name between 2 and 100 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) throw new Error('Please enter a valid email address.');
  if (!project || project.length > 120) throw new Error('Please choose a project type.');
  if (message.length < 20 || message.length > 1000) throw new Error('Please provide a message between 20 and 1,000 characters.');
  const record = {id: require('node:crypto').randomUUID(), name, email, company: typeof input.company === 'string' ? input.company.trim().slice(0, 120) : '', project, message, submittedAt: new Date().toISOString()};
  await fs.mkdir(dataDir, {recursive: true});
  let records = [];
  try { records = JSON.parse(await fs.readFile(dataFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!Array.isArray(records)) records = [];
  records.push(record);
  await fs.writeFile(dataFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
  return record;
}

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
  if (request.method === 'POST' && pathname === '/api/contact') {
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 20_000) request.destroy(); });
    request.on('end', async () => {
      try {
        const record = await saveSubmission(JSON.parse(body || '{}'));
        response.writeHead(201, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify({ok: true, id: record.id}));
      } catch (error) {
        response.writeHead(error instanceof SyntaxError ? 400 : 422, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify({error: error.message || 'Unable to save your message.'}));
      }
    });
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, {'Content-Type':'text/plain; charset=utf-8','Allow':'GET, HEAD, POST'}); response.end('Method not allowed'); return;
  }
  let relative = decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html';
  let filePath = path.resolve(root, relative);
  if (!filePath.startsWith(root + path.sep) && filePath !== path.join(root, 'index.html')) { response.writeHead(403); response.end('Forbidden'); return; }
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    const content = await fs.readFile(filePath);
    response.writeHead(200, {'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Not found');
  }
});

server.listen(port, () => console.log(`Northstar is running at http://localhost:${port}`));
