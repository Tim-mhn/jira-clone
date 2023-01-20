export type BreadcrumbPart = {
  route: string | string[];
  label: string;
};

export type BreadcrumbParts = BreadcrumbPart[];

export type Breadcrumbs = { route: string[]; label: string }[];
