import { timeAgoLabel } from './time-ago.util';

describe('timeAgoLabel', () => {
  it('should return "x seconds ago" if there is less than a minute of difference', () => {
    const time = new Date(2022, 1, 15, 3, 10, 0);
    const currentTime = new Date(2022, 1, 15, 3, 10, 20);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('20 seconds ago');
  });

  it('should return "x minutes ago" if there is between 1 minute and 1 h (excluding) of difference', () => {
    const time = new Date(2022, 1, 15, 3, 10, 0);
    const currentTime = new Date(2022, 1, 15, 3, 12, 20);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('2 minutes ago');
  });

  it('should return use singular "minute"  if there is between 1 minute and 1 minute 59 seconds of difference', () => {
    const time = new Date(2022, 1, 15, 3, 10, 0);
    const currentTime = new Date(2022, 1, 15, 3, 11, 40);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('1 minute ago');
  });

  it('should return "3 minutes ago" if there is exactly 3 minutes of difference ', () => {
    const time = new Date(2022, 1, 15, 3, 10, 10);
    const currentTime = new Date(2022, 1, 15, 3, 13, 10);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('3 minutes ago');
  });

  it('should return "x hours ago" if there is between 1 and 24h (excluding) of difference ', () => {
    const time = new Date(2022, 1, 15, 3, 10, 10);
    const currentTime = new Date(2022, 1, 15, 5, 13, 10);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('2 hours ago');
  });

  describe('should return "x day(s) ago" if 2 dates are in the same month but on a different day, separated by over 24h', () => {
    it('2 days separated by 1 day', () => {
      const time = new Date(2022, 1, 15, 3, 10, 10);
      const currentTime = new Date(2022, 1, 16, 5, 13, 10);

      const timeAgoString = timeAgoLabel(time, currentTime);

      expect(timeAgoString).toEqual('1 day ago');
    });

    it('2 days separated by over a week', () => {
      const time = new Date(2022, 1, 5, 3, 10, 10);
      const currentTime = new Date(2022, 1, 16, 5, 13, 10);

      const timeAgoString = timeAgoLabel(time, currentTime);

      expect(timeAgoString).toEqual('11 days ago');
    });

    it('2 days separated by less than 24h', () => {
      const time = new Date(2022, 1, 15, 14, 10, 10);
      const currentTime = new Date(2022, 1, 16, 5, 8, 10);

      const timeAgoString = timeAgoLabel(time, currentTime);

      expect(timeAgoString).toEqual('1 day ago');
    });
  });

  it('should return "x month(s) ago" if dates are in the same year but in the same month', () => {
    const time = new Date(2022, 1, 15, 14, 10, 10);
    const currentTime = new Date(2022, 3, 12, 5, 8, 10);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('2 months ago');
  });

  it('should return "x year(s) ago" if dates not in the same year', () => {
    const time = new Date(2019, 1, 15, 14, 10, 10);
    const currentTime = new Date(2022, 3, 12, 5, 8, 10);

    const timeAgoString = timeAgoLabel(time, currentTime);

    expect(timeAgoString).toEqual('3 years ago');
  });

  describe('Just now', () => {
    it('should return "just now" if dates are equal', () => {
      const time = new Date();

      const timeAgoString = timeAgoLabel(time, time);

      expect(timeAgoString.toLowerCase()).toEqual('just now');
    });

    it('should return "just now" if dates have less than 1 second of difference', () => {
      const time = new Date(2022, 1, 1, 10, 20, 5, 200);
      const nowIs100MSAfterTime = new Date(2022, 1, 1, 10, 20, 5, 300);

      const timeAgoString = timeAgoLabel(time, nowIs100MSAfterTime);

      expect(timeAgoString.toLowerCase()).toEqual('just now');
    });
  });
});
