import JsonQr from '../src';
import { EXAMPLE_DATA } from './utils';
const { parse } = JsonQr();

const querys = {
  guid_about: {
    query: `
    @{
      guid;
      about;
    }
`,
    result: { guid: EXAMPLE_DATA.guid, about: EXAMPLE_DATA.about },
  },
};
describe('JsonQr', () => {
  it('Get only guid and about', () => {
    expect(parse(EXAMPLE_DATA, querys.guid_about.query)).toEqual(
      querys.guid_about.result
    );
  });
});
