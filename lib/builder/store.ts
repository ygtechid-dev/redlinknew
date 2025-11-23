// Simple state management untuk builder (tanpa localStorage)
import { BuilderElement, PageData } from './types';

export class BuilderStore {
  private elements: BuilderElement[] = [];
  private selectedId: string | null = null;
  private history: BuilderElement[][] = [];
  private historyIndex: number = -1;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getElements() {
    return this.elements;
  }

  getSelectedId() {
    return this.selectedId;
  }

  getSelectedElement(): BuilderElement | null {
    if (!this.selectedId) return null;
    return this.findElement(this.elements, this.selectedId);
  }

  private findElement(elements: BuilderElement[], id: string): BuilderElement | null {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children) {
        const found = this.findElement(el.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  setElements(elements: BuilderElement[]) {
    this.saveHistory();
    this.elements = elements;
    this.notify();
  }

  addElement(element: BuilderElement, parentId?: string) {
    this.saveHistory();
    if (parentId) {
      const parent = this.findElement(this.elements, parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(element);
      }
    } else {
      this.elements.push(element);
    }
    this.notify();
  }

  updateElement(id: string, updates: Partial<BuilderElement>) {
    this.saveHistory();
    const element = this.findElement(this.elements, id);
    if (element) {
      Object.assign(element, updates);
      this.notify();
    }
  }

  deleteElement(id: string) {
    this.saveHistory();
    this.elements = this.removeElement(this.elements, id);
    if (this.selectedId === id) this.selectedId = null;
    this.notify();
  }

  private removeElement(elements: BuilderElement[], id: string): BuilderElement[] {
    return elements.filter(el => {
      if (el.id === id) return false;
      if (el.children) {
        el.children = this.removeElement(el.children, id);
      }
      return true;
    });
  }

  selectElement(id: string | null) {
    this.selectedId = id;
    this.notify();
  }

  private saveHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.elements)));
    this.historyIndex++;
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.notify();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.notify();
    }
  }

  clear() {
    this.saveHistory();
    this.elements = [];
    this.selectedId = null;
    this.notify();
  }

  exportPage(): PageData {
    return {
      name: 'Untitled Page',
      slug: 'untitled',
      elements: this.elements
    };
  }

  loadPage(page: PageData) {
    this.elements = page.elements;
    this.selectedId = null;
    this.history = [];
    this.historyIndex = -1;
    this.notify();
  }
}

export const builderStore = new BuilderStore();