import { TagTemplateBuilder } from '@tim-mhn/ng-forms/autocomplete';

export const TaskTagTemplate: TagTemplateBuilder = (tagText: string) =>
  `<span class="task-tag">#${tagText}</span>`;
