import { TemplateRef } from '@angular/core';

export type TableData<T> = T[];
export type TableColumns<T> = {
  label: string;
  key: keyof T;
  template?: TemplateRef<any>;
}[];
