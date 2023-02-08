import { breadcrumbsWithConcatenatedRoutes } from './breadcrumb.component';
import { BreadcrumbParts, Breadcrumbs } from './breadcrumbs';

describe('BreadcrumbComponent', () => {
  describe('breadcrumbsWithConcatenatedRoutes', () => {
    let breadcrumbs: Breadcrumbs;
    const projectId = 'random-string';

    beforeEach(() => {
      const parts: BreadcrumbParts = [
        {
          label: 'Project',
          route: 'projects',
        },
        {
          label: 'My project',
          route: projectId,
        },
        {
          label: 'Board',
          route: 'board',
        },
      ];

      breadcrumbs = breadcrumbsWithConcatenatedRoutes(parts);
    });
    it('should prepend routes with a /', () => {
      expect(breadcrumbs[0].route).toEqual(['/', 'projects']);
    });
    it('should concatenate the routes', () => {
      expect(breadcrumbs[1].route).toEqual(['/', 'projects', projectId]);
    });

    it('should not change the labels', () => {
      expect(breadcrumbs[2].label).toEqual('Board');
    });

    it('should work with arrays for Breadcrumb part routes', () => {
      const parts: BreadcrumbParts = [
        {
          label: 'Project',
          route: 'projects',
        },
        {
          label: 'My project',
          route: projectId,
        },
        {
          label: 'Board',
          route: 'board',
        },
        {
          label: 'My Task',
          route: ['browse', 'tasks', 'task-id'],
        },
      ];

      const breadcrumbs = breadcrumbsWithConcatenatedRoutes(parts);
      expect(breadcrumbs[3].route).toEqual([
        '/',
        'projects',
        projectId,
        'board',
        'browse',
        'tasks',
        'task-id',
      ]);
    });
  });
});
