/* FreeToolDev — PDF form handling for merges (pdf-lib 1.17.x, global PDFLib).
 *
 * Why this exists: copying pages with pdf-lib's copyPages() carries the visible
 * form widgets but not the document-level /AcroForm, so a merged file looks
 * filled in but is no longer a form. And when several copies of the same form
 * are merged with their fields intact, fields with the same fully-qualified
 * name are one field in PDF terms, so every copy ends up showing one answer.
 *
 * Usage per merge:
 *   var state = PdfForms.newState();
 *   for each source doc: PdfForms.prepare(src, mode, prefix, outDoc, state);  // before copyPages
 *   ...copyPages...
 *   PdfForms.finalize(outDoc, state);                                         // after all pages are added
 * mode: 'separate' (rename each file's fields with a prefix, keep fillable),
 *       'flatten'  (draw the answers into the page, no fields left),
 *       'shared'   (keep names as they are; same-named fields will share one value).
 */
(function () {
  function N(n) { return PDFLib.PDFName.of(n); }

  function acroFormOf(doc) {
    try { return doc.catalog.lookupMaybe(N('AcroForm'), PDFLib.PDFDict) || null; } catch (e) { return null; }
  }

  function inspect(doc) {
    var info = { count: 0, names: [], hasXfa: false, signatures: 0, error: '' };
    var acro = acroFormOf(doc);
    if (!acro) return info;
    info.hasXfa = !!acro.get(N('XFA'));
    try {
      var fields = doc.getForm().getFields();
      fields.forEach(function (f) {
        info.names.push(f.getName());
        if (PDFLib.PDFSignature && f instanceof PDFLib.PDFSignature) info.signatures++;
      });
      info.count = fields.length;
    } catch (e) { info.error = (e && e.message) || String(e); }
    return info;
  }

  function slugPrefix(name, used) {
    var s = String(name).replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'file';
    var p = s, n = 2;
    while (used[p]) { p = s + '-' + n; n++; }
    used[p] = true;
    return p; // never contains "." (a field's partial name may not), safe as a name prefix
  }

  function newState() { return { dr: null, da: null, fieldsSeen: 0, renamed: 0, flattened: 0, warnings: [] }; }

  function mergeResources(outDoc, state, srcDoc, acro) {
    var drRef = acro.get(N('DR'));
    if (drRef) {
      var copied = PDFLib.PDFObjectCopier.for(srcDoc.context, outDoc.context).copy(drRef);
      var copiedDict = outDoc.context.lookup(copied, PDFLib.PDFDict);
      if (!state.dr) state.dr = copiedDict;
      else if (copiedDict) {
        var outFonts = state.dr.lookupMaybe(N('Font'), PDFLib.PDFDict);
        var newFonts = copiedDict.lookupMaybe(N('Font'), PDFLib.PDFDict);
        if (newFonts) {
          if (!outFonts) { state.dr.set(N('Font'), newFonts); }
          else newFonts.entries().forEach(function (kv) { if (!outFonts.has(kv[0])) outFonts.set(kv[0], kv[1]); });
        }
      }
    }
    var da = acro.get(N('DA'));
    if (da && !state.da) state.da = da;
  }

  function prepare(srcDoc, mode, prefix, outDoc, state) {
    var acro = acroFormOf(srcDoc);
    if (!acro) return { fields: 0 };
    var form;
    try { form = srcDoc.getForm(); } catch (e) { state.warnings.push('Could not read the form in one file: ' + e.message); return { fields: 0 }; }
    var count = form.getFields().length;
    state.fieldsSeen += count;
    if (!count) return { fields: 0 };
    if (mode === 'flatten') {
      try { form.flatten(); state.flattened += count; }
      catch (e) { state.warnings.push('Some fields could not be flattened (' + e.message + '); they were kept as fields.'); }
      return { fields: count };
    }
    if (mode === 'separate') {
      var arr = acro.lookupMaybe(N('Fields'), PDFLib.PDFArray);
      if (arr) {
        for (var i = 0; i < arr.size(); i++) {
          var fd = srcDoc.context.lookup(arr.get(i));
          if (!(fd instanceof PDFLib.PDFDict)) continue;
          var T = fd.get(N('T'));
          var old = T && T.decodeText ? T.decodeText() : '';
          fd.set(N('T'), PDFLib.PDFHexString.fromText(prefix + '_' + (old || 'field' + (i + 1))));
          state.renamed++;
        }
      }
    }
    mergeResources(outDoc, state, srcDoc, acro);
    return { fields: count };
  }

  // Rebuild the merged file's /AcroForm from the widgets that copyPages brought over.
  function finalize(outDoc, state) {
    var roots = [], seen = {};
    outDoc.getPages().forEach(function (page) {
      var annots = page.node.Annots();
      if (!annots) return;
      for (var i = 0; i < annots.size(); i++) {
        var ref = annots.get(i);
        var a = outDoc.context.lookup(ref);
        if (!(a instanceof PDFLib.PDFDict)) continue;
        var st = a.get(N('Subtype'));
        if (!st || st.toString() !== '/Widget') continue;
        var curRef = ref, cur = a, guard = 0;
        while (cur.get(N('Parent')) && guard++ < 50) {
          var parentRef = cur.get(N('Parent'));
          var parent = outDoc.context.lookup(parentRef);
          if (!(parent instanceof PDFLib.PDFDict)) break;
          curRef = parentRef; cur = parent;
        }
        var key = curRef.toString();
        if (!seen[key]) { seen[key] = true; roots.push(curRef); }
      }
    });
    if (!roots.length) return { fields: 0 };
    var acro = outDoc.context.obj({});
    acro.set(N('Fields'), outDoc.context.obj(roots));
    if (state.dr) acro.set(N('DR'), state.dr);
    if (state.da) acro.set(N('DA'), state.da);
    outDoc.catalog.set(N('AcroForm'), outDoc.context.register(acro));
    return { fields: roots.length };
  }

  window.PdfForms = { inspect: inspect, prepare: prepare, finalize: finalize, newState: newState, slugPrefix: slugPrefix };
})();
