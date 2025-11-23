// Core types untuk page builder

export type ElementType = 
  | 'container'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'spacer'
  | 'divider'
  | 'columns';

export interface ElementStyle {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  border?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
}

export interface ElementContent {
  text?: string;
  html?: string;
  src?: string;
  alt?: string;
  href?: string;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  style: ElementStyle;
  children?: BuilderElement[];
}

export interface PageData {
  id?: string;
  name: string;
  slug: string;
  elements: BuilderElement[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DragItem {
  type: ElementType;
  id?: string;
}