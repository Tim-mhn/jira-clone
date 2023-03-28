import { TimUISnackbar } from '@tim-mhn/ng-ui/snackbar';
import { of } from 'rxjs';
import {
  SnackbarFeedbackOptions,
  SnackbarFeedbackService,
} from './snackbar-feedback.service';

describe('SnackbarFeedbackService', () => {
  describe('showFeedbackSnackbars', () => {
    let service: SnackbarFeedbackService;
    let snackbarMock: jasmine.SpyObj<TimUISnackbar>;

    beforeEach(() => {
      snackbarMock = jasmine.createSpyObj('TimUISnackbar', ['open']);
      service = new SnackbarFeedbackService(snackbarMock);
    });
    it('be defined', () => {
      expect(service).toBeDefined();
    });

    it('should call the snackbar open function with the right undo action if the option is passed', (done: DoneFn) => {
      const logUndo = () => console.log('undo called');
      const options: SnackbarFeedbackOptions = {
        showSuccessMessage: true,
        showLoadingMessage: false,
        timeout: 0,
        undoAction: logUndo,
      };

      of('')
        .pipe(
          service.showFeedbackSnackbars(
            { successMessage: 'it was a success !' },
            options
          )
        )
        .subscribe({
          next: () => {
            setTimeout(() => {
              expect(snackbarMock.open).toHaveBeenCalledWith(
                'it was a success !',
                jasmine.objectContaining({
                  action: {
                    action: logUndo,
                    text: 'Undo',
                  },
                })
              );
              done();
            }, 0);
          },
        });
    });

    it('should call the snackbar open function without any action if undo action is not passed to the options', (done: DoneFn) => {
      const options: SnackbarFeedbackOptions = {
        showSuccessMessage: true,
        showLoadingMessage: false,
        timeout: 0,
      };

      const { showSuccessMessage } = options;

      of('')
        .pipe(
          service.showFeedbackSnackbars({ successMessage: 'success' }, options)
        )
        .subscribe({
          next: () => {
            setTimeout(() => {
              expect(snackbarMock.open).toHaveBeenCalledWith(
                jasmine.any(String),
                {
                  duration: jasmine.any(Number),
                  mode: jasmine.any(String),
                  dismissible: jasmine.any(Boolean),
                }
              );
              done();
            }, 0);
          },
        });
    });
  });
});
