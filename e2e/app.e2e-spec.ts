import { MaxiNav2Page } from './app.po';

describe('maxi-nav2 App', () => {
  let page: MaxiNav2Page;

  beforeEach(() => {
    page = new MaxiNav2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
