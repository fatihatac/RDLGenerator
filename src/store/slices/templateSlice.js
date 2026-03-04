// ---------------------------------------------------------------------------
// templateSlice.js
// Kullanıcının birden fazla rapor şablonunu kaydetmesine ve yüklemesine
// olanak tanır. Şablonlar Zustand persist ile localStorage'da tutulur.
// ---------------------------------------------------------------------------

import generateId from "../../utils/helpers/generateId";

export const createTemplateSlice = (set, get) => ({
  templates: [], // [{ id, name, createdAt, reportItems }]

  saveTemplate: (name) => {
    const { reportItems, templates } = get();
    if (!reportItems.length) return;

    const newTemplate = {
      id: generateId("tpl"),
      name: name || `Şablon ${templates.length + 1}`,
      createdAt: new Date().toISOString(),
      reportItems: JSON.parse(JSON.stringify(reportItems)),
    };

    set((state) => {
      state.templates.push(newTemplate);
    });

    return newTemplate.id;
  },

  loadTemplate: (templateId) => {
    const { templates, pushHistory } = get();
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    pushHistory(); // yüklemeden önce mevcut state'i geçmişe at (undo desteği)

    set((state) => {
      state.reportItems = JSON.parse(JSON.stringify(template.reportItems));
    });
  },

  deleteTemplate: (templateId) => {
    set((state) => {
      state.templates = state.templates.filter((t) => t.id !== templateId);
    });
  },

  renameTemplate: (templateId, newName) => {
    set((state) => {
      const tpl = state.templates.find((t) => t.id === templateId);
      if (tpl) tpl.name = newName;
    });
  },
});
