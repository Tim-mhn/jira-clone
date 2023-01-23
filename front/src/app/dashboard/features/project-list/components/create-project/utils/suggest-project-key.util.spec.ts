import { single } from 'rxjs';
import { suggestProjectKeyFromName } from './suggest-project-key.util';

describe('suggestProjectKeyFromName', () => {
  it('should return the first 2 letters capitalized if there is one word', () => {
    const projectName = 'Project';

    expect(suggestProjectKeyFromName(projectName)).toEqual('PR');
  });

  describe('should return the first letter capitalized of the first 2 words if there are 2+ words', () => {
    it('should work with 2 words', () => {
      const projectName = 'new project';

      expect(suggestProjectKeyFromName(projectName)).toEqual('NP');
    });

    it('should work with 3 words', () => {
      const projectName = 'another great project';

      expect(suggestProjectKeyFromName(projectName)).toEqual('AG');
    });

    it('should work with words separated by a dash "-"', () => {
      const projectName = 'this-is-a-great-project';
      expect(suggestProjectKeyFromName(projectName)).toEqual('TI');
    });
  });

  it('should return an empty string if the input is an empty string', () => {
    expect(suggestProjectKeyFromName('')).toEqual('');
  });

  it('should return an empty string if the input is null', () => {
    expect(suggestProjectKeyFromName(null)).toEqual('');
  });

  it('should ignore trailing spaces when counting words', () => {
    const singleWordWithTrailingSpace = 'project ';
    expect(suggestProjectKeyFromName(singleWordWithTrailingSpace)).toEqual(
      'PR'
    );
  });
});
