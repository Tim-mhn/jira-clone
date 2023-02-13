import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });

    const sanitizer = TestBed.get(DomSanitizer);
    pipe = new SanitizeHtmlPipe(sanitizer);
  });

  it('should be created', () => {
    expect(pipe).toBeDefined();
  });

  it('should not change a safe html value', () => {
    const safeHTML = '<span>hello world</span>';

    expect(pipe.transform(safeHTML)).toEqual(safeHTML);
  });

  it('should edit an unsafe html value', () => {
    const unsafeHTML = '<script>hello world</script>';

    expect(pipe.transform(unsafeHTML)).not.toEqual(unsafeHTML);
  });
});
