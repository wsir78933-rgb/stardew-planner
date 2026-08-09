import type { BlogHomeSearchParameters } from "./blog-home-state";

function getLocationSearchParameter(
  searchParameters: URLSearchParams,
  parameterName: string,
): string | undefined {
  return searchParameters.has(parameterName)
    ? searchParameters.get(parameterName) ?? undefined
    : undefined;
}

export function getBlogHomeSearchParametersFromLocationSearch(
  locationSearch: string,
): BlogHomeSearchParameters {
  const searchParameters = new URLSearchParams(locationSearch);
  const query = getLocationSearchParameter(searchParameters, "q");
  const topic = getLocationSearchParameter(searchParameters, "topic");
  const visible = getLocationSearchParameter(searchParameters, "visible");

  return {
    ...(query === undefined ? {} : { q: query }),
    ...(topic === undefined ? {} : { topic }),
    ...(visible === undefined ? {} : { visible }),
  };
}

export function getBlogArchivePageParameterFromLocationSearch(
  locationSearch: string,
): string | undefined {
  return getLocationSearchParameter(new URLSearchParams(locationSearch), "page");
}
