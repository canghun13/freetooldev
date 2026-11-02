document.addEventListener('DOMContentLoaded', function () {
  var MAX_ITEMS = 1000;
  var MAX_PREVIEWS = 200; // all results go into the ZIP/PDF; only the first ones are previewed on the page
  var itemsInput = document.getElementById('items');
  var barcodeGrid = document.getElementById('barcodeGrid');
  var errorList = document.getElementById('errorList');
  var resultsPanel = document.getElementById('resultsPanel');
  var downloadZipBtn = document.getElementById('downloadZipBtn');
  var progressStatus = document.getElementById('progressStatus');
  var progressText = document.getElementById('progressText');
  var generateBtn = document.getElementById('generateBtn');
  var lastResults = [];

  // Import a CSV / TSV / TXT file: first column = code, second column (optional) = name.
  var importInput = document.getElementById('importFile');
  var importNote = document.getElementById('importNote');
  function parseDelimited(text) {
    var delim = text.indexOf('\t') !== -1 ? '\t' : (/[;]/.test(text.split('\n')[0]) && !/,/.test(text.split('\n')[0]) ? ';' : ',');
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === delim) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return c.trim(); }); });
  }
  if (importInput) {
    importInput.addEventListener('change', function () {
      var f = importInput.files[0];
      importInput.value = '';
      if (!f) return;
      if (/\.(xlsx|xls|ods|numbers)$/i.test(f.name)) {
        importNote.textContent = f.name + ' is a spreadsheet file. In Excel or Google Sheets choose File → Save as / Download → CSV, then import the CSV — or just copy the two columns and paste them above.';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var rows = parseDelimited(String(e.target.result).replace(/^﻿/, ''));
        var header = '';
        if (rows.length && /^(codes?|sku|skus|barcodes?|upc|ean|gtin|item|items|id|number)$/i.test((rows[0][0] || '').trim())) { header = rows[0][0].trim(); rows.shift(); }
        var out = rows.map(function (r) {
          var code = (r[0] || '').trim(), name = (r[1] || '').trim();
          return name ? code + '\t' + name : code;
        });
        itemsInput.value = out.join('\n');
        importNote.textContent = 'Loaded ' + out.length + ' row' + (out.length === 1 ? '' : 's') + ' from ' + f.name + (header ? ' (skipped header "' + header + '")' : '') + '. First column is the code, second is the name used for the file. ' + (out.length > MAX_ITEMS ? 'Only the first ' + MAX_ITEMS + ' are generated per run.' : '');
      };
      reader.readAsText(f);
    });
  }
  var printBar = document.getElementById('printBar');
  var printNote = document.getElementById('printNote');
  var printBtn = document.getElementById('printBtn');
  var pdfBtn = document.getElementById('pdfBtn');
  var pdfStatus = document.getElementById('pdfStatus');

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slugify(s) {
    return String(s).replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40).replace(/^-+|-+$/g, '') || 'barcode';
  }

  function checkDigit(body) {
    // GS1 mod-10: weights 3,1,3,1... counted from the RIGHTMOST digit of the body
    var sum = 0;
    for (var i = body.length - 1, w = 3; i >= 0; i--, w = (w === 3 ? 1 : 3)) {
      sum += parseInt(body[i], 10) * w;
    }
    return (10 - (sum % 10)) % 10;
  }

  // Returns { ok:true, code:<full code>, added:<bool> } or { ok:false, reason:<string> }
  // Code 128 subset rules (same character sets JsBarcode enforces), with a reason a person can act on
  function check128(code, format) {
    if (/[^\x00-\x7F]/.test(code)) return 'contains non-ASCII characters (accents, curly quotes, emoji or non-Latin letters) — Code 128 encodes plain ASCII only';
    if (format === 'CODE128A' && /[a-z`{|}~\x7F]/.test(code)) return 'has lowercase letters or one of ` { | } ~ — set A has none of these; use Code 128 B or auto';
    if (format === 'CODE128B' && /[\x00-\x1F]/.test(code)) return 'has a control character (such as a tab) — set B has none; use Code 128 A or auto';
    if (format === 'CODE128C') {
      if (!/^\d+$/.test(code)) return 'set C is digits only — use Code 128 B or auto for letters and symbols';
      if (code.length % 2) return 'has ' + code.length + ' digits — set C encodes digit pairs, so it needs an even count; add a leading zero (0' + code + ') only if your system expects it, or use auto, which handles the odd digit for you';
    }
    return '';
  }

  function isComplete(d, len) {
    return d.length === len && /^\d+$/.test(d) && checkDigit(d.slice(0, -1)) === parseInt(d.slice(-1), 10);
  }

  // Returns { ok:true, code, added, warn } or { ok:false, reason }
  function prepare(code, format, mode) {
    if (format.indexOf('CODE128') === 0) {
      var c128 = check128(code, format);
      return c128 ? { ok: false, reason: c128 } : { ok: true, code: code, added: false, warn: '' };
    }
    var name = format === 'EAN13' ? 'EAN-13' : 'UPC-A';
    var full = format === 'EAN13' ? 13 : 12;
    var digits = code.replace(/[\s-]/g, '');
    if (/^\d+([.,]\d+)?e\+?\d+$/i.test(digits)) return { ok: false, reason: 'looks like spreadsheet scientific notation (e.g. 4.00638E+12) — the real digits were already rounded away; re-export the column formatted as Text' };
    if (!/^\d+$/.test(digits)) return { ok: false, reason: 'contains non-digit characters (' + name + ' is digits only — use Code128 for letters)' };
    if (mode === 'calc') {
      if (digits.length !== full - 1) {
        var r = 'has ' + digits.length + ' digits — expected ' + (full - 1) + ' without the check digit';
        if (digits.length === full) r += ' (looks complete already — switch to "Included — validate it")';
        else if (format === 'EAN13' && digits.length === 11) r += ' (11 digits is a UPC-A without its check digit — switch format to UPC-A)';
        return { ok: false, reason: r };
      }
      var warn = '';
      if (format === 'UPC' && isComplete('0' + digits, 12)) warn = 'Check: 0' + digits + ' is also a complete, valid UPC-A. If this list came from a spreadsheet, the leading zero may have been dropped.';
      else if (format === 'EAN13' && isComplete(digits, 12)) warn = 'Check: this is also a complete, valid UPC-A. If it is one, use the UPC-A format instead of calculating.';
      return { ok: true, code: digits + checkDigit(digits), added: true, warn: warn };
    }
    if (digits.length !== full) {
      var reason = 'has ' + digits.length + ' digits — ' + name + ' needs ' + full;
      if (format === 'UPC' && isComplete('0' + digits, 12)) reason += ' (0' + digits + ' is a valid UPC-A — the leading zero was probably dropped by a spreadsheet)';
      else if (format === 'EAN13' && digits.length === 12 && isComplete(digits, 12)) reason += ' (this is a complete, valid UPC-A — switch format to UPC-A; as an EAN-13 the same code is 0' + digits + ')';
      else if (format === 'EAN13' && digits.length === 11 && isComplete('0' + digits, 12)) reason += ' (0' + digits + ' is a valid UPC-A — the leading zero was probably dropped by a spreadsheet; switch format to UPC-A)';
      else if (format === 'EAN13' && digits.length === 12) reason += ' (a 12-digit code is either a UPC-A — switch format — or an EAN-13 missing its check digit — choose "Missing — calculate it")';
      else if (format === 'UPC' && digits.length === 13) reason += ' (13 digits is EAN-13 — switch format)';
      else if (format === 'EAN13' && digits.length === 11) reason += ' (11 digits is usually a UPC-A without its check digit — switch to UPC-A and choose "Missing — calculate it")';
      else if (digits.length === full - 1) reason += ' (check digit missing? choose "Missing — calculate it")';
      return { ok: false, reason: reason };
    }
    var body = digits.slice(0, -1), last = parseInt(digits.slice(-1), 10), want = checkDigit(body);
    if (last !== want) return { ok: false, reason: 'check digit is ' + last + ' but should be ' + want + ' — likely a typo somewhere in the number' };
    return { ok: true, code: digits, added: false, warn: '' };
  }


  generateBtn.addEventListener('click', async function () {
    var lines = itemsInput.value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.length === 0) { alert('Enter at least one code.'); return; }
    if (lines.length > MAX_ITEMS) {
      alert('This batch has ' + lines.length + ' items — the limit is ' + MAX_ITEMS + ' per run. Only the first ' + MAX_ITEMS + ' will be processed.');
      lines = lines.slice(0, MAX_ITEMS);
    }

    var format = document.getElementById('format').value;
    var showText = document.getElementById('showText').value === 'true';
    var checkMode = document.getElementById('checkMode').value;
    var output = document.getElementById('output').value;

    barcodeGrid.innerHTML = '';
    errorList.innerHTML = '';
    resultsPanel.style.display = 'block';
    downloadZipBtn.style.display = 'none';
    lastResults = [];
    var errors = [];
    var usedNames = {};
    generateBtn.disabled = true;
    progressStatus.classList.add('active');

    for (var li = 0; li < lines.length; li++) {
      if (li && li % 50 === 0) {
        progressText.textContent = 'Generating ' + li + ' of ' + lines.length + '…';
        await new Promise(function (r) { setTimeout(r, 0); });
      }
      (function (line) {
      // A line copied from a spreadsheet arrives as "code<TAB>name". Never encode the tab:
      // the first column is the barcode data, the rest is a label used for the file name.
      var cols = line.split('\t');
      var input = cols[0].trim();
      var label = cols.slice(1).join(' ').replace(/\s+/g, ' ').trim();
      if (!input) { errors.push({ code: line, reason: 'first column is empty — the code must come before the name' }); return; }
      var prep = prepare(input, format, checkMode);
      if (!prep.ok) {
        errors.push({ code: input, reason: prep.reason });
        return;
      }
      var code = prep.code;

      var dataUrl, ext, svgText = null;
      var opts = { format: format, displayValue: showText, margin: 10, background: '#ffffff' };
      if (output === 'png4') { opts.width = 4; opts.height = 200; opts.fontSize = 40; opts.margin = 20; }
      try {
        if (output === 'svg') {
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          JsBarcode(svg, code, opts);
          svgText = new XMLSerializer().serializeToString(svg);
          // Some serializers emit xmlns twice (JsBarcode also sets it as an attribute) — duplicates make the file invalid XML
          svgText = svgText.replace(/^(<svg\b[^>]*?\sxmlns="[^"]*")([^>]*?)\sxmlns="[^"]*"/, '$1$2');
          if (!/^<svg\b[^>]*\sxmlns=/.test(svgText)) svgText = svgText.replace(/^<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
          dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
          ext = '.svg';
        } else {
          var canvas = document.createElement('canvas');
          JsBarcode(canvas, code, opts);
          dataUrl = canvas.toDataURL('image/png');
          ext = '.png';
        }
      } catch (e) {
        errors.push({ code: input, reason: 'could not be encoded in this format' });
        return;
      }

      var base = label ? slugify(label) : slugify(code);
      var name = base, n = 2;
      while (usedNames[name]) { name = base + '-' + n; n++; }
      usedNames[name] = true;
      var filename = name + ext;
      lastResults.push({ name: filename, dataUrl: dataUrl, svg: svgText, code: code, label: label, opts: opts });
      if (lastResults.length > MAX_PREVIEWS) return;

      var cell = document.createElement('div');
      cell.className = 'file-row ready';
      cell.style.flexDirection = 'column';
      cell.style.alignItems = 'center';
      cell.style.textAlign = 'center';
      cell.innerHTML =
        '<img src="' + dataUrl + '" style="width:100%; max-width:200px; height:auto; margin-bottom:8px; background:#fff; padding:6px; border:1px solid var(--paper-dim);" alt="Barcode for ' + esc(code) + '">' +
        '<span class="fname" style="width:100%; margin-bottom:8px;">' + esc(code) + '</span>' +
        (label ? '<span style="display:block; width:100%; font-size:0.78rem; color:#5a6472; margin-bottom:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + esc(label) + '</span>' : '') +
        (prep.added ? '<span style="display:block; font-size:0.75rem; color:#1f6b41; margin-bottom:8px;">check digit ' + code.slice(-1) + ' added</span>' : '') +
        (prep.warn ? '<span style="display:block; font-size:0.75rem; color:#8a5a00; margin-bottom:8px; text-align:left;">' + esc(prep.warn) + '</span>' : '') +
        '<a class="btn btn-outline" style="padding:6px 12px; font-size:0.72rem;" href="' + dataUrl + '" download="' + filename + '">Download</a>';
      barcodeGrid.appendChild(cell);
      })(lines[li]);
    }
    generateBtn.disabled = false;
    progressStatus.classList.remove('active');

    progressText.textContent = lastResults.length + ' barcode(s) generated' + (errors.length ? ', ' + errors.length + ' skipped.' : '.') +
      (lastResults.length > MAX_PREVIEWS ? ' Showing the first ' + MAX_PREVIEWS + ' previews — all ' + lastResults.length + ' are in the ZIP and the PDF sheet.' : '');
    if (errors.length) {
      errorList.innerHTML = '<strong>Skipped ' + errors.length + ' (not valid for ' + ({ EAN13: 'EAN-13', UPC: 'UPC-A', CODE128: 'Code 128', CODE128A: 'Code 128 A', CODE128B: 'Code 128 B', CODE128C: 'Code 128 C' }[format] || esc(format)) + '):</strong><ul style="margin:8px 0 0; padding-left:20px; color:#2c3540;">' +
        errors.map(function (er) { return '<li style="margin-bottom:4px;"><code>' + esc(er.code) + '</code> — ' + esc(er.reason) + '</li>'; }).join('') + '</ul>';
    }
    if (lastResults.length) downloadZipBtn.style.display = 'inline-flex';
    printBar.style.display = lastResults.length ? 'flex' : 'none';
    printNote.style.display = lastResults.length ? 'block' : 'none';
    pdfStatus.style.display = 'none';
  });

  // PDF sheet: every barcode drawn as vector bars with pdf-lib (exact module widths, tiny files).
  var pdfLibPromise = null;
  function loadPdfLib() {
    if (window.PDFLib) return Promise.resolve();
    if (!pdfLibPromise) pdfLibPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { pdfLibPromise = null; reject(new Error('Could not load the PDF library. Check your connection and try again.')); };
      document.head.appendChild(s);
    });
    return pdfLibPromise;
  }
  // Text that can't be drawn with the built-in PDF font (non-Latin names, emoji) is rendered to a small PNG instead.
  function textToPng(text, px) {
    var c = document.createElement('canvas'), ctx = c.getContext('2d');
    ctx.font = px + 'px Arial, Helvetica, sans-serif';
    c.width = Math.max(1, Math.ceil(ctx.measureText(text).width) + 4); c.height = Math.ceil(px * 1.3);
    ctx.font = px + 'px Arial, Helvetica, sans-serif'; ctx.fillStyle = '#000'; ctx.textBaseline = 'top';
    ctx.fillText(text, 2, Math.round(px * 0.1));
    return new Promise(function (res, rej) { c.toBlob(function (b) { if (!b) { rej(new Error('label render failed')); return; } b.arrayBuffer().then(function (buf) { res({ bytes: new Uint8Array(buf), w: c.width, h: c.height }); }, rej); }, 'image/png'); });
  }
  function layoutBarcode(r, innerW) {
    var enc = {};
    var o = {}; for (var k in r.opts) o[k] = r.opts[k];
    o.width = 2; o.height = 100; o.fontSize = 20; o.margin = 10;
    JsBarcode(enc, r.code, o);
    var segs = enc.encodings || [];
    var mods = 10; segs.forEach(function (sg) { mods += sg.data.length; }); // 5 modules of margin each side, like the PNG/SVG output
    var retail = (o.format === 'EAN13' || o.format === 'UPC');
    var m, scale = 1;
    if (retail) { m = 0.33; if (mods * m > innerW) { scale = innerW / (mods * m); m = innerW / mods; } }
    else m = Math.min(innerW / mods, 0.6);
    var H = retail ? 22.85 * scale : Math.max(8, Math.min(22, 50 * m));
    var fs = retail ? 3.3 * scale : Math.max(2, Math.min(4, 10 * m));
    return { segs: segs, mods: mods, m: m, H: H, fs: o.displayValue === false ? 0 : fs, retail: retail, scale: scale };
  }
  pdfBtn.addEventListener('click', async function () {
    if (!lastResults.length) return;
    var btn = this; btn.disabled = true;
    pdfStatus.style.display = 'block'; pdfStatus.style.color = '#2c3540';
    pdfStatus.textContent = 'Preparing the PDF…';
    try {
      await loadPdfLib();
      var perRow = parseInt(document.getElementById('perRow').value, 10) || 3;
      var size = document.getElementById('pageSize').value === 'letter' ? [215.9, 279.4] : [210, 297];
      var PT = 72 / 25.4, M = 10, GX = 4, GY = 6, PAD = 2, LBL = 3;
      var cellW = (size[0] - 2 * M - GX * (perRow - 1)) / perRow, innerW = cellW - 2 * PAD;
      var doc = await PDFLib.PDFDocument.create();
      var font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
      var black = PDFLib.rgb(0, 0, 0);
      var page = doc.addPage([size[0] * PT, size[1] * PT]);
      var y = M, row = [], minScale = 1, anyRetail = false;
      function fits(text) { try { font.widthOfTextAtSize(text, 10); return true; } catch (e) { return false; } }
      function drawCell(c, x, top) {
        var L = c.L, bx = x + (cellW - L.mods * L.m) / 2, cx = bx + 5 * L.m;
        var pageTop = function (mm) { return (size[1] - mm) * PT; };
        L.segs.forEach(function (sg) {
          var h = L.H * ((sg.options && sg.options.height) || 100) / 100;
          var d = sg.data, i = 0;
          while (i < d.length) {
            if (d[i] === '1') { var j = i; while (j < d.length && d[j] === '1') j++;
              page.drawRectangle({ x: (cx + i * L.m) * PT, y: pageTop(top + h), width: (j - i) * L.m * PT, height: h * PT, color: black });
              i = j; } else i++;
          }
          if (L.fs && sg.text) {
            var txt = sg.text.replace(/[^\x20-\x7E]/g, '?'), size2 = L.fs * PT, tw = font.widthOfTextAtSize(txt, size2) / PT;
            var ta = (sg.options && sg.options.textAlign) || 'center', tx;
            if (ta === 'left') tx = cx; else if (ta === 'right') tx = cx + sg.data.length * L.m - tw; else tx = cx + (sg.data.length * L.m - tw) / 2;
            page.drawText(txt, { x: tx * PT, y: pageTop(top + L.H + 0.8 + L.fs * 0.75), size: size2, font: font, color: black });
          }
          cx += sg.data.length * L.m;
        });
        var ly = top + L.H + (L.fs ? L.fs + 1.2 : 0.6);
        if (c.label) {
          if (c.labelImg) {
            var lh = LBL * 1.1, lw = Math.min(innerW, lh * c.labelImg.w / c.labelImg.h);
            page.drawImage(c.labelImg.img, { x: (x + (cellW - lw) / 2) * PT, y: pageTop(ly + lh), width: lw * PT, height: (lw * c.labelImg.h / c.labelImg.w) * PT });
          } else {
            var t = c.label, ls = LBL * PT;
            while (font.widthOfTextAtSize(t, ls) / PT > innerW && t.length > 4) t = t.slice(0, -2) + '…';
            page.drawText(t, { x: (x + (cellW - font.widthOfTextAtSize(t, ls) / PT) / 2) * PT, y: pageTop(ly + LBL * 0.8), size: ls, font: font, color: black });
          }
        }
      }
      function cellHeight(c) { return c.L.H + (c.L.fs ? c.L.fs + 1.2 : 0.6) + (c.label ? LBL * 1.3 : 0); }
      function flushRow() {
        if (!row.length) return;
        var rowH = Math.max.apply(null, row.map(cellHeight)) + 2 * PAD;
        if (y + rowH > size[1] - M && y > M) { page = doc.addPage([size[0] * PT, size[1] * PT]); y = M; }
        row.forEach(function (c, i) {
          var x = M + i * (cellW + GX);
          page.drawRectangle({ x: x * PT, y: (size[1] - y - rowH) * PT, width: cellW * PT, height: rowH * PT,
            borderColor: PDFLib.rgb(0.73, 0.73, 0.73), borderWidth: 0.4, borderDashArray: [2, 2] });
          drawCell(c, x, y + PAD);
        });
        y += rowH + GY; row = [];
      }
      for (var i = 0; i < lastResults.length; i++) {
        if (i % 50 === 0) { pdfStatus.textContent = 'Drawing barcode ' + (i + 1) + ' of ' + lastResults.length + '…'; await new Promise(function (r) { setTimeout(r, 0); }); }
        var r = lastResults[i], L;
        try { L = layoutBarcode(r, innerW); } catch (e) { continue; }
        if (L.retail) { anyRetail = true; minScale = Math.min(minScale, L.scale); }
        var cell = { L: L, label: r.label || '' };
        if (cell.label && !fits(cell.label)) {
          var png = await textToPng(cell.label, 48);
          cell.labelImg = { img: await doc.embedPng(png.bytes), w: png.w, h: png.h };
        }
        row.push(cell);
        if (row.length === perRow) flushRow();
      }
      flushRow();
      var bytes = await doc.save();
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      a.download = 'barcodes-sheet.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      var msg = 'PDF ready: ' + lastResults.length + ' barcode(s) on ' + doc.getPageCount() + ' page(s), ' + (bytes.length / 1024).toFixed(0) + ' KB. Print at 100% scale ("Actual size").';
      if (anyRetail && minScale < 1) {
        msg += ' UPC/EAN codes had to shrink to ' + Math.round(minScale * 100) + '% of standard size to fit ' + perRow + ' per row' +
          (minScale < 0.8 ? ', below the GS1 minimum of 80% for retail checkout. Use fewer per row.' : '.');
        if (minScale < 0.8) pdfStatus.style.color = '#8a5a00';
      }
      pdfStatus.textContent = msg;
    } catch (e) {
      pdfStatus.style.color = '#b5451b';
      pdfStatus.textContent = 'Could not build the PDF: ' + ((e && e.message) || e);
    } finally { btn.disabled = false; }
  });

  downloadZipBtn.addEventListener('click', function () {
    var zip = new JSZip();
    lastResults.forEach(function (r) {
      if (r.svg !== null && r.svg !== undefined) { zip.file(r.name, r.svg); return; }
      var base64 = r.dataUrl.split(',')[1];
      zip.file(r.name, base64, { base64: true });
    });
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'barcodes.zip';
      a.click();
    });
  });
});
