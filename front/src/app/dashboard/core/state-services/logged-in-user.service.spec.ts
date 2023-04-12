import { take } from 'rxjs';
import { User } from '../../../auth/models/user';
import { LoggedInUserService } from './logged-in-user.service';

describe('LoggedInUserService', () => {
  let service: LoggedInUserService;

  beforeEach(() => {
    service = new LoggedInUserService();
  });

  describe('isLoggedIn$', () => {
    it('should emit false initially', () => {
      service.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
        expect(isLoggedIn).toEqual(false);
      });
    });

    it('should emit true if setLoggedInUser has been called before', () => {
      const mockUser: User = {
        Email: '',
        Icon: '',
        Id: '',
        Name: '',
      } as any as User;
      service.setLoggedInUser(mockUser);

      service.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
        expect(isLoggedIn).toEqual(true);
      });
    });
  });
});
