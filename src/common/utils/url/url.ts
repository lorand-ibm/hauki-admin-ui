import querystring from 'querystring';

export type SearchParameters = { [key: string]: string | string[] };

const parseSearchParameters = (queryStr: string): SearchParameters => {
  return querystring.parse(queryStr.replace('?', ''));
};

export default { parseSearchParameters };
